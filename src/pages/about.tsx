import type { FC } from 'hono/jsx'
import { BIZ } from '../lib/site-data'
import { Icon } from '../components/icons'
import { Pic } from '../components/chrome'
import { SiloBanner, SectionHead, ContactPanel } from '../components/blocks'

/* ── ABOUT — THE TEAM ──────────────────────────────────────────────────────
   Laid out the way the practice's own site lays it out: one person per row,
   each row alternating sides, photograph beside the biography. Dr. Roark
   comes first with her portrait on the right; the family photograph follows
   on the left beside her paragraph about Brian, Margot and Sloane. Then
   Nicole, then Kelsey. Four rows, one person each — no feature block and no
   two-up grid, because the practice does not present the team that way.

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
   roarkortho.com. Dr. Roark's portrait was already in the photo set; Nicole's
   was recovered from the old site's Elementor background images and kept at
   its native 3:2; Kelsey's came from there too and is kept at 3:4. The family
   photograph — Ashley, Brian, Margot and Sloane walking in the woods — sits
   with her family paragraph, which is where the old site put it. Nothing here
   is stock and nobody's photo stands in for someone else's.

   `id="meet-the-team"` is on the team section because the old site linked to
   /about/#meet-the-team and the header/footer still do — see site-data.ts.  */

const BioParas: FC<{ paras: string[] }> = ({ paras }) => (
  <>
    {paras.map((p) => (
      <p>{p}</p>
    ))}
  </>
)

/* Dr. Roark's biography, split the way the old site split it: the career in
   one column, then the photograph, then the family paragraph in the next. */
const DOCTOR_BIO: string[] = [
  'Dr. Roark is passionate about creating beautiful smiles that inspire confidence. Born and raised in Middlesboro, Kentucky, she developed an early interest in helping others, which led her to earn her Bachelor of Science in Psychology from the University of Kentucky. While she loves her Kentucky Wildcats, she chose to pursue her dental degree at the University of Louisville, where her dedication to dentistry grew.',
  'After earning her degree, Dr. Roark practiced as a general dentist for three years. In her first job out of training she worked alongside an orthodontist and fell in love with the specialty. While it was not the most direct path to her dream career, her years as a general dentist help her view cases through a unique lens — she has seen these teeth from more than one angle.',
  'Dr. Roark completed a three-year orthodontic residency at Montefiore Medical Center in New York City, where she gained extensive training in all aspects of orthodontics, including complex surgical cases. Her work is board certified by the American Board of Orthodontics, and she treats children, teenagers and adults in braces and in the full Invisalign® range.',
]

const DOCTOR_FAMILY: string[] = [
  'She and her husband, Brian George, live in Brentwood with their two daughters, Margot and Sloane. When she is not crafting smiles she is outside with her family, traveling somewhere new, or stealing the mic for karaoke — even though she is the first to admit she cannot carry a tune.',
  'Dr. Roark is proud to serve the Franklin community and looks forward to helping your family achieve their healthiest, happiest smiles.',
]

/* Nicole and Kelsey. `short` is the one-line reason you are glad they are the
   one answering the phone; the biography follows underneath. */
type Person = {
  name: string
  role: string
  short: string
  photo: string
  widths: number[]
  w: number
  h: number
  ratio: string
  alt: string
  mediaFirst: boolean
  bio: string[]
}

const TEAM: Person[] = [
  {
    name: 'Nicole Zielinski',
    role: 'Registered Dental Assistant',
    short: 'Franklin born and raised, and the calm voice beside you in the chair.',
    photo: 'team-nicole',
    widths: [480, 960],
    w: 960,
    h: 640,
    ratio: 'ar-3-2',
    alt: 'Nicole Zielinski, registered dental assistant at Roark Orthodontics in Franklin, Tennessee',
    mediaFirst: false,
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
    ratio: 'ar-3-4',
    alt: 'Kelsey Gibson, patient coordinator at Roark Orthodontics in Franklin, Tennessee',
    mediaFirst: true,
    bio: [
      'Kelsey is the first face you will see when you step into the office. Originally from Michigan, she moved to Murfreesboro after graduating from Hope College. She has been working in administration and marketing ever since.',
      'Kelsey shares her home with her husband, their dog, and a three-legged cat.',
      'Outside of the office you can find her lost in a good book, crocheting, and being the coolest aunt to her five nieces and nephews. Kelsey is dedicated to ensuring that your journey to a new smile is as smooth, seamless and stress-free as possible.',
    ],
  },
]

