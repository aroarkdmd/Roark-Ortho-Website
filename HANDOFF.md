# HANDOFF — Roark Orthodontics Website

Last updated: 2026-10-26
Repo: https://github.com/aroarkdmd/Roark-Ortho-Website (branch `main`, public)
Live: https://roark-orthodontics.pages.dev
Project dir: `/home/user/webapp`
**Last commit: `d5d4361`** — read §0 before doing anything.

Read this first. It is written so a fresh session can start work without re-deriving
anything that cost time to establish.

---

## 0. RESUME HERE (rewritten 2026-10-26 — DEPLOYED)

### State: DEPLOYED and live. Email delivery still NOT live.

> **This section previously said "code complete, NOT deployed". That is now out of date and
> was corrected after verifying production.** Everything described below IS on the live site.
> Do not re-deploy those four features — they are already serving.

The user said "deploy now", explicitly accepting that contact forms would store enquiries without
emailing anyone until the Resend key exists. Deploy happened via `cf-byok-deploy`:

```bash
setup_cloudflare_api_key        # ← must run before ANY wrangler command
npx wrangler whoami             # → Ashleyroarkdmd@gmail.com's Account, 3ee8313f...
npm run build                   # → dist/_worker.js 220.40 kB (gzip 63.33 kB)
npx wrangler pages deploy dist --project-name roark-orthodontics --branch main
```

To resume in a fresh sandbox:

```bash
git clone https://github.com/aroarkdmd/Roark-Ortho-Website.git   # or use the existing /home/user/webapp
cd /home/user/webapp && npm install && npm run build
```

`npm install` IS required. Only `hono` is a runtime dep; `vite`, `wrangler` and `jsdom` are dev deps.

### Verified against production after deploy (2026-10-26)

```
/  /about  /about/  /sitemap.xml  /robots.txt  /contact  /adults  /invisalign
/treatments  /kids-braces  /financing  /book  /blog   → all 200
sitemap.xml                                          → 18 <loc> entries, /book absent
robots.txt                                           → correct
POST /api/contact                                    → {"ok":true,"received":true,
                                                        "delivered":false,"mailNote":"no_api_key"}
malformed POST /api/contact                          → 400
row written to REMOTE D1 (verified id 4, then deleted; table back to 0 rows)
```

`wrangler pages secret list` returns **empty** — no secrets set at all. That is the one blocker.

### What was completed (all now live)

1. **Retainers & relapse care removed from `/treatments`** — three places: the `TREATMENTS`
   grid in `src/lib/site-data.ts`, the comparison matrix, and the options card grid. Commit
   `f6de072`. Deliberately scoped: fee copy still says "includes your first set of retainers",
   because that is a true statement about what the fee covers, not a service listing.
2. **Contact form replaces the in-page scheduler** — `/adults` and `/invisalign` now render
   `ContactPanel` with a "Would you rather pick a time?" link to `/book`. `SchedulerPanel`,
   `/api/scheduler` and `initSchedulerForms()` were **deleted** (not fixed). See §14.
3. **`/about` page** — new, rebuilt from the practice's old WordPress page. Both `/about` and
   `/about/` are routed; `#meet-the-team` anchor preserved. See §16.
4. **`sitemap.xml` + `robots.txt`** — generated from a route table, all 18 URLs verified 200.
   See §15. Also fixed the footer "Sitemap" link, which pointed at a 404.
5. **Franklin Orthodontics Blog (formerly "Smile Journal") moved to footer only** (practice request) — SEO-neutral, and it fixed a real
   header overflow between the 1000px collapse point and ~1070px.

### THE ONE BLOCKING TASK

**`RESEND_API_KEY` and `MAIL_FROM` are unset, so contact forms email nobody.**

Every enquiry IS stored in D1 and the visitor DOES see "Message sent" — that part is honest and
works. But no email reaches info@ or admin@. The rows sit in the database until someone reads
`GET /api/submissions`. **Do not describe the contact form as "done" until this is set.**

The user was going to create a Resend account and supply the key. Full setup walkthrough is in
§13, including the DNS records and the two traps:

- **`MAIL_FROM` must not be `info@` or `admin@`** — those are Google Workspace mailboxes; sending
  as them breaks DMARC alignment. Use `noreply@roarkortho.com`.
