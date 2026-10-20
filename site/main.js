// AI-Native Executive — site behaviour. Edit CONFIG before launch.
const CONFIG = {
  whatsapp: "13104027863", // international format, digits only
  email: "nikky@nikkykho.com",
  // Public URL of the keynote slides (PDF). When set, the "Keynote slides"
  // topic on the Contact page downloads them directly instead of asking visitors to get in touch.
  slidesUrl: "",
};

// Each call to action pre-fills the WhatsApp / email message for its program.
const INTERESTS = {
  slides: { label: "Keynote slides", message: "Hi Nikky, I was at your Frontiers Health keynote. Could you send me the slides for The Fastest Path to AI-Native?" },
  berlin: { label: "Berlin AI-Native Executive Lab, 22 Oct", message: "Hi Nikky, I have a question about the Berlin AI-Native Executive Lab on 22 October." },
  day: { label: "AI-Native Executive Implementation Day", message: "Hi Nikky, I'm interested in the AI-Native Executive Implementation Day." },
  mastermind: { label: "AI-Native Executive Mastermind", message: "Hi Nikky, I'd like to apply for a founding membership in the AI-Native Executive Mastermind." },
  vip: { label: "AI-Native Visionary Circle (VIP)", message: "Hi Nikky, I'd like to apply for the AI-Native Visionary Circle (VIP)." },
  enterprise: { label: "Private AI transformation assessment", message: "Hi Nikky, I'd like to request a private AI transformation assessment for my organization." },
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Masthead state
const masthead = $("[data-masthead]");
const onScroll = () => masthead.classList.toggle("is-scrolled", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile nav
const toggle = $("[data-nav-toggle]");
const mobileNav = $("[data-mobile-nav]");
const setNav = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  mobileNav.hidden = !open;
};
toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
$$("a", mobileNav).forEach((a) => a.addEventListener("click", () => setNav(false)));
window.addEventListener("resize", () => { if (window.innerWidth > 1080) setNav(false); });

// Contact links
const enc = encodeURIComponent;
const topic = $("[data-topic]");
function setInterest(key) {
  const it = INTERESTS[key];
  if (!it || !topic) return;
  $$("[data-whatsapp]").forEach((a) => { a.href = `https://wa.me/${CONFIG.whatsapp}?text=${enc(it.message)}`; });
  const body = `${it.message}\n\nName:\nRole:\nOrganization:\n`;
  $$("[data-email]").forEach((a) => { a.href = `mailto:${CONFIG.email}?subject=${enc(`AI-Native Executive: ${it.label}`)}&body=${enc(body)}`; });
  topic.hidden = false;
  topic.textContent = `Your message will be pre-filled for: ${it.label}`;
  $$(".topic-chips [data-interest]").forEach((a) => a.classList.toggle("is-active", a.dataset.interest === key));
}
$$("[data-interest]").forEach((a) => a.addEventListener("click", () => setInterest(a.dataset.interest)));

// Each page pre-fills for its own topic; links and QR codes can override with ?interest=berlin etc.
const qp = new URLSearchParams(location.search).get("interest");
setInterest(INTERESTS[qp] ? qp : document.body.dataset.defaultInterest);

// Slides: the "Keynote slides" topic becomes a direct download once a URL is configured
if (CONFIG.slidesUrl) {
  $$('[data-interest="slides"]').forEach((a) => {
    a.href = CONFIG.slidesUrl;
    a.setAttribute("download", "");
    a.removeAttribute("data-interest");
    a.textContent = "Download keynote slides ↓";
  });
}

// Reveal on scroll
const reveals = $$(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`;
    io.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

$$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
