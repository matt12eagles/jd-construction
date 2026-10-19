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

// Contact form -> opens the visitor's messages app with a pre-filled text
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = [
    `Hi Jose, this is ${f.get("name")}. I found you on your website.`,
    `Project: ${f.get("project")}`,
    f.get("town") ? `Town: ${f.get("town")}` : "",
    f.get("details"),
  ].filter(Boolean).join("\n");
  window.location.href = `sms:${CONTACT_PHONE}?&body=${encodeURIComponent(body)}`;
});

document.getElementById("year").textContent = new Date().getFullYear();
