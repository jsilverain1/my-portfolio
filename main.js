"use strict";

/* --------------------------------------------------------------------------
   Theme toggle
   Follows the OS preference by default; an explicit choice is saved.
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  const activeTheme = () =>
    root.dataset.theme || (systemDark.matches ? "dark" : "light");

  function render() {
    const theme = activeTheme();
    root.dataset.activeTheme = theme;
    const next = theme === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", `Switch to ${next} theme`);
  }

  toggle.addEventListener("click", () => {
    const next = activeTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
    render();
  });

  systemDark.addEventListener("change", render);
  toggle.hidden = false;
  render();
}

/* --------------------------------------------------------------------------
   Mobile navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");

  function setOpen(open) {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close after choosing a section, on Escape, or when clicking elsewhere.
  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && links.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav")) setOpen(false);
  });
}

/* --------------------------------------------------------------------------
   Contact form
   Validates accessibly, then submits to Formspree without leaving the page.
   Without JavaScript the form still posts normally with native validation.
   -------------------------------------------------------------------------- */
const FIELD_MESSAGES = {
  name: { valueMissing: "Please enter your name." },
  email: {
    valueMissing: "Please enter your email address.",
    typeMismatch: "Please enter a valid email address, like name@example.com.",
  },
  message: { valueMissing: "Please enter a message." },
};

function validateField(field) {
  const messages = FIELD_MESSAGES[field.name] || {};
  const errorEl = document.getElementById(`${field.id}-error`);
  let message = "";

  if (field.validity.valueMissing || (field.required && !field.value.trim())) {
    message = messages.valueMissing;
  } else if (field.validity.typeMismatch) {
    message = messages.typeMismatch;
  }

  field.setAttribute("aria-invalid", String(Boolean(message)));
  errorEl.textContent = message;
  return !message;
}

function initContactForm() {
  const form = document.querySelector(".contact-form");
  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const fields = [...form.querySelectorAll("input[required], textarea[required]")];

  form.noValidate = true;

  // Re-check a field as the visitor corrects it, but only once it has been flagged.
  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  function setStatus(message, type) {
    status.textContent = message;
    status.classList.toggle("is-success", type === "success");
    status.classList.toggle("is-error", type === "error");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const invalid = fields.filter((field) => !validateField(field));
    if (invalid.length) {
      invalid[0].focus();
      setStatus("", null);
      return;
    }

    submitBtn.disabled = true;
    setStatus("Sending…", null);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Formspree responded with ${response.status}`);
      }

      form.reset();
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
      setStatus("Thanks! Your message has been sent. I'll get back to you soon.", "success");
    } catch (error) {
      console.error(error);
      setStatus(
        "Sorry, your message couldn't be sent. Please email me directly at joesilverain@gmail.com.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function initFooterYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

initThemeToggle();
initMobileNav();
initContactForm();
initFooterYear();
