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
| `/areas-we-serve`, `/blog`, `/blog/:slug` | Geo page + Franklin Orthodontics Blog |
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
- `POST /api/contact` — every contact form on the site (`name`, `email`, `phone`, `message`,
  `source`, `page`). Stores to D1, **then** emails both practice inboxes.
- `POST /api/booking` — genuinely unrouted; only `src/pages/book.tsx` called it
- `GET /api/submissions` — admin read of stored submissions (Bearer `ADMIN_TOKEN`; 404 if unset)
- `GET /health`

## SEO files
- `GET /sitemap.xml` — generated from the route table in `src/lib/seo.ts`
- `GET /robots.txt` — generated; allows all, disallows `/api/` and `/health`, names the AI
  crawlers, advertises the sitemap

Both are generated rather than static so a new page cannot be forgotten. Journal articles come
from `POSTS`, so they appear with **no** second edit.

Two deliberate omissions, and why: **`/book` is not in the sitemap** (it sends
`noindex`), and **`/book` is not disallowed in robots.txt** — a crawler must be able to fetch the
page to read the noindex, and blocking it would hide the directive.

## Redirects from the old WordPress site

`src/lib/redirects.ts`, called **only** from `app.notFound()` in `src/index.tsx`, so a redirect
can never override a page that exists. Covers all 17 WordPress pages (taken from its REST API on
2026-10-27), plus trailing-slash and letter-case variants of every current page. The query
string is always kept, so `gclid`, `gbraid` and `utm_*` survive for Google Ads attribution.
GET/HEAD only; `/api/*` and `/static/*` never redirect.

| Old URL | New URL | Type |
|---|---|---|
| `/treatment-options/` | `/treatments` | 301 |
| `/treatment-options/braces/` | `/braces` | 301 |
| `/treatment-options/invisalign/` | `/invisalign` | 301 |
| `/treatment-options/palatal-expander/` | `/palatal-expander` | 301 |
| `/financing-and-insurance/` | `/financing` | 301 |
| `/book-now/` | `/book` | 301 |
| `/thank-you/` | `/contact` | 301 |
| `/appointment-scheduled/` | `/book` | 301 |
| `/contact/`, `/blog/`, `/braces/` etc. | same path, no slash | 301 |
| `/invisalign-franklin/` (Ads) | `/invisalign` | **302, temporary** |
| `/braces-franklin/` (Ads) | `/braces` | **302, temporary** |
| `/first-visit/` | `/#patients` | **302, temporary** |
| `/gallery/` | `/#gallery` | **302, temporary** |
| `/product-recommendations/` | `/invisalign` | **302, temporary** |

The 302s point at stand-in pages. When the real page ships (`/lp/invisalign-franklin`,
`/lp/braces-franklin`, `/first-visit`, a gallery), change that entry to the new URL **and** to
`301`. Building a real page at an old path (e.g. `/first-visit`) wins automatically.

301s are sent with `Cache-Control: public, max-age=86400` (one day), 302s with `no-store`.

Verify against any host with:
```bash
scripts/check-redirects.sh https://roark-orthodontics.pages.dev   # 70 checks
```

## Contact-form delivery

`/api/contact` writes the row to D1 **first**, then emails it to `info@roarkortho.com` and
`admin@roarkortho.com` (from `CONTACT_INBOXES`, overridable with a `CONTACT_INBOXES` env var).
Order matters: a mail outage cannot lose an enquiry. The response reports `delivered: true|false`.

Requires two secrets — `RESEND_API_KEY` and `MAIL_FROM` (a verified address on the domain, e.g.
`noreply@roarkortho.com`; **not** `info@`, which is a Google Workspace mailbox). Without the key,
enquiries are still stored and the visitor still sees "Message sent", but no email is sent.

A confirmation is only shown when the row was actually stored. `POST /api/contact` returns
`503 {ok:false,error:'not_stored'}` on a storage failure or a missing binding, and the client
renders a visible `[data-form-alert]` with the office number instead of the success panel.


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
# test first on a preview link (does not touch production):
npx wrangler pages deploy dist --project-name roark-orthodontics --branch preview
scripts/check-redirects.sh https://preview.roark-orthodontics.pages.dev
# then production:
npx wrangler pages deploy dist --project-name roark-orthodontics --branch main
```

⚠ The project is also connected to GitHub, and those automatic builds fail (no build command
is set, so `dist` is missing). Production is unaffected because deploys go up from the sandbox.
Before setting a build command in the dashboard, push the latest code to GitHub, or Cloudflare
will publish the older GitHub version.

The API token needs **Account · Cloudflare Pages · Edit** *and* **Account · D1 · Edit**.
Without D1 the deploy fails on the binding, and form storage is unavailable.

## Status

✅ Builds clean, all routes 200 in production.
✅ **Old WordPress URLs redirect** (deployed 2026-10-27, all 70 checks pass on production).
✅ **Contact form verified end to end against the production database** — a test POST to
`/api/contact` returned `{ok:true,received:true}` and the corresponding row was read back from
`roark-orthodontics-production` via `wrangler d1 execute --remote` (test row since deleted).

Deferred / outstanding:
- ✅ **Booking is real.** `/book` now runs the practice's actual WaveOrtho appointment book instead of
  the previous mock. The mock's two defects (decorative slot availability computed from a hash, and a
  "welcome email is on its way" message with no email library behind it) are no longer reachable from
  the UI. `/api/booking` and `src/pages/book.tsx` remain in the codebase, unrouted — delete them
  once you are happy with Wave. (`/api/scheduler`, `SchedulerPanel` and `initSchedulerForms()` were
  **deleted** on 2026-10-26, not fixed — see HANDOFF.md §14. The practice wants no in-page booking:
  every page carries a contact form, with a link to `/book` for anyone who wants to pick a time.)
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
