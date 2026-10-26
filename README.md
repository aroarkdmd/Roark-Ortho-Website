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
Validation rules and error copy mirror the design exactly.

**A confirmation is only shown when the row was actually stored.** This is deliberately
pessimistic: a wrong "sent" silently loses a patient's enquiry, while a wrong "please call us"
costs one phone call. `POST /api/contact` returns `503 {ok:false,error:'not_stored'}` on a
storage failure or a missing binding, and the client renders a visible
`[data-form-alert]` with the office number instead of the success panel.

> **Known gap:** `POST /api/scheduler` still answers `{ok:true, bookingId, stored:false}` on a
> storage failure and the client does not yet treat that as an error. Fixing the scheduler panel
> is deliberately deferred (see Status).

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

Live on the practice's own Cloudflare account:

- **Production:** https://roark-orthodontics.pages.dev
- **Project:** `roark-orthodontics` (Pages, production branch `main`)
- **D1:** `roark-orthodontics-production` (`ac7f7c75-fdda-436f-a756-9ff86c3efb52`), binding `DB`

```bash
npm run build
npx wrangler pages deploy dist --project-name roark-orthodontics
```

The API token needs **Account · Cloudflare Pages · Edit** *and* **Account · D1 · Edit**.
Without D1 the deploy fails on the binding, and form storage is unavailable.

## Status

✅ Builds clean, all routes 200 in production.
✅ **Contact form verified end to end against the production database** — a test POST to
`/api/contact` returned `{ok:true,received:true}` and the corresponding row was read back from
`roark-orthodontics-production` via `wrangler d1 execute --remote` (test row since deleted).

Deferred / outstanding:
- ⏸ **Scheduler panel** (`POST /api/scheduler`) — still reports success on a storage failure and
  its client handler does not yet reject `stored:false`. Deferred by request; the booking flow
  (`/api/booking`) and the contact form are already correct.
- ⚠ `GTM_ID` is unset, so **no tag loads**. Set it (`npx wrangler pages secret put GTM_ID
  --project-name roark-orthodontics`) and add a GTM Custom Event trigger on `appointment_booked`.
- ⚠ **No privacy policy or HIPAA Notice of Privacy Practices page.** The footer "Privacy" link
  points at `/contact#faq`. A practice collecting names, emails and phone numbers needs both, and
  this is independent of the cookie-consent question. Needs the practice's own reviewed text.
- ⚠ `/api/submissions` is an unauthenticated admin read. It is not linked from the site, but it
  returns every stored submission to anyone who requests it. Needs auth or removal before launch.

Assets: logos, 4 woff2 fonts and 17 WebP photos copied from the handoff bundle.
