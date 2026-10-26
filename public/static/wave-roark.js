/* ============================================================================
   WAVE → ROARK RUNTIME

   Mounts the WaveOrtho Inquiry Form & Exam Scheduler with full control over
   when it renders and what counts as a conversion.

   The library is loaded by the page (not by this file) and exposes
   `window.WaveInquiryForm`. The mount element carries data-wait="true", which
   tells the library NOT to auto-render — we render explicitly below, after the
   submission handler is attached. Per Wave's documentation the handler must be
   assigned BEFORE createForm() or it is never called.

   ── Why the conversion gate is not just "no error" ────────────────────────
   On success Wave calls onFormSubmission with `{}`, and adds `appointmentMessage`
   in two very different cases:

     1. a real exam slot was booked, or
     2. the patient clicked "Please call me instead".

   Case 2 is NOT a booking. Firing a Google Ads conversion for it would inflate
   the conversion count with appointment requests that never became appointments
   — the same class of bug as the scheduler that used to claim "booked" on a
   failed write. Wave distinguishes the two only by the message text, which is
   brittle, so we additionally watch for an actual slot selection:

     · a click inside .available-time-button / .confirm-button marks a slot as
       chosen (captured at the container with a capture-phase listener, so it
       keeps working across Wave's re-renders)
     · a click on .wave-appointment-scheduler-please-call-me clears it again

   A booking therefore requires BOTH a chosen slot AND a success response.
   ========================================================================= */
(function () {
  'use strict';

  var ROOT_ID = 'waveInquiryForm';
  var CALL_ME_TEXT = 'Our office will call you to schedule an appointment';

  function boot() {
    var el = document.getElementById(ROOT_ID);
    if (!el) return; // not the booking page

    var W = window.WaveInquiryForm;
    if (!W || typeof W.createForm !== 'function') {
      /* The library is hosted by us at /static/wave/, so this should never
         happen. Surface it loudly rather than rendering an empty page. */
      console.error('[roark] Wave library did not load — check /static/wave/wave-inquiry-form.min.js');
      var err = document.createElement('p');
      err.className = 'bk-wavefail';
      err.textContent = 'We could not load the scheduler. Please call the office and we will book you in.';
      el.appendChild(err);
      return;
    }

    /* ── slot-selection tracking ───────────────────────────────────────── */
    var pickedSlot = false;
    el.addEventListener(
      'click',
      function (ev) {
        var t = ev.target;
        if (!t || typeof t.closest !== 'function') return;
        if (t.closest('.wave-appointment-scheduler-please-call-me')) {
          pickedSlot = false;
          return;
        }
        if (t.closest('.available-time-button, .confirm-button, .selected-time')) {
          pickedSlot = true;
        }
      },
      true,
    ); // capture: survives Wave replacing the inner nodes on every re-render

    /* ── submission ────────────────────────────────────────────────────── */
    W.onFormSubmission = function (res) {
      if (res && res.error) return; // Wave renders its own field errors

      var isCallMe = res && res.appointmentMessage === CALL_ME_TEXT;
      var isBooking = pickedSlot && !isCallMe;
      pickedSlot = false; // one submission, one decision

      window.dataLayer = window.dataLayer || [];

      if (isBooking) {
        /* Consent-gated, no patient data, fires at most once per session —
           all handled inside tagging.js. */
        if (window.roarkBookingConversion) window.roarkBookingConversion('wave');
        else
          window.dataLayer.push({
            event: 'appointment_booked',
            cta_location: 'wave_scheduler',
            page_path: window.location.pathname,
          });
      } else {
        window.dataLayer.push({
          event: 'appointment_requested',
          cta_location: 'wave_scheduler',
          page_path: window.location.pathname,
        });
      }
    };

    /* ── mount ─────────────────────────────────────────────────────────── */
    try {
      W.createForm(ROOT_ID);
    } catch (e) {
      console.error('[roark] Wave createForm failed', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
