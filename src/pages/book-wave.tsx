import type { FC } from 'hono/jsx'
import { BIZ } from '../lib/site-data'
import { Icon } from '../components/icons'
import { Logo } from '../components/chrome'

/* ── BOOKING PAGE — WaveOrtho engine, Roark design ─────────────────────────
   The scheduling engine is WaveOrtho's Inquiry Form & Exam Scheduler (the same
   system that runs the practice's appointment book), mounted with their
   JavaScript library rather than their iframe. The iframe would have been
   quicker, but an iframe cannot be restyled — everything inside it is a
   separate document — and keeping the Roark design is the requirement.

   Wave DOES ship CSS, and the stylesheet is loaded in front of ours — see the
   `styles` array on the /book route in src/index.tsx:
     /static/wave/wave-core.min.css   Wave's structural rules, Bootstrap removed
     /static/wave-roark.css           our skin, layered on top of those rules

   Only the first 9,676 bytes of Wave's published stylesheet are shipped. From
   byte 9,676 onward it is Bootstrap 5, including 17 global `body{}` rules and
   28 `.row{}` rules that would repaint this entire site if loaded. Wave's own
   selectors are all scoped, so that prefix is safe to use; the Bootstrap tail
   is not. The separate `-exam-scheduler.min.css` was a strict subset of the
   part we already ship, so it is deliberately omitted rather than duplicated.

   ── Location ─────────────────────────────────────────────────────────────
   The Wave account has two locations, Franklin and Hermitage. Online
   scheduling is Franklin-only, so:
     data-hide-locations="true"   → no location picker is shown to the patient
     data-default-location="Franklin"

   "Franklin" must be the NAME, not the location UUID. The library resolves it
   with `e.name === value`; passing the UUID matches nothing and, because the
   locations are hidden, the scheduler does not render at all. That failure is
   silent, which is why it is spelled out here.

   ── Conversion ───────────────────────────────────────────────────────────
   WaveInquiryForm.onFormSubmission is assigned BEFORE createForm, as their
   docs require — a handler set afterwards is never called. On success it fires
   the Google Ads conversion through the existing tagging runtime, which is
   already consent-gated and carries no patient data. */

const DOCTOR_ID = 'B63E154EBB'
const DEFAULT_LOCATION = 'Franklin'

export const BookWavePage: FC<{ from?: string }> = ({ from = 'book' }) => (
  <>
    <header class="bk-top">
      <div class="wrap wrap-wide">
        <div class="bk-top__in">
          <a href="/" aria-label="Roark Orthodontics — home">
            <Logo variant="paper" width="9.5rem" />
          </a>
          <div class="bk-top__right">
            <a class="bk-link bk-link--site" href="/">
              Back to the site
            </a>
            <a class="bk-link" href={BIZ.phoneHref} data-phone="book_header">
              <Icon name="phone" size={12} /> {BIZ.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </header>

    <main id="main">
      <section class="bk-intro">
        <div class="wrap wrap-narrow center">
          <span class="eb">Complimentary new patient exam</span>
          <h1 class="h-section" style="font-size:var(--fs-h2);margin-bottom:1rem">
            Pick a time that works for you
          </h1>
          <p class="lead" style="margin-bottom:0">
            About 45 minutes, including photographs, an x-ray and a digital scan. Choose a day and time, and the
            office will confirm by email.
          </p>
        </div>
      </section>

      <section class="bk-formsec">
        <div class="wrap wrap-text">
          {/* Wave mounts into this element. data-wait defers rendering so the
              JS handlers below can be attached first — their documented
              requirement. */}
          <div
            id="waveInquiryForm"
            data-doctor-id={DOCTOR_ID}
            data-hide-locations="true"
            data-default-location={DEFAULT_LOCATION}
            data-show-map="false"
            data-show-patient-status="false"
            data-show-services="false"
            data-show-references="false"
            data-show-header="false"
            data-show-warning="true"
            data-wait="true"
            data-source={from}
          />
        </div>
      </section>

      <section class="bk-helpsec">
        <div class="wrap wrap-narrow center">
          <p class="caption" style="margin-bottom:1rem">
            Prefer to talk it through? The office answers the phone during office hours.
          </p>
          <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="book_footer">
            <Icon name="phone" size={11} /> Call {BIZ.phoneDisplay}
          </a>
        </div>
      </section>
    </main>

    {/* Both deferred, in this order — `defer` guarantees execution order, so
        the library is defined before wave-roark.js calls createForm(). */}
    <script src="/static/wave/wave-inquiry-form.min.js" defer></script>
    <script src="/static/wave-roark.js" defer></script>
  </>
)
