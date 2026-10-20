// AI Business Accelerators — selection, order summary, and send links.
// Uses CONFIG (whatsapp, email) from main.js, which loads first.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const enc = encodeURIComponent;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const STORE = "rad-accelerators-v1";

  const boxes = $$('input[type="checkbox"][data-cat]');
  const byValue = new Map(boxes.map((b) => [b.value, b]));
  const catName = (id) => $(`#cat-${id} h3`).textContent;
  const catIds = [...new Set(boxes.map((b) => b.dataset.cat))];

  const list = $("[data-order-list]");
  const empty = $("[data-empty]");
  const clearBtn = $("[data-clear]");
  const bar = $("[data-order-bar]");
  const status = $("[data-order-status]");
  const waLink = $("[data-send-whatsapp]");
  const mailLink = $("[data-send-email]");
  let orderInView = false;

  const selected = () => boxes.filter((b) => b.checked);
  const grouped = () =>
    catIds
      .map((id) => ({ id, name: catName(id), items: selected().filter((b) => b.dataset.cat === id) }))
      .filter((g) => g.items.length);

  function message() {
    const groups = grouped();
    if (!groups.length) return "Hi Nikky, I'd like to talk about AI Business Accelerators for my business.";
    const n = selected().length;
    const body = groups.map((g) => `${g.name}\n${g.items.map((b) => `• ${b.dataset.label}`).join("\n")}`).join("\n\n");
    return `Hi Nikky, I'd like a custom quote for these AI Business Accelerators (${n}):\n\n${body}\n\nCompany:\nWebsite:\nNotes:`;
  }

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(selected().map((b) => b.value))); } catch {}
  }
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "[]");
      saved.forEach((v) => { const b = byValue.get(v); if (b) b.checked = true; });
    } catch {}
  }

  function render() {
    const n = selected().length;
    $$("[data-count]").forEach((el) => { el.textContent = n; });
    $$("[data-count-badge]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
    empty.hidden = n > 0;
    clearBtn.hidden = n === 0;

    catIds.forEach((id) => {
      const inCat = boxes.filter((b) => b.dataset.cat === id);
      const on = inCat.filter((b) => b.checked).length;
      const jump = $(`[data-cat-count="${id}"]`);
      if (jump) jump.textContent = on ? ` · ${on}` : "";
      $(`#cat-${id}`).classList.toggle("is-active", on > 0);
      const all = $(`[data-select-all="${id}"]`);
      all.textContent = on === inCat.length ? "Clear" : "Select all";
    });

    list.innerHTML = grouped()
      .map(
        (g) => `<div class="order-group"><p class="order-group-name">${esc(g.name)}</p><ul>${g.items
          .map((b) => `<li><span>${esc(b.dataset.label)}</span><button type="button" data-remove="${b.value}" aria-label="Remove ${esc(b.dataset.label)}">×</button></li>`)
          .join("")}</ul></div>`
      )
      .join("");

    const text = message();
    waLink.href = `https://wa.me/${CONFIG.whatsapp}?text=${enc(text)}`;
    mailLink.href = `mailto:${CONFIG.email}?subject=${enc(`AI Business Accelerators: custom quote request (${n} selected)`)}&body=${enc(text)}`;
    bar.hidden = n === 0 || orderInView;
    save();
  }

  boxes.forEach((b) => b.addEventListener("change", render));

  $$("[data-select-all]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const inCat = boxes.filter((b) => b.dataset.cat === btn.dataset.selectAll);
      const turnOn = !inCat.every((b) => b.checked);
      inCat.forEach((b) => { b.checked = turnOn; });
      render();
    })
  );

  $$("[data-bundle]").forEach((btn) =>
    btn.addEventListener("click", () => {
      btn.dataset.bundle.split(" ").forEach((v) => { const b = byValue.get(v); if (b) b.checked = true; });
      render();
      const label = btn.textContent;
      btn.textContent = "Added ✓";
      btn.classList.add("is-added");
      setTimeout(() => { btn.textContent = label; btn.classList.remove("is-added"); }, 1800);
    })
  );

  list.addEventListener("click", (e) => {
    const v = e.target.closest("[data-remove]")?.dataset.remove;
    if (v && byValue.has(v)) { byValue.get(v).checked = false; render(); }
  });

  clearBtn.addEventListener("click", () => {
    boxes.forEach((b) => { b.checked = false; });
    render();
  });

  const flash = (msg) => {
    status.textContent = msg;
    clearTimeout(flash.t);
    flash.t = setTimeout(() => { status.textContent = ""; }, 3000);
  };

  $("[data-copy]").addEventListener("click", async () => {
    const text = message();
    try {
      await navigator.clipboard.writeText(text);
      flash("Copied. Paste it into any message or email.");
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      flash(ok ? "Copied. Paste it into any message or email." : "Copy isn't available here. Use WhatsApp or email instead.");
    }
  });

  $("[data-print]").addEventListener("click", () => window.print());

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => {
      orderInView = en.isIntersecting;
      bar.hidden = selected().length === 0 || orderInView;
    }, { threshold: 0.15 }).observe($("#order"));
  }

  load();
  render();
})();
