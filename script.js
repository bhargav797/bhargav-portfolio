/* script.js — updated & cleaned version
   - Uses your PROFILE data (copied)
   - Robust mobile menu handling:
     * supports #anchors (smooth scroll + close)
     * supports mailto:, tel:, and external links (close menu and let browser handle)
     * ignores href="#" placeholders
     * focus trap + Escape to close
     * overlay click closes
   - Wires up contact links and downloads
   - Removes project thumbnail nodes (if present) so you can use View Project buttons
*/

const PROFILE = {
  name: "Bhargav Gol",
  role: "MSC IT Student / Full Stack Developer",
  years: "5+ months",
  projectsCount: "6+",
  email: "bhargav280421@gmail.com",
  whatsapp: "918347613102",
  linkedin: "https://www.linkedin.com/in/bhargav-gol-88a314335",
  github: "https://github.com/bhargav797",
  resume: "assets/resume.pdf",
  internship: "assets/Internship.pdf",
  msuLogo: "assets/msu-logo.png",
  projectImage: "assets/clogo.png"
};

function safe(path) {
  try {
    return encodeURI(path);
  } catch (e) {
    return path;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Basic text wiring ---
  const nameEls = [
    document.getElementById("brand-name"),
    document.getElementById("profile-name"),
    document.getElementById("hero-name")
  ];
  nameEls.forEach(el => { if (el) el.textContent = PROFILE.name; });

  const roleEl = document.getElementById("role");
  if (roleEl) roleEl.textContent = PROFILE.role;

  const yearsEl = document.getElementById("years");
  if (yearsEl) yearsEl.textContent = PROFILE.years;

  const projectsEl = document.getElementById("projects-count");
  if (projectsEl) projectsEl.textContent = PROFILE.projectsCount + " projects";

  const aboutText = document.getElementById("about-text");
  if (aboutText) {
    aboutText.textContent =
      "I am an MSC IT student and aspiring frontend developer who enjoys turning complex problems into simple, beautiful, and intuitive user interfaces. I focus on writing clean, maintainable code and continuously improving my skills by working on real-world projects.";
  }

  // --- Experience card injection (use msuLogo if present) ---
  const experiences = [
    {
      title: "Full Stack Internship",
      company: "Softholic India",
      location: "On-Site",
      period: "2024",
      description:
        "Worked on building responsive web pages, fixing UI bugs, and collaborating with the team using Git and GitHub.",
      logo: PROFILE.projectImage // <-- use msuLogo for company/education branding
    }
  ];

  const expList = document.getElementById("experience-list");
  if (expList) {
    experiences.forEach(exp => {
      const item = document.createElement("article");
      item.className = "card";

      const logoHtml = exp.logo
        ? `<img src="${safe(exp.logo)}" alt="${exp.company} logo" style="width:44px;height:auto;border-radius:8px;margin-right:10px;">`
        : "";

      item.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          ${logoHtml}
          <div>
            <h3 style="margin:0;">${exp.title}</h3>
            <p class="muted small" style="margin:2px 0 0;">${exp.company} • ${exp.location}</p>
          </div>
        </div>
        <p class="muted small">${exp.period}</p>
        <p class="small">${exp.description}</p>
      `;
      expList.appendChild(item);
    });
  }

  // --- Remove project-thumb nodes (you asked to remove project images) ---
  document.querySelectorAll("#projectsGrid .project-thumb").forEach(node => node.remove());

  // --- Wire static links (email, whatsapp, social, resume) ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const ema = document.getElementById("email-link");
  if (ema) ema.href = `mailto:${PROFILE.email}`;

  const wa = document.getElementById("wa-link");
  if (wa) wa.href = `https://wa.me/${PROFILE.whatsapp}`;

  const gh = document.getElementById("github-link");
  if (gh) gh.href = PROFILE.github;

  const li = document.getElementById("linkedin-link");
  if (li) li.href = PROFILE.linkedin;

  const resumeBtn = document.getElementById("download-resume");
  if (resumeBtn) {
    resumeBtn.href = safe(PROFILE.resume);
    resumeBtn.setAttribute("download", "Bhargav-Gol-Resume.pdf");
  }

  const internshipLink = document.getElementById("internship-letter");
  if (internshipLink) {
    internshipLink.href = safe(PROFILE.internship);
    internshipLink.setAttribute("download", "Bhargav-Gol-Internship-Letter.pdf");
  }

  // mobile social links (in the mobile menu)
  const mobileEmail = document.getElementById("mobile-email");
  if (mobileEmail) mobileEmail.href = `mailto:${PROFILE.email}`;

  const mobileWa = document.getElementById("mobile-wa");
  if (mobileWa) mobileWa.href = `https://wa.me/${PROFILE.whatsapp}`;

  const mobileGh = document.getElementById("mobile-github");
  if (mobileGh) mobileGh.href = PROFILE.github;

  // --- MOBILE MENU: open/close, overlay, focus trap ---
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuClose = document.getElementById("menu-close");

  if (!mobileMenu) {
    console.warn("No mobile menu element found (#mobile-menu).");
    return;
  }

  // Ensure overlay exists
  let overlayEl = mobileMenu.querySelector(".mobile-overlay");
  if (!overlayEl) {
    overlayEl = document.createElement("div");
    overlayEl.className = "mobile-overlay";
    mobileMenu.insertBefore(overlayEl, mobileMenu.firstChild);
  }

  // Ensure mobile-panel exists and wrap children into it
  let panelEl = mobileMenu.querySelector(".mobile-panel");
  if (!panelEl) {
    panelEl = document.createElement("div");
    panelEl.className = "mobile-panel";

    // move existing children (except overlay) into panel
    Array.from(mobileMenu.children).forEach(child => {
      if (child === overlayEl) return;
      panelEl.appendChild(child);
    });

    mobileMenu.appendChild(panelEl);
  }

  let lastFocused = null;
  function openMenu() {
    lastFocused = document.activeElement;
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // prevent background scroll
    const closeBtn = mobileMenu.querySelector(".menu-close") || menuClose;
    if (closeBtn) closeBtn.focus();
    document.addEventListener("keydown", trapFocus);
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    document.removeEventListener("keydown", trapFocus);
  }

  function trapFocus(e) {
    if (e.key === "Escape") {
      closeMenu();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = mobileMenu.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (mobileMenu.classList.contains("open")) closeMenu();
      else openMenu();
    });
  }

  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (overlayEl) overlayEl.addEventListener("click", closeMenu);

  // --- Mobile menu links: support anchors, mailto, tel, external ---
  // Use all links inside mobile menu so we don't depend on specific classes
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", ev => {
      const href = a.getAttribute("href");

      // ignore placeholder links like href="#"
      if (!href || href === "#") {
        closeMenu();
        return;
      }

      // If it's an internal anchor -> smooth scroll and close
      if (href.startsWith("#")) {
        ev.preventDefault();
        // close after preventing default to avoid cancelling scroll
        closeMenu();
        const target = document.querySelector(href);
        if (target) {
          // small timeout for nicer UX and to avoid reflow cancelling scroll
          setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        }
        return;
      }

      // If mailto: or tel: or external http(s) -> close menu and let browser handle default navigation
      if (href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:\/\//i.test(href)) {
        closeMenu();
        // do not preventDefault, let link open
        return;
      }

      // For other cases: just close the menu
      closeMenu();
    });
  });

  // --- Desktop nav anchors: smooth scroll ---
  document.querySelectorAll(".nav-link").forEach(a => {
    a.addEventListener("click", ev => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const t = document.querySelector(href);
      if (t) {
        ev.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // --- Header scrolled state ---
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 56) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
