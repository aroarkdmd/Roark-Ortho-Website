import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { Layout, BookingLayout, type Seo } from './layout'
import { HomePage } from './pages/home'
import { SurgicalOrthoPage } from './pages/surgical'
import { ContactPage } from './pages/contact'
import { BookPage } from './pages/book'
import {
  TreatmentsPage,
  KidsPage,
  AdultsPage,
  InvisalignFirstPage,
  BracesPage,
  InvisalignPage,
  ExpanderPage,
  FinancingPage,
  AreasPage,
  BlogPage,
  BlogArticlePage,
} from './pages/content'
import { BIZ, HOME_FAQ, SURG_FAQ, CONTACT_FAQ, FIRST_FAQ, POSTS } from './lib/site-data'
import { consentRequired, resolveGtmId } from './lib/tagging'
import type { TagConfig } from './layout'

type Bindings = { DB?: D1Database; GTM_ID?: string; ADMIN_TOKEN?: string }

const app = new Hono<{ Bindings: Bindings }>()

/* Resolve per-request tagging config. `cf.country` is populated by Cloudflare
   at the edge, so the consent decision costs nothing and never depends on a
   third-party geo lookup. Locally (no `cf`) it reads as undefined, which
   consentRequired() treats as "no banner". */
function tagFor(c: { env?: Bindings; req: { raw?: Request; path: string } }): TagConfig {
  const cf = (c.req.raw as unknown as { cf?: { country?: string } } | undefined)?.cf
  return {
    gtmId: resolveGtmId(c.env),
    consentRequired: consentRequired(cf?.country),
    path: c.req.path,
  }
}

app.use('/api/*', cors())

/* ── STATIC ──────────────────────────────────────────────────────────────── */
app.use('/static/*', serveStatic({ root: './' }))

/* ── PAGES ───────────────────────────────────────────────────────────────── */
app.get('/', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Roark Orthodontics | Braces & Invisalign in Franklin, TN',
        description:
          'Board certified orthodontist in downtown Franklin, TN. Braces for kids and teens, Invisalign® for adults and teens, Invisalign First® for children. Free exam, written prices, 0% plans with a down payment at the start.',
        canonical: '/',
        active: 'home',
        faq: HOME_FAQ,
        breadcrumb: [{ name: 'Home', href: '/' }],
        preloadImage: '/static/photos/first-visit',
        transparentHeader: true,
      }}
    >
      <HomePage />
    </Layout>,
  ),
)

app.get('/surgical-orthodontics', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Surgical Orthodontics in Franklin, TN | Braces with Jaw Surgery',
        description:
          'Combined orthodontic and jaw surgery treatment in downtown Franklin, TN, planned with your oral and maxillofacial surgeon. Board certified orthodontist. Free consultation.',
        canonical: '/surgical-orthodontics',
        active: 'treatments',
        faq: SURG_FAQ,
        breadcrumb: [
          { name: 'Home', href: '/' },
          { name: 'Treatments', href: '/treatments' },
          { name: 'Surgical Orthodontics' },
        ],
        service: {
          name: 'Surgical Orthodontics in Franklin, TN',
          description:
            'Combined orthodontic and orthognathic surgery treatment for jaw discrepancies that tooth movement alone cannot correct, coordinated with an oral and maxillofacial surgeon.',
          audience: 'Teens and adults with jaw discrepancies',
        },
        preloadImage: '/static/photos/gallery-3',
      }}
    >
      <SurgicalOrthoPage />
    </Layout>,
  ),
)

app.get('/contact', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Contact Roark Orthodontics | Downtown Franklin, TN',
        description:
          'Contact Roark Orthodontics at 212 E Main St, Ste 100, downtown Franklin, TN. Call (615) 814-4884, email hello@roarkortho.com, or send us a message. Open Monday to Wednesday.',
        canonical: '/contact',
        active: 'contact',
        faq: CONTACT_FAQ,
        breadcrumb: [{ name: 'Home', href: '/' }, { name: 'Contact' }],
        preloadImage: '/static/photos/gallery-1-storefront',
      }}
    >
      <ContactPage />
    </Layout>,
  ),
)

