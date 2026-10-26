import type { FC } from 'hono/jsx'
import { BIZ } from '../lib/site-data'
import { Icon, Ticks } from '../components/icons'
import { Pic } from '../components/chrome'
import { SiloBanner, SectionHead, FactStrip, ContactPanel } from '../components/blocks'

/* ── ABOUT / MEET THE TEAM ────────────────────────────────────────────────
   Content carried over from the previous site's /about/ page, which is the
   practice's own copy about Dr. Roark, Nicole and Kelsey. The wording is
   theirs; only the markup is new. Two deliberate changes:

     1. Apostrophes that were missing in the old source ("wasnt", "Shes")
        are restored, and the family/personal details are kept exactly as
        the practice wrote them — this is published biography, not data.
     2. Headshots are NOT invented. No photograph of a team member exists in
        the project's photo set, and using an office or patient photo in a
        staff card would misrepresent who is in it. Each card therefore shows
        a monogram until the practice supplies real portraits. Drop a file in
        public/static/photos/ and swap the <Monogram> for a <Pic> to finish.

   `id="meet-the-team"` is on the team section because the old site linked to
   /about/#meet-the-team and that link must keep working.                  */

type Person = {
  name: string
  role: string
  initials: string
  bio: string[]
}

const TEAM: Person[] = [
  {
    name: 'Nicole Zielinski',
    role: 'Registered Dental Assistant',
    initials: 'NZ',
    bio: [
      'Nicole grew up right here in Franklin. She attended the University of Alabama, where she obtained a Bachelor of Arts in Communication and Information Sciences.',
      'After graduating, Nicole moved back home to Franklin and began working in Dermatology and then Plastic Surgery, managing the front office and social media. She then began work at an orthodontic office, and her love for all things teeth flourished.',
      'She now lives in Franklin with her husband, Benton Zielinski, and their four cats and dog.',
      'In her spare time, Nicole loves to cook, entertain, and spend time with family and friends. She enjoys helping patients in their smile journey to find their most confident selves.',
    ],
  },
  {
    name: 'Kelsey Gibson',
    role: 'Patient Coordinator',
    initials: 'KG',
    bio: [
      'Kelsey is the first face you will see when you step into the office. Originally from Michigan, she moved to Murfreesboro after graduating from Hope College. She has been working in administration and marketing ever since.',
      'Kelsey shares her home with her husband, their dog, and a three-legged cat.',
      'Outside of the office you can find her lost in a good book, crocheting, and being the coolest aunt to her five nieces and nephews. Kelsey is dedicated to ensuring that your journey to a new smile is as smooth, seamless, and stress-free as possible.',
    ],
  },
]

const Monogram: FC<{ initials: string; big?: boolean; onRose?: boolean }> = ({ initials, big, onRose }) => (
  <span
    class={'team__mono' + (big ? ' team__mono--lg' : '') + (onRose ? ' on-rose' : '')}
    aria-hidden="true"
  >
    {initials}
  </span>
)

const BioParas: FC<{ paras: string[] }> = ({ paras }) => (
  <>
    {paras.map((p, i) => (
      <p style={i === paras.length - 1 ? 'margin-bottom:0' : undefined}>{p}</p>
    ))}
  </>
)

/* Dr. Roark's biography. Long enough that it gets its own two-column band
   rather than sitting inside a staff card. */
const DOCTOR_BIO: string[] = [
  'Dr. Roark is passionate about creating beautiful smiles that inspire confidence. Born and raised in Middlesboro, Kentucky, she developed an early interest in helping others, which led her to earn her Bachelor of Science in Psychology from the University of Kentucky. While she loves her Kentucky Wildcats, she chose to pursue her dental degree at the University of Louisville, where her dedication to dentistry grew.',
  'After earning her degree, Dr. Roark practiced as a general dentist for three years. In her first job out of training, she worked alongside an orthodontist and fell in love with the specialty. That experience inspired her to pursue advanced training in orthodontics. While it was not the most direct path to her dream career, her years as a general dentist help her view cases through a unique lens.',
  'Dr. Roark completed a three-year orthodontic residency at Montefiore Medical Center in New York City, where she gained extensive training in all aspects of orthodontics, including complex surgical cases. She is dedicated to providing a caring, comfortable experience for every patient.',
  `Dr. Roark and her husband, Brian George, live in Brentwood, Tennessee, with their two daughters, Margot and Sloane. When she is not crafting beautiful smiles, Dr. Roark loves spending time outdoors with her family, exploring new destinations through travel, and occasionally stealing the mic for karaoke — even if she is the first to admit she cannot carry a tune. Her warm personality and commitment to her patients make every visit to the office a comfortable and uplifting experience.`,
  'Dr. Roark is proud to serve the Franklin community and looks forward to helping your family achieve their healthiest, happiest smiles.',
]

