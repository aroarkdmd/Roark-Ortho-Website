import type { FC, Child } from 'hono/jsx'
import { BIZ, HOURS, type Faq } from '../lib/site-data'
import { Icon, Ticks } from './icons'

/* ── BREADCRUMBS ─────────────────────────────────────────────────────────── */
export type Crumb = { name: string; href?: string }

export const SiloCrumbs: FC<{ trail: Crumb[] }> = ({ trail }) => (
  <nav class="crumbs" aria-label="Breadcrumb">
    {trail.map((t, i) => (
      <>
        {i > 0 && <span aria-hidden="true">/</span>}
        {t.href ? <a href={t.href}>{t.name}</a> : <span>{t.name}</span>}
      </>
    ))}
  </nav>
)

export const SiloBanner: FC<{
  img: string
  imgAlt: string
  crumbs: Crumb[]
  h1: string
  sub: string
  eager?: boolean
  bannerClass?: string
}> = ({ img, imgAlt, crumbs, h1, sub, eager, bannerClass }) => (
  <section class={'pbanner' + (bannerClass ? ' ' + bannerClass : '')}>
    <Pic name={img} alt={imgAlt} eager={eager} sizes="100vw" widths={[480, 960]} w={1600} h={1067} />
    <div class="wrap wrap-wide">
      <div class="pbanner__in">
        <SiloCrumbs trail={crumbs} />
        <h1>{h1}</h1>
        <p>{sub}</p>
      </div>
    </div>
  </section>
)

/* Pic lives in chrome.tsx; re-exported here for page imports. */
import { Pic } from './chrome'

/* ── SECTION FURNITURE ───────────────────────────────────────────────────── */
export const SectionHead: FC<{
  eyebrow?: string
  title: string
  body?: string
  onNavy?: boolean
  narrow?: boolean
  id?: string
}> = ({ eyebrow, title, body, onNavy, narrow, id }) => (
  <div class={'center' + (onNavy ? ' on-navy' : '')}>
    <div class={narrow ? 'wrap-narrow' : 'wrap-text'} style="margin:0 auto">
      {eyebrow && <span class="eb">{eyebrow}</span>}
      <h2 class="h-section" id={id} style="margin-bottom:1rem">
        {title}
      </h2>
      {body && (
        <p class="lead" style="margin-bottom:0">
          {body}
        </p>
      )}
    </div>
  </div>
)

export const InfoRow: FC<{ icon: string; title: string; children: Child }> = ({ icon, title, children }) => (
  <div style="display:flex;gap:1rem;align-items:flex-start">
    <span
      style="flex:none;width:2.6rem;height:2.6rem;border-radius:50%;background:var(--rose-100);color:var(--rose-800);display:flex;align-items:center;justify-content:center"
    >
      <Icon name={icon} size={16} />
    </span>
    <div>
      <h4 style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .25rem">
        {title}
      </h4>
      <div style="font-size:var(--fs-body-sm);color:var(--ink-700)">{children}</div>
    </div>
  </div>
)