app.get('/treatments', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Orthodontic Treatments in Franklin, TN | Braces, Invisalign® & More',
        description:
          'Braces, Invisalign® clear aligners, Invisalign Teen® and Invisalign First® for children, palatal expanders and surgical orthodontics in downtown Franklin, TN. Board certified orthodontist. Free initial exam.',
        canonical: '/treatments',
        active: 'treatments',
        breadcrumb: [{ name: 'Home', href: '/' }, { name: 'Treatments' }],
      }}
    >
      <TreatmentsPage />
    </Layout>,
  ),
)

app.get('/kids-braces', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Braces & Invisalign First® for Kids in Franklin, TN',
        description:
          'Braces, Invisalign First® and Invisalign Teen® for children and teenagers in downtown Franklin, TN. First screening from age 7, complimentary exam with a digital scan.',
        canonical: '/kids-braces',
        active: 'kids',
        breadcrumb: [{ name: 'Home', href: '/' }, { name: 'Kids & Teens' }],
        preloadImage: '/static/photos/gallery-6',
      }}
    >
      <KidsPage />
    </Layout>,
  ),
)

app.get('/adults', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Invisalign® & Braces for Adults in Franklin, TN',
        description:
          'Adult orthodontics in downtown Franklin, TN: Invisalign® clear aligners, braces and surgical orthodontics. One fee for every appliance, 0% interest plans with a down payment at the start.',
        canonical: '/adults',
        active: 'adults',
        breadcrumb: [{ name: 'Home', href: '/' }, { name: 'Adults' }],
        preloadImage: '/static/photos/invisalign',
      }}
    >
      <AdultsPage />
    </Layout>,
  ),
)

app.get('/invisalign-first', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Invisalign First® for Kids in Franklin, TN | Children’s Clear Aligners',
        description:
          "Invisalign First® clear aligners for children in downtown Franklin, TN. Designed for growing mouths. Free screening with a board certified orthodontist.",
        canonical: '/invisalign-first',
        active: 'treatments',
        faq: FIRST_FAQ,
        breadcrumb: [
          { name: 'Home', href: '/' },
          { name: 'Treatments', href: '/treatments' },
          { name: 'Invisalign First®' },
        ],
        preloadImage: '/static/photos/gallery-6',
      }}
    >
      <InvisalignFirstPage />
    </Layout>,
  ),
)

app.get('/braces', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Braces in Franklin, TN | Metal & Clear Braces for Every Age',
        description:
          'Traditional metal braces and tooth-colored clear braces for children, teenagers and adults in downtown Franklin, TN. One fee covering records, adjustments and retainers.',
        canonical: '/braces',
        active: 'treatments',
        breadcrumb: [{ name: 'Home', href: '/' }, { name: 'Treatments', href: '/treatments' }, { name: 'Braces' }],
        preloadImage: '/static/photos/braces',
      }}
    >
      <BracesPage />
    </Layout>,
  ),
)

app.get('/invisalign', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Invisalign® Clear Aligners in Franklin, TN',
        description:
          'Invisalign® clear aligners for adults, Invisalign Teen® for teenagers and Invisalign First® for children in downtown Franklin, TN. Clear, removable, and the more aesthetic option.',
        canonical: '/invisalign',
        active: 'treatments',
        breadcrumb: [
          { name: 'Home', href: '/' },
          { name: 'Treatments', href: '/treatments' },
          { name: 'Invisalign®' },
        ],
        preloadImage: '/static/photos/invisalign',
      }}
    >
      <InvisalignPage />
    </Layout>,
  ),
)

