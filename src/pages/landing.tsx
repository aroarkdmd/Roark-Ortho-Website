import type { FC } from 'hono/jsx'
import { BIZ, type Faq } from '../lib/site-data'
import { Icon, Ticks } from '../components/icons'
import { Pic } from '../components/chrome'
import { SectionHead, FaqList, ContactPanel } from '../components/blocks'
import { CompareTable } from './content'

/* ============================================================================
   GOOGLE ADS LANDING PAGES — /lp/invisalign-franklin and /lp/braces-franklin

   Rendered inside LandingLayout (src/layout.tsx): noindex, minimal header,
   no site navigation. One job: a consultation request from an ad click.

   CONTENT RULES (healthcare advertising):
     · Every fact here is already published on the organic pages: fees,
       timings, credentials, insurance, hours. Nothing new is claimed.
     · No reviews, ratings, star counts or before/after photos. None have been
       collected with patient permission yet. Add them when they have been,
       directly under the trust strip (see README).
     · No "best", "painless", "guaranteed" or "perfect smile".
     · Invisalign® is used as a trademark adjective.

   TRACKING: every Book link carries ?from=<slug>_<spot> (the analytics
   cta_location, also passed to the Wave scheduler as its source). On these
   pages app.js also copies gclid / gbraid / wbraid / utm_* onto every Book
   link, so the click ID reaches /book where the conversion fires.
   ========================================================================= */

type LpConfig = {
  slug: string
  eyebrow: string
  h1: string
  sub: string
  heroImg: string
  heroAlt: string
  heroCaptionTitle: string
  heroCaption: string
  promises: string[]
}

/* ── SHARED SECTIONS ─────────────────────────────────────────────────────── */

const BookButton: FC<{ slug: string; spot: string; label?: string; variant?: string; lg?: boolean }> = ({
  slug,
  spot,
  label = 'See exam times',
  variant = 'btn--rose',
  lg,
}) => (
  <a
    class={'btn ' + variant + (lg ? ' btn--lg' : '')}
    href={'/book?from=' + slug + '_' + spot}
    data-book={slug + '_' + spot}
  >
    <Icon name="calendar" size={12} /> {label}
  </a>
)

const CallButton: FC<{ slug: string; spot: string; variant?: string }> = ({ slug, spot, variant = 'btn--out' }) => (
  <a class={'btn ' + variant} href={BIZ.phoneHref} data-phone={slug + '_' + spot}>
    <Icon name="phone" size={11} /> Call or text {BIZ.phoneDisplay}
  </a>
)

const Hero: FC<{ c: LpConfig }> = ({ c }) => (
  <section class="lp__hero on-navy" aria-labelledby="lp-h1">
    <div class="wrap wrap-wide">
      <div class="lp__grid">
        <div class="lp__text">
          <span class="eb lp__eb">{c.eyebrow}</span>
          <h1 id="lp-h1">{c.h1}</h1>
          <p class="lp__sub">{c.sub}</p>
          <div class="lp__cta">
            <BookButton slug={c.slug} spot="hero" label="See exam times & book" lg />
            <CallButton slug={c.slug} spot="hero" />
          </div>
          <div class="lp__promise">
            {c.promises.map((p) => (
              <span>
                <Icon name="check" size={11} /> {p}
              </span>
            ))}
          </div>
          <div class="lp__trust">
            <span>Board certified, American Board of Orthodontics</span>
            <span>AAO member</span>
            <span>Invisalign® provider</span>
            <span>In-network with most PPO plans</span>
          </div>
        </div>
        <figure class="lp__media">
          <Pic
            name={c.heroImg}
            alt={c.heroAlt}
            eager
            sizes="(max-width: 1000px) 100vw, 50vw"
            widths={[480, 960]}
            w={960}
            h={720}
          />
          <figcaption>
            <b>{c.heroCaptionTitle}</b>
            {c.heroCaption}
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
)

/* Three reasons, all verifiable on the site. */
const TrustStrip: FC = () => (
  <section class="lp__truststrip" aria-label="Why families choose Roark Orthodontics">
    <div class="wrap wrap-wide">
      <div class="lp__trustgrid">
        <div>
          <div class="lp__trustic">
            <Icon name="star" size={15} />
          </div>
          <h2>A board-certified orthodontist</h2>
          <p>
            Dr. Ashley Roark is certified by the American Board of Orthodontics, after a three-year orthodontic
            residency at Montefiore Medical Center in New York.
          </p>
        </div>
        <div>
          <div class="lp__trustic">
            <Icon name="check" size={15} />
          </div>
          <h2>The same doctor at every visit</h2>
          <p>
            A single-doctor practice by choice. Dr. Roark sees every patient herself, so your treatment is never handed
            between providers.
          </p>
        </div>
        <div>
          <div class="lp__trustic">
            <Icon name="envelope" size={15} />
          </div>
          <h2>A written price before you decide</h2>
          <p>
            You leave the free exam with a written plan, the full fee, what your insurance covers and a monthly figure.
            Nothing is decided on the day.
          </p>
        </div>
      </div>
    </div>
  </section>
)