- **Root SPF needs no change.** It already includes `amazonses.com`; Resend's SPF lives on the
  `send` subdomain.

### The open question is now CLOSED

The previous session asked whether to (a) wait for the Resend key or (b) deploy now. **The user
chose (b): "deploy now"**, knowingly accepting that forms would store without emailing. That is done
and is no longer an open question — do not re-ask it.

### Do not repeat these mistakes

- **`dig` is not installed in this sandbox.** It exits silently and every lookup looks like "no
  record". I wrongly reported your DNS as empty because of this. Use
  `curl -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=X&type=Y'`.
- **There is no headless browser.** `PlaywrightConsoleCapture` fails, and `playwright`/`puppeteer`
  are not installed. Do not claim a layout is verified by eye — you cannot see it. Ask for a
  screenshot, or measure with `fontTools` against the real woff2 in `public/static/fonts/`.
  I burned time re-deriving a header-overflow number twice and got two different answers.
- **`/about` does not match `/about/`** in a Workers route. Both must be registered. The old site
  used the trailing-slash form, so external links depend on it.

### Verification that was actually run (all passing at commit `d5d4361`, post-deploy)

```
npm run build                     → green, dist/_worker.js 220.40 kB (gzip 63.33 kB)
20-route sweep                    → 0 failures
all 18 sitemap URLs              → 200
sitemap.xml                      → valid XML, correct MIME
robots.txt                       → /api/ and /health disallowed; /book NOT disallowed
/about/ and /about/#meet-the-team → 200
```

---

## 1. Standing instructions from the user

These were stated repeatedly and are not negotiable:

- **Deploy to the user's OWN Cloudflare account.** Project `roark-orthodontics`.
  Use the `cf-byok-deploy` skill. Live URL: https://roark-orthodontics.pages.dev
- **NEVER propose Genspark hosting.** The user said, verbatim: *"don't ask me again to host on genspark"*.
  Do not activate `gsk-hosted-deploy` for this project.
