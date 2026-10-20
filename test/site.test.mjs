import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access, stat } from "node:fs/promises";

const read = (p) => readFile(new URL(`../site/${p}`, import.meta.url), "utf8");
const PAGES = { home: "index.html", programs: "programs/index.html", accelerators: "accelerators/index.html", about: "about/index.html", contact: "contact/index.html" };
const html = Object.fromEntries(await Promise.all(Object.entries(PAGES).map(async ([k, p]) => [k, await read(p)])));
const text = (h) => h.replace(/<[^>]+>/g, " ");
const all = Object.values(html).join("\n");

test("home page is only the Berlin one-day event", () => {
  const h = html.home;
  for (const id of ["top", "agenda", "details", "host", "reserve", "faq"]) assert.match(h, new RegExp(`id="${id}"`), `home missing #${id}`);
  assert.match(text(h), /Thursday/);
  assert.match(text(h), /22/);
  assert.match(text(h), /€795/);
  assert.match(h, /data-default-interest="berlin"/);
  // Other offers live on their own pages, not on the home page.
  for (const other of ["€15,000", "€25,000", "Visionary Circle", "Future Technology Lab", "AI Video Commercials", "id=\"programs\"", "id=\"immersion\""]) {
    assert.ok(!h.includes(other), `home page should not include ${other}`);
  }
});

test("every page has the same menu bar linking all pages", () => {
  for (const [key, h] of Object.entries(html)) {
    for (const href of ["/", "/programs/", "/accelerators/", "/about/", "/contact/"]) {
      assert.match(h, new RegExp(`<nav class="nav"[\\s\\S]*href="${href}"[\\s\\S]*</nav>`), `${key} menu missing ${href}`);
    }
    assert.match(h, /aria-current="page"/, `${key} has no active menu item`);
    assert.match(h, /href="\/#reserve"/, `${key} missing Reserve CTA`);
  }
});

test("programs page carries the tiers, immersion, technology, and timeline", () => {
  for (const id of ["programs", "immersion", "technology", "timeline", "apply", "faq"]) assert.match(html.programs, new RegExp(`id="${id}"`));
  for (const p of ["€995", "€1,495", "€15,000", "€18,000", "€25,000", "€30,000"]) assert.ok(text(html.programs).includes(p), `missing ${p}`);
});

test("private guardrail phrases stay off every page", async (t) => {
  // The phrase list lives in test/guardrails.local.json, which is gitignored so it never reaches the public repo.
  let banned;
  try {
    ({ bannedPhrases: banned } = JSON.parse(await readFile(new URL("./guardrails.local.json", import.meta.url), "utf8")));
  } catch {
    t.skip("test/guardrails.local.json not present");
    return;
  }
  for (const phrase of banned) assert.ok(!text(all).includes(phrase), `site must not mention a private guardrail phrase`);
});

test("Berlin Lab takes payment via Stripe and is not presented as a Frontiers Health event", () => {
  assert.match(text(html.home), /Not an official Frontiers Health event/);
  assert.match(text(html.home), /not affiliated with or endorsed by Frontiers Health/);
  assert.match(html.home, /href="https:\/\/buy\.stripe\.com\/8x28wQcm00UC2ja9yibQY00"/, "home must link to the Stripe payment page");
  assert.ok((html.home.match(/data-pay/g) || []).length >= 3, "payment link on hero, agenda, and reserve section");
});

test("contact is WhatsApp + email only, with no form anywhere", () => {
  assert.ok(!/<form\b/.test(all), "no page may contain a form");
  for (const k of ["home", "programs", "contact"]) {
    assert.match(html[k], /href="https:\/\/wa\.me\/13104027863"/, `${k} missing WhatsApp`);
    assert.match(html[k], /href="mailto:nikky@nikkykho\.com/, `${k} missing email`);
  }
  assert.match(text(html.contact), /\+1 310 402 7863/);
  assert.ok(!all.includes("support@realaidynamics.com"));
});

test("local links and assets resolve to real files", async () => {
  const refs = new Set();
  for (const h of Object.values(html)) {
    for (const m of h.matchAll(/(?:src|href)="(\/[^"#?]*)/g)) refs.add(m[1]);
    for (const m of h.matchAll(/srcset="([^"]+)"/g)) m[1].split(",").forEach((s) => refs.add(s.trim().split(" ")[0]));
  }
  for (const r of refs) {
    const p = new URL(`../site${r}`, import.meta.url);
    const isDir = (await stat(p)).isDirectory();
    await access(isDir ? new URL("index.html", p.href.endsWith("/") ? p : `${p.href}/`) : p);
  }
});

test("stylesheet is well formed and headings use the serif face", async () => {
  const css = await read("styles.css");
  assert.equal((css.match(/{/g) || []).length, (css.match(/}/g) || []).length, "unbalanced braces");
  assert.match(css, /^h1, h2, [^{]*\{\s*font-family: var\(--serif\);/m);
});
