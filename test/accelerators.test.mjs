import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { accelerators, bundles } from "../data/accelerators.mjs";

const page = await readFile(new URL("../site/accelerators/index.html", import.meta.url), "utf8");
const home = await readFile(new URL("../site/index.html", import.meta.url), "utf8");
const checklist = await readFile(new URL("../AI-Business-Accelerators-Checklist.md", import.meta.url), "utf8");

test("every category and build from the service sheets is on the page as a checkbox", () => {
  const fromSheets = ["Custom AI Agents", "AI Integrations", "AI Executive Intelligence", "AI Workflow Automation", "AI Customer Experience", "AI Marketing Automation", "AI Lead Generation", "AI Video Commercials"];
  for (const name of fromSheets) assert.ok(page.includes(name), `missing ${name}`);
  for (const c of accelerators) for (const [id] of c.items) assert.ok(page.includes(`value="${c.id}.${id}"`), `missing checkbox ${c.id}.${id}`);
});

test("ids are unique and bundles only reference real builds", () => {
  const ids = accelerators.flatMap((c) => c.items.map(([id]) => `${c.id}.${id}`));
  assert.equal(new Set(ids).size, ids.length);
  for (const b of bundles) for (const k of b.items) assert.ok(ids.includes(k), `${b.id} → ${k}`);
});

test("the menu bar links to the accelerators page", () => {
  assert.match(home, /<nav class="nav"[\s\S]*href="\/accelerators\/"[\s\S]*<\/nav>/);
});

test("ordering goes to WhatsApp and email, with no form or prices", () => {
  assert.ok(!/<form\b/.test(page));
  assert.match(page, /data-send-whatsapp/);
  assert.match(page, /mailto:nikky@nikkykho\.com/);
  assert.ok(!/[€$]\s?\d/.test(page), "accelerators are custom quoted; no prices on the page");
});

test("printable checklist has a checkbox for every build", () => {
  const total = accelerators.reduce((n, c) => n + c.items.length, 0);
  assert.equal((checklist.match(/^- \[ \] /gm) || []).length, total + bundles.length);
});