app.get('/palatal-expander', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Palatal Expander for Children in Franklin, TN',
        description:
          'A fixed palatal expander gently widens a narrow upper jaw in children, often the right answer for a crossbite while the growth center is still open. Franklin, TN.',
        canonical: '/palatal-expander',
        active: 'treatments',
        breadcrumb: [
          { name: 'Home', href: '/' },
          { name: 'Treatments', href: '/treatments' },
          { name: 'Palatal Expander' },
        ],
      }}
    >
      <ExpanderPage />
    </Layout>,
  ),
)

app.get('/financing', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Insurance & Payment Plans | Roark Orthodontics Franklin, TN',
        description:
          'What orthodontic treatment costs in Franklin, TN: one fee for every appliance, insurance verified before your first visit, and 0% interest plans with a down payment at the start.',
        canonical: '/financing',
        active: 'financing',
        breadcrumb: [{ name: 'Home', href: '/' }, { name: 'Financing' }],
        preloadImage: '/static/photos/treatment-header',
      }}
    >
      <FinancingPage />
    </Layout>,
  ),
)

app.get('/areas-we-serve', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Areas We Serve | Roark Orthodontics, Downtown Franklin TN',
        description:
          'Roark Orthodontics serves Franklin, Cool Springs, Westhaven, Berry Farms, Brentwood, Nolensville, Thompson’s Station, Spring Hill and across Williamson County, TN.',
        canonical: '/areas-we-serve',
        breadcrumb: [{ name: 'Home', href: '/' }, { name: 'Areas we serve' }],
      }}
    >
      <AreasPage />
    </Layout>,
  ),
)

app.get('/blog', (c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Smile Journal | Orthodontic Advice from Franklin, TN',
        description:
          'Straight talk about orthodontics from Roark Orthodontics in downtown Franklin, TN: what treatment costs, when to bring your child in, and aligners versus braces.',
        canonical: '/blog',
        active: 'blog',
        breadcrumb: [{ name: 'Home', href: '/' }, { name: 'Smile Journal' }],
      }}
    >
      <BlogPage />
    </Layout>,
  ),
)

