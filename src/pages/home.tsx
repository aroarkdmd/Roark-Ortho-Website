import type { FC } from 'hono/jsx'
import { BIZ, HOME_FAQ, POSTS, TREATMENTS } from '../lib/site-data'
import { Icon, Ticks } from '../components/icons'
import { Pic } from '../components/chrome'
import { SectionHead, FaqList, InfoRow, HoursList, CredentialsRow, SectionHead as Head } from '../components/blocks'

const PathwayCards: FC = () => (
  <section class="sec-sm sec--paper" id="pathways">
    <div class="wrap wrap-wide">
      <div class="path">
        <a class="path__card path__card--kids" href="/kids-braces">
          <div class="path__media">
            <Pic
              name="gallery-6"
              alt="A young patient at Roark Orthodontics"
              sizes="(max-width: 1000px) 100vw, 50vw"
              widths={[480, 960]}
              w={960}
              h={640}
            />
            <span class="path__tag">For parents</span>
          </div>
          <div class="path__body">
            <span class="eb">Children &amp; teens</span>
            <h2>Braces, Invisalign First® and Invisalign Teen® for kids</h2>
            <p>
              Early screening from age 7, braces and the stage-matched aligner systems, with both options open at
              every age.
            </p>
            <Ticks
              items={[
                'A first screening by age 7, as the AAO recommends',
                'Complimentary exam — photographs, x-ray and iTero scan',
                'One written fee, whatever the appliance',
              ]}
            />
            <span class="path__go">
              See the options <Icon name="arrowRight" size={12} />
            </span>
          </div>
        </a>

        <a class="path__card path__card--adults" href="/adults">
          <div class="path__media">
            <Pic
              name="invisalign"
              alt="A clear Invisalign® aligner"
              sizes="(max-width: 1000px) 100vw, 50vw"
              widths={[480, 960]}
              w={960}
              h={640}
            />
            <span class="path__tag">For adults</span>
          </div>
          <div class="path__body">
            <span class="eb">Adults</span>
            <h2>Invisalign®, braces and surgical orthodontics for adults</h2>
            <p>
              Every adult option, with a clear comparison, one fee for every appliance, and 0% interest plans
              after a down payment.
            </p>
            <Ticks
              items={[
                'Clear, removable aligners — the more aesthetic option',
                '6 to 18 months for most adult cases',
                'In-network with most major PPO plans',
              ]}
            />
            <span class="path__go">
              See the options <Icon name="arrowRight" size={12} />
            </span>
          </div>
        </a>
      </div>
    </div>
  </section>
)

