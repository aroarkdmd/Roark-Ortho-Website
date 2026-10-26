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
| `/book` | **Live WaveOrtho exam scheduler** (see below) |

## Booking page (`/book`) — WaveOrtho scheduler

`/book` runs the practice's **real** appointment book, not a mock. The WaveOrtho Inquiry Form &
Exam Scheduler (v8.0.8) is mounted through **their JavaScript library**, not their iframe — the
iframe was rejected because everything inside it is a separate document and cannot be restyled.

Files:

| File | Role |
|---|---|
| `src/pages/book-wave.tsx` | The page; carries the mount element and attribute config |
| `public/static/wave/wave-inquiry-form.min.js` | Vendored library (331,076 B) |
| `public/static/wave/wave-core.min.css` | Wave's own CSS, Bootstrap stripped (9,676 B) |
| `public/static/wave-roark.css` | The Roark skin — re-tints Wave's class names |
| `public/static/wave-roark.js` | Mount runtime + conversion gating |

**Location.** The Wave account holds Franklin and Hermitage. Online scheduling is Franklin-only, so
`data-hide-locations="true"` + `data-default-location="Franklin"` hide the picker and lock the
default. Hermitage remains a valid option value in the hidden `<select>` but is unreachable — the
patient never sees it and the hidden select is pre-set to Franklin's UUID.

`data-default-location` matches on the location **name**, not its UUID (`e.name === value` in the
source). Passing the UUID silently matches nothing and, because the picker is hidden, the scheduler
does not render at all.

**Render timing.** `data-wait="true"` stops the library auto-rendering on a 5s timer. `wave-roark.js`
then assigns `onFormSubmission` and calls `createForm()` itself, because a handler attached *after*
render is never invoked. Verified: with `data-wait` and no manual call the container stays empty;
without `data-wait` it self-renders after ~5s.

**Conversion gating.** Wave calls `onFormSubmission` with `{}` on success and sets
`appointmentMessage` for **both** a real booking and "please call me instead". Only the call-me case
uses the fixed string `Our office will call you to schedule an appointment`; a real booking uses a
time-derived message. The runtime additionally tracks whether a slot was actually picked (capture-
phase click listener on `.available-time-button` / `.confirm-button`, which survives Wave's
re-renders). A conversion needs **both** success and a picked slot, so call-me requests are counted
as `appointment_requested`, not `appointment_booked`.

**Styling.** Wave ships CSS, but `wave-ortho-inquiry-form.min.css` (165 KB) bundles Bootstrap 5 from
byte 9,676 onward, including 17 global `body{}` and 28 `.row{}` rules that would repaint the whole
site. Only bytes 0–9,675 (Wave's own structural rules) are shipped. The standalone
`-exam-scheduler.min.css` was a strict subset of that range and is omitted. The skin then overrides
colour/type/spacing under an `#waveInquiryForm` prefix so it outranks Wave's class selectors without
`!important` — the one exception is the duplicate `<h1>`, which Wave writes `display:inherit` onto
inline and therefore needs `!important` to hide.

**Network.** The library calls `https://central.waveortho.com/wave-central/api/v4/*` directly from
the browser. That origin returns `Access-Control-Allow-Origin: *`, so this works from our domain and
needs no proxy. Nothing is proxied through Cloudflare, and no PHI passes through our own API.

## API
- `POST /api/contact` — contact panel (`name`, `email`, `phone`, `message`, `source`, `page`)
- `POST /api/scheduler` — **live**, on `/adults` and `/invisalign` (see the bug below)
- `POST /api/booking` — genuinely unrouted; only `src/pages/book.tsx` called it
- `GET /api/submissions` — admin read of stored submissions (not linked from the site)
- `GET /health`

**`/api/scheduler` is NOT legacy.** An earlier draft of this file claimed it was unrouted. It is
not: `SchedulerPanel` (`src/components/blocks.tsx:270`) is rendered on `/adults`
(`src/pages/content.tsx:577`) and `/invisalign` (`:954`), and `public/static/app.js:413` posts to it.

`/api/booking` and `src/pages/book.tsx` **are** dead — `/book` no longer routes to `BookPage`, so
`booking.js` never runs (it bails at the `.bk-shell` guard) and nothing posts to `/api/booking`.

All of these write to D1 table `submissions` (schema auto-created on first write).
Validation rules and error copy mirror the design exactly.

**A confirmation is only shown when the row was actually stored.** This is deliberately
pessimistic: a wrong "sent" silently loses a patient's enquiry, while a wrong "please call us"
costs one phone call. `POST /api/contact` returns `503 {ok:false,error:'not_stored'}` on a
storage failure or a missing binding, and the client renders a visible
`[data-form-alert]` with the office number instead of the success panel.

> **OPEN BUG — `/api/scheduler` loses enquiries (`src/index.tsx:567-580`).** It wraps the insert in
> `try/catch`, and the `catch` returns `{ok:true, bookingId, stored:false}` — a 200 that claims
> success. `app.js` ignores `stored`, so the panel shows "Request received" on an enquiry that was
> never written. This is the exact defect already fixed for `/api/contact`; the fix is to mirror
> `/api/contact` — throw when `c.env.DB` is missing, return `503 {ok:false,error:'not_stored'}` in
> the catch, and have `app.js` render `[data-form-alert]` (the element already exists at
> `blocks.tsx:238`) instead of calling `finish()`.
>
> **Decide first:** these two panels may be redundant now that `/book` runs the real Wave book.
> Either fix `/api/scheduler` or delete `SchedulerPanel` and point that traffic at Wave.

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
- ✅ **Booking is real.** `/book` now runs the practice's actual WaveOrtho appointment book instead of
  the previous mock. The mock's two defects (decorative slot availability computed from a hash, and a
  "welcome email is on its way" message with no email library behind it) are no longer reachable from
  the UI. `/api/booking` and `/api/scheduler` remain in the codebase, unfixed, and unrouted — delete
  them once you are happy with Wave.
