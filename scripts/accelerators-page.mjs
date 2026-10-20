// AI Business Accelerators: page body and printable checklist, generated from data/accelerators.mjs.
import { accelerators, bundles } from "../data/accelerators.mjs";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const pad = (n) => String(n).padStart(2, "0");
export const total = accelerators.reduce((n, c) => n + c.items.length, 0);

const ICONS = {
  agent: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/>',
  network: '<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="m6.5 6.5 3.7 3.7M17.5 6.5l-3.7 3.7M6.5 17.5l3.7-3.7M17.5 17.5l-3.7-3.7"/>',
  chart: '<path d="M4 20h16"/><path d="M7 16v-3M11 16V9M15 16v-5M19 16V6"/><path d="m5 10 5-5 3 3 6-5"/>',
  flow: '<rect x="3" y="4" width="7" height="6" rx="1.5"/><rect x="14" y="14" width="7" height="6" rx="1.5"/><path d="M6.5 10v4a3 3 0 0 0 3 3H14"/><path d="m12 15 2 2-2 2"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19a3 3 0 0 1-3 3h-3"/>',
  megaphone: '<path d="M3 10v4h4l8 5V5L7 10H3Z"/><path d="M18 9a4 4 0 0 1 0 6"/><path d="M8 14v5h3"/>',
  funnel: '<path d="M3 4h18l-7 8.5V19l-4 2v-8.5L3 4Z"/>',
  video: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m10 9 5 3-5 3V9Z"/>',
  phone: '<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  pen: '<path d="m4 20 1-4L16 5l3 3L8 19l-4 1Z"/><path d="m14 7 3 3"/><path d="M19 15v4M17 17h4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/>',
  browser: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18"/><circle cx="6.5" cy="6.5" r=".6"/><circle cx="9" cy="6.5" r=".6"/><path d="m9 13-2 2 2 2M15 13l2 2-2 2"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2.1-.5-2.6-1.5M12 6.5V8M12 16v1.5"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5 4.8"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
};
const icon = (name, size = 24) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

const card = (c, i) => `
      <article class="acc-card reveal" id="cat-${c.id}" style="--hue:${c.hue}">
        <header class="acc-card-head">
          <span class="acc-icon">${icon(c.icon)}</span>
          <div>
            <p class="acc-num">${pad(i + 1)}</p>
            <h3>${esc(c.name)}</h3>
            <p class="acc-tagline">${esc(c.tagline)}</p>
          </div>
          <button type="button" class="acc-all" data-select-all="${c.id}" aria-label="Select all in ${esc(c.name)}">Select all</button>
        </header>
        <fieldset class="acc-items">
          <legend class="sr-only">${esc(c.name)}</legend>
${c.items
  .map(
    ([id, label, desc]) => `          <label class="acc-item">
            <input type="checkbox" value="${c.id}.${id}" data-cat="${c.id}" data-label="${esc(label)}">
            <span class="acc-box" aria-hidden="true"></span>
            <span class="acc-text"><strong>${esc(label)}</strong><span>${esc(desc)}</span></span>
          </label>`
  )
  .join("\n")}
        </fieldset>
      </article>`;

const bundleCard = (b) => `
      <article class="bundle-card reveal">
        <p class="bundle-count">${b.items.length} builds</p>
        <h3>${esc(b.name)}</h3>
        <p>${esc(b.text)}</p>
        <button type="button" class="btn btn-ghost-light btn-sm" data-bundle="${b.items.join(" ")}">Add bundle</button>
      </article>`;

