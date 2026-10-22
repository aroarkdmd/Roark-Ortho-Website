import type { FC } from 'hono/jsx'
import { BIZ } from '../lib/site-data'
import { Icon } from '../components/icons'
import { Logo } from '../components/chrome'

/* ── BOOKING SHELL ─────────────────────────────────────────────────────────
   Four steps, one <main> per step, a persistent summary rail on desktop
   (>1080px) and a confirmation screen. State is owned by public/static/
   booking.js — it matches the handoff's model exactly (step, maxStep, done,
   ref, who, date, time, contact, patients, insurance, insurer, heard, notes,
   sms, errors) and persists to localStorage under roark-booking-v1 so a
   refresh mid-booking on mobile does not lose the visitor's place.         */

const STEPS = [
  { id: 'visit', lbl: 'Who it’s for' },
  { id: 'time', lbl: 'Date & time' },
  { id: 'details', lbl: 'Your details' },
  { id: 'review', lbl: 'Review' },
]

export const BookPage: FC<{ from?: string }> = ({ from = 'book' }) => (
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

    <div class="bk-prog">
      <div class="wrap wrap-wide">
        <div class="bk-prog__in" id="bk-progress" role="tablist" aria-label="Booking steps">
          {STEPS.map((s, i) => (
            <button
              class="bk-prog__step"
              data-step-btn={i}
              role="tab"
              aria-selected={i === 0 ? 'true' : 'false'}
              aria-controls="bk-panel"
              type="button"
            >
              <i data-step-num={i}>{i + 1}</i>
              <span class="bk-prog__lbl">{s.lbl}</span>
            </button>
          ))}
        </div>
      </div>
    </div>

    <main id="main">
      <div class="wrap wrap-wide">
        <div class="bk-shell">
          <div class="bk-main">
            <div class="bk-mbar" id="bk-mbar">
              <Icon name="calendar" size={14} />
              <span id="bk-mbar-text">Nothing selected yet</span>
            </div>

            {/* ── step 0 ───────────────────────────────────────────────── */}
            <section class="bk-panel" data-panel="0">
              <h1>Book your complimentary exam</h1>
              <p class="bk-lede">
                About 45 minutes with Dr. Roark, including photographs, an x-ray and a digital iTero scan. No
                charge, and no obligation to treat.
              </p>

              <div class="bk-exam">
                <div>
                  <span class="bk-exam__m">45 minutes · no charge</span>
                  <h3>Complimentary New Patient Exam</h3>
                  <p>
                    A full evaluation with Dr. Roark — photographs, an x-ray and a digital iTero scan — then a
                    written plan with fees.
                  </p>
                </div>
                <ul class="bk-exam__inc">
                  <li>
                    <Icon name="check" size={11} /> Photographs and an x-ray
                  </li>
                  <li>
                    <Icon name="check" size={11} /> Digital iTero scan — no impression trays
                  </li>
                  <li>
                    <Icon name="check" size={11} /> A written plan with fees
                  </li>
                </ul>
              </div>

              <p class="bk-q">Who is the exam for?</p>
              <div class="bk-choices" id="bk-who">
                <button class="bk-choice" data-who="me" type="button">
                  <span class="bk-choice__t">Me</span>
                  <span class="bk-choice__d">I’m an adult looking for treatment for myself.</span>
                  <span class="bk-choice__tick">
                    <Icon name="check" size={10} />
                  </span>
                </button>
                <button class="bk-choice" data-who="child" type="button">
                  <span class="bk-choice__t">My child</span>
                  <span class="bk-choice__d">Booking for a son or daughter.</span>
                  <span class="bk-choice__tick">
                    <Icon name="check" size={10} />
                  </span>
                </button>
                <button class="bk-choice" data-who="kids" type="button">
                  <span class="bk-choice__t">More than one child</span>
                  <span class="bk-choice__d">Booking for two or more of your children.</span>
                  <span class="bk-choice__tick">
                    <Icon name="check" size={10} />
                  </span>
                </button>
              </div>

              <p class="bk-already">
                Already a patient? Adjustments, retainer checks, repairs and second opinions are booked by phone —
                call <a href={BIZ.phoneHref}>{BIZ.phoneDisplay}</a>.
              </p>

              <div class="bk-actions">
                <button class="btn btn--pri" data-next type="button">
                  Continue <Icon name="arrowRight" size={11} />
                </button>
                <span class="speednote" id="bk-err-0"></span>
              </div>
            </section>

            {/* ── step 1 ───────────────────────────────────────────────── */}
            <section class="bk-panel" data-panel="1" hidden>
              <h1>Pick a date and time</h1>
              <p class="bk-lede">
                The office is open Monday to Wednesday, 7:30am to 4:00pm. Times shown are the ones still free.
              </p>

              <div class="bk-when">
                <div class="bk-cal">
                  <div class="bk-cal__hd">
                    <b id="bk-cal-month">Month</b>
                    <div class="bk-cal__nav">
                      <button type="button" id="bk-prev" aria-label="Previous month">
                        <Icon name="chevronRight" size={11} />
                      </button>
                      <button type="button" id="bk-nextm" aria-label="Next month">
                        <Icon name="chevronRight" size={11} />
                      </button>
                    </div>
                  </div>
                  <div class="bk-cal__grid" id="bk-cal-grid"></div>
                  <div class="bk-cal__key">
                    <span>
                      <i /> Available
                    </span>
                    <span>Mon–Wed only</span>
                    <span>Brown = fully booked</span>
                  </div>
                </div>

                <div class="bk-slots" id="bk-slots">
                  <div class="bk-empty">
                    <b>Choose a day</b>
                    Times for that day will appear here.
                  </div>
                </div>
              </div>

              <div class="bk-actions">
                <button class="btn btn--out-ink" data-back type="button">
                  Back
                </button>
                <button class="btn btn--pri" data-next type="button">
                  Continue <Icon name="arrowRight" size={11} />
                </button>
                <span class="speednote" id="bk-err-1"></span>
              </div>
            </section>

            {/* ── step 2 ───────────────────────────────────────────────── */}
            <section class="bk-panel" data-panel="2" hidden>
              <h1>Your details</h1>
              <p class="bk-lede">
                We use these to send the welcome email and the forms. Nothing here is shared with anyone else.
              </p>

              <fieldset class="bk-fieldset">
                <legend>Contact</legend>
                <div class="form__row">
                  <div class="field">
                    <label for="bk-first">First name</label>
                    <input id="bk-first" name="first" autocomplete="given-name" data-contact="first" />
                  </div>
                  <div class="field">
                    <label for="bk-last">Last name</label>
                    <input id="bk-last" name="last" autocomplete="family-name" data-contact="last" />
                  </div>
                </div>
                <div class="form__row">
                  <div class="field">
                    <label for="bk-email">Email</label>
                    <input id="bk-email" name="email" type="email" autocomplete="email" data-contact="email" />
                  </div>
                  <div class="field">
                    <label for="bk-phone">Mobile phone</label>
                    <input
                      id="bk-phone"
                      name="phone"
                      type="tel"
                      autocomplete="tel"
                      placeholder="(615) 555-0134"
                      data-contact="phone"
                    />
                  </div>
                </div>
                <div class="form__row" id="bk-dob-row" hidden>
                  <div class="field">
                    <label for="bk-dob">Date of birth</label>
                    <input id="bk-dob" name="dob" type="date" data-contact="dob" />
                  </div>
                </div>
              </fieldset>

              <fieldset class="bk-fieldset" id="bk-patients" hidden>
                <legend>Who is coming in</legend>
                <div class="form__row">
                  <div class="field">
                    <label for="bk-p1-first">Child’s first name</label>
                    <input id="bk-p1-first" name="p1first" data-patient="0" data-key="first" />
                  </div>
                  <div class="field">
                    <label for="bk-p1-dob">Date of birth</label>
                    <input id="bk-p1-dob" name="p1dob" type="date" data-patient="0" data-key="dob" />
                  </div>
                </div>
                <div class="form__row" id="bk-p2-row" hidden>
                  <div class="field">
                    <label for="bk-p2-first">Second child’s first name</label>
                    <input id="bk-p2-first" name="p2first" data-patient="1" data-key="first" />
                  </div>
                  <div class="field">
                    <label for="bk-p2-dob">Date of birth</label>
                    <input id="bk-p2-dob" name="p2dob" type="date" data-patient="1" data-key="dob" />
                  </div>
                </div>
              </fieldset>

              <fieldset class="bk-fieldset">
                <legend>Insurance</legend>
                <div class="field">
                  <label>Do you have dental insurance?</label>
                  <div class="bk-seg" id="bk-insurance">
                    <button type="button" data-ins="yes">
                      Yes
                    </button>
                    <button type="button" data-ins="no">
                      No
                    </button>
                    <button type="button" data-ins="unsure">
                      Not sure
                    </button>
                  </div>
                </div>
                <div class="field" id="bk-insurer-row" hidden>
                  <label for="bk-insurer">Insurer</label>
                  <select id="bk-insurer" data-insurer>
                    <option value="">Choose one…</option>
                    <option>Delta Dental</option>
                    <option>Cigna</option>
                    <option>MetLife</option>
                    <option>BlueCross BlueShield of Tennessee</option>
                    <option>Aetna</option>
                    <option>Guardian</option>
                    <option>United Concordia</option>
                    <option>Humana</option>
                    <option>Other</option>
                  </select>
                </div>
              </fieldset>

              <fieldset class="bk-fieldset">
                <legend>A little more</legend>
                <div class="field">
                  <label for="bk-heard">How did you hear about us?</label>
                  <select id="bk-heard" data-heard>
                    <option value="">Choose one…</option>
                    <option>A friend or family member</option>
                    <option>My dentist</option>
                    <option>Google search</option>
                    <option>Instagram</option>
                    <option>Walking by on Main Street</option>
                    <option>Other</option>
                  </select>
                </div>
                <div class="field">
                  <label for="bk-notes">
                    Anything we should know? <span class="muted">(optional)</span>
                  </label>
                  <textarea
                    id="bk-notes"
                    data-notes
                    placeholder="A concern you would like Dr. Roark to look at."
                  />
                </div>
                <label class="consent">
                  <input type="checkbox" data-sms checked />
                  <span>
                    Text me appointment reminders at this number. Message rates may apply — reply STOP to opt out.
                    We never share your information.
                  </span>
                </label>
              </fieldset>

              <div class="bk-actions">
                <button class="btn btn--out-ink" data-back type="button">
                  Back
                </button>
                <button class="btn btn--pri" data-next type="button">
                  Review <Icon name="arrowRight" size={11} />
                </button>
                <span class="speednote" id="bk-err-2"></span>
              </div>
            </section>

            {/* ── step 3 ───────────────────────────────────────────────── */}
            <section class="bk-panel" data-panel="3" hidden>
              <h1>Review and confirm</h1>
              <p class="bk-lede">
                One last look. Nothing is booked until you press the button below, and nothing is charged at any
                point.
              </p>

              <div class="bk-review">
                <div class="bk-review__row">
                  <span>Visit</span>
                  <div>
                    Complimentary New Patient Exam
                    <small>45 minutes · no charge</small>
                  </div>
                  <span></span>
                </div>
                <div class="bk-review__row">
                  <span>For</span>
                  <div id="bk-review-who">—</div>
                  <button class="bk-edit" data-goto="0" type="button">
                    Edit
                  </button>
                </div>
                <div class="bk-review__row">
                  <span>When</span>
                  <div id="bk-review-when">—</div>
                  <button class="bk-edit" data-goto="1" type="button">
                    Edit
                  </button>
                </div>
                <div class="bk-review__row">
                  <span>Contact</span>
                  <div id="bk-review-contact">—</div>
                  <button class="bk-edit" data-goto="2" type="button">
                    Edit
                  </button>
                </div>
                <div class="bk-review__row">
                  <span>Insurance</span>
                  <div id="bk-review-ins">—</div>
                  <button class="bk-edit" data-goto="2" type="button">
                    Edit
                  </button>
                </div>
              </div>

              <div class="bk-fee">
                <b>$0</b>
                <p>
                  The new patient exam is complimentary. Photographs, an x-ray and the iTero scan are included, and
                  you leave with a written plan and fee.
                </p>
              </div>

              <div class="bk-actions">
                <button class="btn btn--out-ink" data-back type="button">
                  Back
                </button>
                <button class="btn btn--pri" id="bk-confirm" type="button">
                  <span data-label>Confirm appointment</span> <Icon name="check" size={12} />
                </button>
                <span class="speednote" id="bk-err-3"></span>
              </div>
            </section>
          </div>

          {/* ── summary rail ─────────────────────────────────────────────── */}
          <aside class="bk-side">
            <div class="bk-sum">
              <div class="bk-sum__img">
                <img src="/static/photos/gallery-3-960.webp" alt="The Roark Orthodontics treatment room" loading="lazy" />
                <span>New patient exam</span>
              </div>
              <div class="bk-sum__body">
                <h2>Your visit</h2>
                <ul class="bk-sum__list">
                  <li id="bk-sum-who" class="is-empty">
                    <Icon name="check" size={13} />
                    <div>
                      <b>Who it’s for</b>
                      <span data-slot>Not chosen</span>
                    </div>
                  </li>
                  <li id="bk-sum-when" class="is-empty">
                    <Icon name="check" size={13} />
                    <div>
                      <b>Date &amp; time</b>
                      <span data-slot>Not chosen</span>
                    </div>
                  </li>
                  <li id="bk-sum-contact" class="is-empty">
                    <Icon name="check" size={13} />
                    <div>
                      <b>Your details</b>
                      <span data-slot>Not added</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="bk-sum__foot">
                Questions before you book? Call
                <a href={BIZ.phoneHref}> {BIZ.phoneDisplay}</a> — the office is open Monday to Wednesday.
              </div>
            </div>
            <div class="bk-help">
              <img src="/static/logos/tooth-mark.png" alt="" />
              <p>
                212 E Main St, Ste 100, Franklin, TN 37064. Free parking in front of the office and in the 2nd
                Street garage across the street.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ── confirmation ───────────────────────────────────────────────── */}
      <div id="bk-done-wrap" hidden>
        <div class="wrap wrap-wide">
          <div class="bk-done">
            <div class="bk-done__hd">
              <div class="bk-done__ic">
                <Icon name="check" size={22} />
              </div>
              <h1>You’re booked</h1>
              <p>
                A welcome email is on its way with the forms and everything you need for the first visit. We do not
                phone to confirm — the email is the confirmation.
              </p>
            </div>

            <div class="bk-ticket">
              <div class="bk-ticket__date">
                <small id="bk-ticket-dow">Day</small>
                <b id="bk-ticket-day">00</b>
                <span id="bk-ticket-mon">Month</span>
                <em id="bk-ticket-time">0:00am</em>
              </div>
              <div class="bk-ticket__body">
                <h2>Complimentary New Patient Exam</h2>
                <div class="bk-ticket__meta">
                  <span>
                    <Icon name="pin" size={13} />
                    {BIZ.street}, {BIZ.city}, {BIZ.region} {BIZ.postal}
                  </span>
                  <span>
                    <Icon name="clock" size={13} />
                    45 minutes · please arrive five minutes early
                  </span>
                  <span>
                    <Icon name="check" size={13} />
                    Photographs, an x-ray and a digital iTero scan included
                  </span>
                </div>
                <div class="bk-ticket__acts">
                  <button class="btn btn--pri" id="bk-ics" type="button">
                    <Icon name="calendar" size={11} /> Add to calendar
                  </button>
                  <a class="btn btn--out-ink" href={BIZ.gbp} target="_blank" rel="noopener">
                    <Icon name="directions" size={11} /> Directions
                  </a>
                  <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="book_success">
                    <Icon name="phone" size={11} /> Call the office
                  </a>
                </div>
                <p class="bk-ref">
                  Reference <b id="bk-ticket-ref">—</b>
                </p>
              </div>
            </div>

            <div class="bk-next">
              <div>
                <small>Before you come</small>
                <h3>Fill in the forms</h3>
                <p>The welcome email contains the health history form. It takes about five minutes.</p>
              </div>
              <div>
                <small>On the day</small>
                <h3>Just bring yourself</h3>
                <p>
                  Nothing to prepare. Free parking in front of the office, and in the 2nd Street garage across the
                  street.
                </p>
              </div>
              <div>
                <small>Afterwards</small>
                <h3>A written plan</h3>
                <p>
                  You leave with a treatment timeline, a full fee breakdown and what your insurance covers — or a
                  note that nothing is needed yet.
                </p>
              </div>
            </div>

            <div style="text-align:center;margin-top:2.5rem">
              <a class="btn btn--out-ink" href="/">
                Back to the site
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div id="bk-toast" class="bk-toast" hidden></div>
    <input type="hidden" id="bk-from" value={from} />
  </>
)
