require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Security
// ---------------------------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ---------------------------------------------------------------------------
// Body parsing & static files
// ---------------------------------------------------------------------------
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.use(express.static(path.join(__dirname, "..", "public"), { maxAge: "7d" }));

// ---------------------------------------------------------------------------
// Rate limiting — contact endpoint
// ---------------------------------------------------------------------------
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// ---------------------------------------------------------------------------
// Nodemailer transport (optional — falls back to file logging)
// ---------------------------------------------------------------------------
const emailConfigured =
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASSWORD &&
  process.env.BUSINESS_EMAIL;

const transporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: parseInt(process.env.EMAIL_PORT || "587", 10) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

// Inquiries log file
const inquiriesDir = path.join(__dirname, "..", "inquiries");
if (!fs.existsSync(inquiriesDir)) {
  fs.mkdirSync(inquiriesDir, { recursive: true });
}

function logInquiry(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(inquiriesDir, `inquiry-${timestamp}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`[Inquiry logged] ${filePath}`);
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_SERVICE = 200;
const MAX_MESSAGE = 2000;

function sanitize(str, maxLen) {
  if (typeof str !== "string") return "";
  const limit = maxLen || 500;
  return str.trim().replace(/<[^>]*>/g, "").slice(0, limit);
}

function validate(body) {
  const errors = [];

  const name = sanitize(body.name, MAX_NAME);
  const email = sanitize(body.email, MAX_EMAIL);
  const service = sanitize(body.service, MAX_SERVICE);
  const message = sanitize(body.message, MAX_MESSAGE);

  if (!name || name.length < 1) {
    errors.push("Please enter your name.");
  } else if (name.length > MAX_NAME) {
    errors.push("Name is too long.");
  }

  if (!email || !EMAIL_RE.test(email)) {
    errors.push("Please enter a valid email address.");
  } else if (email.length > MAX_EMAIL) {
    errors.push("Email is too long.");
  }

  if (!service || service.length < 1) {
    errors.push("Please select a service.");
  } else if (service.length > MAX_SERVICE) {
    errors.push("Service selection is too long.");
  }

  if (!message || message.length < 1) {
    errors.push("Please enter a message.");
  } else if (message.length > MAX_MESSAGE) {
    errors.push(`Message must be ${MAX_MESSAGE} characters or fewer.`);
  }

  // Basic spam checks (skip URL checks — users legitimately share venue links)
  const combined = `${name} ${email} ${message}`.toLowerCase();
  const spamTriggers = ["<script", "viagra", "casino", "buy now"];
  if (spamTriggers.some((t) => combined.includes(t))) {
    errors.push("Your message was flagged as potential spam.");
  }

  return { errors, name, email, service, message };
}

// ---------------------------------------------------------------------------
// Contact endpoint
// ---------------------------------------------------------------------------
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { errors, name, email, service, message } = validate(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const now = new Date();
    const dateStr = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const inquiryData = {
      name,
      email,
      service,
      message,
      submitted: dateStr,
      receivedAt: now.toISOString(),
    };

    // Always log inquiry to file
    logInquiry(inquiryData);

    // Send email if configured, otherwise just log
    if (transporter) {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.BUSINESS_EMAIL,
        replyTo: email,
        subject: `New Website Inquiry — ${service}`,
        text: [
          "New Website Inquiry",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Service: ${service}`,
          "",
          "Message:",
          message,
          "",
          `Submitted: ${dateStr}`,
        ].join("\n"),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; color: #15171B;">
            <h2 style="margin: 0 0 8px; font-size: 20px;">New Website Inquiry</h2>
            <hr style="border: none; border-top: 1px solid #E2DAC8; margin: 12px 0;">
            <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 6px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 6px 0;"><strong>Service:</strong> ${service}</p>
            <p style="margin: 6px 0;"><strong>Message:</strong></p>
            <p style="margin: 6px 0; white-space: pre-wrap;">${message}</p>
            <hr style="border: none; border-top: 1px solid #E2DAC8; margin: 12px 0;">
            <p style="margin: 6px 0; font-size: 12px; color: #666;">Submitted: ${dateStr}</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email sent] Inquiry from ${email}`);
      } catch (mailErr) {
        console.error(`[Email failed] ${mailErr.message} — inquiry saved to file`);
      }
    } else {
      console.log(`[No email configured] Inquiry from ${email} logged to file`);
    }

    return res.status(200).json({
      success: true,
      message: "Thanks — we'll be in touch shortly.",
    });
  } catch (err) {
    console.error("Contact form error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

// ---------------------------------------------------------------------------
// SPA fallback — serve index.html for unmatched routes
// ---------------------------------------------------------------------------
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Lumen Studios server running on http://localhost:${PORT}`);
});
