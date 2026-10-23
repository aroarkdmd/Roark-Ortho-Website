/* ============================================================================
   TAGGING — configuration and jurisdiction rules.

   Two decisions live here, both deliberately conservative:

   1. No container ID is invented. GTM_ID comes from the environment (a
      Cloudflare secret / .dev.vars entry). While it is unset the site ships
      no tag at all and asks for no consent — which is the state this build
      was reviewed in. Turning tracking on is one secret, not a code change.

   2. Consent is required only where the law actually requires it. Google's
      EU user consent policy binds EEA / UK / Swiss traffic; Tennessee (and
      the US generally) has no equivalent cookie-consent statute for a
      practice's own marketing site. So the banner is shown on the basis of
      the visitor's country, not to everyone.

   `country` comes from Cloudflare's request metadata (request.cf.country),
   which is populated at the edge and costs nothing.
   ========================================================================= */

/* EEA member states, plus the UK and Switzerland. This is the territory
   covered by Google's EU user consent policy. */
export const CONSENT_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'IS', 'LI', 'NO', // EEA/EFTA
  'GB', 'CH', // UK, Switzerland
])

/* Unknown country (local dev, or a request without cf metadata) is treated as
   not requiring consent. The consequence of guessing wrong here is a banner
   shown to the wrong audience, not a missing consent record on a visitor the
   law protects — a US practice's audience is overwhelmingly domestic, and
   Cloudflare only omits `cf` outside its network. */
export function consentRequired(country?: string | null): boolean {
  if (!country) return false
  return CONSENT_COUNTRIES.has(country.toUpperCase())
}

/* Accept only a plausible GTM container ID. Anything else — an empty secret,
   a stray placeholder like GTM-XXXXXXX copied out of the design file, a typo —
   is treated as "not configured" rather than injected into a script src. */
const GTM_ID_RE = /^GTM-[A-Z0-9]{5,}$/i

export function resolveGtmId(env: { GTM_ID?: string } | undefined): string | null {
  const raw = (env?.GTM_ID || '').trim()
  if (!raw) return null
  if (!GTM_ID_RE.test(raw)) return null
  /* The design uses GTM-XXXXXXX as a placeholder. Never treat it as real. */
  if (/^GTM-X+$/i.test(raw)) return null
  return raw.toUpperCase()
}