export const body = `
<section class="hero acc-hero">
  <div class="hero-bg" aria-hidden="true"><div class="hero-grid"></div></div>
  <div class="wrap hero-inner">
    <p class="kicker"><span class="dot"></span>Custom development · Real AI Dynamics</p>
    <h1>AI Business <em>Accelerators</em></h1>
    <p class="lede">Choose what you want built. We design, develop, and integrate it into your business, so you get systems that run, not another tool to learn.</p>
    <div class="acc-stats">
      <div><span>${accelerators.length}</span>accelerators</div>
      <div><span>${total}</span>builds to choose from</div>
      <div><span>Custom</span>quote for your business</div>
    </div>
    <div class="acc-hero-ctas">
      <a class="btn btn-accent btn-lg" href="#catalog">Start choosing</a>
      <a class="btn btn-ghost-light btn-lg" href="#bundles">See quick-start bundles</a>
    </div>
  </div>
</section>

<section class="section section-dark section-tight acc-how" aria-labelledby="how-title">
  <div class="wrap">
    <h2 id="how-title" class="sr-only">How ordering works</h2>
    <ol class="how">
      <li class="reveal"><span>01</span><h3>Choose</h3><p>Tick every accelerator you want, or start from a bundle.</p></li>
      <li class="reveal"><span>02</span><h3>Send</h3><p>Send your list on WhatsApp or by email in one tap.</p></li>
      <li class="reveal"><span>03</span><h3>Scope</h3><p>We review it with you and send a custom proposal and quote.</p></li>
      <li class="reveal"><span>04</span><h3>Build &amp; launch</h3><p>We build, integrate, test, and train your team to use it.</p></li>
    </ol>
  </div>
</section>

<section id="bundles" class="section section-dark section-tight" aria-labelledby="bundles-title">
  <div class="wrap">
    <p class="eyebrow reveal">Quick-start bundles</p>
    <h2 id="bundles-title" class="reveal">Start with a <em>proven combination.</em></h2>
    <p class="section-lede reveal">Each bundle ticks a set of builds for you. Add to it, remove from it, or combine bundles.</p>
    <div class="bundles">${bundles.map(bundleCard).join("")}
    </div>
  </div>
</section>

<section id="catalog" class="section section-light" aria-labelledby="catalog-title">
  <div class="wrap">
    <p class="eyebrow reveal">The catalog</p>
    <h2 id="catalog-title" class="reveal">Choose what you <em>want built.</em></h2>
    <p class="section-lede reveal">Every build is custom developed for your business and connected to the tools you already use. Tick as many as you like.</p>
    <nav class="acc-jump reveal" aria-label="Jump to an accelerator">
${accelerators.map((c) => `      <a href="#cat-${c.id}" style="--hue:${c.hue}">${esc(c.name)}<span data-cat-count="${c.id}"></span></a>`).join("\n")}
    </nav>
    <div class="acc-grid">${accelerators.map(card).join("")}
    </div>
  </div>
</section>

<section id="order" class="section section-apply" aria-labelledby="order-title">
  <div class="wrap order">
    <div class="order-copy">
      <p class="eyebrow reveal">Your order</p>
      <h2 id="order-title" class="reveal">Your custom <em>AI build.</em></h2>
      <p class="reveal">Send your selection on WhatsApp or by email. We reply to schedule a scoping call and send a custom proposal and quote. Nothing is charged until you approve it.</p>
      <ul class="apply-points reveal">
        <li>No payment to request a quote</li>
        <li>Built around the tools you already use</li>
        <li>Prefer to talk first? Message +1 310 402 7863</li>
      </ul>
    </div>
    <div class="order-panel reveal">
      <div class="order-head">
        <p class="order-count"><span data-count>0</span> selected</p>
        <button type="button" class="order-clear" data-clear hidden>Clear all</button>
      </div>
      <p class="order-empty" data-empty>Nothing selected yet. <a href="#catalog">Choose your accelerators</a> or <a href="#bundles">start from a bundle</a>.</p>
      <div class="order-list" data-order-list></div>
      <div class="order-actions">
        <a class="btn btn-wa btn-block btn-lg" href="https://wa.me/13104027863" target="_blank" rel="noopener" data-send-whatsapp>Send on WhatsApp</a>
        <a class="btn btn-ghost-light btn-block" href="mailto:nikky@nikkykho.com?subject=AI%20Business%20Accelerators" data-send-email>Send by email</a>
        <div class="order-minor">
          <button type="button" data-copy>Copy list</button>
          <button type="button" data-print>Print checklist</button>
        </div>
        <p class="order-status" role="status" aria-live="polite" data-order-status></p>
      </div>
    </div>
  </div>
</section>



<div class="order-bar" data-order-bar hidden>
  <div class="wrap order-bar-inner">
    <p><strong data-count>0</strong> accelerators selected</p>
    <a class="btn btn-accent btn-sm" href="#order">Review &amp; send</a>
  </div>
</div>
`;

export const checklist = `# AI Business Accelerators — Client Checklist

Tick everything you want built, then send this list to Nikky Kho at **nikky@nikkykho.com** or WhatsApp **+1 310 402 7863**. We'll reply with a scoping call and a custom quote.

**Name:** ____________________  **Company:** ____________________  **Website:** ____________________

${accelerators
  .map(
    (c, i) => `## ${pad(i + 1)}. ${c.name}
*${c.tagline}*

${c.items.map(([, label, desc]) => `- [ ] **${label}**: ${desc}`).join("\n")}
`
  )
  .join("\n")}
## Quick-start bundles

${bundles
  .map((b) => {
    const labels = b.items.map((k) => {
      const [cat, id] = k.split(".");
      return accelerators.find((c) => c.id === cat).items.find((it) => it[0] === id)[1];
    });
    return `- [ ] **${b.name}**: ${b.text} (${labels.join(", ")})`;
  })
  .join("\n")}

**Notes / anything else:**

______________________________________________________________________

Order online: the AI Business Accelerators page (\`/accelerators/\`) on the AI-Native Executive site.
`;