- **Communicate in English only.** The user objected to Chinese previously.
- **Design matters.** The user has repeatedly said they love the current Roark design and want it kept.
  (Later relaxed slightly: *"Don't worry about preserving the style, just make it work and make it as
  close to my style as possible."* Style is secondary to function, but still aim to match.)
- **Online scheduling is FRANKLIN ONLY.** Hermitage must never be offered. The user does not use
  online scheduling for Hermitage.

Cloudflare account: `3ee8313f02d4d71306e687c39e46d2c3` (Ashleyroarkdmd@gmail.com's Account)
D1: `roark-orthodontics-production` = `ac7f7c75-fdda-436f-a756-9ff86c3efb52`, binding `DB`

---

## 2. What `/book` is now

`/book` runs the practice's **real** WaveOrtho appointment book, not a mock.

- WaveOrtho Inquiry Form & Exam Scheduler **v8.0.8**
- Doctor ID: **`B63E154EBB`** (client 0491, "Roark, Ashley") — this is a public `data-doctor-id`,
  not a secret.
- Mounted via Wave's **JavaScript library**, NOT their iframe. The iframe was rejected because
  everything inside it is a separate document and cannot be restyled. The user explicitly chose the
  JS library route: *"finish the javascript library route, you do not need to delete, this site is not live"*.

### Files
| File | Role |
|---|---|
| `src/pages/book-wave.tsx` | The page; carries the mount element + attribute config |
| `public/static/wave/wave-inquiry-form.min.js` | Vendored library, **331,076 bytes** |
| `public/static/wave/wave-core.min.css` | Wave's own CSS with Bootstrap stripped, **9,676 bytes** |
| `public/static/wave-roark.css` | The Roark skin (~20 KB) |
| `public/static/wave-roark.js` | Mount runtime + conversion gating (~8.8 KB) |

---

## 3. CRITICAL — the demo-mode trap (do not repeat this)

This burned an enormous amount of time. **The Wave library on their public CDN is a DEMO build.**

- `https://central.waveortho.com/wave-inquiry-form/lib/wave-ortho-inquiry-form.min.js` is
  **360,561 bytes**. It contains a *second* definition of `WaveInquiryForm` at byte offset 331,076
  that hardcodes `demoMode = !0` and serves fabricated slots (`Appt_ID:"1234-1234-1234"`).
- The **user's uploaded build is 331,076 bytes** and has `demoMode` completely absent
  (property does not exist). It is the clean production build.

Verify any future vendor drop with:
```bash
grep -c "demoMode" public/static/wave/wave-inquiry-form.min.js   # must be 1 (a guard read) or 0
```
If the file is ~360 KB, you have the demo build. Get the real one from the user or Wave's
download page — the user has uploaded all 8 vendor files before (see §8).

### Wave integration facts established by testing (all verified, don't re-derive)

- `window.WaveInquiryForm` **does** exist (it is also aliased `window.$wave_WaveInquiryForm`).
  Keys: `createForm, _getText, _getLanguage, demoMode, getDemoAppointmentData, getConfigMap`.
- `data-wait="true"` **defers auto-render** (verified: without it, the form self-renders after ~5s;
  with it, the container stays empty until you call `createForm()`). This is required so
  `onFormSubmission` can be attached first — a handler attached after render is never called.
- `data-default-location` matches on the location **NAME**, not UUID (`e.name === d` in source).
  Passing the UUID silently matches nothing, and because locations are hidden the scheduler
  **does not render at all**. Silent failure. Correct value: `"Franklin"`.
- `data-hide-locations="true"` + `data-default-location="Franklin"` → picker is `display:none` and
  the hidden `<select>` is pre-set to Franklin's UUID. Hermitage stays as an option value but is
  unreachable.
- Wave's API sends **`Access-Control-Allow-Origin: *`**, so it is called directly from the browser.
  No proxy needed, and no PHI passes through our own API.
- API endpoints (called by the library itself): `/wave-central/api/v3/getInquiryFormData.php`,
  `/v4/getAppointmentDataCount.php`, `/v4/getAppointmentData.php`, `/api/appt_scheduler.php`,
  `/api/inquiry.php` — all on `https://central.waveortho.com`.
- **Wave DOES ship CSS.** An earlier note claiming it ships none was wrong (that conclusion came
  from the demo build). `wave-ortho-inquiry-form.min.css` is 165,244 bytes but **Bootstrap 5 starts
  at byte 9,676**. Only bytes 0–9,675 are Wave's own scoped rules; the rest has 17 global `body{}`
  and 28 `.row{}` rules that would repaint the whole site. The standalone
  `-exam-scheduler.min.css` is a strict subset of that range and is redundant.

---

## 4. The conversion gate — how it works now (this was buggy twice)

`onFormSubmission` receives `{}` on success, plus `appointmentMessage` in two cases. Wave's own
logic (function `O()` in the minified source):

```
appointment_scheduler.value ? message = generatedAppointmentString()
: appointment_call_me.value  && message = "Our office will call you to schedule an appointment"
message && (result.appointmentMessage = message)
```

So:

| `appointmentMessage` | meaning | event fired |
|---|---|---|
| absent | no appointment attached | `appointment_requested` |
| exactly `CALL_ME_TEXT` | asked to be called | `appointment_requested` |
| anything else | real slot booked | `appointment_booked` |
| `res.error` truthy | validation error | *(none)* |

`CALL_ME_TEXT = 'Our office will call you to schedule an appointment'`

**Do not go back to tracking clicks.** That was the first implementation and it was wrong: clicking
`.available-time-button` only *selects* a time. A submission carrying a selected-but-unconfirmed slot
fired `appointment_booked`, inflating Google Ads conversions. Reading Wave's own field cannot drift
out of sync.

---

## 5. Bugs found in the final audit

### Fixed (commit `fb0aae2`, deployed, verified live)
1. **False conversions on unconfirmed selections.** See §4. Gate rewritten to read
   `appointmentMessage`; the capture-phase click listener was deleted.
2. **Stale Confirm button after changing day.** Wave clears `.selected-time` when the patient moves
   to another day, but by then the Confirm button lives in our wrapper (outside the `<tbody>` Wave
   rewrites), so it survived still calling `$wave_appointmentConfirmed('09:00:00')` for the
   *previous* day while nothing was selected. A patient could confirm a slot not on screen.
   `place()` now empties the wrapper when there is no `.selected-time`.

### RESOLVED 2026-10-26 — `/api/scheduler` was deleted, not fixed
This briefly read as an open bug: `/api/scheduler` wrapped its insert in `try/catch` and the
`catch` returned `{ok:true, bookingId, stored:false}` — HTTP 200 claiming success, so the panel
showed "Request received" for an enquiry that was never written.

**It is gone.** The practice asked for no in-page booking: every page now carries the same contact
form, with a link to `/book` for anyone who wants to pick a time. So `SchedulerPanel`,
`/api/scheduler` and `initSchedulerForms()` were all removed. Nothing posts to that endpoint and
nothing renders that form. See §14.

`/api/booking` and `src/pages/book.tsx` are still genuinely dead — nothing routes to `BookPage`, so
`booking.js` never runs (it bails at the `.bk-shell` guard) and nothing posts to `/api/booking`.
Safe to delete whenever.

---

## 6. Layout decisions already made (don't undo)

Wave's defaults are a two-column layout; the user asked for a different arrangement, twice.

- `.calendar-table` → `margin: 0 auto` (shrink-to-fit table needs auto side margins to centre).
- `.available-appointments-container.show` → Wave pins this to `width:173px; margin-left:20px`
  (it expects slots *beside* the calendar). Overridden to full width, `max-width:21rem`, centred.
- **Confirm sits BELOW the whole list of times**, not beside the selected time. This required a DOM
  move, not CSS: `wave-roark.js` relocates the button into a `.roark-confirm-slot` div appended
  after the table. A `MutationObserver` re-applies it because Wave replaces the entire `<tbody>` on
  every slot change. The observer guards on "is it already where it belongs" rather than
  disconnecting, so its own wake-up finds nothing to do — no loop.
- The skin is scoped under `#waveInquiryForm` so it outranks Wave's class selectors without
  `!important`. **One exception:** `.wave-form-title` needs `!important` because Wave writes
  `style="display:inherit"` inline (inline beats any stylesheet), and we hide it to avoid two `<h1>`s.

---

## 7. Privacy page — was made wrong by the Wave switch, then fixed

`/privacy` originally described the booking flow as posting to `/api/booking` and being stored in
**our** D1 database. After the Wave switch that was false. Fixed in commit `97618d8`:

- booking details now described as going **browser → WaveOrtho**, never to us
- WaveOrtho added to the processor table
- the `roark-booking-v1` storage row removed (that key is never written now)
- "four small jobs" → "three small jobs" to match the remaining keys
- security section updated to distinguish our D1 enquiries from Wave-held appointments

**If the data flow changes again, this page must change with it.** It is written to describe only
what the code actually does.

---

## 8. Vendor files the user uploaded previously

At `/home/user/uploaded_files/` (may need re-uploading in a new session):

| File | Bytes |
|---|---|
| `wave-ortho-inquiry-form.js` | 434,885 |
| `wave-ortho-inquiry-form.min.js` | **331,076** ← the clean one |
| `bootstrap.css` / `bootstrap.min.css` | 155,931 / 155,884 |
| `wave-ortho-inquiry-form.css` | 168,543 |
| `wave-ortho-inquiry-form.min.css` | 165,244 |
| `wave-ortho-inquiry-form-exam-scheduler.css` | 7,949 |
| `wave-ortho-inquiry-form-exam-scheduler.min.css` | 5,841 |

`/tmp/wave-ortho-inquiry-form.min.js` also exists (identical to the clean build,
md5 `a331a20ceffaef69322f312023cfc467`).

---

## 9. Testing approach that works (no browser in the sandbox)

`PlaywrightConsoleCapture` **fails** in this sandbox ("Target page, context or browser has been
closed") — but it *did* once confirm `#WAVE-form` renders on the live URL. The reliable method is
**jsdom executing the real library against the live Wave API**:

```bash
npm i -D jsdom   # already installed
node /tmp/wavetest/<script>.js
```

Pattern: build a JSDOM with `runScripts:'dangerously'`, `url:'https://central.waveortho.com/book'`
(so relative API paths resolve), inject the library via `textContent`, silence `w.console.log`
(Wave is very verbose), then drive clicks with `new w.MouseEvent('click',{bubbles:true})`.
Test scripts from this session: `move.js` (slot switching), `stray2.js` (day switching),
`gate.js` (conversion matrix), `convert.js` (select-without-confirm), `live.js` (full render),
`e2e.js` (boot path). **These may be gone in a fresh sandbox — recreate as needed.**

jsdom loses cross-document state, and it cannot verify *appearance*. Visual confirmation must come
from the user, who has been sending screenshots.

---

## 10. Current verified state

- Build: green (`✓ 69 modules transformed`, `dist/_worker.js` 220.40 kB, gzip 63.33 kB)
- Deploy: **live and matching the repo.** Deployed 2026-10-26 via `cf-byok-deploy`;
  deployment URL `https://78ce104b.roark-orthodontics.pages.dev`, aliased at
  `https://roark-orthodontics.pages.dev`.
- Git: `d5d4361` on `main`, pushed to `origin/main`.
- All routes 200 in production: `/`, `/about`, `/about/`, `/contact`, `/adults`, `/invisalign`,
  `/treatments`, `/kids-braces`, `/financing`, `/book`, `/blog`, `/sitemap.xml`, `/robots.txt`.
- `/about` and `/sitemap.xml` previously 404'd in production; both are now 200.
- `POST /api/contact` verified end-to-end against **remote** D1: row written, then deleted.
  Response `{"ok":true,"received":true,"delivered":false,"mailNote":"no_api_key"}`.
- Confirmed working against the **live** Wave API: calendar renders 42 day cells; clicking a day
  returns real slots (e.g. Oct 27 → 7:30am unavailable, 9:00am + 10:30am bookable) at Franklin;
  location auto-locked to Franklin with the picker hidden.

---

## 11. Still outstanding (not bugs, just not done)

- ⚠ **`GTM_ID` is unset**, so no Google tag loads. The conversion fires into `dataLayer` and goes
  nowhere. Set with
  `npx wrangler pages secret put GTM_ID --project-name roark-orthodontics`, then add a GTM Custom
  Event trigger on `appointment_booked`.
- ⚠ **`ADMIN_TOKEN` is unset** → `GET /api/submissions` fails closed with 404. Set it before you
  need to read submissions.
- ⚠ **`RESEND_API_KEY` / `MAIL_FROM` are unset** → `/api/contact` still stores every enquiry in
  D1, but sends no email. Without the key the JSON response carries `delivered: false`. Set both
  once the domain is verified in Resend; see §13.
- ⚠ Footer **"Accessibility"** link (`src/components/chrome.tsx:321`) still points at
  `/contact#faq`, which says nothing about accessibility.
- ⚠ **No HIPAA Notice of Privacy Practices.** `/privacy` covers the *website* only and says so
  explicitly. The clinical notice is the practice's own document.
- Not requested, but noted: `src/pages/book.tsx` (540 lines) and `/api/booking` are dead weight.
  `SchedulerPanel` and `/api/scheduler` were **deleted** — see §14.

---

## 13. Contact-form email delivery (deployed; inert until secrets are set)

**Status: the code is live in production, but no email is sent** — `wrangler pages secret list`
returns empty, so `sendEnquiry` short-circuits with `{sent:false, skipped:'no_api_key'}` and
`/api/contact` responds `delivered:false`. It starts emailing the moment the two secrets below
exist; no redeploy is needed, because Pages reads secrets at runtime.

Every contact form on the site posts to `/api/contact`, which does two things:

1. inserts the row into D1 `submissions` (as before), **then**
2. emails it to **info@roarkortho.com and admin@roarkortho.com** via `src/lib/mail.ts`.

Order matters: the row is written first, so a mail outage cannot lose an enquiry. The response
returns `delivered: true|false` plus `mailNote`, and the client never shows "Message sent" for a
row that was not stored.

Delivery uses Resend because a Worker cannot open an SMTP socket. Two secrets are required:

```
npx wrangler pages secret put RESEND_API_KEY --project-name roark-orthodontics
npx wrangler pages secret put MAIL_FROM     --project-name roark-orthodontics
```

`MAIL_FROM` must be on a domain verified in Resend (e.g. `Roark Website <noreply@roarkortho.com>`).
**Do not** send from `info@`/`admin@` — those are Google Workspace mailboxes and sending as them
breaks DMARC alignment. Replies still reach a human because the form sets reply-to to the patient.

Recipients come from `CONTACT_INBOXES` in `src/lib/site-data.ts`, overridable at runtime with a
`CONTACT_INBOXES` env var (comma separated). `BIZ.email` (`hello@roarkortho.com`) is the address
*printed on the site* — deliberately a separate value from where enquiries are delivered.

DNS facts established 2026-10-26 (re-verify if in doubt — `dig` is NOT installed in the sandbox;
use `curl -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=…&type=…'`):
`roarkortho.com` is on Cloudflare nameservers (`brit.ns` / `sage.ns`), mail is Google Workspace,
no `send` / `resend._domainkey` records exist yet, and there is **no DMARC record**.

---

## 14. Removed: the scheduler panel (2026-10-26)

The practice asked for no direct booking inside pages — a contact form everywhere, plus a link to
`/book` for anyone who wants to pick a time. So:

- `SchedulerPanel` is **gone** from `src/components/blocks.tsx`
- `/api/scheduler` is **gone** from `src/index.tsx`
- `initSchedulerForms()` is **gone** from `public/static/app.js`

`/adults` and `/invisalign` — the only two pages that rendered it — now show `ContactPanel` with
`bookFrom` set, which renders a "Would you rather pick a time?" link to `/book` and a Book online
button in the success state. `ContactPanel` takes `bookFrom?` / `bookLabel?` for this; omit them and
the panel is a plain contact form with no booking link.

**This also closed the open defect in §5** (`/api/scheduler` returning HTTP 200 `stored:false` for
an enquiry it never wrote). The endpoint no longer exists.

---

## 15. Sitemap and robots (2026-10-26)

Both are **generated**, not static files, from the route table in `src/lib/seo.ts`:

- `/sitemap.xml` — 15 pages + every `POSTS` entry, each with a real `lastmod` taken from the post
  date. **Every listed URL was verified to return 200**; a sitemap naming a 404 is worse than none.
- `/robots.txt` — allows everything, disallows `/api/` and `/health`, names GPTBot / ClaudeBot /
  PerplexityBot / Google-Extended / CCBot explicitly, and advertises the sitemap.

Two rules that look like omissions but are deliberate:

- **`/book` is not in the sitemap.** It sends `<meta name="robots" content="noindex">`
  (`BookingLayout`). Listing it would contradict that.
- **`/book` is not disallowed in robots.txt.** A crawler must be able to *fetch* the page to read
  the noindex. Disallowing it hides the directive and leaves the URL eligible for a bare
  "indexed without a description" listing.

Adding a page means adding one line to `PAGES` in `src/lib/seo.ts`. Journal articles need no edit
at all — they come from `POSTS`.

`ORIGIN` is duplicated there because `src/layout.tsx` keeps its copy module-private. If the domain
changes, both must change.

---

## 16. About page (2026-10-26)

`/about` is new, rebuilt from the practice's previous WordPress page. `src/pages/about.tsx`.

- **Bare `/about` does not match `/about/`** in a Workers route, and the old site published the
  trailing-slash form — so **both** are registered and both canonicalise to `/about`.
- The old deep link `/about/#meet-the-team` still works: the team section carries
  `id="meet-the-team"`.
- **No staff headshots exist** in `public/static/photos/`. The team cards render an initials
  monogram (`.team__mono`) rather than reusing an office photo, which would imply it shows that
  person. Drop real portraits in and swap `<Monogram>` for `<Pic>` to finish.
- The `Smile Journal` was **removed from the header nav** at the practice's request (footer only).
  This is SEO-neutral: the footer is sitewide, so `/blog` keeps an internal link on every page.
  It also fixed a real layout bug — eight header items overflowed the bar between 1000px (the nav
  collapse breakpoint) and roughly 1070px. Seven fit.


---

## 12. Honest process note

The Wave integration consumed far more time than it should have. The failure mode was
**guessing at a vendor's contract instead of obtaining its actual artifacts**: probing CDN URLs,
reverse-engineering a minified bundle, and concluding "Wave ships no CSS" and "there is no
`window.WaveInquiryForm`" — both of which were wrong, because the bundle being read was a demo
build. It resolved only when the user uploaded the real vendor files.

**Lesson for next session: when integrating a third-party library, ask for the vendor bundle they
were given (or the install docs from their vendor portal) before reverse-engineering anything.**
One request would have saved the entire detour.
tire detour.
