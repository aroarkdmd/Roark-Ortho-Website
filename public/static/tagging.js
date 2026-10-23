/* ============================================================================
   ROARK ORTHODONTICS — tagging + consent runtime.

   Loaded by both page shells (site and booking). Reads a JSON blob that the
   Worker injects into #tag-config, so the SERVER decides:
     gtmId            — the container to load, or null to load no tag at all
     consentRequired  — true only for EEA / UK / CH visitors
     path             — current path, attached to events as page_path

   Order is deliberate: Consent Mode v2 defaults are pushed BEFORE gtag.js is
   injected, which is the only ordering Google accepts.
   ========================================================================= */
(function () {
  'use strict';

  var cfg = {};
  var el = document.getElementById('tag-config');
  if (el) {
    try { cfg = JSON.parse(el.textContent || '{}') || {}; } catch (e) { cfg = {}; }
  }

  var GTM_ID = cfg.gtmId || null;
  var NEED_CONSENT = !!cfg.consentRequired;
  var CONSENT_KEY = 'roark-consent-v1';
  var CONV_KEY = 'roark-conv-fired';

  /* Dev/QA override so the EU banner can be exercised from a US sandbox:
     /?consent=1 forces the banner and clears any prior choice. */
  try {
    if (new URLSearchParams(window.location.search).get('consent') === '1') {
      NEED_CONSENT = true;
      try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    }
  } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function storedChoice() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  /* US visitors (and any country without a consent statute) are granted up
     front — no banner, tags work immediately. EEA/UK/CH start denied. */
  var granted = !NEED_CONSENT || storedChoice() === 'granted';

  gtag('consent', 'default', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  });

  /* ── container ─────────────────────────────────────────────────────────── */
  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    document.head.appendChild(s);
  }

  /* ── consent banner ────────────────────────────────────────────────────── */
  var bar = document.getElementById('consentbar');
  function apply(choice) {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch (e) {}
    var g = choice === 'granted';
    gtag('consent', 'update', {
      ad_storage: g ? 'granted' : 'denied',
      ad_user_data: g ? 'granted' : 'denied',
      ad_personalization: g ? 'granted' : 'denied',
      analytics_storage: g ? 'granted' : 'denied',
    });
    window.dataLayer.push({ event: g ? 'consent_granted' : 'consent_denied' });
  }
  if (bar) {
    if (NEED_CONSENT && !storedChoice()) {
      bar.style.display = 'block';
      var grant = bar.querySelector('[data-consent="grant"]');
      var deny = bar.querySelector('[data-consent="deny"]');
      if (grant) grant.addEventListener('click', function () { apply('granted'); bar.style.display = 'none'; });
      if (deny) deny.addEventListener('click', function () { apply('denied'); bar.style.display = 'none'; });
    } else {
      bar.style.display = 'none';
    }
  }

  /* ── the booking conversion ──────────────────────────────────────────────
     Called once by public/static/booking.js at the moment the confirmation
     screen is revealed — and only when the server confirmed it stored the
     row. Three guarantees:

       1. Fires at most once per browser session (CONV_KEY), so a refresh or
          a back-navigation off the confirmation screen cannot double-count.
       2. Carries NO patient data — no name, email, phone, DOB or clinical
          note. Only a booking reference, a value and a currency.
       3. Survives the consent gate: if the visitor is in a jurisdiction that
          requires consent and has not granted it, gtag drops the hit rather
          than storing anything.

     GTM trigger: Custom Event, name `appointment_booked`.                     */
  window.roarkBookingConversion = function (ref) {
    try {
      if (sessionStorage.getItem(CONV_KEY)) return;
      sessionStorage.setItem(CONV_KEY, '1');
    } catch (e) {
      /* Private mode with storage blocked: fall through and fire once. */
    }
    window.dataLayer.push({
      event: 'appointment_booked',
      conversion_value: 1,
      currency: 'USD',
      booking_ref: ref || '',
      page_path: cfg.path || window.location.pathname,
      page_title: document.title,
    });
  };
})();
