import type { FC } from 'hono/jsx'
import { BIZ } from '../lib/site-data'
import { Icon } from '../components/icons'
import { Pic } from '../components/chrome'
import { SiloBanner, SectionHead, ContactPanel } from '../components/blocks'

/* ── ABOUT — THE TEAM ──────────────────────────────────────────────────────
   This page is about the people, not the credential. The previous build led
   with a board-certification explainer and a FactStrip of Dr. Roark's
   education; the practice asked for that de-emphasized. Board certification
   now appears once, in passing, inside her biography — which is where the
   practice itself puts it. The rest of the page is the team.

   Copy is the practice's own, carried over from the old site's /about/ page.
   Only the markup and the ordering are new. Apostrophes that the old source
   dropped ("wasnt", "Shes") are restored; the personal details are left
   exactly as the practice wrote them, because this is published biography.

   Photographs: all of them come from the practice's own shoot on
   roarkortho.com. Dr. Roark's was already in the photo set; Nicole's and
   Kelsey's were recovered from the old site's Elementor background images
   and cropped 3:4. The family photograph — Ashley, Brian, Margot and Sloane
   walking in the woods — is the practice's own, kept at its native 3:2.
   Nothing here is stock and nobody's photo stands in for someone else's.

   `id="meet-the-team"` is on the team section because the old site linked to
   /about/#meet-the-team and the header/footer still do — see site-data.ts.  */

const BioParas: FC<{ paras: string[] }> = ({ paras }) => (
  <>
    {paras.map((p) => (
      <p>{p}</p>
    ))}
  </>
)

/* Dr. Roark. Long enough that it gets its own feature block beside the
   portrait rather than a card. */
const DOCTOR_BIO: string[] = [
  'Dr. Roark is passionate about creating beautiful smiles that inspire confidence. Born and raised in Middlesboro, Kentucky, she developed an early interest in helping others, which led her to earn her Bachelor of Science in Psychology from the University of Kentucky. While she loves her Kentucky Wildcats, she chose to pursue her dental degree at the University of Louisville, where her dedication to dentistry grew.',
  'After earning her degree, Dr. Roark practiced as a general dentist for three years. In her first job out of training she worked alongside an orthodontist and fell in love with the specialty. While it was not the most direct path to her dream career, her years as a general dentist help her view cases through a unique lens — she has seen these teeth from more than one angle.',
  'Dr. Roark completed a three-year orthodontic residency at Montefiore Medical Center in New York City, where she gained extensive training in all aspects of orthodontics, including complex surgical cases. Her work is board certified by the American Board of Orthodontics, and she treats children, teenagers and adults in braces and in the full Invisalign® range.',
  'She and her husband, Brian George, live in Brentwood with their two daughters, Margot and Sloane. When she is not crafting smiles she is outside with her family, traveling somewhere new, or stealing the mic for karaoke — even though she is the first to admit she cannot carry a tune.',
]

type Person = {
  name: string
  role: string
  short: string
  photo: string
  widths: number[]
  w: number
  h: number
  alt: string
  bio: string[]
}

/* The rest of the team. `short` is the one-line reason you are glad they are
   the one answering the phone; the biography follows underneath. */
const TEAM: Person[] = [
  {
    name: 'Nicole Zielinski',
    role: 'Registered Dental Assistant',
    short: 'Franklin born and raised, and the calm voice beside you in the chair.',
    photo: 'team-nicole',
    widths: [480, 800],
    w: 800,
    h: 1066,
    alt: 'Nicole Zielinski, registered dental assistant at Roark Orthodontics in Franklin, Tennessee',
    bio: [
      'Nicole grew up right here in Franklin. She attended the University of Alabama, where she obtained a Bachelor of Arts in Communication and Information Sciences.',
      'After graduating, Nicole moved back home to Franklin and began working in dermatology and then plastic surgery, managing the front office and social media. She then began work at an orthodontic office, and her love for all things teeth flourished.',
      'She now lives in Franklin with her husband, Benton Zielinski, and their four cats and dog.',
      'In her spare time, Nicole loves to cook, entertain and spend time with family and friends. She enjoys helping patients in their smile journey to find their most confident selves.',
    ],
  },
  {
    name: 'Kelsey Gibson',
    role: 'Patient Coordinator',
    short: 'The first face you see, and the one who keeps the schedule human.',
    photo: 'team-kelsey',
    widths: [480, 730],
    w: 730,
    h: 973,
    alt: 'Kelsey Gibson, patient coordinator at Roark Orthodontics in Franklin, Tennessee',
    bio: [
      'Kelsey is the first face you will see when you step into the office. Originally from Michigan, she moved to Murfreesboro after graduating from Hope College. She has been working in administration and marketing ever since.',
      'Kelsey shares her home with her husband, their dog, and a three-legged cat.',
      'Outside of the office you can find her lost in a good book, crocheting, and being the coolest aunt to her five nieces and nephews. Kelsey is dedicated to ensuring that your journey to a new smile is as smooth, seamless and stress-free as possible.',
    ],
  },
]