/* One row: photograph on one side, biography on the other. `mediaFirst` flips
   the order so consecutive rows alternate, the way the old site does.

   `name` and `role` are optional because the family row has neither. On the
   practice's own site that row carries no heading at all — it is a
   continuation of Dr. Roark's section, with the photograph beside her
   paragraph about Brian, Margot and Sloane. Inventing a title for it would be
   putting words in the practice's mouth, so the photograph's caption does the
   identifying instead. */
const PersonRow: FC<{
  name?: string
  role?: string
  short?: string
  photo: string
  alt: string
  widths: number[]
  w: number
  h: number
  ratio: string
  mediaFirst?: boolean
  caption?: string
  children?: unknown
}> = ({ name, role, short, photo, alt, widths, w, h, ratio, mediaFirst, caption, children }) => (
  <article class={'person' + (mediaFirst ? ' person--media-first' : '')}>
    <div class="person__media">
      <div class={'person__frame ' + ratio}>
        <Pic name={photo} alt={alt} sizes="(max-width: 1000px) 100vw, 50vw" widths={widths} w={w} h={h} />
      </div>
      {caption && <p class="photo-cap">{caption}</p>}
    </div>
    <div class="person__body">
      {role && <span class="eb">{role}</span>}
      {name && <h3 class="person__name">{name}</h3>}
      {short && <p class="person__short">{short}</p>}
      <div class="person__bio">{children}</div>
    </div>
  </article>
)

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

        <div class="people">
          {/* Row 1 — Dr. Roark, photograph right */}
          <PersonRow
            role="Founder &amp; orthodontist"
            name="Dr. Ashley Roark, DMD"
            photo="dr-roark"
            alt="Dr. Ashley Roark, orthodontist and founder of Roark Orthodontics in Franklin, Tennessee"
            widths={[480, 683]}
            w={683}
            h={911}
            ratio="ar-3-4"
          >
            <BioParas paras={DOCTOR_BIO} />
          </PersonRow>

          {/* Row 2 — the family photograph, on the left, beside her family
              paragraph. This is where the practice's own site puts it, and it
              carries no heading there: the row is a continuation of her
              section, not a separate person. */}
          <PersonRow
            photo="family-roark"
            alt="Dr. Ashley Roark walking in the woods with her husband Brian and their daughters, Margot and Sloane"
            widths={[480, 960, 1440]}
            w={1440}
            h={960}
            ratio="ar-3-2"
            mediaFirst
            caption="Ashley, Brian, Margot and Sloane — out walking, which is where you will usually find them."
          >
            <BioParas paras={DOCTOR_FAMILY} />
          </PersonRow>

          {/* Rows 3 and 4 — Nicole, then Kelsey */}
          {TEAM.map((p) => (
            <PersonRow
              role={p.role}
              name={p.name}
              short={p.short}
              photo={p.photo}
              alt={p.alt}
              widths={p.widths}
              w={p.w}
              h={p.h}
              ratio={p.ratio}
              mediaFirst={p.mediaFirst}
            >
              <BioParas paras={p.bio} />
            </PersonRow>
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
                name="gallery-3"
                alt="The waiting room at Roark Orthodontics on East Main Street in downtown Franklin"
                sizes="(max-width: 1000px) 100vw, 50vw"
                widths={[480, 960]}
                w={960}
                h={640}
                style="aspect-ratio:3 / 2"
              />
            </div>
            <figcaption class="photo-cap">
              The waiting room on East Main Street. One office, three people, and the same chairs every visit.
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