const ARTICLE_BODIES: Record<string, { h: string; p: string[] }[]> = {
  'surgical-orthodontics': [
    {
      h: 'Two things move, and only one of them is the teeth',
      p: [
        'Orthodontics moves teeth through bone. It is very good at that. What it cannot do is change the size or position of the jaw itself — and in some patients the jaw is precisely the problem.',
        'When the lower jaw sits noticeably too far forward or too far back, when the upper jaw is underdeveloped, or when the bite is open at the front, straightening the teeth alone will not hold. The teeth end up in a correct relationship with each other but a poor one with the jaws, and the bite relapses.',
        'That is the case for surgical orthodontics — also called orthognathic treatment — where the orthodontic work and corrective jaw surgery are planned together as one course rather than two separate opinions.',
      ],
    },
    {
      h: 'The sequence, and why the order matters',
      p: [
        'Braces or aligners go on first. That sounds backwards — why straighten teeth that are going to be repositioned anyway? Because the surgeon needs the teeth in a known, aligned position to plan where the jaws must go. The pre-surgical phase usually takes 9 to 15 months.',
        'The surgery is performed by an oral and maxillofacial surgeon in a hospital or accredited facility. It usually means one night in hospital and about two weeks away from your normal routine.',
        'Then a finishing phase of orthodontics — roughly 6 to 12 months — settles the bite and fine-tunes how the teeth fit now the jaws are in their corrected position. Retainers follow, and hold the result for life.',
      ],
    },
    {
      h: 'Who it is actually for',
      p: [
        'The signs are functional more than aesthetic: an underbite, a significant overbite with a receding chin, an open bite where the front teeth do not meet, a chin that shifts to one side on closing, persistent difficulty chewing or biting through food, or severe jaw joint problems.',
        'Most adult orthodontic cases need no surgery at all. If you recognize a couple of these signs it is worth a consultation — and if surgery is not indicated, we will say so plainly and treat you with braces or aligners alone.',
      ],
    },
  ],
  'braces-cost-franklin': [
    {
      h: 'The range, and why it is a range',
      p: [
        'Most treatment at our office falls between $3,400 and $6,250. That is the same range for metal braces, clear braces and clear aligners, because we price by how complex the bite is rather than by which appliance you choose.',
        'A mild crowding case and a case involving a deep overbite, a crossbite and impacted teeth are not the same job. The fee follows the work.',
        'A shorter early interceptive phase for a child runs $1,900 to $3,400, and is quoted separately from a later comprehensive phase if one turns out to be needed.',
      ],
    },
    {
      h: 'What the fee includes',
      p: [
        'Everything in the course of treatment: records (x-rays, photographs and the digital iTero scan), the appliance itself, every adjustment visit, your first set of retainers and the post-treatment check-ins.',
        'There is no separate charge for a broken bracket, and the fee does not change if treatment runs longer than estimated. That is worth asking about when you compare quotes — a lower headline number with per-visit charges added is not a lower fee.',
      ],
    },
    {
      h: 'Insurance and payment plans',
      p: [
        'Many dental plans include an orthodontic benefit, and it often works as a lifetime maximum rather than a percentage of each visit. We are in-network with most major PPO plans that carry orthodontic benefits, and we verify your specific coverage before your first visit.',
        'We also offer 0% interest monthly payment plans: a down payment when treatment starts, then the balance spread across a term matched to your expected treatment length. HSA and FSA dollars are welcome, and sibling and family treatment discounts apply automatically to additional cases.',
      ],
    },
  ],
  'invisalign-first-kids': [
    {
      h: 'Yes — children can have aligners',
      p: [
        'Parents are usually surprised to hear it, but there is an aligner system designed specifically for children. Invisalign First® is not an adult tray scaled down: the aligners are shaped to fit a smaller mouth with baby teeth still present, and they can work around teeth that have not fully erupted.',
        'It is designed for roughly age 7 to 10, while the adult teeth are arriving and the jaw is still growing.',
      ],
    },
    {
      h: 'What early treatment is actually for',
      p: [
        'Early treatment is about guiding growth, not only straightening teeth. Crowding, excessive spacing, a crossbite and protruding front teeth are all easier to influence while the jaw can still be guided.',
        'Invisalign First® does not widen the upper jaw on its own — for a narrow arch it is used alongside a palatal expander. But used together, they can create room and correct a growth problem so that a later phase is shorter, and occasionally unnecessary.',
      ],
    },
    {
      h: 'What it asks of your child',
      p: [
        'Aligners need around 20 to 22 hours of wear a day to work. That is the honest trade-off against braces, which work regardless.',
        'Children tend to do well with them — they are removable, comfortable, and come out for meals. We monitor wear at each visit and will tell you if we think braces would give a more reliable result for your child.',
      ],
    },
  ],
}

app.get('/blog/:slug', (c) => {
  const slug = c.req.param('slug')
  const post = POSTS.find((p) => p.slug === slug)
  const body = ARTICLE_BODIES[slug]
  if (!post || !body) return c.notFound()
  return c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: post.title + ' | Roark Orthodontics',
        description: post.ex,
        canonical: '/blog/' + slug,
        active: 'blog',
        breadcrumb: [
          { name: 'Home', href: '/' },
          { name: 'Smile Journal', href: '/blog' },
          { name: post.tag },
        ],
        preloadImage: '/static/photos/gallery-3',
      }}
    >
      <BlogArticlePage post={post} body={body} />
    </Layout>,
  )
})

app.get('/book', (c) =>
  c.html(
    <BookingLayout
      tag={tagFor(c)}
      seo={{
        title: 'Book a Complimentary Exam | Roark Orthodontics',
        description:
          'Book your complimentary new patient exam with Dr. Roark in downtown Franklin, TN. About 45 minutes, including photographs, an x-ray and a digital scan. No charge.',
        canonical: '/book',
      }}
    >
      <BookPage from={c.req.query('from') || 'book'} />
    </BookingLayout>,
  ),
)

/* ── API ─────────────────────────────────────────────────────────────────── */