export const AboutPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="first-visit"
      imgAlt="Dr. Roark's treatment room at Roark Orthodontics in downtown Franklin"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'About' }]}
      h1="The people behind the smiles"
      sub="Three of us, one office on East Main Street — and you will get to know all three."
      eager
    />

    {/* ── MEET THE TEAM ────────────────────────────────────────────────── */}
    <section class="sec sec--paper cv" id="meet-the-team">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Meet the team"
          title="The people you will actually meet"
          body="No call center and no rotating cast. The person who plans your treatment is the person who carries it out."
        />

        {/* Dr. Roark — portrait beside the biography */}
        <div class="team__feature reveal" style="margin-top:3.5rem">
          <div class="team__member">
            <div class="team__photo">
              <Pic
                name="dr-roark"
                alt="Dr. Ashley Roark, orthodontist and founder of Roark Orthodontics in Franklin, Tennessee"
                sizes="(max-width: 1000px) 100vw, 35vw"
                widths={[480, 683]}
                w={683}
                h={911}
              />
            </div>
          </div>

          <div>
            <span class="eb">Founder &amp; orthodontist</span>
            <h3
              style="font-family:var(--font-display);font-size:var(--fs-h3);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 1.25rem;line-height:1.15"
            >
              Dr. Ashley Roark, DMD
            </h3>
            <div class="team__bio">
              <BioParas paras={DOCTOR_BIO} />
            </div>
          </div>
        </div>

        {/* Nicole and Kelsey */}
        <div class="team__grid2">
          {TEAM.map((p) => (
            <article class="team__member reveal">
              <div class="team__photo">
                <Pic
                  name={p.photo}
                  alt={p.alt}
                  sizes="(max-width: 1000px) 100vw, 40vw"
                  widths={p.widths}
                  w={p.w}
                  h={p.h}
                />
              </div>
              <div class="team__meta">
                <h3 class="team__name">{p.name}</h3>
                <p class="team__role">{p.role}</p>
                <p class="team__short">{p.short}</p>
                <div class="team__bio">
                  <BioParas paras={p.bio} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* ── THE PRACTICE, IN ONE PARAGRAPH ───────────────────────────────── */}
    <section class="sec sec--cream cv" id="the-practice">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">The practice</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Small on purpose
            </h2>
            <p>
              Roark Orthodontics is a single-doctor practice, and that is a deliberate choice rather than a stage we
              are growing out of. It means your treatment does not get handed between providers, and it means the
              three of us know which chair you sat in last time.
            </p>
            <p>
              We treat children, teenagers and adults, in braces and with the full Invisalign® range, and we plan
              surgical cases together with your oral and maxillofacial surgeon. If a case needs someone else, we say
              so early rather than at the end.
            </p>
            <p style="margin-bottom:0">
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

          <figure class="split__media reveal" style="margin:0">
            <div class="frame-rose">
              <Pic
                name="family-roark"
                alt="Dr. Ashley Roark walking in the woods with her husband Brian and their daughters Margot and Sloane"
                sizes="(max-width: 1000px) 100vw, 50vw"
                widths={[480, 960, 1440]}
                w={1440}
                h={960}
                style="aspect-ratio:3 / 2"
              />
            </div>
            <figcaption class="photo-cap">
              Ashley, Brian, Margot and Sloane — out walking, which is where you will usually find them.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    {/* ── CONTACT ──────────────────────────────────────────────────────── */}
    <section class="sec sec--paper cv" id="contact">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Get in touch</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Questions about the practice, the team or the office?
            </h2>
            <p>
              Send a message here and one of us will reply by email — usually the same or next business day. If you
              already know you would like a time, the scheduler is quicker.
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

    {/* ── CLOSING ──────────────────────────────────────────────────────── */}
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
