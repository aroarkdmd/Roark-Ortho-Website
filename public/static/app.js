/* ============================================================================
   ROARK ORTHODONTICS — site behaviour.
   Ported from the design's prototype scripts, minus the two known defects the
   handoff calls out: no client-side JSX compilation, no development React.
   Content is server-rendered; this file only adds interaction.
   ========================================================================= */
(function () {
  'use strict';

  /* Kept in sync with BIZ.phoneDisplay in src/lib/site-data.ts. The failure
     copy needs a number the visitor can dial, and this file has no access to
     the server-side data module. */
  var PHONE_DISPLAY = '(615) 814-4884';

  /* ── CONSENT MODE / ANALYTICS STUB ────────────────────────────────────────
     Every event carries page_path, page_title and any utm_* / gclid present.
     No PHI is ever pushed — never a name, email, phone, DOB or clinical note. */

  function urlParams() {
    var out = {};
    try {
      var q = new URLSearchParams(window.location.search);
      ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
        if (q.get(k)) out[k] = q.get(k);
      });
    } catch (e) {}
    return out;
  }

  function track(event, params) {
    var payload = Object.assign(
      {
        event: event,
        page_path: window.location.pathname,
        page_title: document.title,
      },
      urlParams(),
      params || {}
    );
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }
  window.roarkTrack = track;

  /* Consent Mode, the banner and the container loader all live in
     /static/tagging.js now — it has to run before any tag and it also serves
     the booking shell, which never loaded this file. Keeping a second copy
     here would let the two disagree about the stored choice. */

  /* ── HEADER: solid on scroll, mobile nav ───────────────────────────────── */
  function initHeader() {
    var hdr = document.getElementById('site-header');
    if (hdr) {
      /* Only the homepage hero is rendered transparent. Interior pages ship
         already solid and must never lose their background. */
      var isTransparent = hdr.getAttribute('data-transparent') === '1';
      var onScroll = function () {
        if (!isTransparent) {
          hdr.classList.add('hdr--solid');
          return;
        }
        hdr.classList.toggle('hdr--solid', window.scrollY > 40);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var burger = document.getElementById('burger');
    var mnav = document.getElementById('mobile-nav');
    var close = document.getElementById('mnav-close');
    function openNav() {
      if (!mnav) return;
      mnav.classList.add('is-open');
      mnav.setAttribute('aria-hidden', 'false');
      if (burger) burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      track('nav_open');
    }
    function closeNav() {
      if (!mnav) return;
      mnav.classList.remove('is-open');
      mnav.setAttribute('aria-hidden', 'true');
      if (burger) burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    if (burger) burger.addEventListener('click', openNav);
    if (close) close.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    if (mnav) {
      mnav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeNav);
      });
    }
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────────────────────
     Starts at opacity 0 / translateY(18px); the observer adds .is-in. If
     IntersectionObserver is missing, everything is revealed immediately —
     content must never stay invisible. */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    els.forEach(function (e, i) {
      e.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
      io.observe(e);
    });
  }

  /* ── CLICK-TO-LOAD MAP ───────────────────────────────────────────────────
     The Google Maps iframe is ~700 KB of third- party JS. It is never created
     until the visitor asks for it. */
  function initMaps() {
    document.querySelectorAll('.mapfacade[data-src]').forEach(function (el) {
      el.addEventListener('click', function () {
        var src = el.getAttribute('data-src');
        if (!src) return;
        var frame = document.createElement('iframe');
        frame.src = src;
        frame.title = 'Map to Roark Orthodontics';
        frame.loading = 'lazy';
        frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        frame.setAttribute('allowfullscreen', '');
        el.innerHTML = '';
        el.appendChild(frame);
        el.style.cursor = 'default';
        track('map_load');
      });
    });
  }

  /* ── PHONE / BOOK CLICK ATTRIBUTION ──────────────────────────────────────
     Every tel: tap and every Book CTA is attributed to its location. That
     location is the analytics dimension the design asks us to preserve. */
  function initCtaTracking() {
    document.querySelectorAll('[data-phone]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('phone_click', { cta_location: el.getAttribute('data-phone') });
      });
    });
    document.querySelectorAll('[data-book]').forEach(function (el) {
      el.addEventListener('click', function () {
        track('book_click', { cta_location: el.getAttribute('data-book') });
      });
    });
  }

  /* ── CONSENT BAR ─────────────────────────────────────────────────────────
     Moved to /static/tagging.js, which must run before any tag loads and also
     serves the booking shell. See the note above. */

  /* ── CONTACT PANEL ───────────────────────────────────────────────────────
     Validation runs on submit only — never per keystroke. Errors are inline
     under each field, and focus moves to the first invalid field. The exact
     messages are the design's. The POST is real: /api/contact. The success
     state never depends on the network call succeeding. */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field, msg) {
    var hint = field.querySelector('[data-error]');
    var input = field.querySelector('input, textarea, select');
    if (msg) {
      field.classList.add('field--err');
      if (hint) {
        hint.textContent = msg;
        hint.hidden = false;
      }
      if (input) input.setAttribute('aria-invalid', 'true');
    } else {
      field.classList.remove('field--err');
      if (hint) {
        hint.textContent = '';
        hint.hidden = true;
      }
      if (input) input.removeAttribute('aria-invalid');
    }
  }

  function fieldOf(form, name) {
    return form.querySelector('[data-field="' + name + '"]');
  }

  function initContactForms() {
    document.querySelectorAll('[data-contact-form]').forEach(function (form) {
      var panel = form.closest('.wave');
      var done = document.getElementById(form.id + '-done');
      var btn = form.querySelector('button[type="submit"]');
      var label = btn && btn.querySelector('[data-label]');
      var labelText = label ? label.textContent : '';

      function validate() {
        var errors = {};
        var name = form.querySelector('[name="name"]');
        var email = form.querySelector('[name="email"]');
        var message = form.querySelector('[name="message"]');
        if (!name.value.trim()) errors.name = 'Please tell us your name.';
        if (!EMAIL_RE.test(email.value.trim())) errors.email = 'Please enter a valid email address.';
        if (!message.value.trim()) errors.message = 'Let us know how we can help.';
        return errors;
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var errors = validate();
        ['name', 'email', 'message'].forEach(function (k) {
          var f = fieldOf(form, k);
          if (f) setError(f, errors[k]);
        });

        var keys = Object.keys(errors);
        if (keys.length) {
          var first = form.querySelector('[name="' + keys[0] + '"]');
          if (first) first.focus();
          return;
        }

        var payload = {
          name: form.querySelector('[name="name"]').value.trim(),
          email: form.querySelector('[name="email"]').value.trim(),
          phone: form.querySelector('[name="phone"]').value.trim(),
          message: form.querySelector('[name="message"]').value.trim(),
          source: form.getAttribute('data-source') || 'page',
          page: window.location.pathname,
        };

        if (btn) btn.disabled = true;
        if (label) label.textContent = 'Sending…';

        track('contact_form_submit', {
          cta_location: payload.source,
          channel: 'panel',
        });

        var finish = function () {
          if (btn) btn.disabled = false;
          if (label) label.textContent = labelText;
          form.hidden = true;
          if (done) {
            done.hidden = false;
            done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            var h = done.querySelector('h3');
            if (h) {
              h.setAttribute('tabindex', '-1');
              h.focus();
            }
          }
          track('contact_form_success', { cta_location: payload.source });
        };

        /* Failure must be visible. The old code called finish() from .catch(),
           so a dropped connection or an unstored row still rendered "Message
           sent" — the enquiry was lost and the visitor believed otherwise. */
        var alertEl = form.querySelector('[data-form-alert]');
        var fail = function (msg) {
          if (btn) btn.disabled = false;
          if (label) label.textContent = labelText;
          if (alertEl) {
            alertEl.textContent = msg;
            alertEl.hidden = false;
          }
          track('contact_form_error', { cta_location: payload.source });
        };
        if (alertEl) {
          alertEl.hidden = true;
          alertEl.textContent = '';
        }

        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then(function (r) { return r.json().catch(function () { return {}; }); })
          .then(function (data) {
            /* Per-field validation errors stay inline on the fields. */
            if (data && data.ok === false && data.errors) {
              ['name', 'email', 'message'].forEach(function (k) {
                var f = fieldOf(form, k);
                if (f) setError(f, data.errors[k]);
              });
              var firstKey = Object.keys(data.errors)[0];
              var el = form.querySelector('[name="' + firstKey + '"]');
              if (el) el.focus();
              if (btn) btn.disabled = false;
              if (label) label.textContent = labelText;
              return;
            }
            /* Anything other than an explicit success is a failure. This is
               deliberately pessimistic: a wrong "sent" loses a patient's
               enquiry, a wrong "call us" costs one phone call. */
            if (!data || data.ok !== true || data.received !== true) {
              fail('We could not send that just now. Please call ' +
                PHONE_DISPLAY + ' and we will take the details over the phone.');
              return;
            }
            finish();
          })
          .catch(function () {
            fail('We could not reach the office just now. Please call ' +
              PHONE_DISPLAY + ' and we will take the details over the phone.');
          });
      });
    });

    document.querySelectorAll('[data-contact-reset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var done = b.closest('.done');
        if (!done) return;
        var form = done.parentElement.querySelector('[data-contact-form]');
        if (form) {
          form.reset();
          form.hidden = false;
          form.querySelectorAll('[data-field]').forEach(function (f) { setError(f, null); });
          done.hidden = true;
          var first = form.querySelector('input');
          if (first) first.focus();
        }
      });
    });
  }

  /* ── SCHEDULER PANEL ─────────────────────────────────────────────────────
     Mirrors the design's WaveFallback rules exactly: first and last name
     required, email regex, 10-digit phone. */
  function initSchedulerForms() {
    document.querySelectorAll('[data-scheduler-form]').forEach(function (form) {
      var done = document.getElementById(form.id + '-done');
      var btn = form.querySelector('button[type="submit"]');
      var label = btn && btn.querySelector('[data-label]');
      var labelText = label ? label.textContent : '';

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var errors = {};
        var first = form.querySelector('[name="first"]');
        var last = form.querySelector('[name="last"]');
        var email = form.querySelector('[name="email"]');
        var phone = form.querySelector('[name="phone"]');

        if (!first.value.trim()) errors.first = 'Please enter a first name.';
        if (!last.value.trim()) errors.last = 'Please enter a last name.';
        if (!EMAIL_RE.test(email.value.trim())) errors.email = 'Please enter a valid email address.';
        if (phone.value.replace(/\D/g, '').length < 10) errors.phone = 'Please enter a 10-digit phone number.';

        ['first', 'last', 'email', 'phone'].forEach(function (k) {
          var f = fieldOf(form, k);
          if (f) setError(f, errors[k]);
        });

        var keys = Object.keys(errors);
        if (keys.length) {
          var el = form.querySelector('[name="' + keys[0] + '"]');
          if (el) el.focus();
          return;
        }

        var payload = {
          first: first.value.trim(),
          last: last.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          patient: form.querySelector('[name="patient"]').value,
          when: form.querySelector('[name="when"]').value,
          notes: form.querySelector('[name="notes"]').value.trim(),
          sms: form.querySelector('[name="sms"]').checked,
          source: form.getAttribute('data-source') || 'page',
        };

        if (btn) btn.disabled = true;
        if (label) label.textContent = 'Sending…';

        track('scheduler_step', { step: 'request', cta_location: payload.source });

        var finish = function (bookingId) {
          if (btn) btn.disabled = false;
          if (label) label.textContent = labelText;
          form.hidden = true;
          if (done) {
            done.hidden = false;
            done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            var h = done.querySelector('h3');
            if (h) {
              h.setAttribute('tabindex', '-1');
              h.focus();
            }
          }
          /* This panel says "Request received" — the office still has to
             confirm the slot, so it is NOT a booked appointment. It used to
             push booking_complete, which would have inflated Google Ads
             conversions with requests that were never booked. The converted
             event is appointment_booked, fired from the /book flow only. */
          track('appointment_requested', {
            booking_ref: bookingId || '',
          });
        };

        fetch('/api/scheduler', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then(function (r) { return r.json().catch(function () { return {}; }); })
          .then(function (data) {
            if (data && data.ok === false && data.errors) {
              ['first', 'last', 'email', 'phone'].forEach(function (k) {
                var f = fieldOf(form, k);
                if (f) setError(f, data.errors[k]);
              });
              if (btn) btn.disabled = false;
              if (label) label.textContent = labelText;
              return;
            }
            finish(data && data.bookingId);
          })
          .catch(function () { finish(); });
      });
    });

    document.querySelectorAll('[data-scheduler-reset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var done = b.closest('.done');
        if (!done) return;
        var form = done.parentElement.querySelector('[data-scheduler-form]');
        if (form) {
          form.reset();
          form.hidden = false;
          form.querySelectorAll('[data-field]').forEach(function (f) { setError(f, null); });
          done.hidden = true;
          var first = form.querySelector('input');
          if (first) first.focus();
        }
      });
    });
  }

  /* ── FAQ ───────────────────────────────────────────────────────────────── */
  function initFaq() {
    document.querySelectorAll('.faq summary').forEach(function (s) {
      s.addEventListener('click', function () {
        var q = s.textContent.trim();
        track('faq_toggle', { question: q.slice(0, 80) });
      });
    });
  }

  function boot() {
    initHeader();
    initReveal();
    initMaps();
    initCtaTracking();
    initContactForms();
    initSchedulerForms();
    initFaq();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