/* One table serves both forms; `kind` separates the contact panel from the
   scheduler panel. No PHI goes into analytics — this is the only place the
   values are stored, and they are read back only by the practice. */
async function ensureSchema(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS submissions (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         kind TEXT NOT NULL,
         source TEXT,
         page TEXT,
         name TEXT,
         first_name TEXT,
         last_name TEXT,
         email TEXT,
         phone TEXT,
         message TEXT,
         patient TEXT,
         preferred_time TEXT,
         notes TEXT,
         sms INTEGER DEFAULT 0,
         visit_date TEXT,
         visit_time TEXT,
         who TEXT,
         patients TEXT,
         insurance TEXT,
         insurer TEXT,
         heard TEXT,
         reference TEXT,
         status TEXT DEFAULT 'new',
         created_at TEXT DEFAULT (datetime('now'))
       )`,
    )
    .run()
  await db.prepare(`CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at)`).run()
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* Contact panel */
app.post('/api/contact', async (c) => {
  const body = await c.req.json<Record<string, string>>().catch(() => ({}) as Record<string, string>)
  const name = (body.name || '').trim()
  const email = (body.email || '').trim()
  const phone = (body.phone || '').trim()
  const message = (body.message || '').trim()
  const source = (body.source || 'page').slice(0, 64)
  const page = (body.page || '').slice(0, 200)

  /* Validate server-side with the design's exact rules. */
  const errors: Record<string, string> = {}
  if (!name) errors.name = 'Please tell us your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (!message) errors.message = 'Let us know how we can help.'
  if (Object.keys(errors).length) return c.json({ ok: false, errors }, 400)

  try {
    /* A missing binding is a deployment fault, not a visitor problem. It used
       to fall through to a success response, so a misconfigured deploy showed
       "Message sent" for every enquiry and stored none of them. */
    if (!c.env.DB) throw new Error('no DB binding')
    await ensureSchema(c.env.DB)
    await c.env.DB.prepare(
      `INSERT INTO submissions (kind, source, page, name, email, phone, message)
       VALUES ('contact', ?, ?, ?, ?, ?, ?)`,
    )
      .bind(source, page, name, email, phone, message)
      .run()
    return c.json({ ok: true, received: true })
  } catch (err) {
    /* Never claim receipt of something we did not store. The client turns this
       into a visible "call us" message so the enquiry is not silently lost. */
    console.error('contact insert failed', err)
    return c.json({ ok: false, error: 'not_stored' }, 503)
  }
})

/* Scheduler panel */
app.post('/api/scheduler', async (c) => {
  const body = await c.req.json<Record<string, string>>().catch(() => ({}) as Record<string, string>)
  const first = (body.first || '').trim()
  const last = (body.last || '').trim()
  const email = (body.email || '').trim()
  const phone = (body.phone || '').trim()
  const patient = (body.patient || 'self').slice(0, 32)
  const when = (body.when || 'morning').slice(0, 32)
  const notes = (body.notes || '').trim()
  const source = (body.source || 'page').slice(0, 64)

  const errors: Record<string, string> = {}
  if (!first) errors.first = 'Please enter a first name.'
  if (!last) errors.last = 'Please enter a last name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (phone.replace(/\D/g, '').length < 10) errors.phone = 'Please enter a 10-digit phone number.'
  if (Object.keys(errors).length) return c.json({ ok: false, errors }, 400)

  const bookingId =
    'R-' +
    Date.now()
      .toString(36)
      .toUpperCase()

  try {
    if (c.env.DB) {
      await ensureSchema(c.env.DB)
      await c.env.DB.prepare(
        `INSERT INTO submissions (kind, source, name, first_name, last_name, email, phone, patient, preferred_time, notes, sms, reference)
         VALUES ('scheduler', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      )
        .bind(source, first + ' ' + last, first, last, email, phone, patient, when, notes, bookingId)
        .run()
    }
    return c.json({ ok: true, bookingId })
  } catch (err) {
    return c.json({ ok: true, bookingId, stored: false })
  }
})