export const HomePage: FC = () => (
  <main id="main">
    {/* ── hero ─────────────────────────────────────────────────────────── */}
    <section class="hero" aria-labelledby="home-h1">
      <div class="hero__bg">
        <Pic
          name="first-visit"
          eager
          alt="Dr. Roark with a patient at Roark Orthodontics in Franklin, Tennessee"
          sizes="100vw"
          widths={[480, 960, 1440, 1600]}
          w={1600}
          h={1067}
        />
      </div>
      <div class="wrap wrap-wide">
        <div class="hero__in">
          <span class="eb eb--light">Downtown Franklin, Tennessee</span>
          <h1 id="home-h1">
            Braces and Invisalign for <em>every smile</em> in Franklin, TN.
          </h1>
          <p>
            Board certified orthodontics on Main Street, for children, teens and adults. Every exam includes
            photographs, an x-ray and a digital iTero scan, and you leave with a written plan and price.
          </p>
          <div class="hero__cta">
            <a class="btn btn--rose" href="/book?from=home_hero" data-book="home_hero">
              <Icon name="calendar" size={12} /> Book a Free Consultation
            </a>
            <a class="btn btn--out" href={BIZ.phoneHref} data-phone="home_hero">
              <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
            </a>
          </div>
          <div style="display:flex;gap:1.25rem 2rem;flex-wrap:wrap;margin-top:2rem;font-size:var(--fs-caption);color:rgba(255,255,255,.88)">
            <span style="display:inline-flex;gap:.5rem;align-items:center">
              <Icon name="check" size={11} /> Board certified (ABO)
            </span>
            <span style="display:inline-flex;gap:.5rem;align-items:center">
              <Icon name="check" size={11} /> Free initial exam
            </span>
            <span style="display:inline-flex;gap:.5rem;align-items:center">
              <Icon name="check" size={11} /> 0% plans · down payment at start
            </span>
          </div>
        </div>
      </div>
    </section>

    <PathwayCards />

    {/* ── treatments ───────────────────────────────────────────────────── */}
    <section class="sec sec--paper cv" id="treatments">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Treatment options"
          title="Orthodontic services in Franklin, TN"
          body="Braces are open to every age group, and the aligner range is named by audience — Invisalign® for adults, Invisalign Teen® for teenagers and Invisalign First® for children. And where the jaw rather than the teeth is the issue, we plan surgical orthodontics with an oral surgeon."
        />
        <div class="grid-3" style="margin-top:3.5rem">
          {[
            {
              img: 'braces',
              alt: 'Metal braces on a model of teeth',
              eyebrow: 'Children, teens & adults',
              title: 'Braces',
              body: 'Traditional metal braces and tooth-colored clear braces — a proven, reliable option and a perfectly reasonable choice at any age. Plenty of adults choose them too.',
              href: '/braces',
              link: 'Metal & clear braces for every age',
            },
            {
              img: 'invisalign',
              alt: 'A clear Invisalign aligner',
              eyebrow: 'Adults, teens & children',
              title: 'Invisalign® Clear Aligners',
              body: 'Three aligner systems, one for each stage of life: Invisalign® for adults, Invisalign Teen® for teenagers and Invisalign First® for children. Removable, so you eat and drink normally, and a more aesthetic option at work, at school or in photos.',
              href: '/invisalign',
              link: 'Aligners for every age',
            },
            {
              img: 'gallery-7',
              alt: 'A treatment bay at Roark Orthodontics',
              eyebrow: 'Teens & adults',
              title: 'Surgical Orthodontics',
              body: 'For jaw discrepancies that moving teeth alone cannot correct. Dr. Roark plans and coordinates treatment together with your oral and maxillofacial surgeon, in both phases either side of surgery.',
              href: '/surgical-orthodontics',
              link: 'How surgical orthodontics works',
            },
          ].map((s) => (
            <article class="card card--accent reveal">
              <div class="card__img">
                <Pic name={s.img} alt={s.alt} sizes="(max-width: 1000px) 100vw, 33vw" widths={[480, 960]} w={960} h={640} />
              </div>
              <div class="card__body">
                <span class="eb" style="margin-bottom:.75rem">
                  {s.eyebrow}
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <a class="post__more" href={s.href}>
                  {s.link} <Icon name="arrowRight" size={11} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* ── founder band ─────────────────────────────────────────────────── */}
    <section class="sec sec--navy on-navy cv" id="about">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Meet your orthodontist</span>
            <h2 class="h-section" style="margin-bottom:1.25rem">
              Dr. Ashley Roark
            </h2>
            <p>
              Dr. Roark is passionate about creating beautiful, confident smiles. Born and raised in Middlesboro,
              Kentucky, she earned her dental degree at the University of Louisville, practiced as a general
              dentist for three years, then completed a three-year orthodontic residency at Montefiore Medical
              Center in New York City — including complex surgical cases.
            </p>
            <p>
              She is board certified by the American Board of Orthodontics, and she lives in Brentwood with her
              husband, Dr. Brian George, and their two daughters. She is proud to serve the Franklin community and
              looks forward to helping your family smile.
            </p>
            <div class="creds creds--founder">
              <div class="cred">
                <b>ABO</b>
                <span>Board Certified</span>
              </div>
              <div class="cred">
                <b>3 yr</b>
                <span>Ortho Residency</span>
              </div>
              <div class="cred">
                <b>2024</b>
                <span>Opened on Main St</span>
              </div>
            </div>
          </div>
          <div class="split__media reveal">
            <Pic
              name="gallery-7"
              alt="A treatment bay at Roark Orthodontics"
              sizes="(max-width: 1000px) 100vw, 50vw"
              widths={[480]}
              w={683}
              h={1024}
              style="aspect-ratio:3/4;object-fit:cover"
            />
          </div>
        </div>
      </div>
    </section>

    {/* ── gallery / credentials ────────────────────────────────────────── */}
    <section class="sec sec--cream cv" id="gallery">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Our office"
          title="Step into the world of beautiful smiles"
          body="Our modern facility is designed to give you a comfortable, positive experience — from the welcoming reception area to our treatment rooms."
        />
        <div class="mas" style="margin-top:3rem">
          <figure class="tall">
            <Pic
              name="gallery-1-storefront"
              alt="The Roark Orthodontics storefront on East Main Street"
              sizes="(max-width: 1000px) 100vw, 33vw"
              widths={[480, 960]}
              w={960}
              h={1280}
            />
          </figure>
          <figure>
            <Pic name="gallery-3" alt="The welcoming reception and waiting room" sizes="(max-width: 1000px) 50vw, 33vw" widths={[480, 960]} w={960} h={720} />
          </figure>
          <figure>
            <Pic name="gallery-7" alt="A treatment bay at Roark Orthodontics" sizes="(max-width: 1000px) 50vw, 33vw" widths={[480]} w={683} h={512} />
          </figure>
          <figure>
            <Pic name="treatment-header" alt="Inside the practice" sizes="(max-width: 1000px) 50vw, 33vw" widths={[960]} w={960} h={720} />
          </figure>
          <figure>
            <Pic name="gallery-6" alt="A young patient at Roark Orthodontics" sizes="(max-width: 1000px) 50vw, 33vw" widths={[480, 960]} w={960} h={720} />
          </figure>
        </div>
      </div>
    </section>

    <section class="sec-sm sec--paper sec--hair cv">
      <div class="wrap wrap-wide">
        <div class="center" style="margin-bottom:2.5rem">
          <span class="eb">Qualifications</span>
        </div>
        <CredentialsRow />
      </div>
    </section>

    {/* ── first visit + financing ──────────────────────────────────────── */}
    <section class="sec sec--paper cv" id="patients">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="New patients"
          title="Your first visit — what actually happens"
          body="No pressure, no goopy impressions, and no decision required on the day."
        />
        <div class="grid-3" style="margin-top:3rem">
          {[
            {
              icon: 'calendar',
              title: '1 · Book online or call',
              body: 'Grab a time with the online scheduler, or call (615) 814-4884. We are open Monday to Wednesday, and the welcome email with your forms follows straight away.',
            },
            {
              icon: 'star',
              title: '2 · A friendly first exam',
              body: 'Dr. Roark takes photos and a digital iTero scan — no goopy impressions — and talks through what she sees in plain language. This visit is complimentary, and there is no obligation to treat.',
            },
            {
              icon: 'check',
              title: '3 · A written plan and price',
              body: 'You leave with a treatment timeline, a full fee breakdown, what your insurance covers, and a monthly payment figure if you want one. Nothing is decided on the spot.',
            },
          ].map((s) => (
            <div class="card reveal" style="padding:2rem">
              <InfoRow icon={s.icon} title={s.title}>
                {s.body}
              </InfoRow>
            </div>
          ))}
        </div>

        <div class="split" style="margin-top:4rem">
          <div class="reveal">
            <span class="eb">Financing</span>
            <h3 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1rem">
              Clear prices, flexible payments
            </h3>
            <p>
              At your free exam you receive a written fee that covers everything — records, appliances, every
              adjustment, your first set of retainers and post-treatment visits.
            </p>
            <Ticks
              items={[
                'In-network with most major PPO plans — we verify your benefits for you',
                '0% interest plans — down payment at the start',
                'HSA and FSA dollars welcome',
                'Sibling and family treatment discounts',
              ]}
            />
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:2rem">
              <a class="btn btn--pri" href="/financing">
                Cost &amp; payment details <Icon name="arrowRight" size={11} />
              </a>
              <a class="btn btn--out-ink" href="/blog/braces-cost-franklin">
                What braces cost in Franklin
              </a>
            </div>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic name="gallery-3" alt="The Roark Orthodontics waiting room" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={720} />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── visit / NAP ──────────────────────────────────────────────────── */}
    <section class="sec sec--cream cv" id="visit">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Visit us</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.5rem">
              Find us on East Main Street
            </h2>
            <div style="display:grid;gap:1.5rem;margin-bottom:2rem">
              <InfoRow icon="pin" title="Address">
                <a href={BIZ.gbp} target="_blank" rel="noopener">
                  {BIZ.street}
                  <br />
                  {BIZ.city}, {BIZ.region} {BIZ.postal}
                </a>
              </InfoRow>
              <InfoRow icon="phone" title="Phone">
                <a href={BIZ.phoneHref} data-phone="home_visit">
                  {BIZ.phoneDisplay}
                </a>
              </InfoRow>
              <InfoRow icon="envelope" title="Email">
                <a href={'mailto:' + BIZ.email}>{BIZ.email}</a>
              </InfoRow>
            </div>
            <span class="eb">Office hours</span>
            <HoursList />
            <p class="speednote" style="margin-top:1rem">
              Dr. Roark sees patients Monday–Wednesday. Thursday–Sunday the office is closed.
            </p>
          </div>
          <div class="reveal">
            <div class="mapfacade" id="mapfacade-home" data-src={'https://www.google.com/maps?q=' + encodeURIComponent(BIZ.name + ' ' + BIZ.street + ', ' + BIZ.city + ', ' + BIZ.region) + '&output=embed'} style="height:24rem">
              <Icon name="pin" size={30} />
              <b>212 East Main Street</b>
              <span>Click to load the Google Map · downtown Franklin, TN</span>
            </div>
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.25rem">
              <a class="btn btn--pri" href={BIZ.gbp} target="_blank" rel="noopener">
                <Icon name="directions" size={11} /> Get directions
              </a>
              <a class="btn btn--out-ink" href="/book?from=home_visit" data-book="home_visit">
                <Icon name="calendar" size={11} /> Book a free exam
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── FAQ ──────────────────────────────────────────────────────────── */}
    <section class="sec sec--paper cv" id="faq">
      <div class="wrap wrap-narrow">
        <Head eyebrow="Common questions" title="Answers before you come in" narrow />
        <div style="margin-top:2.5rem">
          <FaqList items={HOME_FAQ} idPrefix="homefaq" />
        </div>
      </div>
    </section>

    {/* ── blog ─────────────────────────────────────────────────────────── */}
    <section class="sec sec--cream cv" id="journal">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Smile Journal"
          title="Straight talk about orthodontics"
          body="What treatment really costs, when to bring your child in, and how we choose between aligners and braces."
        />
        <div class="posts" style="margin-top:3rem">
          {POSTS.map((p) => (
            <a class="post reveal" href={p.href}>
              <div class="post__img">
                <img
                  src={p.imgSm}
                  srcset={p.imgSm + ' 480w, ' + p.img + ' 960w'}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="post__body">
                <span class="post__meta">
                  {p.tag} · {p.mins} min read
                </span>
                <h3>{p.title}</h3>
                <p>{p.ex}</p>
                <span class="post__more">
                  Read the article <Icon name="arrowRight" size={11} />
                </span>
              </div>
            </a>
          ))}
        </div>
        <div class="center" style="margin-top:2.5rem">
          <a class="btn btn--out-ink" href="/blog">
            All articles <Icon name="arrowRight" size={11} />
          </a>
        </div>
      </div>
    </section>

    {/* ── CTA ──────────────────────────────────────────────────────────── */}
    <section class="sec sec--rose on-rose">
      <div class="wrap wrap-narrow center">
        <h2 class="h-section" style="margin-bottom:1rem">
          Ready to start your smile journey?
        </h2>
        <p class="lead" style="margin-bottom:2rem">
          Schedule your free exam today — we would love to meet your family.
        </p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
          <a class="btn btn--white" href="/book?from=home_footer_cta" data-book="home_footer_cta">
            <Icon name="calendar" size={12} /> Book a free consultation
          </a>
          <a class="btn btn--out" href={BIZ.phoneHref} data-phone="home_footer_cta">
            <Icon name="phone" size={11} /> Call {BIZ.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  </main>
)
