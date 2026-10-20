# AI-Native Executive — site

Static, zero-dependency multi-page site for Real AI Dynamics (with AI Startup House).

| Page | URL | Source |
| --- | --- | --- |
| **Home = Berlin AI-Native Executive Lab** (one-day event, Thu 22 Oct 2026) | `/` | `src/pages/home.html` |
| Executive programs (Implementation Day, Mastermind, VIP, immersion, technology, timeline) | `/programs/` | `src/pages/programs.html` |
| AI Business Accelerators (order page) | `/accelerators/` | `data/accelerators.mjs` |
| About (Nikky, ecosystem, enterprise) | `/about/` | `src/pages/about.html` |
| Contact (WhatsApp + email, topic pre-fill) | `/contact/` | `src/pages/contact.html` |

- The menu bar, `<head>`, and footer are shared and defined once in `scripts/build.mjs`. Edit `src/pages/*` or the data, then run `npm run build`. Never edit `site/**/index.html` directly, since the build overwrites it.
- `site/` is the deployable root (`vercel.json`). Preview: `npm run dev`, then http://localhost:8160 (launch config `ai-native-executive`).
- Tests: `npm test` builds, then checks the home page is event-only, the menu is on every page, prices, guardrails, links, and contact info.
- Pre-fill links: each page pre-fills WhatsApp/email for its own topic (home → Berlin, programs → Mastermind, about → enterprise). `?interest=slides | berlin | day | mastermind | vip | enterprise` overrides that, so QR codes can point anywhere.

## AI Business Accelerators (`/accelerators/`)

Order page where clients tick the builds they want (15 accelerators, 94 builds, 4 quick-start bundles) and send the list on WhatsApp or by email with one tap. There are no prices; every build is custom quoted. Linked from the home page nav, the ecosystem section, a dedicated "AI Business Accelerators" section, and the footer.

- Edit the catalog in `data/accelerators.mjs`, then run `npm run build`. That regenerates `site/accelerators/index.html` and the printable `AI-Business-Accelerators-Checklist.md`.
- Selections are remembered in the visitor's browser. "Print checklist" prints the whole catalog with tick boxes.

## Contact

There's no form. Calls to action scroll to the page's own contact section (or go to `/contact/`), which has a WhatsApp button (+1 310 402 7863) and an email button (nikky@nikkykho.com). Clicking a program's button (or arriving via `?interest=…`) pre-fills the WhatsApp message and email subject for that program.

Settings live in `site/main.js` → `CONFIG`: `whatsapp`, `email`, and `slidesUrl` (set it to a public PDF to make the "Keynote slides" topic on the Contact page a direct download).

## Deploying

The Vercel project `ai-native-executive` (team Kho) deploys automatically from the `main` branch of this repo. Vercel runs `npm run build` and serves `site/`. Live at https://ai-native-executive.vercel.app.