/* Booking flow confirmation */
app.post('/api/booking', async (c) => {
  const b = await c.req.json<any>().catch(() => ({}) as any)
  const ref = (b.ref || '').slice(0, 32)

  const errors: string[] = []
  if (!b.who) errors.push('who')
  if (!b.date) errors.push('date')
  if (!b.time) errors.push('time')
  const contact = b.contact || {}
  if (!String(contact.first || '').trim()) errors.push('contact.first')
  if (!String(contact.last || '').trim()) errors.push('contact.last')
  if (!EMAIL_RE.test(String(contact.email || ''))) errors.push('contact.email')
  if (String(contact.phone || '').replace(/\D/g, '').length < 10) errors.push('contact.phone')
  if (errors.length) return c.json({ ok: false, errors }, 400)

  try {
    if (c.env.DB) {
      await ensureSchema(c.env.DB)
      await c.env.DB.prepare(
        `INSERT INTO submissions (kind, source, name, first_name, last_name, email, phone, notes,
                                  sms, visit_date, visit_time, who, patients, insurance, insurer, heard, reference)
         VALUES ('booking', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          String(b.source || 'book').slice(0, 64),
          String(contact.first || '') + ' ' + String(contact.last || ''),
          String(contact.first || ''),
          String(contact.last || ''),
          String(contact.email || ''),
          String(contact.phone || ''),
          String(b.notes || ''),
          b.sms ? 1 : 0,
          String(b.date || ''),
          String(b.time || ''),
          String(b.who || ''),
          JSON.stringify(b.patients || []),
          String(b.insurance || ''),
          String(b.insurer || ''),
          String(b.heard || ''),
          ref,
        )
        .run()
    }
    return c.json({ ok: true, ref })
  } catch (err) {
    return c.json({ ok: true, ref, stored: false })
  }
})

/* Admin read — returns every stored submission, so it must not be public.
   It previously answered anyone who asked, which on a live site collecting
   patient names, emails and phone numbers is a data exposure.

   Guarded by an ADMIN_TOKEN secret. If the secret is unset the route stays
   closed (404) rather than falling open — a missing secret is a deployment
   fault, and failing open here would leak PHI. */
app.get('/api/submissions', async (c) => {
  const expected = (c.env.ADMIN_TOKEN || '').trim()
  const given = (c.req.header('authorization') || '').replace(/^Bearer\s+/i, '').trim()

  if (!expected || given !== expected) {
    return c.json({ ok: false, error: 'not_found' }, 404)
  }
  if (!c.env.DB) return c.json({ ok: false, error: 'no database bound' }, 500)

  await ensureSchema(c.env.DB)
  const rows = await c.env.DB.prepare(
    `SELECT * FROM submissions ORDER BY id DESC LIMIT 200`,
  ).all()
  return c.json({ ok: true, count: rows.results?.length || 0, submissions: rows.results || [] })
})

app.get('/health', (c) => c.json({ ok: true, name: BIZ.name }))

app.notFound((c) =>
  c.html(
    <Layout
      tag={tagFor(c)}
      seo={{
        title: 'Page not found | Roark Orthodontics',
        description: 'That page has moved or does not exist.',
        canonical: '/404',
      }}
    >
      <main id="main">
        <section class="sec sec--paper" style="padding-top:calc(var(--header-h) + 4rem)">
          <div class="wrap wrap-narrow center">
            <span class="eb">404</span>
            <h1 class="h-section">That page has moved</h1>
            <p class="lead">
              Try the treatment menu, or call the office on {' '}
              <a href={BIZ.phoneHref}>{BIZ.phoneDisplay}</a> and we will point you the right way.
            </p>
            <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;margin-top:2rem">
              <a class="btn btn--pri" href="/">
                Back to the home page
              </a>
              <a class="btn btn--out-ink" href="/contact">
                Contact the office
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>,
    404,
  ),
)

export default app