const MeetDoctor: FC<{ slug: string }> = ({ slug }) => (
  <section class="sec sec--paper cv">
    <div class="wrap wrap-wide">
      <div class="split">
        <div class="split__media lp__doc reveal">
          <Pic
            name="dr-roark"
            alt="Dr. Ashley Roark, board certified orthodontist at Roark Orthodontics in Franklin, Tennessee"
            sizes="(max-width: 1000px) 100vw, 50vw"
            widths={[480, 683]}
            w={683}
            h={911}
          />
        </div>
        <div class="reveal">
          <span class="eb">Your orthodontist</span>
          <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
            Dr. Ashley Roark, DMD
          </h2>
          <p>
            Dr. Roark earned her dental degree at the University of Louisville and practiced as a general dentist for
            three years before completing a three-year orthodontic residency at Montefiore Medical Center in New York
            City. She is board certified by the American Board of Orthodontics.
          </p>
          <p>
            She opened Roark Orthodontics on East Main Street in 2024, and lives in Brentwood with her family. Her team
            of three is the same team you will see at every visit.
          </p>
          <Ticks
            items={[
              'Board certified, American Board of Orthodontics',
              'Member, American Association of Orthodontists and American Dental Association',
              'Treats children, teenagers and adults',
            ]}
          />
          <div style="margin-top:1.75rem">
            <BookButton slug={slug} spot="doctor" label="Book your free exam with Dr. Roark" variant="btn--pri" />
          </div>
        </div>
      </div>
    </div>
  </section>
)

