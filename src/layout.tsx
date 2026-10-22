import type { FC, Child } from 'hono/jsx'
import { BIZ, HOURS } from './lib/site-data'
import { Header, MobileNav, Footer, StickyCTA, ConsentBar } from './components/chrome'
import { CONSENT_COPY } from './lib/site-data'

export type Seo = {
  title: string
  description: string
  canonical: string
  active?: string
  h1?: string
  faq?: { q: string; a: string }[]
  service?: { name: string; description: string; audience?: string }
  breadcrumb?: { name: string; href?: string }[]
  preloadImage?: string
  plain?: boolean
  transparentHeader?: boolean
}

const ORIGIN = 'https://roarkortho.com'

function localBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Dentist', 'LocalBusiness'],
    '@id': ORIGIN + '/#practice',
    name: BIZ.name,
    legalName: BIZ.legalName,
    description:
      'Board certified orthodontic practice in historic downtown Franklin, Tennessee, offering braces for all ages, Invisalign® for adults, Invisalign Teen® for teenagers and Invisalign First® for children.',
    url: ORIGIN + '/',
    telephone: '+1-615-814-4884',
    email: BIZ.email,
    image: [ORIGIN + '/static/photos/first-visit-1600.webp'],
    logo: { '@type': 'ImageObject', url: ORIGIN + '/static/logos/roark-logo.png', width: 1200, height: 483 },
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BIZ.street,
      addressLocality: BIZ.city,
      addressRegion: BIZ.region,
      postalCode: BIZ.postal,
      addressCountry: BIZ.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: BIZ.lat, longitude: BIZ.lng },
    hasMap: BIZ.gbp,
    openingHoursSpecification: HOURS.filter((h) => !h.closed).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'https://schema.org/' + h.day,
      opens: h.open,
      closes: h.close,
    })),
    medicalSpecialty: 'Dentistry',
    founder: {
      '@type': 'Person',
      name: BIZ.doctor,
      jobTitle: BIZ.doctorRole,
      hasCredential: 'American Board of Orthodontics — Board Certified',
    },
    sameAs: [BIZ.instagram, BIZ.facebook],
  }
}

function graphFor(seo: Seo) {
  const graph: unknown[] = [localBusiness()]
  graph.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ORIGIN + '/#website',
    url: ORIGIN + '/',
    name: BIZ.name,
    publisher: { '@id': ORIGIN + '/#practice' },
  })
  if (seo.breadcrumb?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: seo.breadcrumb.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        ...(b.href ? { item: ORIGIN + b.href } : {}),
      })),
    })
  }
  if (seo.faq?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seo.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  if (seo.service) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: seo.service.name,
      description: seo.service.description,
      ...(seo.service.audience ? { audience: { '@type': 'Audience', audienceType: seo.service.audience } } : {}),
      provider: { '@id': ORIGIN + '/#practice' },
      areaServed: { '@type': 'City', name: 'Franklin' },
      url: ORIGIN + seo.canonical,
    })
  }
  return graph
}

export const Layout: FC<{ seo: Seo; children: Child }> = ({ seo, children }) => {
  /* Consent Mode v2 defaults are pushed before any tag loads. */
  const consentScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('consent','default',{ ad_storage:'denied', ad_user_data:'denied',
      ad_personalization:'denied', analytics_storage:'denied',
      functionality_storage:'granted', security_storage:'granted', wait_for_update: 500 });
    window.gtag = window.gtag || gtag;
  `

  return (
    <html lang="en-US">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={ORIGIN + seo.canonical} />
        <meta name="theme-color" content="#003d69" />
        <meta name="geo.region" content="US-TN" />
        <meta name="geo.placename" content="Franklin, Tennessee" />
        <meta name="geo.position" content="35.9248;-86.8714" />
        <meta name="ICBM" content="35.9248, -86.8714" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Roark Orthodontics" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={ORIGIN + '/static/photos/first-visit-1440.webp'} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preload" href="/static/fonts/playfair-display-latin.woff2" as="font" type="font/woff2" crossorigin />
        <link rel="preload" href="/static/fonts/lora-latin.woff2" as="font" type="font/woff2" crossorigin />
        {seo.preloadImage && (
          <link
            rel="preload"
            as="image"
            href={seo.preloadImage + '-480.webp'}
            imagesrcset={seo.preloadImage + '-480.webp 480w, ' + seo.preloadImage + '-960.webp 960w'}
            imagesizes="100vw"
            fetchpriority="high"
          />
        )}
        <link rel="icon" href="/static/logos/tooth-mark.png" />
        <link rel="apple-touch-icon" href="/static/logos/roark-logo.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphFor(seo)) }} />
        <script dangerouslySetInnerHTML={{ __html: consentScript }} />
        <link rel="stylesheet" href="/static/site.css" />
        {seo.plain && <link rel="stylesheet" href="/static/booking.css" />}
      </head>
      <body>
        <a class="skip" href="#main">
          Skip to content
        </a>
        <Header active={seo.active} solid={!seo.transparentHeader} transparent={seo.transparentHeader} />
        <MobileNav active={seo.active} />
        {children}
        <Footer />
        <StickyCTA />
        <ConsentBar copy={CONSENT_COPY} />
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
}

/* The booking flow uses its own shell — no footer, its own top bar — but the
   same token layer. */
export const BookingLayout: FC<{ seo: Seo; children: Child }> = ({ seo, children }) => (
  <html lang="en-US">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content="noindex,follow" />
      <meta name="theme-color" content="#003d69" />
      <link rel="preload" href="/static/fonts/playfair-display-latin.woff2" as="font" type="font/woff2" crossorigin />
      <link rel="preload" href="/static/fonts/lora-latin.woff2" as="font" type="font/woff2" crossorigin />
      <link rel="icon" href="/static/logos/tooth-mark.png" />
      <script dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};" }} />
      <link rel="stylesheet" href="/static/site.css" />
      <link rel="stylesheet" href="/static/booking.css" />
    </head>
    <body>
      <a class="skip" href="#main">
        Skip to content
      </a>
      {children}
      <script src="/static/booking.js" defer></script>
    </body>
  </html>
)
