/* ============================================================================
   SEO — robots.txt and sitemap.xml, generated from the route list.

   Why generated rather than hand-written: a hand-maintained sitemap goes stale
   the first time somebody adds a page and forgets. Everything below is derived
   from the same data the pages are rendered from (the route table here, and
   POSTS for the journal), so adding a page means adding one line in one place.

   TWO DELIBERATE EXCLUSIONS:

     /book  — the booking shell sends `<meta name="robots" content="noindex">`
              (see BookingLayout in src/layout.tsx). It is NOT listed here and
              it is NOT disallowed in robots.txt. That combination is
              intentional: a crawler must be allowed to FETCH the page to see
              the noindex tag. Disallowing it would hide the directive and
              leave the URL eligible for a bare "indexed without description"
              listing. Listing it would contradict the noindex.
     /api/*, /health — machine endpoints, no content, disallowed outright.

   The canonical origin is duplicated from src/layout.tsx by necessity: that
   file keeps it module-private. If the domain ever changes, both must change.
   ========================================================================= */

import { POSTS } from './site-data'

export const ORIGIN = 'https://roarkortho.com'

type Entry = {
  path: string
  /* Relative weight within this site. Not a global score. */
  priority: string
  changefreq: 'weekly' | 'monthly' | 'yearly'
  /* ISO date. Omitted where the page has no meaningful publish date; a wrong
     <lastmod> is worse than none, because crawlers learn to distrust it. */
  lastmod?: string
}

/* Ordered most- to least-important. The homepage and the two commercial
   landing pages lead; legal copy trails. */
const PAGES: Entry[] = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'yearly' },
  { path: '/treatments', priority: '0.9', changefreq: 'monthly' },
  { path: '/adults', priority: '0.9', changefreq: 'monthly' },
  { path: '/kids-braces', priority: '0.9', changefreq: 'monthly' },
  { path: '/invisalign', priority: '0.8', changefreq: 'monthly' },
  { path: '/invisalign-first', priority: '0.8', changefreq: 'monthly' },
  { path: '/braces', priority: '0.8', changefreq: 'monthly' },
  { path: '/palatal-expander', priority: '0.7', changefreq: 'monthly' },
  { path: '/surgical-orthodontics', priority: '0.7', changefreq: 'monthly' },
  { path: '/financing', priority: '0.8', changefreq: 'monthly' },
  { path: '/areas-we-serve', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
]

/* Every real, servable page path. Used by the redirect resolver
   (src/lib/redirects.ts) for trailing-slash and letter-case tidy-ups, so
   /braces/ → /braces only when /braces is a page that actually exists.
   /book is included: it is a real page, merely noindexed. */
export const KNOWN_PATHS: ReadonlySet<string> = new Set([
  ...PAGES.map((p) => p.path),
  ...POSTS.map((p) => p.href),
  '/book',
  /* Google Ads landing pages: real pages, noindexed, never in the sitemap. */
  '/lp/invisalign-franklin',
  '/lp/braces-franklin',
])

/* XML text escaping. Only &, < and > can appear in our URLs, but escape all
   five so a future path with a quote cannot produce invalid XML. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemap(): string {
  const urls: string[] = []

  const add = (loc: string, priority: string, changefreq: string, lastmod?: string) => {
    urls.push(
      '  <url>\n' +
        '    <loc>' + esc(ORIGIN + loc) + '</loc>\n' +
        (lastmod ? '    <lastmod>' + esc(lastmod) + '</lastmod>\n' : '') +
        '    <changefreq>' + changefreq + '</changefreq>\n' +
        '    <priority>' + priority + '</priority>\n' +
        '  </url>',
    )
  }

  for (const p of PAGES) add(p.path, p.priority, p.changefreq, p.lastmod)

  /* The journal, straight from POSTS — so a new article appears here the
     moment it appears in the data, with no second edit to forget. */
  for (const post of POSTS) add(post.href, '0.6', 'monthly', post.date)

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') +
    '\n</urlset>\n'
  )
}

/* robots.txt.

   /book is absent from the Disallow list on purpose — see the header comment.

   The AI crawlers are allowed explicitly. They are permitted by the `*` rule
   anyway, so this costs nothing; it is here because several of these agents
   look for a named group before they will crawl, and being named is how a
   practice gets cited in an answer rather than skipped. Nothing here grants
   access to anything a human visitor cannot already see. */
export function buildRobots(): string {
  const agents = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot']

  return (
    '# Roark Orthodontics — https://roarkortho.com\n' +
    '\n' +
    'User-agent: *\n' +
    'Allow: /\n' +
    'Disallow: /api/\n' +
    'Disallow: /health\n' +
    '\n' +
    '# The booking page is crawlable but carries a noindex tag, so it is not\n' +
    '# listed in the sitemap. Do not disallow it here: a blocked URL cannot be\n' +
    '# read, and an unread noindex cannot be obeyed.\n' +
    '\n' +
    agents.map((a) => 'User-agent: ' + a + '\nAllow: /\n').join('\n') +
    '\nSitemap: ' +
    ORIGIN +
    '/sitemap.xml\n'
  )
}