const FirstVisit: FC<{ slug: string }> = ({ slug }) => (
  <section class="sec sec--cream cv">
    <div class="wrap wrap-wide">
      <SectionHead
        eyebrow="Your first visit"
        title="What happens at the free exam"
        body="About 45 minutes. No messy impression trays, no pressure, and no decision required on the day."
      />
      <div class="grid-3" style="margin-top:3rem">
        {[
          {
            icon: 'calendar',
            title: '1 · Pick a time',
            body: 'Choose a day and time online, or call or text the office. We are open Monday to Wednesday from 7:30am, so a visit before school or work is easy.',
          },
          {
            icon: 'star',
            title: '2 · Photos, an x-ray and a 3D scan',
            body: 'Dr. Roark takes photographs, an x-ray and a digital iTero scan, then talks through what she sees in plain language. The exam is free, with no obligation to treat.',
          },
          {
            icon: 'check',
            title: '3 · A written plan and price',
            body: 'You leave with a timeline, the full fee, what your insurance covers and a monthly payment figure if you want one. Sometimes the answer is that nothing is needed yet.',
          },
        ].map((s) => (
          <div class="card reveal lp__step" style="padding:2rem">
            <span class="lp__trustic" aria-hidden="true">
              <Icon name={s.icon} size={15} />
            </span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
      <p style="text-align:center;margin:2.5rem 0 0;font-size:var(--fs-body-sm)">
        <Icon name="pin" size={12} /> {BIZ.street}, downtown Franklin · free parking in front and in the 2nd Street garage
        across the street
      </p>
    </div>
  </section>
)

const CostSection: FC<{ slug: string; heading: string; body: string; extra: string[] }> = ({
  slug,
  heading,
  body,
  extra,
}) => (
  <section class="sec sec--paper cv">
    <div class="wrap wrap-wide">
      <div class="split" style="align-items:start">
        <div class="reveal">
          <span class="eb">Cost &amp; insurance</span>
          <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
            {heading}
          </h2>
          <p>{body}</p>
          <Ticks
            items={[
              'In-network with most major PPO plans. We check your benefits for you.',
              '0% interest monthly plans, with a down payment at the start',
              'HSA and FSA dollars welcome',
              'Sibling and family treatment discounts',
              ...extra,
            ]}
          />
        </div>
        <div class="reveal">
          <ContactPanel
            id={slug + '-contact'}
            location={slug + '_cost'}
            bookFrom={slug + '_cost'}
            title="Ask about cost or insurance"
            lede="Tell us your insurance and what you'd like to know, and we'll reply by email. Please don't include medical details."
          />
        </div>
      </div>
    </div>
  </section>
)

const FaqSection: FC<{ items: Faq[]; slug: string }> = ({ items, slug }) => (
  <section class="sec sec--cream cv">
    <div class="wrap wrap-text">
      <SectionHead eyebrow="Questions" title="Before you book" />
      <div style="margin-top:2.5rem">
        <FaqList items={items} idPrefix={slug + '-faq'} />
      </div>
    </div>
  </section>
)

const FinalCta: FC<{ slug: string; title: string }> = ({ slug, title }) => (
  <section class="sec sec--navy on-navy">
    <div class="wrap wrap-narrow center">
      <h2 class="h-section" style="margin-bottom:1rem">
        {title}
      </h2>
      <p style="margin-bottom:2rem">
        A free, 45-minute exam with Dr. Roark, and a written plan and price before you decide anything.
      </p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        <BookButton slug={slug} spot="final" label="See exam times" lg />
        <CallButton slug={slug} spot="final" />
      </div>
    </div>
  </section>
)

/* ── /lp/invisalign-franklin ─────────────────────────────────────────────── */

const INVISALIGN: LpConfig = {
  slug: 'lp_invisalign',
  eyebrow: 'Invisalign® · Downtown Franklin, TN',
  h1: 'Invisalign® in downtown Franklin, with a board-certified orthodontist',
  sub: 'A free exam with Dr. Ashley Roark, including a digital iTero scan, and a written plan and price before you decide. Most treatment is $3,400–$6,250, and aligners cost the same as braces here.',
  heroImg: 'invisalign-smile',
  heroAlt: 'A smiling woman holding a clear Invisalign® aligner',
  heroCaptionTitle: '$3,400–$6,250',
  heroCaption: 'Same fee for aligners and braces. One price covers every aligner and your first retainers.',
  promises: ['Free exam & 3D scan', 'Written price, no pressure', '0% interest plans'],
}

const INVISALIGN_FAQ: Faq[] = [
  {
    q: 'How much does Invisalign® cost in Franklin?',
    a: 'Most comprehensive treatment at our office is $3,400 to $6,250, the same range as braces, because we price by how complex the bite is rather than by the appliance. The fee covers records, the iTero scan, every aligner, your first set of retainers and the post-treatment check-ins. Your exact fee is given in writing at the free exam.',
  },
  {
    q: 'Am I a good candidate for Invisalign®?',
    a: 'Many adults and teenagers are, as long as the teeth and gums are healthy. Aligners need to be worn 20 to 22 hours a day to work. If braces would give you a more reliable result, Dr. Roark will tell you so at the exam.',
  },
  {
    q: 'How long does treatment take?',
    a: 'Most adult and teen aligner cases take 6 to 18 months. You change aligners every 7 days and come in every 8 to 12 weeks for a short check.',
  },
  {
    q: 'Does insurance cover Invisalign®?',
    a: 'Many dental plans with an orthodontic benefit cover aligners the same way they cover braces, often as a lifetime maximum. We are in-network with most major PPO plans and check your coverage before your first visit. Adult orthodontics is sometimes excluded, which we will tell you up front.',
  },
  {
    q: 'Is the first visit really free?',
    a: 'Yes. The new-patient exam, including photographs, an x-ray and the digital scan, is complimentary, and there is no obligation to start treatment.',
  },
]

export const LpInvisalignPage: FC = () => {
  const c = INVISALIGN
  return (
    <main id="main" class="lp">
      <Hero c={c} />
      <TrustStrip />

      <section class="sec sec--paper cv">
        <div class="wrap wrap-wide">
          <div class="split">
            <div class="reveal">
              <span class="eb">Is Invisalign® right for you?</span>
              <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
                Clear, removable, and honest about what it asks of you
              </h2>
              <p>
                Aligners are clear and come out to eat, brush and floss, so there are no food rules and no brackets. They
                are discreet at work, at school and in photos, though still visible up close.
              </p>
              <p>
                What they ask in return is wear time: about 20 to 22 hours a day. If your bite or your routine would be
                better served by braces, Dr. Roark will say so at the exam. Braces cost the same here, so the
                recommendation is about the result, not the fee.
              </p>
              <Ticks
                items={[
                  'Worn 20–22 hours a day, changed every 7 days',
                  'Office checks every 8–12 weeks',
                  'Most cases take 6–18 months',
                  'Digital iTero scan instead of impression trays',
                ]}
              />
            </div>
            <div class="reveal">
              <SectionHead eyebrow="Three systems" title="The right aligner for your age" narrow />
              <CompareTable
                head={['System', 'For', 'Typical length']}
                rows={[
                  ['Invisalign®', 'Adults', '6–18 months'],
                  ['Invisalign Teen®', 'Teenagers, with wear indicators', '6–18 months'],
                  ['Invisalign First®', 'Children about 7–10', '6–12 months'],
                ]}
                minWidth="0"
              />
            </div>
          </div>
        </div>
      </section>

      <MeetDoctor slug={c.slug} />
      <CostSection
        slug={c.slug}
        heading="Aligners cost the same as braces here"
        body="Comprehensive treatment at our office runs $3,400 to $6,250, whichever appliance you choose. One fee covers records, the iTero scan, every aligner, your first set of retainers and the post-treatment check-ins."
        extra={[]}
      />
      <FirstVisit slug={c.slug} />
      <FaqSection items={INVISALIGN_FAQ} slug={c.slug} />
      <FinalCta slug={c.slug} title="See whether Invisalign® is right for you" />
    </main>
  )
}

/* ── /lp/braces-franklin ─────────────────────────────────────────────────── */

const BRACES: LpConfig = {
  slug: 'lp_braces',
  eyebrow: 'Braces · Downtown Franklin, TN',
  h1: 'Braces for kids, teens and adults in downtown Franklin',
  sub: 'Metal or tooth-colored braces, planned and adjusted by the same board-certified orthodontist at every visit. A free exam, a written fee, and 0% interest plans.',
  heroImg: 'braces-girl',
  heroAlt: 'A smiling girl with braces looking in a mirror',
  heroCaptionTitle: '$3,400–$6,250',
  heroCaption: 'Same fee for metal and clear braces. Adjustments, retainers and broken brackets included.',
  promises: ['Free exam & 3D scan', 'Written price, no pressure', '0% interest plans'],
}

const BRACES_FAQ: Faq[] = [
  {
    q: 'How much do braces cost in Franklin?',
    a: 'Most comprehensive treatment at our office is $3,400 to $6,250, the same for metal braces, clear braces and aligners, because we price by how complex the bite is. The fee covers records, the appliances, every adjustment, your first retainers and post-treatment check-ins. A shorter early (Phase 1) treatment for younger children is $1,900 to $3,400.',
  },
  {
    q: 'When should my child first see an orthodontist?',
    a: 'The American Association of Orthodontists recommends a first check by age 7. Most of those visits end with no treatment at all, just a baseline and a plan to watch. The screening is free.',
  },
  {
    q: 'How long will braces take?',
    a: 'Comprehensive treatment usually takes 18 to 24 months, with short adjustment visits every 6 to 8 weeks.',
  },
  {
    q: 'What is the difference between metal and clear braces?',
    a: 'Metal braces use stainless steel brackets. Clear braces use tooth-colored ceramic brackets, which are much less noticeable, though still visible up close. They work the same way and cost the same at our office.',
  },
  {
    q: 'What if a bracket breaks?',
    a: 'Call the office and we will get you in. There is no separate charge for a broken bracket, and the fee does not change if treatment runs longer than estimated.',
  },
]

export const LpBracesPage: FC = () => {
  const c = BRACES
  return (
    <main id="main" class="lp">
      <Hero c={c} />
      <TrustStrip />

      <section class="sec sec--paper cv">
        <div class="wrap wrap-wide">
          <div class="split">
            <div class="reveal">
              <span class="eb">Metal or clear</span>
              <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
                Fixed braces that work at every age
              </h2>
              <p>
                Braces are fixed to the teeth, so they keep working whether or not anyone remembers to wear something.
                That makes them a reliable choice for children and teens, for complex bites, and for adults who would
                rather not manage a tray.
              </p>
              <p>
                Choose stainless steel brackets or tooth-colored ceramic ones. Both work the same way, and both cost the
                same here.
              </p>
              <Ticks
                items={[
                  'For children, teenagers and adults',
                  'Most treatment takes 18–24 months',
                  'Short adjustment visits every 6–8 weeks',
                  'First check recommended by age 7 (AAO)',
                ]}
              />
            </div>
            <div class="reveal">
              <SectionHead eyebrow="Compare" title="Metal and clear braces" narrow />
              <CompareTable
                head={['Feature', 'Metal braces', 'Clear braces']}
                rows={[
                  ['Brackets', 'Stainless steel', 'Tooth-colored ceramic'],
                  ['Appearance', 'Visible', 'Much less noticeable'],
                  ['Best for', 'Any age, any bite', 'Teens and adults'],
                  ['Fee at our office', 'Same', 'Same'],
                ]}
                minWidth="0"
              />
            </div>
          </div>
        </div>
      </section>

      <MeetDoctor slug={c.slug} />
      <CostSection
        slug={c.slug}
        heading="One written fee, metal or clear"
        body="Comprehensive treatment at our office runs $3,400 to $6,250, the same whether you choose metal or clear. One fee covers records, the appliances, every adjustment, your first retainers and the post-treatment check-ins."
        extra={['No separate charge for a broken bracket']}
      />
      <FirstVisit slug={c.slug} />
      <FaqSection items={BRACES_FAQ} slug={c.slug} />
      <FinalCta slug={c.slug} title="Find out what your family actually needs" />
    </main>
  )
}
