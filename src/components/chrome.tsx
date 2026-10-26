import type { FC } from 'hono/jsx'
import { BIZ, NAV, FOOTER_TREATMENTS, FOOTER_PATIENTS } from '../lib/site-data'
import { Icon } from './icons'

/* ── LOGO ──────────────────────────────────────────────────────────────────
   The rose rule is part of the mark, so each ground gets its own prepared
   artwork rather than a recolor. Sizing is always by width (2.484:1).       */
export const LOGO_SRC = {
  paper: '/static/logos/roark-logo.png',
  reverse: '/static/logos/roark-logo-reverse.png',
  rose: '/static/logos/roark-logo-on-rose.png',
}

export const Logo: FC<{ variant?: 'paper' | 'reverse' | 'rose'; width?: string; alt?: string; class?: string }> = ({
  variant = 'paper',
  width = '12rem',
  alt = 'Roark Orthodontics',
  class: className,
}) => (
  <img
    class={'logo-img' + (className ? ' ' + className : '')}
    src={LOGO_SRC[variant]}
    alt={alt}
    width="1200"
    height="483"
    style={`width:${width};max-width:100%`}
  />
)

/* The design's logo swap is two stacked images cross-fading as the header goes
   solid. In JSX we render both and let the .hdr--solid rules do the work. */
const SwapLogo: FC<{ solid?: boolean; width?: string }> = ({ solid, width = '13.5rem' }) => (
  <a class="logo-link" href="/" aria-label="Roark Orthodontics — home">
    <Logo variant="reverse" width={solid ? '11rem' : width} alt="" />
    <Logo variant="paper" width={solid ? '11rem' : width} alt="Roark Orthodontics" />
  </a>
)

/* ── PHOTO MANIFEST ───────────────────────────────────────────────────────
   Only the widths that actually exist on disk, so a srcset entry can never
   404. Mirrors site/photo-manifest.jsx from the handoff.                   */
export const PHOTO_WIDTHS: Record<string, number[]> = {
  adults: [480, 960],
  'surgical-scan': [480, 960],
  'office-hall': [480, 960],
  'consult-room': [480, 960],
  braces: [480, 960],
  'braces-girl': [480, 960],
  'invisalign-smile': [480, 960],
  'adults-laugh': [480, 960],
  'dr-roark': [480, 683],
  family: [480, 960],
  'first-visit': [480, 960, 1440, 1600],
  'gallery-1-storefront': [480, 960],
  'gallery-3': [480, 960],
  'gallery-6': [480, 960],
  'gallery-7': [480, 683],
  invisalign: [480, 960],
  'itero-scan': [480, 960],
  'treatment-header': [960],
  /* Team portraits, from the practice's own photographs on roarkortho.com.
     Nicole's is kept at its native 3:2; Kelsey's at 3:4. Each width here is a
     file that exists on disk. */
  'team-nicole': [480, 960],
  'team-kelsey': [480, 730],
  /* The Roark family — Ashley, Brian, Margot and Sloane walking in the
     woods. From the practice's own shoot, kept at its native 3:2. */
  'family-roark': [480, 960, 1440],
}

const PHOTO = '/static/photos/'

export const Pic: FC<{
  name: string
  alt: string
  class?: string
  sizes?: string
  widths?: number[]
  w?: number
  h?: number
  eager?: boolean
  style?: string
}> = ({
  name,
  alt,
  class: className,
  sizes = '(max-width: 900px) 100vw, 50vw',
  widths = [480, 960, 1440],
  w,
  h,
  eager,
  style,
}) => {
  const available = PHOTO_WIDTHS[name] || []
  const wanted = available.filter((x) => widths.indexOf(x) !== -1)
  const set = wanted.length ? wanted : available
  const fallbackW = set.length ? set[set.length - 1] : null

  if (!fallbackW) {
    return (
      <div class="ph" style={style} role="img" aria-label={alt}>
        <b>Missing photo</b>
        <span>{name} — add it to public/static/photos/ and rebuild the WebP set</span>
      </div>
    )
  }

  const srcset = set.map((x) => PHOTO + name + '-' + x + '.webp ' + x + 'w').join(', ')

  return (
    <img
      src={PHOTO + name + '-' + fallbackW + '.webp'}
      srcset={set.length > 1 ? srcset : undefined}
      sizes={sizes}
      alt={alt}
      class={className}
      width={w ? String(w) : undefined}
      height={h ? String(h) : undefined}
      style={style}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      fetchpriority={eager ? 'high' : undefined}
    />
  )
}

/* ── HEADER ──────────────────────────────────────────────────────────────── */
const TopBar: FC = () => (
  <div class="hdr__top">
    <div class="wrap wrap-wide">
      <div class="hdr__top-in">
        <a href={BIZ.phoneHref} data-phone="topbar">
          <Icon name="phone" size={11} />
          {BIZ.phoneDisplay}
        </a>
        <span>
          <Icon name="pin" size={11} />
          {BIZ.street}, {BIZ.city}, {BIZ.region} {BIZ.postal}
        </span>
        <span>
          <Icon name="clock" size={11} />
          {BIZ.hours}
        </span>
      </div>
    </div>
  </div>
)

/* `solid` is the resting state. Interior pages are always solid; the homepage
   hero is transparent at the top and gains its background after 40px of
   scroll. `transparent` tells the script which of the two it is, so the
   scroll handler never strips the background off an interior page. */
