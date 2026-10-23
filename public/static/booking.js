/* ============================================================================
   ROARK ORTHODONTICS — booking flow.
   Ported from the handoff's book.html state model. Persists to localStorage
   under roark-booking-v1 so a refresh mid-booking on mobile does not lose the
   visitor's place. The step-3 confirm POSTs to /api/booking; the success
   screen never depends on that call succeeding.
   ========================================================================= */
(function () {
  'use strict';

  var STORE = 'roark-booking-v1';
  var ENDPOINT = '/api/booking';
  var EXAM = { id: 'exam', mins: 45, t: 'Complimentary New Patient Exam' };
  var TIMES = [
    '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  ];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DOW_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var STEP_NAMES = ['who', 'date_time', 'details', 'review'];

  var EMPTY = {
    step: 0,
    maxStep: 0,
    done: false,
    ref: '',
    who: null,
    date: null,
    time: null,
    contact: { first: '', last: '', email: '', phone: '', dob: '' },
    patients: [],
    insurance: '',
    insurer: '',
    heard: '',
    notes: '',
    sms: true,
    errors: {},
    month: null,
  };

  var S = null;

  /* ── helpers ──────────────────────────────────────────────────────────── */
  function key(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fromKey(k) {
    var p = k.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function today() {
    var t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }
  function longDate(k) {
    var d = fromKey(k);
    return DOW_LONG[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + d.getDate();
  }
  function fmtTime(t) {
    var p = t.split(':').map(Number);
    var hh = p[0] % 12 === 0 ? 12 : p[0] % 12;
    return hh + ':' + String(p[1]).padStart(2, '0') + (p[0] < 12 ? 'am' : 'pm');
  }
  function endTime(t, mins) {
    var p = t.split(':').map(Number);
    var tot = p[0] * 60 + p[1] + mins;
    return String(Math.floor(tot / 60)).padStart(2, '0') + ':' + String(tot % 60).padStart(2, '0');
  }
  function isOfficeDay(d) {
    var w = d.getDay();
    return w >= 1 && w <= 3; /* Monday–Wednesday */
  }
  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
  }
  function slots(k) {
    var d = fromKey(k);
    if (!isOfficeDay(d) || d <= today()) return [];
    var busy = hash(k + 'load');
    return TIMES.map(function (t) {
      var r = hash(k + t);
      var free = r > 0.25 + busy * 0.55;
      if (t === '12:00' || t === '12:30') free = false; /* lunch */
      return { t: t, free: free };
    });
  }
  function dayState(d) {
    if (!isOfficeDay(d)) return 'closed';
    if (d <= today()) return 'past';
    var s = slots(key(d));
    return s.some(function (x) { return x.free; }) ? 'open' : 'full';
  }
  function firstOpen() {
    var d = today();
    for (var i = 1; i < 90; i++) {
      var n = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (dayState(n) === 'open') return key(n);
    }
    return null;
  }
  function fmtPhone(v) {
    var n = v.replace(/\D/g, '').slice(0, 10);
    if (n.length < 4) return n;
    if (n.length < 7) return '(' + n.slice(0, 3) + ') ' + n.slice(3);
    return '(' + n.slice(0, 3) + ') ' + n.slice(3, 6) + '-' + n.slice(6);
  }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function track(event, params) {
    window.dataLayer = window.dataLayer || [];
    var q = {};
    try {
      var p = new URLSearchParams(window.location.search);
      ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
        if (p.get(k)) q[k] = p.get(k);
      });
    } catch (e) {}
    window.dataLayer.push(Object.assign({
      event: event,
      page_path: window.location.pathname,
      page_title: document.title,
    }, q, params || {}));
  }

  /* ── persistence ──────────────────────────────────────────────────────── */
  function save() {
    try {
      var copy = Object.assign({}, S);
      delete copy.done;
      localStorage.setItem(STORE, JSON.stringify(copy));
    } catch (e) {}
  }
  function load() {
    var base = JSON.parse(JSON.stringify(EMPTY));
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return base;
      var saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        base = Object.assign(base, saved);
        base.contact = Object.assign(EMPTY.contact, saved.contact || {});
        base.patients = Array.isArray(saved.patients) ? saved.patients : [];
        base.done = false;
        base.errors = {};
      }
    } catch (e) {}
    return base;
  }

  /* ── ref ──────────────────────────────────────────────────────────────── */
  function makeRef() {
    var d = new Date();
    var mmdd = String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    var rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'RO-' + mmdd + '-' + rnd;
  }

  /* ── validation ───────────────────────────────────────────────────────── */
  function validate(step) {
    var e = {};
    if (step === 0) {
      if (!S.who) e.step = 'Choose who the exam is for.';
    }
    if (step === 1) {
      if (!S.date) e.date = 'Choose a date.';
      else if (!S.time) e.time = 'Choose a time.';
    }
    if (step === 2) {
      if (!S.contact.first.trim()) e.first = 'Please enter a first name.';
      if (!S.contact.last.trim()) e.last = 'Please enter a last name.';
      if (!EMAIL_RE.test(S.contact.email.trim())) e.email = 'Please enter a valid email address.';
      if (S.contact.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a 10-digit phone number.';
      if (S.who === 'me' && !S.contact.dob) e.dob = 'Please add a date of birth.';
      if (S.who === 'child' || S.who === 'kids') {
        var count = S.who === 'kids' ? 2 : 1;
        for (var i = 0; i < count; i++) {
          var p = S.patients[i] || {};
          if (!String(p.first || '').trim()) e['p' + i + 'first'] = "Please add your child's first name.";
          if (!p.dob) e['p' + i + 'dob'] = 'Please add a date of birth.';
        }
      }
      if (S.insurance === 'yes' && !S.insurer) e.insurer = 'Please choose your insurer, or pick Not sure.';
    }
    return e;
  }

  /* ── DOM ──────────────────────────────────────────────────────────────── */
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  function panels() { return $$('[data-panel]'); }

  function toast(msg) {
    var t = $('#bk-toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    setTimeout(function () { t.hidden = true; }, 3600);
  }

  function setStep(n, opts) {
    S.step = n;
    if (n > S.maxStep) S.maxStep = n;
    S.errors = {};
    save();
    paintSteps();
    panels().forEach(function (p) {
      p.hidden = Number(p.getAttribute('data-panel')) !== n;
    });
    if (!opts || opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function paintSteps() {
    $$('[data-step-btn]').forEach(function (b) {
      var i = Number(b.getAttribute('data-step-btn'));
      b.classList.toggle('is-on', i === S.step);
      b.classList.toggle('is-done', i < S.step || (i <= S.maxStep && i !== S.step));
      b.setAttribute('aria-selected', i === S.step ? 'true' : 'false');
      var isReachable = i <= S.maxStep;
      b.disabled = !isReachable && i !== 0;
      var n = b.querySelector('[data-step-num]');
      if (n) n.textContent = i < S.step ? '✓' : String(i + 1);
    });
  }

  /* ── step 0: who ──────────────────────────────────────────────────────── */
  function paintWho() {
    $$('[data-who]').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-who') === S.who);
      b.setAttribute('aria-pressed', b.getAttribute('data-who') === S.who ? 'true' : 'false');
    });
  }

  /* ── step 1: calendar ─────────────────────────────────────────────────── */
  function paintCal() {
    var grid = $('#bk-cal-grid');
    if (!grid) return;
    var base = S.month ? fromKey(S.month + '-01') : fromKey(key(today()).slice(0, 7) + '-01');
    var y = base.getFullYear();
    var m = base.getMonth();
    var monthLabel = $('#bk-cal-month');
    if (monthLabel) monthLabel.textContent = MON[m] + ' ' + y;

    grid.innerHTML = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (d) {
      var h = document.createElement('div');
      h.className = 'bk-cal__dow';
      h.textContent = d;
      grid.appendChild(h);
    });

    var first = new Date(y, m, 1);
    var lead = first.getDay();
    for (var i = 0; i < lead; i++) {
      var blank = document.createElement('div');
      grid.appendChild(blank);
    }

    var days = new Date(y, m + 1, 0).getDate();
    var tKey = key(today());
    for (var d = 1; d <= days; d++) {
      var dt = new Date(y, m, d);
      var k = key(dt);
      var state = dayState(dt);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bk-day';
      b.textContent = String(d);
      if (k === tKey) b.classList.add('is-today');
      if (state === 'open') {
        b.classList.add('is-open');
        b.setAttribute('aria-label', longDate(k) + ' — available');
      } else if (state === 'full') {
        b.classList.add('is-full');
        b.setAttribute('aria-label', longDate(k) + ' — fully booked');
        b.disabled = true;
      } else {
        b.disabled = true;
        b.setAttribute('aria-label', longDate(k) + ' — office closed');
      }
      if (S.date === k) b.classList.add('is-on');
      b.addEventListener('click', function (kk) {
        return function () {
          S.date = kk;
          S.time = null;
          save();
          paintCal();
          paintSlots();
        };
      }(k));
      grid.appendChild(b);
    }

    var prev = $('#bk-prev');
    if (prev) {
      prev.disabled = y < today().getFullYear() || (y === today().getFullYear() && m <= today().getMonth());
    }
  }

  function paintSlots() {
    var box = $('#bk-slots');
    if (!box) return;
    if (!S.date) {
      box.innerHTML = '<div class="bk-empty"><b>Choose a day</b>Times for that day will appear here.</div>';
      return;
    }
    var list = slots(S.date);
    var morning = list.filter(function (x) { return x.t < '12:00'; });
    var afternoon = list.filter(function (x) { return x.t >= '12:00'; });

    var html = '<h3 class="bk-slots__day">' + longDate(S.date) + '</h3>' +
      '<p class="bk-slots__sub">45-minute visit. Times shown are still free.</p>';

    function group(label, items) {
      if (!items.length) return '';
      var out = '<div class="bk-slots__grp">' + label + '<span>' +
        items.filter(function (x) { return x.free; }).length + ' free</span></div><div class="bk-slots__grid">';
      items.forEach(function (x) {
        out += '<button type="button" class="bk-slot' + (S.time === x.t ? ' is-on' : '') + '"' +
          (x.free ? '' : ' disabled') +
          ' data-slot="' + x.t + '">' + fmtTime(x.t) + '</button>';
      });
      return out + '</div>';
    }

    html += group('Morning', morning);
    html += group('Afternoon', afternoon);
    box.innerHTML = html;

    $$('#bk-slots [data-slot]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.time = b.getAttribute('data-slot');
        save();
        paintSlots();
      });
    });
  }

  /* ── step 2: details ──────────────────────────────────────────────────── */
  function paintDetails() {
    var dobRow = $('#bk-dob-row');
    if (dobRow) dobRow.hidden = S.who !== 'me';

    var patients = $('#bk-patients');
    if (patients) patients.hidden = !(S.who === 'child' || S.who === 'kids');

    var p2 = $('#bk-p2-row');
    if (p2) p2.hidden = S.who !== 'kids';

    $$('[data-contact]').forEach(function (el) {
      var k = el.getAttribute('data-contact');
      if (document.activeElement !== el) el.value = S.contact[k] || '';
    });

    $$('[data-patient]').forEach(function (el) {
      var i = Number(el.getAttribute('data-patient'));
      var k = el.getAttribute('data-key');
      var p = S.patients[i] || {};
      if (document.activeElement !== el) el.value = p[k] || '';
    });

    $$('[data-ins]').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-ins') === S.insurance);
    });
    var insRow = $('#bk-insurer-row');
    if (insRow) insRow.hidden = S.insurance !== 'yes';
    var insSel = $('#bk-insurer');
    if (insSel) insSel.value = S.insurer || '';
    var heard = $('#bk-heard');
    if (heard) heard.value = S.heard || '';
    var notes = $('#bk-notes');
    if (notes && document.activeElement !== notes) notes.value = S.notes || '';
    var sms = $('[data-sms]');
    if (sms) sms.checked = S.sms !== false;
  }

  /* ── step 3: review ───────────────────────────────────────────────────── */
  function whoLabel() {
    if (S.who === 'me') return 'Myself';
    if (S.who === 'child') return 'My child' + (S.patients[0] && S.patients[0].first ? ' — ' + S.patients[0].first : '');
    if (S.who === 'kids') {
      var names = S.patients.filter(function (p) { return p && p.first; }).map(function (p) { return p.first; });
      return 'Two of my children' + (names.length ? ' — ' + names.join(' and ') : '');
    }
    return '—';
  }

  function paintReview() {
    var who = $('#bk-review-who');
    if (who) who.textContent = whoLabel();

    var when = $('#bk-review-when');
    if (when) {
      when.innerHTML = S.date && S.time
        ? longDate(S.date) + ' at ' + fmtTime(S.time) + '<small>45 minutes · arrive five minutes early</small>'
        : '—';
    }

    var contact = $('#bk-review-contact');
    if (contact) {
      var c = S.contact;
      contact.innerHTML = (c.first || '') + ' ' + (c.last || '') +
        '<small>' + (c.email || '') + (c.phone ? ' · ' + c.phone : '') + '</small>';
    }

    var ins = $('#bk-review-ins');
    if (ins) {
      ins.textContent = S.insurance === 'yes'
        ? (S.insurer || 'Yes')
        : S.insurance === 'no'
          ? 'No dental insurance'
          : S.insurance === 'unsure'
            ? 'Not sure — we will check for you'
            : '—';
    }
  }

  /* ── summary rail ─────────────────────────────────────────────────────── */
  function paintSummary() {
    var w = $('#bk-sum-who');
    if (w) {
      var chosen = !!S.who;
      w.classList.toggle('is-empty', !chosen);
      var slot = w.querySelector('[data-slot]');
      if (slot) slot.textContent = chosen ? whoLabel() : 'Not chosen';
    }
    var wh = $('#bk-sum-when');
    if (wh) {
      var hasWhen = !!(S.date && S.time);
      wh.classList.toggle('is-empty', !hasWhen);
      var s2 = wh.querySelector('[data-slot]');
      if (s2) s2.textContent = hasWhen ? longDate(S.date) + ' · ' + fmtTime(S.time) : 'Not chosen';
    }
    var ct = $('#bk-sum-contact');
    if (ct) {
      var hasC = !!(S.contact.first && S.contact.email);
      ct.classList.toggle('is-empty', !hasC);
      var s3 = ct.querySelector('[data-slot]');
      if (s3) s3.textContent = hasC ? S.contact.first + ' ' + S.contact.last : 'Not added';
    }
    var mbar = $('#bk-mbar-text');
    if (mbar) {
      var bits = [];
      if (S.who) bits.push(whoLabel());
      if (S.date && S.time) bits.push(longDate(S.date) + ' at ' + fmtTime(S.time));
      mbar.textContent = bits.length ? bits.join(' · ') : 'Nothing selected yet';
    }
  }

  function paintAll() {
    paintSteps();
    paintWho();
    paintCal();
    paintSlots();
    paintDetails();
    paintReview();
    paintSummary();
  }

  /* ── errors ───────────────────────────────────────────────────────────── */
  function showErrors(step, errors) {
    var box = document.getElementById('bk-err-' + step);
    var msg = errors.step || errors.date || errors.time || 'Please check the highlighted fields.';
    if (box) box.textContent = Object.keys(errors).length ? msg : '';

    /* inline field errors, in the design's visual language */
    var map = {
      first: 'bk-first', last: 'bk-last', email: 'bk-email', phone: 'bk-phone', dob: 'bk-dob',
      insurer: 'bk-insurer',
      p0first: 'bk-p1-first', p0dob: 'bk-p1-dob', p1first: 'bk-p2-first', p1dob: 'bk-p2-dob',
    };
    Object.keys(map).forEach(function (k) {
      var el = document.getElementById(map[k]);
      if (!el) return;
      var wrap = el.closest('.field');
      if (!wrap) return;
      var hint = wrap.querySelector('.field__hint');
      if (errors[k]) {
        wrap.classList.add('field--err');
        if (hint) { hint.textContent = errors[k]; hint.hidden = false; }
      } else {
        wrap.classList.remove('field--err');
        if (hint) { hint.textContent = ''; hint.hidden = true; }
      }
    });

    var firstKey = Object.keys(errors)[0];
    if (firstKey && map[firstKey]) {
      var f = document.getElementById(map[firstKey]);
      if (f) f.focus();
    }
  }

  /* ── confirm ──────────────────────────────────────────────────────────── */
  function ics() {
    var d = fromKey(S.date);
    var ymd = key(d).replace(/-/g, '');
    var st = S.time.replace(':', '') + '00';
    var en = endTime(S.time, EXAM.mins).replace(':', '') + '00';
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Roark Orthodontics//Booking//EN',
      'BEGIN:VEVENT',
      'UID:' + S.ref + '@roarkortho.com',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART;TZID=America/Chicago:' + ymd + 'T' + st,
      'DTEND;TZID=America/Chicago:' + ymd + 'T' + en,
      'SUMMARY:' + EXAM.t + ' — Roark Orthodontics',
      'LOCATION:212 E Main St Ste 100\\, Franklin\\, TN 37064',
      'DESCRIPTION:Free parking in front of the office\\, on Main Street\\, and in the 2nd Street garage across the street. Questions? Call (615) 814-4884.',
      'END:VEVENT', 'END:VCALENDAR',
    ];
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'roark-orthodontics-visit.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function showDone() {
    var wrap = $('#bk-done-wrap');
    var shell = document.querySelector('.bk-shell');
    var prog = document.querySelector('.bk-prog');
    if (shell) shell.hidden = true;
    if (prog) prog.hidden = true;
    if (!wrap) return;
    wrap.hidden = false;

    var d = fromKey(S.date);
    var set = function (sel, text) {
      var el = $(sel);
      if (el) el.textContent = text;
    };
    set('#bk-ticket-dow', DOW_LONG[d.getDay()]);
    set('#bk-ticket-day', String(d.getDate()));
    set('#bk-ticket-mon', MON[d.getMonth()] + ' ' + d.getFullYear());
    set('#bk-ticket-time', fmtTime(S.time) + ' – ' + fmtTime(endTime(S.time, EXAM.mins)));
    set('#bk-ticket-ref', S.ref);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function confirmBooking() {
    var e = validate(2);
    if (Object.keys(e).length) {
      toast('Please check your details before confirming.');
      setStep(2);
      setTimeout(function () { showErrors(2, e); }, 60);
      return;
    }

    var btn = $('#bk-confirm');
    var label = btn && btn.querySelector('[data-label]');
    var original = label ? label.textContent : 'Confirm appointment';
    if (btn) btn.disabled = true;
    if (label) label.textContent = 'Booking…';

    S.ref = makeRef();

    var payload = {
      ref: S.ref,
      visit: 'exam',
      date: S.date,
      time: S.time,
      who: S.who,
      contact: S.contact,
      patients: S.who === 'me' ? [] : S.patients,
      insurance: S.insurance || 'unsure',
      insurer: S.insurer,
      heard: S.heard,
      notes: S.notes,
      sms: S.sms !== false,
      consent: { sms: S.sms !== false, source: 'book' },
      source: ($('#bk-from') && $('#bk-from').value) || 'book',
    };

    /* Only a CONFIRMED save shows the confirmation and counts as a conversion.
       This used to be called from .catch() as well, which meant a dropped
       connection told the patient they were booked when the row was never
       written — and would now have fired a conversion for an appointment that
       does not exist. A failed request stays on the review step with a way to
       call the office instead. */
    var finish = function () {
      S.done = true;
      if (btn) btn.disabled = false;
      if (label) label.textContent = original;
      /* A completed booking is cleared from storage so a genuine second
         booking still counts as its own conversion. */
      try { localStorage.removeItem(STORE); } catch (err) {}
      /* The Google Ads conversion. Fires once, carries no patient data, and
         is gated by Consent Mode for EEA/UK/CH visitors. */
      if (window.roarkBookingConversion) window.roarkBookingConversion(S.ref);
      showDone();
    };

    var bail = function (msg) {
      toast(msg);
      if (btn) btn.disabled = false;
      if (label) label.textContent = original;
    };

    track('booking_step', { step: 4, step_name: 'confirm' });

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (data) {
        if (data && data.ok === false) {
          bail('We could not save that — please call (615) 814-4884.');
          return;
        }
        if (data && data.stored === false) {
          /* The Worker answers ok:true/stored:false when its storage write
             failed. Treat it as a failure rather than confirming a booking
             nobody received. */
          bail('We could not save that — please call (615) 814-4884.');
          return;
        }
        finish();
      })
      .catch(function () {
        bail('We could not reach the office just now — please call (615) 814-4884.');
      });
  }

  /* ── wiring ───────────────────────────────────────────────────────────── */
  function bind() {
    $$('[data-who]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-who');
        if (S.who !== id) {
          /* Changing who resets patients and clamps the progress bar. */
          S.who = id;
          S.patients = id === 'kids' ? [{ first: '', dob: '' }, { first: '', dob: '' }] : id === 'child' ? [{ first: '', dob: '' }] : [];
          S.maxStep = Math.min(S.maxStep, 0);
        }
        save();
        paintWho();
        paintSummary();
        paintDetails();
      });
    });

    $$('[data-next]').forEach(function (b) {
      b.addEventListener('click', function () {
        var e = validate(S.step);
        if (Object.keys(e).length) {
          showErrors(S.step, e);
          return;
        }
        showErrors(S.step, {});
        if (S.step === 3) {
          confirmBooking();
          return;
        }
        var next = S.step + 1;
        setStep(next);
        paintAll();
        track('booking_step', { step: next + 1, step_name: STEP_NAMES[next] });
      });
    });

    $$('[data-back]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (S.step === 0) return;
        setStep(S.step - 1);
        paintAll();
      });
    });

    $$('[data-step-btn]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Number(b.getAttribute('data-step-btn'));
        if (b.disabled) return;
        if (i > S.step) return; /* only jump backwards */
        setStep(i);
        paintAll();
      });
    });

    $$('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () {
        setStep(Number(b.getAttribute('data-goto')));
        paintAll();
      });
    });

    /* contact fields */
    $$('[data-contact]').forEach(function (el) {
      el.addEventListener('input', function () {
        var k = el.getAttribute('data-contact');
        S.contact[k] = el.value;
        if (k === 'phone') {
          var atEnd = el.selectionStart === el.value.length;
          var f = fmtPhone(el.value);
          if (f !== el.value) {
            el.value = f;
            if (atEnd) {
              try { el.setSelectionRange(f.length, f.length); } catch (e) {}
            }
          }
          S.contact[k] = el.value;
        }
        save();
        paintSummary();
      });
    });

    $$('[data-patient]').forEach(function (el) {
      el.addEventListener('input', function () {
        var i = Number(el.getAttribute('data-patient'));
        var k = el.getAttribute('data-key');
        if (!S.patients[i]) S.patients[i] = { first: '', dob: '' };
        S.patients[i][k] = el.value;
        save();
        paintSummary();
      });
    });

    $$('[data-ins]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.insurance = b.getAttribute('data-ins');
        save();
        paintDetails();
      });
    });

    var insSel = $('#bk-insurer');
    if (insSel)
      insSel.addEventListener('change', function () {
        S.insurer = insSel.value;
        save();
      });

    var heard = $('#bk-heard');
    if (heard)
      heard.addEventListener('change', function () {
        S.heard = heard.value;
        save();
      });

    var notes = $('#bk-notes');
    if (notes)
      notes.addEventListener('input', function () {
        S.notes = notes.value;
        save();
      });

    var sms = $('[data-sms]');
    if (sms)
      sms.addEventListener('change', function () {
        S.sms = sms.checked;
        save();
      });

    var prev = $('#bk-prev');
    if (prev)
      prev.addEventListener('click', function () {
        var base = S.month ? fromKey(S.month + '-01') : fromKey(key(today()).slice(0, 7) + '-01');
        var d = new Date(base.getFullYear(), base.getMonth() - 1, 1);
        S.month = key(d).slice(0, 7);
        save();
        paintCal();
      });

    var nextm = $('#bk-nextm');
    if (nextm)
      nextm.addEventListener('click', function () {
        var base = S.month ? fromKey(S.month + '-01') : fromKey(key(today()).slice(0, 7) + '-01');
        var d = new Date(base.getFullYear(), base.getMonth() + 1, 1);
        S.month = key(d).slice(0, 7);
        save();
        paintCal();
      });

    var icsBtn = $('#bk-ics');
    if (icsBtn) icsBtn.addEventListener('click', ics);

    var confirmBtn = $('#bk-confirm');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmBooking);
  }

  /* ── boot ─────────────────────────────────────────────────────────────── */
  function boot() {
    if (!document.querySelector('.bk-shell')) return;
    S = load();
    if (!S.date) {
      var f = firstOpen();
      if (f) S.month = f.slice(0, 7);
    }
    bind();
    if (S.who) {
      var need = S.who === 'kids' ? 2 : S.who === 'child' ? 1 : 0;
      while (S.patients.length < need) S.patients.push({ first: '', dob: '' });
    }
    paintAll();
    setStep(S.step || 0, { scroll: false });
    paintAll();
    track('booking_start', {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