export const HoursList: FC<{ tone?: 'rose' }> = ({ tone }) => {
  const onRose = tone === 'rose'
  return (
    <ul class="hours">
      {HOURS.map((h) => (
        <li
          class={h.closed ? 'closed' : ''}
          style={onRose ? 'border-bottom-color:rgba(255,255,255,.25);color:rgba(255,255,255,.9)' : undefined}
        >
          <b style={onRose ? 'color:#fff' : undefined}>{h.day}</b>
          <span>{h.closed ? 'Closed' : '7:30am – 4:00pm'}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── FAQ ───────────────────────────────────────────────────────────────────
   Native <details>/<summary> is kept deliberately: keyboard support,
   find-in-page and no-JS behavior come for free. First item open.          */
export const FaqList: FC<{ items: Faq[]; idPrefix?: string }> = ({ items, idPrefix = 'faq' }) => (
  <div class="faq">
    {items.map((it, i) => (
      <details id={idPrefix + '-' + i} open={i === 0}>
        <summary>
          {it.q} <Icon name="chevronDown" size={13} />
        </summary>
        <div class="faq__a">
          <p>{it.a}</p>
        </div>
      </details>
    ))}
  </div>
)

/* ── CREDENTIALS ─────────────────────────────────────────────────────────── */
export const CredentialsRow: FC = () => {
  const items = [
    { name: 'ABO', sub: 'Board Certified' },
    { name: 'AAO', sub: 'Member' },
    { name: 'Invisalign®', sub: 'Provider' },
    { name: 'ADA', sub: 'Member' },
  ]
  return (
    <div class="creds">
      {items.map((i) => (
        <div class="cred">
          <b>{i.name}</b>
          <span>{i.sub}</span>
        </div>
      ))}
    </div>
  )
}

/* ── CONTACT PANEL (the design's conversion component) ─────────────────────
   A framed card that asks for a message rather than a visit. Field order,
   labels, placeholders, validation messages and the success state mirror the
   handoff exactly. The difference from the prototype: the submit is real —
   it POSTs JSON to /api/contact (see src/index.tsx), which persists to D1 and
   emails the practice inboxes (src/lib/mail.ts).
   The success state never depends on the network call succeeding.

   `bookFrom` — the panel never books an appointment. It collects a message.
   Where the design previously placed a scheduler panel, the visitor is given
   a link to /book instead, so the choice ("just ask" vs "pick a time") is
   explicit rather than implied. Pass the same `from` slug the CTA uses.     */
export const ContactPanel: FC<{
  id?: string
  location?: string
  title?: string
  lede?: string
  bookFrom?: string
  bookLabel?: string
}> = ({ id = 'contact-panel', location = 'page', title, lede, bookFrom, bookLabel }) => {
  const fid = (k: string) => id + '-' + k
  const formId = id + '-form'
  const bookHref = '/book?from=' + (bookFrom || location)

  const bar = (
    <div class="wave__bar">
      <span class="wave__badge">
        <Icon name="envelope" size={10} /> Contact the office
      </span>
      <a
        href={BIZ.phoneHref}
        data-phone={location + '_contact'}
        style="font-size:var(--fs-eyebrow);font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--navy-600);display:inline-flex;align-items:center;gap:.45rem"
      >
        <Icon name="phone" size={10} /> Or call {BIZ.phoneDisplay}
      </a>
    </div>
  )

  return (
    <div class="wave" id={id} data-cta-location={location}>
      {bar}
      <div class="wave__fallback">
        {/* form */}
        <form class="form" id={formId} data-contact-form data-source={location} novalidate>
          <div>
            <h3 class="wave__formtitle">{title || 'Contact Us'}</h3>
            <p class="wave__lede">{lede || 'Send any question here and we will reply by email.'}</p>
          </div>

          <div class="field" data-field="name">
            <label for={fid('name')}>Name</label>
            <input
              id={fid('name')}
              name="name"
              type="text"
              autocomplete="name"
              placeholder="Your name"
              aria-describedby={fid('name') + '-err'}
            />
            <span class="field__hint" id={fid('name') + '-err'} data-error hidden />
          </div>

          <div class="field" data-field="email">
            <label for={fid('email')}>Email</label>
            <input
              id={fid('email')}
              name="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              aria-describedby={fid('email') + '-err'}
            />
            <span class="field__hint" id={fid('email') + '-err'} data-error hidden />
          </div>

          <div class="field" data-field="phone">
            <label for={fid('phone')}>
              Phone <span class="muted">(optional)</span>
            </label>
            <input
              id={fid('phone')}
              name="phone"
              type="tel"
              autocomplete="tel"
              placeholder="(615) 000-0000"
            />
          </div>

          <div class="field" data-field="message">
            <label for={fid('message')}>Message</label>
            <textarea
              id={fid('message')}
              name="message"
              style="min-height:5.5rem"
              placeholder="What would you like to know?"
              aria-describedby={fid('message') + '-err'}
            />
            <span class="field__hint" id={fid('message') + '-err'} data-error hidden />
          </div>

          <div>
            <button type="submit" class="btn btn--pri">
              <span data-label>Send message</span> <Icon name="arrowRight" size={11} />
            </button>
          </div>

          {/* Form-level failure. Shown when the message was NOT stored — the
              visitor must never see the success panel for an enquiry that was
              discarded. role="alert" so a screen reader announces it. */}
          <p class="form__alert" data-form-alert role="alert" hidden></p>

          {/* This panel only takes a message. Anyone who would rather pick a
              time is sent to the scheduler, which is where appointments are
              actually made. Two clear choices instead of one ambiguous one. */}
          {bookFrom && (
            <p class="form__book">
              Would you rather pick a time?{' '}
              <a href={bookHref} data-book={bookFrom}>
                {bookLabel || 'Book the complimentary exam online'} <Icon name="arrowRight" size={9} />
              </a>
            </p>
          )}

          <p class="form__note">
            We only use this to reply to you. For anything urgent — a broken bracket, a wire poking, or pain you
            cannot manage — please call <a href={BIZ.phoneHref}>{BIZ.phoneDisplay}</a> rather than message.
          </p>
        </form>

        {/* success state — replaces the form entirely */}
        <div class="done" id={formId + '-done'} hidden>
          <div class="done__ic">
            <Icon name="check" size={22} />
          </div>
          <h3>Message sent</h3>
          <p>
            We have it, and a reply will come to your email — usually the same or next business day. For anything
            urgent, call <a href={BIZ.phoneHref}>{BIZ.phoneDisplay}</a>.
          </p>
          <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
            {bookFrom && (
              <a class="btn btn--pri" href={bookHref} data-book={bookFrom}>
                <Icon name="calendar" size={11} /> Book online
              </a>
            )}
            <button class="btn btn--out-ink" type="button" data-contact-reset>
              Send another
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── CAPABILITY / FACT CELLS ─────────────────────────────────────────────── */
export const FactStrip: FC<{ items: [string, string, string][] }> = ({ items }) => (
  <section class="sec-sm sec--cream sec--hair">
    <div class="wrap wrap-wide">
      <div class="grid-3">
        {items.map(([k, v, d]) => (
          <div>
            <span class="eb" style="margin-bottom:.5rem">
              {k}
            </span>
            <p
              style="font-family:var(--font-display);font-size:var(--fs-h3);color:var(--navy-600);font-weight:var(--fw-display);margin:0 0 .5rem;line-height:1.1"
              data-fact-value
            >
              {v}
            </p>
            <p style="font-size:var(--fs-body-sm);margin:0">{d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export const IconCard: FC<{ icon?: string; title: string; children: Child; pad?: string }> = ({
  icon,
  title,
  children,
  pad = '1.75rem',
}) => (
  <div class="card reveal" style={'padding:' + pad}>
    {icon ? (
      <InfoRow icon={icon} title={title}>
        {children}
      </InfoRow>
    ) : (
      <>
        <h3
          style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .5rem"
        >
          {title}
        </h3>
        <p style="font-size:var(--fs-body-sm);margin:0">{children}</p>
      </>
    )}
  </div>
)

export const Callout: FC<{ children: Child; max?: string }> = ({ children, max }) => (
  <div class="callout" style={max ? 'max-width:' + max + ';margin:3rem auto 0' : undefined}>
    <p>{children}</p>
  </div>
)

export const TickList: FC<{ items: string[] }> = ({ items }) => <Ticks items={items} />
