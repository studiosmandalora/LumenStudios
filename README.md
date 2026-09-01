# Click Media — Photography & Videography Studio

A production-ready full-stack website for a photography/videography studio. Built with a clean frontend (HTML/CSS/JS) and a lightweight Node.js/Express backend. **No database required.**

## Features

- **Responsive Design** — Works on desktop, tablet, and mobile
- **Contact Form** — Emails inquiries directly to the business (via SMTP)
- **Service Selection** — Interactive photography/videography service picker
- **Portfolio Gallery** — Filterable portfolio with hover effects
- **Animations** — Smooth scroll reveals, aperture animation, cursor effects
- **Accessibility** — Semantic HTML, keyboard nav, ARIA, reduced-motion support
- **Security** — Helmet, CORS, rate limiting, server-side validation

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your SMTP credentials:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
BUSINESS_EMAIL=business@clickmedia.com
EMAIL_FROM=noreply@clickmedia.com
```

> For Gmail, generate an App Password at https://myaccount.google.com/apppasswords

### 3. Run locally

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Configuration

All content is configurable in `public/app.js` under the `CONFIG` object:

- **Business info** — Name, email, location
- **Services** — Photography and videography options with descriptions
- **Portfolio** — Items with images, titles, categories, and service tags
- **Colors** — Defined as CSS custom properties in `styles.css`

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --cream: #EDE7D9;
  --blue: #2D4FA0;
  --black: #15171B;
  /* ... */
}
```

### Adding Portfolio Items

Add entries to the `CONFIG.portfolio` array in `app.js`:

```javascript
{
  category: "portrait",
  branch: "photography",
  service: "portrait-session",
  title: "New Project",
  image: "/images/portfolio/new-project.jpg"
}
```

### Using Your Own Images

Replace the `image` paths in portfolio items with your own:

- Place images in `public/images/portfolio/`
- Reference them as `/images/portfolio/your-image.jpg`
- Recommended size: 600×750px (4:5 aspect ratio)

## Deployment

### Render

1. Push to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in the dashboard

### Railway

1. Push to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Railway auto-detects Node.js
4. Add environment variables

### Vercel (with serverless)

Adapt the backend to Vercel serverless functions or use a separate hosting for the API.

### Fly.io

```bash
fly launch
fly deploy
```

### Any Node.js Host

```bash
npm install
npm start
```

The server serves static files from `public/` and handles the `/api/contact` endpoint.

## Project Structure

```
├── public/
│   ├── index.html        # Main HTML page
│   ├── styles.css         # All styles & design system
│   ├── app.js             # Frontend logic & configuration
│   ├── favicon.svg        # Favicon
│   └── images/            # Your images go here
│       └── portfolio/
├── server/
│   └── server.js          # Express backend
├── .env.example           # Environment template
├── package.json           # Dependencies
└── README.md              # This file
```

## API

### POST /api/contact

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "service": "Wedding Photography",
  "message": "Looking for coverage on June 15th in downtown LA."
}
```

**Success:**
```json
{
  "success": true,
  "message": "Thanks — we'll be in touch shortly."
}
```

**Error:**
```json
{
  "success": false,
  "message": "Please enter a valid email address."
}
```

## License

MIT
