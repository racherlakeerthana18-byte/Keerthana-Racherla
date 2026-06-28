document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const backToTop = document.querySelector(".back-to-top");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const year = document.querySelector("#year");

year.textContent = "2026";

const savedTheme = localStorage.getItem("portfolio-theme");
const initialTheme = savedTheme || "dark";

document.documentElement.dataset.theme = initialTheme;

// Keeps the new switch control accessible while reusing the existing theme state.
function updateThemeToggle(theme) {
  const isDark = theme === "dark";

  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

updateThemeToggle(initialTheme);

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 16);
  backToTop.classList.toggle("visible", window.scrollY > 580);
}

function closeMobileMenu() {
  navToggle.setAttribute("aria-expanded", "false");
  navPanel.classList.remove("open");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navPanel.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeToggle(nextTheme);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", setHeaderState);
setHeaderState();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function revealInitialViewport() {
  revealItems.forEach((item) => {
    const box = item.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) {
      item.classList.add("visible");
    }
  });
}

requestAnimationFrame(revealInitialViewport);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0,
  }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

function setFieldError(field, message) {
  const error = field.nextElementSibling;
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));

  if (error && error.classList.contains("error-message")) {
    error.textContent = message;
  }
}

function validateField(field) {
  const value = field.value.trim();

  if (!value) {
    setFieldError(field, "This field is required.");
    return false;
  }

  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    setFieldError(field, "Enter a valid email address.");
    return false;
  }

  if (field.minLength > 0 && value.length < field.minLength) {
    setFieldError(field, `Please enter at least ${field.minLength} characters.`);
    return false;
  }

  setFieldError(field, "");
  return true;
}

if (contactForm) {
  const fields = contactForm.querySelectorAll("input, textarea");
  const status = contactForm.querySelector(".form-status");

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = Array.from(fields).every(validateField);

    if (!isValid) {
      status.textContent = "Please fix the highlighted fields.";
      return;
    }

    status.textContent = "Thank you. Your message is ready to send.";
    contactForm.reset();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});