- ⚠ `GTM_ID` is unset, so **no tag loads**. Set it (`npx wrangler pages secret put GTM_ID
  --project-name roark-orthodontics`) and add a GTM Custom Event trigger on `appointment_booked`.
  Until then the conversion fires into `dataLayer` and goes nowhere.
- ⚠ **No HIPAA Notice of Privacy Practices.** `/privacy` covers the *website* only (forms, storage,
  ads measurement) and deliberately says so — it is not a substitute for the clinical notice, which
  needs the practice's own reviewed text.
- ⚠ The footer **"Accessibility"** link still points at `/contact#faq`, which has nothing about
  accessibility. Needs either a real page or repointing.
- ✅ `/api/submissions` is no longer an open admin read. It requires a bearer `ADMIN_TOKEN` and
  **fails closed with a 404 when the secret is unset** (verified: unauthenticated GET returns 404).
  Set it with `npx wrangler pages secret put ADMIN_TOKEN --project-name roark-orthodontics` before
  you need to read submissions.

## Privacy page (`/privacy`)

`src/pages/privacy.tsx`, rendered at `/privacy`. It describes **only what the code actually does**,
and was written against the running implementation rather than from a template:

| Claim on the page | Where it comes from |
|---|---|
| Contact form fields, stored in our database | `POST /api/contact` → D1 `submissions` |
| Booking fields incl. date of birth, insurance | **WaveOrtho** — submitted browser-to-`central.waveortho.com`, never to us |
| `roark-booking-v1` local storage draft | `public/static/booking.js` `STORE` |
| `roark-consent-v1` consent choice | `public/static/tagging.js` `CONSENT_KEY` |
| `roark-conv-fired` session flag | `public/static/tagging.js` `CONV_KEY` |
| "Sets no cookies of its own" | no `document.cookie` anywhere in `src/` or `public/static/` |
| "Fonts served from our own server" | `/static/fonts/*.woff2`, no Google Fonts request |
| "Map loads only when tapped" | `initMaps()` in `public/static/app.js` swaps a facade for an iframe |
| "No patient data in the conversion" | `roarkBookingConversion()` payload: ref, value, currency only |
| EEA/UK/CH consent prompt | `consentRequired()` + `request.cf.country` in `src/lib/tagging.ts` |

**If any of those change, this page must change with it.** The section 6 storage table and section
10 processor table are the two that go stale fastest.

Consent can be revisited via `?consent=1` on any URL, which clears the stored choice and re-shows
the bar — that is documented to visitors in section 13.


Assets: logos, 4 woff2 fonts and 17 WebP photos copied from the handoff bundle.