export const Header: FC<{ active?: string; solid?: boolean; transparent?: boolean }> = ({
  active,
  solid,
  transparent,
}) => (
  <header
    class={'hdr' + (solid ? ' hdr--solid' : '')}
    id="site-header"
    data-transparent={transparent ? '1' : '0'}
  >
    <TopBar />
    <div class="hdr__bar">
      <div class="wrap wrap-wide">
        <div class="hdr__in">
          <SwapLogo solid={solid} />
          <nav class="nav" aria-label="Primary">
            {NAV.map((n) => (
              <a
                href={n.href}
                class={active === n.id ? 'is-active' : ''}
                aria-current={active === n.id ? 'page' : undefined}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a class="btn btn--pri btn--sm hdr__cta" href="/book?from=header" data-book="header">
            Book Now
          </a>
          <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
            <Icon name="bars" size={21} />
          </button>
        </div>
      </div>
    </div>
  </header>
)

export const MobileNav: FC<{ active?: string }> = ({ active }) => (
  <div class="mnav" id="mobile-nav" aria-hidden="true">
    <div class="mnav__top">
      <Logo variant="reverse" width="10rem" />
      <button class="mnav__x" id="mnav-close" aria-label="Close menu">
        <Icon name="xmark" size={22} />
      </button>
    </div>
    {NAV.map((n) => (
      <a class="mnav__link" href={n.href} aria-current={active === n.id ? 'page' : undefined}>
        {n.label}
      </a>
    ))}
    <a class="btn btn--rose" href="/book?from=mobile_nav" data-book="mobile_nav">
      Book Now
    </a>
    <div style="display:flex;gap:1rem;margin-top:1.5rem;flex-wrap:wrap">
      <a class="btn btn--out btn--sm" href={BIZ.phoneHref} data-phone="mobile_nav">
        <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
      </a>
      <a class="btn btn--out btn--sm" href={BIZ.gbp} target="_blank" rel="noopener">
        <Icon name="pin" size={11} /> Directions
      </a>
    </div>
  </div>
)

/* ── FOOTER ──────────────────────────────────────────────────────────────── */
export const Footer: FC = () => (
  <footer class="ftr" id="area">
    <div class="wrap wrap-wide">
      <div class="ftr__top">
        <span class="ftr__logo">
          <img class="logo-img" src="/static/logos/roark-logo-on-rose-trimmed.png" width="648" height="195" alt="Roark Orthodontics" />
        </span>
        <p>Board certified orthodontist serving downtown Franklin, TN.</p>
      </div>

      <div class="ftr__grid">
        <div>
          <h5>Visit the office</h5>
          <div class="nap">
            <b>{BIZ.name}</b>
            <address>
              <a href={BIZ.gbp} target="_blank" rel="noopener">
                {BIZ.street}
              </a>
              <br />
              {BIZ.city}, {BIZ.region} {BIZ.postal}
            </address>
            <a href={BIZ.phoneHref} data-phone="footer">
              {BIZ.phoneDisplay}
            </a>
            <a href={'mailto:' + BIZ.email}>{BIZ.email}</a>
            <span>{BIZ.hours}</span>
          </div>
          <div class="ftr__social">
            <a href={BIZ.instagram} target="_blank" rel="noopener" aria-label="Roark Orthodontics on Instagram">
              <Icon name="instagram" size={16} />
            </a>
            <a href={BIZ.facebook} target="_blank" rel="noopener" aria-label="Roark Orthodontics on Facebook">
              <Icon name="facebook" size={16} />
            </a>
          </div>
        </div>

        <div>
          <h5>Treatments</h5>
          <ul>
            {FOOTER_TREATMENTS.map((l) => (
              <li>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5>Patients</h5>
          <ul>
            {FOOTER_PATIENTS.map((l) => (
              <li>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div style="margin-top:1.5rem">
            <a class="btn btn--out btn--sm" href="/book?from=footer" data-book="footer">
              <Icon name="calendar" size={11} /> Book Online
            </a>
          </div>
        </div>
      </div>

      <div class="ftr__base">
        <span>© 2026 {BIZ.legalName}. All rights reserved.</span>
        <span>
          {BIZ.doctor} · {BIZ.doctorRole}
        </span>
        <span style="display:flex;gap:1.25rem;flex-wrap:wrap">
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/sitemap.xml">Sitemap</a>
        </span>
      </div>
    </div>
  </footer>
)

/* ── STICKY MOBILE CTA ───────────────────────────────────────────────────── */
export const StickyCTA: FC = () => (
  <div class="sticky" role="region" aria-label="Book a consultation">
    <a class="btn btn--rose" href="/book?from=sticky_mobile" data-book="sticky_mobile">
      <Icon name="calendar" size={12} /> Book Consultation
    </a>
    <a class="sticky__call" href={BIZ.phoneHref} data-phone="sticky_mobile" aria-label={'Call ' + BIZ.phoneDisplay}>
      <Icon name="phone" size={14} />
    </a>
  </div>
)

/* The consent bar from the design: shown until a choice is stored. */
export const ConsentBar: FC<{ copy: string }> = ({ copy }) => (
  <div
    class="consentbar"
    id="consentbar"
    role="dialog"
    aria-label="Cookie preferences"
    style="position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:210;max-width:34rem;margin:0 auto;background:var(--white);border:1px solid var(--clay);border-radius:var(--r-md);box-shadow:var(--shadow-lg);padding:1.25rem 1.5rem;display:none"
  >
    <p style="margin:0 0 1rem;font-size:var(--fs-caption);color:var(--ink-700)">{copy}</p>
    <div style="display:flex;gap:.6rem;flex-wrap:wrap">
      <button class="btn btn--pri btn--sm" data-consent="grant">
        Accept
      </button>
      <button class="btn btn--out-ink btn--sm" data-consent="deny">
        Decline
      </button>
      <a class="btn btn--out-ink btn--sm" href="/privacy">
        Privacy
      </a>
    </div>
  </div>
)