export const AboutPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="first-visit"
      imgAlt="Dr. Roark's treatment room at Roark Orthodontics in downtown Franklin"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'About' }]}
      h1="About Roark Orthodontics"
      sub="A board certified orthodontist and a small team who know their patients by name — on East Main Street in historic downtown Franklin."
      eager
    />

    {/* ── education, from the biography ─────────────────────────────────── */}
    <FactStrip
      items={[
        ['Undergraduate', 'Kentucky', 'Bachelor of Science in Psychology, University of Kentucky.'],
        ['Dental degree', 'Louisville', 'Doctor of Dental Medicine, University of Louisville.'],
        ['Residency', 'Montefiore', 'Three-year orthodontic residency in New York City, including complex surgical cases.'],
      ]}
    />

    {/* ── the practice, in one paragraph ───────────────────────────────── */}
    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">The practice</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Orthodontics, done by one orthodontist, in one place
            </h2>
            <p>
              Roark Orthodontics is a single-doctor practice. That is a deliberate choice: the person who plans your
              treatment is the person who carries it out, at every adjustment visit, from the first scan to the
              retainer check.
            </p>
            <p>
              Dr. Roark is <b>board certified by the American Board of Orthodontics</b> — a voluntary credential beyond
              licensure, earned by examination and case review. She treats children, teenagers and adults, with braces
              and with the full Invisalign® range, and plans surgical cases together with your oral and maxillofacial
              surgeon.
            </p>
            <p>
              The office is at {BIZ.street} in downtown Franklin, with free parking in front and in the 2nd Street
              garage across the street. If you would like to know what a visit is like before you come,{' '}
              <a href="/#patients">start with your first visit</a>.
            </p>
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem">
              <a class="btn btn--pri" href="/book?from=about" data-book="about">
                <Icon name="calendar" size={11} /> Book a free exam
              </a>
              <a class="btn btn--out-ink" href="/treatments">
                Treatment options <Icon name="arrowRight" size={11} />
              </a>
            </div>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic
                name="gallery-6"
                alt="A treatment bay at Roark Orthodontics in downtown Franklin"
                sizes="(max-width: 1000px) 100vw, 50vw"
                widths={[480, 960]}
                w={960}
                h={640}
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── MEET THE TEAM ────────────────────────────────────────────────── */}
    <section class="sec sec--cream cv" id="meet-the-team">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Meet the team"
          title="The people you will actually meet"
          body="Three people, and you will get to know all of them. Nobody here is a call centre."
        />

        {/* Dr. Roark — featured, because the biography is long */}
        <div class="split" style="margin-top:3.5rem;align-items:start">
          <div class="reveal">
            <div style="display:flex;gap:1.25rem;align-items:center;margin-bottom:1.75rem">
              <Monogram initials="AR" big />
              <div>
                <span class="eb" style="margin-bottom:.35rem">
                  Founder &amp; orthodontist
                </span>
                <h3
                  style="font-family:var(--font-display);font-size:var(--fs-h3);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .25rem;line-height:1.15"
                >
                  Dr. Ashley Roark, DMD
                </h3>
                <p style="margin:0;font-size:var(--fs-caption);color:var(--ink-700)">
                  Board Certified Orthodontist
                </p>
              </div>
            </div>
            <BioParas paras={DOCTOR_BIO} />
          </div>

          <div class="reveal">
            <div class="card" style="padding:2rem">
              <h3
                style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 1rem"
              >
                Credentials
              </h3>
              <Ticks
                items={[
                  'Board Certified — American Board of Orthodontics',
                  'Member — American Association of Orthodontists',
                  'Member — American Dental Association',
                  'Invisalign® provider — adult, teen and First® systems',
                  'Three-year residency, Montefiore Medical Center, New York',
                  'Three years in general dentistry before specializing',
                ]}
              />
              <div style="border-top:1px solid var(--clay);margin:1.5rem 0 0;padding-top:1.5rem">
                <a class="btn btn--pri" href="/book?from=about_doctor" data-book="about_doctor">
                  <Icon name="calendar" size={11} /> Meet Dr. Roark
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* the rest of the team */}
        <div class="grid-2" style="margin-top:3.5rem">
          {TEAM.map((p) => (
            <article class="card reveal" style="padding:2rem">
              <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.25rem">
                <Monogram initials={p.initials} />
                <div>
                  <h3
                    style="font-family:var(--font-display);font-size:var(--fs-h4);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .2rem"
                  >
                    {p.name}
                  </h3>
                  <p
                    style="margin:0;font-size:var(--fs-eyebrow);font-weight:var(--fw-semi);letter-spacing:.06em;text-transform:uppercase;color:var(--rose-800)"
                  >
                    {p.role}
                  </p>
                </div>
              </div>
              <div style="font-size:var(--fs-body-sm);color:var(--ink-700);display:grid;gap:.85rem">
                <BioParas paras={p.bio} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* ── what board certification means ───────────────────────────────── */}
    <section class="sec sec--paper cv" id="board-certified">
      <div class="wrap wrap-narrow">
        <SectionHead
          eyebrow="What the credential means"
          title="Every orthodontist is licensed. Not every orthodontist is board certified."
          body="It is worth knowing the difference before you choose where to be treated."
          narrow
        />
        <div class="prose" style="margin-top:2.5rem">
          <p>
            A licence to practise dentistry is granted by the state. <b>Board certification</b> is separate and
            voluntary: it is awarded by the American Board of Orthodontics only after a written examination and the
            submission of completed cases for peer review, and it is maintained through continuing assessment.
          </p>
          <p>
            In practical terms, it means an independent body of orthodontists has examined Dr. Roark&rsquo;s own
            finished cases — records, results and how they held up — and judged them to the specialty&rsquo;s standard.
            You can verify any orthodontist&rsquo;s standing in the ABO directory.
          </p>
          <p style="margin-bottom:0">
            None of that changes what treatment costs or how long it takes. What it does tell you is how carefully the
            work is reviewed.
          </p>
        </div>
      </div>
    </section>

    {/* ── contact ──────────────────────────────────────────────────────── */}
    <section class="sec sec--cream cv" id="contact">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Get in touch</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Questions about the practice, the team or the office?
            </h2>
            <p>
              Send a message here and one of the team will reply by email — usually the same or next business day. If
              you already know you would like a time, the scheduler is quicker.
            </p>
            <div style="display:grid;gap:1.25rem;margin-top:2rem">
              <div style="display:flex;gap:.75rem;align-items:flex-start">
                <span
                  style="flex:none;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--rose-100);color:var(--rose-800);display:flex;align-items:center;justify-content:center"
                >
                  <Icon name="pin" size={14} />
                </span>
                <div style="font-size:var(--fs-body-sm)">
                  <a href={BIZ.gbp} target="_blank" rel="noopener">
                    {BIZ.street}
                    <br />
                    {BIZ.city}, {BIZ.region} {BIZ.postal}
                  </a>
                </div>
              </div>
              <div style="display:flex;gap:.75rem;align-items:flex-start">
                <span
                  style="flex:none;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--rose-100);color:var(--rose-800);display:flex;align-items:center;justify-content:center"
                >
                  <Icon name="phone" size={14} />
                </span>
                <div style="font-size:var(--fs-body-sm)">
                  <a href={BIZ.phoneHref} data-phone="about">
                    {BIZ.phoneDisplay}
                  </a>
                </div>
              </div>
              <div style="display:flex;gap:.75rem;align-items:flex-start">
                <span
                  style="flex:none;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--rose-100);color:var(--rose-800);display:flex;align-items:center;justify-content:center"
                >
                  <Icon name="clock" size={14} />
                </span>
                <div style="font-size:var(--fs-body-sm)">
                  Monday to Wednesday, 7:30am – 4:00pm.
                  <br />
                  Closed Thursday to Sunday.
                </div>
              </div>
            </div>
          </div>

          <div class="reveal">
            <ContactPanel
              id="about-contact"
              location="about"
              bookFrom="about"
              title="Contact the office"
              lede="Ask us anything about the practice or the team and we will reply by email."
            />
          </div>
        </div>
      </div>
    </section>

    {/* ── closing ──────────────────────────────────────────────────────── */}
    <section class="sec sec--rose on-rose">
      <div class="wrap wrap-narrow center">
        <h2 class="h-section" style="margin-bottom:1rem">
          Come and meet us properly
        </h2>
        <p style="margin-bottom:2rem">
          The exam is complimentary, takes about 45 minutes, and includes photographs, an x-ray and a digital scan —
          so you leave with a real answer rather than an estimate.
        </p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
          <a class="btn btn--white" href="/book?from=about_cta" data-book="about_cta">
            <Icon name="calendar" size={12} /> Book a free consultation
          </a>
          <a class="btn btn--out" href={BIZ.phoneHref} data-phone="about_cta">
            <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  </main>
)
