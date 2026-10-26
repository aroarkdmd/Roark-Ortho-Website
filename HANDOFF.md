# HANDOFF — Roark Orthodontics Website

Last updated: 2026-10-26
Repo: https://github.com/aroarkdmd/Roark-Ortho-Website (branch `main`, public)
Live: https://roark-orthodontics.pages.dev
Project dir: `/home/user/webapp`

Read this first. It is written so a fresh session can start work without re-deriving
anything that cost time to establish.

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

### OPEN — needs a decision from the user
**`/api/scheduler` loses enquiries.** `src/index.tsx:567-580` wraps the insert in `try/catch`, and
the `catch` returns `{ok:true, bookingId, stored:false}` — HTTP 200 claiming success.
`public/static/app.js` ignores `stored`, so the panel shows "Request received" for an enquiry that
was never written. This is the identical defect already fixed for `/api/contact`.

This endpoint is **live**, not legacy: `SchedulerPanel` (`blocks.tsx:270`) renders on `/adults`
(`content.tsx:577`) and `/invisalign` (`:954`), and `app.js:413` posts to it.

**Two options — ask the user which:**
- (a) Fix it by mirroring `/api/contact`: throw when `c.env.DB` is missing, return
  `503 {ok:false,error:'not_stored'}` in the catch, and have `app.js` render the
  `[data-form-alert]` element (already present at `blocks.tsx:238`) instead of calling `finish()`.
- (b) Delete `SchedulerPanel` from both pages and point that traffic at `/book` (Wave), since the
  real scheduler now exists.

`/api/booking` and `src/pages/book.tsx` are genuinely dead — nothing routes to `BookPage`, so
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

- Build: green (`✓ 66 modules transformed`, `dist/_worker.js` ~206.66 kB)
- Deploy: **live and matching the repo.** `public/static/wave-roark.js` is 8,779 bytes both locally
  and in production; prod serves the new gate (`pickedSlot` absent, `appointmentMessage` present).
- Git: `fb0aae2`, pushed to `origin/main`.
- All routes 200 in production: `/`, `/book`, `/privacy`, and all four `/static/wave*` assets.
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
- ⚠ Footer **"Accessibility"** link (`src/components/chrome.tsx:321`) still points at
  `/contact#faq`, which says nothing about accessibility.
- ⚠ **No HIPAA Notice of Privacy Practices.** `/privacy` covers the *website* only and says so
  explicitly. The clinical notice is the practice's own document.
- Not requested, but noted: `src/pages/book.tsx` (540 lines) and `/api/booking` are dead weight;
  `/api/scheduler`'s fake-availability hash was in the *old* mock and is no longer reachable.

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
