/* ============================================================================
   REDIRECTS — old WordPress URLs (roarkortho.com) → pages on this site.

   WHY THIS EXISTS
   The WordPress site has earned rankings and backlinks on its own URLs, and
   the Google Ads account points at two of them. When the domain moves to this
   build, every one of those URLs would otherwise return 404. The full list of
   WordPress pages was taken from its REST API on 2026-10-27 (17 pages, 0
   posts) — see the table below.

   HOW IT IS WIRED (src/index.tsx)
   resolveRedirect() is called ONLY from app.notFound(). So a redirect can
   never shadow a page that exists: it fires only for a URL that would
   otherwise be a 404. Adding a real page at an old path automatically wins.

   301 vs 302
   301 (permanent) where the destination is the long-term home of that
   content. 302 (temporary) where the real destination does not exist yet
   (/lp/* Ads pages, /first-visit, a gallery, a product page). Browsers
   cache 301s, so a 301 that later has to change keeps sending returning
   visitors to the old target; a 302 can be repointed freely. When the new
   page ships, change its entry to 301 and point it at the new URL.

   Even the 301s carry a one-day Cache-Control, so a mistake here cannot be
   cached in someone's browser forever. Search engines still treat them as
   permanent.

   QUERY STRINGS
   The original query string is always carried over, so Google Ads
   auto-tagging (gclid, gbraid, wbraid) and utm_* parameters survive the hop
   and the booking conversion can still be attributed to the click.
   ========================================================================= */

export type RedirectRule = { to: string; status: 301 | 302 }

/* Keys are lowercase, without a trailing slash. Lookup normalises the
   incoming path the same way, so /Treatment-Options/Braces/ matches too. */
export const LEGACY_REDIRECTS: Record<string, RedirectRule> = {
  /* Treatment pages — same content, new URL. */
  '/treatment-options': { to: '/treatments', status: 301 },
  '/treatment-options/braces': { to: '/braces', status: 301 },
  '/treatment-options/invisalign': { to: '/invisalign', status: 301 },
  '/treatment-options/palatal-expander': { to: '/palatal-expander', status: 301 },

  /* Practice pages. */
  '/financing-and-insurance': { to: '/financing', status: 301 },
  '/book-now': { to: '/book', status: 301 },

  /* Old confirmation pages. They were indexable on WordPress; nobody should
     land on a "thank you" with nothing to thank them for. */
  '/thank-you': { to: '/contact', status: 301 },
  '/appointment-scheduled': { to: '/book', status: 301 },

  /* Google Ads landing pages (noindex on WordPress) → their replacements,
     also noindex. Update the Final URLs in Google Ads as well; the redirect
     is a safety net, not the plan. */
  '/invisalign-franklin': { to: '/lp/invisalign-franklin', status: 301 },
  '/braces-franklin': { to: '/lp/braces-franklin', status: 301 },

  /* TEMPORARY until a dedicated page exists. */
  '/first-visit': { to: '/#patients', status: 302 }, // → /first-visit page
  '/gallery': { to: '/#gallery', status: 302 }, // office photo gallery on the homepage
  '/product-recommendations': { to: '/invisalign', status: 302 }, // aligner & retainer care products
}

/* Normalise for lookup: lowercase, collapse repeated slashes, drop trailing
   slashes (but keep "/" itself). */
function normalise(path: string): string {
  let p = path.toLowerCase().replace(/\/{2,}/g, '/')
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p || '/'
}

/* Append the original query string to a target that may carry a #fragment.
   The query must sit before the fragment: /?gclid=x#patients, not
   /#patients?gclid=x (which would put the gclid inside the fragment, where
   no server or tag ever sees it). */
export function withQuery(target: string, search: string): string {
  if (!search || search === '?') return target
  const q = search.startsWith('?') ? search : '?' + search
  const hash = target.indexOf('#')
  const base = hash === -1 ? target : target.slice(0, hash)
  const frag = hash === -1 ? '' : target.slice(hash)
  const joined = base.includes('?') ? base + '&' + q.slice(1) : base + q
  return joined + frag
}

/* Decide where a would-be-404 request should go, or null to show the 404.

   `knownPaths` is the set of real pages (from the sitemap route table plus
   /book), used for the generic tidy-ups:
     /braces/  → /braces      (trailing slash — WordPress used them everywhere)
     /Braces   → /braces      (case)
   Legacy entries are checked first and resolve straight to their final
   destination, so there is never a redirect chain (/contact/ is one hop). */
export function resolveRedirect(
  method: string,
  path: string,
  search: string,
  knownPaths: ReadonlySet<string>,
): RedirectRule | null {
  if (method !== 'GET' && method !== 'HEAD') return null
  /* Machine and asset paths never redirect: a missing file must stay a 404. */
  if (path.startsWith('/api/') || path.startsWith('/static/')) return null

  const key = normalise(path)

  const legacy = LEGACY_REDIRECTS[key]
  if (legacy) return { to: withQuery(legacy.to, search), status: legacy.status }

  if (key !== path && knownPaths.has(key)) {
    return { to: withQuery(key, search), status: 301 }
  }

  return null
}
