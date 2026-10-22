# Roark Orthodontics — Website

Rebuilt from the Genspark Design handoff `designer2-328a89aa-4d67-446a-9a63-9156a2f6c975`
via the `designer-handoff` skill. The handoff HTML was treated as the **specification**,
not shipped: the design is reimplemented as a server-rendered Hono app on Cloudflare Pages.

## Stack
- **Hono + TSX** server-rendered pages (no client-side JSX compilation, no dev React)
- **Cloudflare Pages + D1** — forms persist server-side
- Design tokens ported verbatim from `colors_and_type.css`; structural layer from `site/site.css`
- Self-hosted Playfair Display + Lora woff2, Font Awesome 6 Solid icon paths

## Pages
| Route | Purpose |
|---|---|
| `/` | Homepage — hero, pathway split, treatments, founder, gallery, FAQ, journal |
| `/surgical-orthodontics` | Treatment page incl. the **Contact Us** panel (`#surg-contact`) |
| `/contact` | NAP, hours, click-to-load map, contact panel |
| `/treatments` | Treatment menu + appliance/age matrix |
| `/kids-braces`, `/adults` | Demographic silos |
| `/invisalign-first`, `/braces`, `/invisalign`, `/palatal-expander` | Treatment detail |
| `/financing` | Cost, insurance, 0% plans |
| `/areas-we-serve`, `/blog`, `/blog/:slug` | Geo page + Smile Journal |
| `/book` | 4-step booking flow with summary rail and confirmation |

## API
- `POST /api/contact` — contact panel (`name`, `email`, `phone`, `message`, `source`, `page`)
- `POST /api/scheduler` — new-patient-exam request panel
- `POST /api/booking` — booking flow confirmation (`ref`, `who`, `date`, `time`, `contact`, `patients`, `insurance`, …)
- `GET /api/submissions` — admin read of stored submissions (not linked from the site)
- `GET /health`

All three write to D1 table `submissions` (schema auto-created on first write).
Validation rules and error copy mirror the design exactly. **The success state never depends
on the network call** — a storage failure still shows the confirmation.

## Design fidelity notes
- Tokens, type scale, radii, shadows, motion and breakpoints are the handoff's values.
- Contact panel field order/labels/placeholders/validation messages are verbatim.
- Booking state model matches `book.html` (step, maxStep, done, ref, who, date, time, patients,
  insurance, sms, errors) and persists to `localStorage` under `roark-booking-v1`.
- Analytics: Consent Mode v2 defaults pushed before any tag; `phone_click`, `book_click`,
  `contact_form_submit`, `booking_step`, `booking_complete` all carry `page_path` + utm/gclid.
  **No PHI is ever pushed to analytics.**
- Fixes applied per the README's known-defects list: content is server-rendered, JSX is
  precompiled, forms transmit, each treatment page has its own H1.

## Local development
```bash
npm run build
pm2 start ecosystem.config.cjs        # wrangler pages dev dist ... --port 3000
curl http://localhost:3000
```
Apply local D1: `npx wrangler d1 migrations apply webapp-production --local`

## Deploy
`wrangler pages deploy dist --project-name <name>` (D1 binding `DB` required for form storage).

## Status
✅ Builds clean, all routes 200, all three endpoints verified writing to D1.
Assets: logos, 4 woff2 fonts and 17 WebP photos copied from the handoff bundle.
