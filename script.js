// Jose's cell — the contact form texts this number
const CONTACT_PHONE = "+13473851857";

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Before/after sliders
document.querySelectorAll(".compare").forEach((box) => {
  const range = box.querySelector(".compare-range");
  const update = () => box.style.setProperty("--pos", range.value + "%");
  range.addEventListener("input", update);
  update(); // browsers can restore a dragged position on reload
});

// Gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
document.querySelectorAll(".gallery-item").forEach((item) =>
  item.addEventListener("click", () => {
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector("img").alt;
    lightbox.hidden = false;
  })
);
lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) lightbox.hidden = true;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.hidden = true;
});

// English / Español switch. English comes from index.html, Spanish from es.js.
const EN = {
  "page.title": document.title,
  "sms.greeting": "Hi Jose, this is {name}. I found you on your website.",
  "sms.project": "Project",
  "sms.town": "Town",
};
const ATTRS = { "data-i18n-alt": "alt", "data-i18n-ph": "placeholder", "data-i18n-aria": "aria-label" };
const original = new Map();
document.querySelectorAll("[data-i18n], [data-i18n-alt], [data-i18n-ph], [data-i18n-aria]").forEach((el) => {
  const saved = {};
  if (el.hasAttribute("data-i18n")) saved.html = el.innerHTML;
  for (const [key, attr] of Object.entries(ATTRS)) {
    if (el.hasAttribute(key)) saved[attr] = el.getAttribute(attr) || "";
  }
  original.set(el, saved);
});

let lang = "en";
const t = (key) => (lang === "es" && key in ES ? ES[key] : EN[key]);
const langButton = document.getElementById("lang-toggle");

function setLang(next) {
  lang = next;
  const es = lang === "es";
  original.forEach((saved, el) => {
    if ("html" in saved) el.innerHTML = es ? ES[el.dataset.i18n] ?? saved.html : saved.html;
    for (const [key, attr] of Object.entries(ATTRS)) {
      if (attr in saved) el.setAttribute(attr, es ? ES[el.getAttribute(key)] ?? saved[attr] : saved[attr]);
    }
  });
  document.documentElement.lang = lang;
  document.title = t("page.title");
  langButton.textContent = es ? "English" : "Español";
  langButton.lang = es ? "en" : "es";
  langButton.setAttribute("aria-label", es ? "View this site in English" : "Ver el sitio en español");
  try { localStorage.setItem("lang", lang); } catch {}
}

langButton.addEventListener("click", () => setLang(lang === "es" ? "en" : "es"));
let startLang = new URLSearchParams(location.search).get("lang");
if (!startLang) { try { startLang = localStorage.getItem("lang"); } catch {} }
if (startLang === "es") setLang("es");

// Contact form -> opens the visitor's messages app with a pre-filled text
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = [
    t("sms.greeting").replace("{name}", f.get("name")),
    `${t("sms.project")}: ${f.get("project")}`,
    f.get("town") ? `${t("sms.town")}: ${f.get("town")}` : "",
    f.get("details"),
  ].filter(Boolean).join("\n");
  window.location.href = `sms:${CONTACT_PHONE}?&body=${encodeURIComponent(body)}`;
});

document.getElementById("year").textContent = new Date().getFullYear();
