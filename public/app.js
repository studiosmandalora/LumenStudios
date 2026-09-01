/* ================================================================
   CLICK MEDIA — Application Logic
   ================================================================ */

(function () {
  "use strict";

  // ================================================================
  // CONFIGURATION — Edit everything here
  // ================================================================
  const CONFIG = {
    business: {
      name: "Click Media",
      email: "hello@clickmedia.com",
      phone: "",
      location: "Los Angeles, CA",
    },

    services: {
      photography: {
        label: "Photography",
        description: "Stills, printed or shared — portraits to full events.",
        options: {
          "portrait-session": {
            label: "Portrait Session",
            detail:
              "Individual or group portraits captured in-studio or on location. Perfect for personal branding, family photos, or creative projects.",
          },
          "wedding-photography": {
            label: "Wedding Photography",
            detail:
              "Full-day coverage of your wedding — from getting ready to the last dance. We capture every moment, candid and posed.",
          },
          "sports-photo": {
            label: "Sports Photo Shoot",
            detail:
              "Action-packed sports photography for athletes, teams, and events. High-speed capture that freezes the decisive moment.",
          },
          "event-coverage": {
            label: "Event Coverage",
            detail:
              "Conferences, galas, parties, and corporate events — we document it all with an editorial eye.",
          },
          "product-photography": {
            label: "Product Photography",
            detail:
              "Clean, professional product shots for e-commerce, catalogs, and marketing. Studio lighting, styled environments, and post-production.",
          },
        },
      },
      videography: {
        label: "Videography",
        description: "Motion, sound and story — from reels to full films.",
        options: {
          "wedding-films": {
            label: "Wedding Films",
            detail:
              "Cinematic wedding films that tell your love story. From highlights to full-day edits, crafted with emotion and artistry.",
          },
          "event-videography": {
            label: "Event Videography",
            detail:
              "Dynamic event videos that capture energy, speakers, and highlights. Perfect for conferences, launches, and celebrations.",
          },
          "sports-highlights": {
            label: "Sports Highlight Reels",
            detail:
              "Fast-paced highlight reels and game-day edits. Multi-angle capture and professional post-production.",
          },
          "commercial-promo": {
            label: "Commercial & Promo",
            detail:
              "Brand videos, product launches, and promotional content designed to engage your audience and drive results.",
          },
          "music-videos": {
            label: "Music Videos",
            detail:
              "Creative music videos with unique visual storytelling. From concept development to final edit.",
          },
        },
      },
    },

    portfolio: [
      {
        category: "wedding-photo",
        branch: "photography",
        service: "wedding-photography",
        title: "Amara & Jonas",
        image: "/images/portfolio/wedding-amara.svg",
      },
      {
        category: "portrait",
        branch: "photography",
        service: "portrait-session",
        title: "Studio Portrait — Elena",
        image: "/images/portfolio/portrait-elena.svg",
      },
      {
        category: "wedding-video",
        branch: "videography",
        service: "wedding-films",
        title: "Sofia & Marcus",
        image: "/images/portfolio/wedding-sofia.svg",
      },
      {
        category: "product",
        branch: "photography",
        service: "product-photography",
        title: "Lumière Candles",
        image: "/images/portfolio/product-lumiere.svg",
      },
      {
        category: "commercial",
        branch: "videography",
        service: "commercial-promo",
        title: "Northwell Promo",
        image: "/images/portfolio/commercial-northwell.svg",
      },
      {
        category: "event-photo",
        branch: "photography",
        service: "event-coverage",
        title: "Tech Summit 2026",
        image: "/images/portfolio/event-techsummit.svg",
      },
      {
        category: "sports-photo",
        branch: "photography",
        service: "sports-photo",
        title: "Track & Field — Regionals",
        image: "/images/portfolio/sports-track.svg",
      },
      {
        category: "music-video",
        branch: "videography",
        service: "music-videos",
        title: "Nightfall — Debut Single",
        image: "/images/portfolio/music-nightfall.svg",
      },
      {
        category: "event-video",
        branch: "videography",
        service: "event-videography",
        title: "Annual Gala Recap",
        image: "/images/portfolio/event-gala.svg",
      },
    ],
  };

  // ================================================================
  // DOM READY
  // ================================================================
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initNavigation();
    initAperture();
    initServices();
    initPortfolio();
    initContactForm();
    initScrollReveal();
    initCursorPill();
  }

  // ================================================================
  // NAVIGATION
  // ================================================================
  function initNavigation() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("navToggle");
    const mobile = document.getElementById("navMobile");
    const mobileLinks = mobile.querySelectorAll("a");

    let mobileOpen = false;

    toggle.addEventListener("click", () => {
      mobileOpen = !mobileOpen;
      toggle.classList.toggle("active", mobileOpen);
      mobile.classList.toggle("active", mobileOpen);
      toggle.setAttribute("aria-expanded", mobileOpen);
      document.body.style.overflow = mobileOpen ? "hidden" : "";
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileOpen = false;
        toggle.classList.remove("active");
        mobile.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (id === "#") return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  }

  // ================================================================
  // APERTURE
  // ================================================================
  function initAperture() {
    const aperture = document.getElementById("aperture");
    if (!aperture) return;

    // Open animation on load
    setTimeout(() => {
      aperture.classList.add("aperture--open");
    }, 600);

    // Parallax interaction on desktop
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || "ontouchstart" in window) return;

    const svg = aperture.querySelector(".aperture__svg");
    const blades = aperture.querySelectorAll(".aperture__blade");

    aperture.parentElement.addEventListener("mousemove", (e) => {
      const rect = aperture.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      svg.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;

      blades.forEach((blade, i) => {
        const angle = dx * 3 * (i % 2 === 0 ? 1 : -1);
        blade.style.transform = `rotate(${angle}deg)`;
      });
    });

    aperture.parentElement.addEventListener("mouseleave", () => {
      svg.style.transform = "";
      blades.forEach((blade) => {
        blade.style.transform = "";
      });
    });
  }

  // ================================================================
  // SERVICES
  // ================================================================
  let activeService = null;
  let activeBranch = null;

  function initServices() {
    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card) => {
      const branch = card.dataset.branch;
      const header = card.querySelector(".service-card__header");
      const chips = card.querySelectorAll(".chip");
      const detailEl = card.querySelector(".service-card__detail");
      const options = CONFIG.services[branch].options;

      // Toggle card
      header.addEventListener("click", () => {
        const wasOpen = card.classList.contains("open");

        // Close all cards
        cards.forEach((c) => {
          c.classList.remove("open");
          c.querySelector(".service-card__header").setAttribute("aria-expanded", "false");
          c.querySelectorAll(".chip").forEach((ch) => ch.classList.remove("active"));
          c.querySelector(".service-card__detail").textContent = "";
        });

        if (!wasOpen) {
          card.classList.add("open");
          header.setAttribute("aria-expanded", "true");
        }
      });

      // Chip selection
      chips.forEach((chip) => {
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          const serviceKey = chip.dataset.service;

          // Toggle active chip
          const wasActive = chip.classList.contains("active");
          chips.forEach((c) => c.classList.remove("active"));

          if (wasActive) {
            activeService = null;
            activeBranch = null;
            detailEl.textContent = "";
            filterPortfolio("all");
          } else {
            chip.classList.add("active");
            activeService = serviceKey;
            activeBranch = branch;
            detailEl.textContent = options[serviceKey]?.detail || "";

            // Filter portfolio
            filterPortfolio("service", serviceKey);

            // Scroll to portfolio
            setTimeout(() => {
              const portfolio = document.getElementById("portfolio");
              if (portfolio) {
                const offset = 72;
                const top = portfolio.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }, 400);
          }
        });
      });
    });
  }

  // ================================================================
  // PORTFOLIO
  // ================================================================
  function initPortfolio() {
    const grid = document.getElementById("portfolioGrid");
    if (!grid) return;

    // Render portfolio items
    CONFIG.portfolio.forEach((item, index) => {
      const el = document.createElement("div");
      el.className = "portfolio__item anim-reveal";
      el.style.animationDelay = `${index * 0.05}s`;
      el.dataset.branch = item.branch;
      el.dataset.service = item.service;
      el.dataset.category = item.category;

      el.innerHTML = `
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="portfolio__item-overlay">
          <span class="portfolio__item-cat">${item.category.replace(/-/g, " ")}</span>
          <span class="portfolio__item-title">${item.title}</span>
        </div>
      `;

      grid.appendChild(el);
    });

    // Filter buttons
    const filters = document.querySelectorAll(".portfolio__filter");
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((f) => f.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        filterPortfolio(filter);
      });
    });
  }

  function filterPortfolio(type, value) {
    const items = document.querySelectorAll(".portfolio__item");
    const filterBtns = document.querySelectorAll(".portfolio__filter");

    // Reset filter buttons
    filterBtns.forEach((f) => f.classList.remove("active"));

    if (type === "service") {
      // Find the branch for this service
      const branch = activeBranch;
      filterBtns.forEach((f) => {
        if (f.dataset.filter === branch) f.classList.add("active");
      });

      items.forEach((item) => {
        const show = item.dataset.service === value;
        item.classList.toggle("portfolio__item--hidden", !show);
        if (show) {
          item.classList.remove("portfolio__item--enter");
          void item.offsetWidth; // force reflow
          item.classList.add("portfolio__item--enter");
        }
      });
    } else if (type === "photography" || type === "videography") {
      filterBtns.forEach((f) => {
        if (f.dataset.filter === type) f.classList.add("active");
      });

      items.forEach((item) => {
        const show = item.dataset.branch === type;
        item.classList.toggle("portfolio__item--hidden", !show);
        if (show) {
          item.classList.remove("portfolio__item--enter");
          void item.offsetWidth;
          item.classList.add("portfolio__item--enter");
        }
      });
    } else {
      // Show all
      filterBtns.forEach((f) => {
        if (f.dataset.filter === "all") f.classList.add("active");
      });

      items.forEach((item) => {
        item.classList.remove("portfolio__item--hidden");
        item.classList.remove("portfolio__item--enter");
        void item.offsetWidth;
        item.classList.add("portfolio__item--enter");
      });
    }
  }

  // ================================================================
  // CONTACT FORM
  // ================================================================
  function initContactForm() {
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("contactSubmit");
    const status = document.getElementById("formStatus");
    if (!form) return;

    // Pre-fill service if selected from services section
    const serviceSelect = document.getElementById("contactService");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      status.className = "form-status";

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const service = form.service.value;
      const message = form.message.value.trim();

      // Client-side validation
      if (!name) {
        showFormError("Please enter your name.");
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormError("Please enter a valid email address.");
        return;
      }
      if (!service) {
        showFormError("Please select a service.");
        return;
      }
      if (!message) {
        showFormError("Please enter a message.");
        return;
      }

      // Submit
      submitBtn.classList.add("btn--loading");
      submitBtn.disabled = true;

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, service, message }),
        });

        const data = await res.json();

        if (data.success) {
          status.textContent = data.message;
          status.className = "form-status form-status--success";
          form.reset();
        } else {
          showFormError(data.message || "Something went wrong. Please try again.");
        }
      } catch {
        showFormError("Network error. Please check your connection and try again.");
      } finally {
        submitBtn.classList.remove("btn--loading");
        submitBtn.disabled = false;
      }
    });

    function showFormError(msg) {
      status.textContent = msg;
      status.className = "form-status form-status--error";
    }
  }

  // ================================================================
  // SCROLL REVEAL
  // ================================================================
  function initScrollReveal() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      document.querySelectorAll(".anim-reveal").forEach((el) => {
        el.classList.add("anim-reveal--visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("anim-reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".anim-reveal").forEach((el) => {
      observer.observe(el);
    });
  }

  // ================================================================
  // CURSOR PILL
  // ================================================================
  function initCursorPill() {
    const pill = document.getElementById("cursorPill");
    if (!pill) return;

    // No pill on touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      pill.style.display = "none";
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let mouseX = 0;
    let mouseY = 0;
    let pillX = 0;
    let pillY = 0;
    let isOverItem = false;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      pillX += (mouseX - pillX) * 0.15;
      pillY += (mouseY - pillY) * 0.15;
      pill.style.left = pillX + "px";
      pill.style.top = pillY + "px";
      requestAnimationFrame(animate);
    }
    animate();

    // Show pill only when hovering portfolio items
    document.addEventListener("mouseover", (e) => {
      const item = e.target.closest(".portfolio__item");
      if (item && !isOverItem) {
        isOverItem = true;
        pill.classList.add("cursor-pill--visible");
      }
    });

    document.addEventListener("mouseout", (e) => {
      const item = e.target.closest(".portfolio__item");
      if (item) {
        // Check if the related target is still inside a portfolio item
        const relatedItem = e.relatedTarget && e.relatedTarget.closest(".portfolio__item");
        if (!relatedItem) {
          isOverItem = false;
          pill.classList.remove("cursor-pill--visible");
        }
      }
    });

    // Hide pill when leaving viewport
    document.addEventListener("mouseleave", () => {
      isOverItem = false;
      pill.classList.remove("cursor-pill--visible");
    });
  }
})();
