import type { FC } from 'hono/jsx'
import { BIZ, TREATMENTS, FIRST_FAQ, POSTS, SERVICE_AREAS, type Faq } from '../lib/site-data'
import { Icon, Ticks } from '../components/icons'
import { Pic } from '../components/chrome'
import { SectionHead, FaqList, SiloBanner, FactStrip, Callout, ContactPanel, CredentialsRow, InfoRow } from '../components/blocks'

const CLOSING_CTA: FC<{ from: string; title?: string; body?: string }> = ({
  from,
  title = 'Not sure which treatment you need?',
  body = 'The free exam includes a digital scan and a clear recommendation — including, sometimes, that nothing is needed yet.',
}) => (
  <section class="sec sec--rose on-rose">
    <div class="wrap wrap-narrow center">
      <h2 class="h-section" style="margin-bottom:1rem">
        {title}
      </h2>
      <p style="margin-bottom:2rem">{body}</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        <a class="btn btn--white" href={'/book?from=' + from} data-book={from}>
          <Icon name="calendar" size={12} /> Book a free consultation
        </a>
        <a class="btn btn--out" href={BIZ.phoneHref} data-phone={from}>
          <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
        </a>
      </div>
    </div>
  </section>
)

const CrossLinks: FC<{ links: { eyebrow: string; title: string; body: string; href: string; more: string }[] }> = ({
  links,
}) => (
  <section class="sec-sm sec--cream sec--hair">
    <div class="wrap wrap-wide">
      <div class="grid-3">
        {links.map((l) => (
          <a class="card" href={l.href} style="padding:2rem">
            <span class="eb">{l.eyebrow}</span>
            <h3 style="font-family:var(--font-display);font-size:var(--fs-h4);color:var(--navy-600);margin:0 0 .5rem">
              {l.title}
            </h3>
            <p style="font-size:var(--fs-body-sm)">{l.body}</p>
            <span class="post__more">
              {l.more} <Icon name="arrowRight" size={11} />
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
)

const CompareTable: FC<{ head: string[]; rows: string[][]; minWidth?: string }> = ({ head, rows, minWidth = '44rem' }) => (
  <div class="tw" style="margin-top:3rem;background:var(--white);border:1px solid var(--clay);border-radius:var(--r-md)">
    <table class="article" style={'margin:0;min-width:' + minWidth}>
      <thead>
        <tr>
          {head.map((h) => (
            <th>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr>
            {r.map((c, i) => (
              <td>{i === 0 ? <b>{c}</b> : c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

/* ══ TREATMENTS HUB ═══════════════════════════════════════════════════════ */
export const TreatmentsPage: FC = () => (
  <main id="main">
    <section class="sec-sm sec--cream sec--hair" style="padding-top:calc(var(--header-h) + 3rem)">
      <div class="wrap wrap-wide">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span>Treatments</span>
        </nav>
        <span class="eb">Treatment options</span>
        <h1 class="h-section" style="max-width:46rem;margin-bottom:1.25rem">
          Orthodontic treatment in Franklin, TN
        </h1>
        <p class="lead" style="max-width:54rem;margin-bottom:1rem">
          Braces are available at every age. Invisalign® is available for children, teens and adults, with each
          system matched to the stage of growth.
        </p>
        <p style="max-width:54rem">
          Which one you need is a clinical decision, not a preference. The free exam gives you a scan, a clear
          recommendation and a written price.
        </p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:2rem">
          <a class="btn btn--pri" href="/book?from=treatments_hero" data-book="treatments_hero">
            <Icon name="calendar" size={11} /> Book a free exam
          </a>
          <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="treatments_hero">
            <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
          </a>
        </div>
      </div>
    </section>

    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="grid-2">
          {TREATMENTS.map((t) => (
            <a class="card card--accent reveal" href={t.href}>
              <div class="card__img">
                <Pic name={t.img} alt={t.name} sizes="(max-width: 1000px) 100vw, 33vw" widths={[480, 960]} w={960} h={640} />
              </div>
              <div class="card__body">
                <span class="eb" style="margin-bottom:.6rem">
                  {t.audience}
                </span>
                <h3 style="font-size:var(--fs-h4)">{t.name}</h3>
                <p>{t.blurb}</p>
                <span class="post__more">
                  Learn more <Icon name="arrowRight" size={11} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="matrix">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Which appliance, which age"
          title="Compare your options"
          body="Braces work well at any age, and the bite, not the birthday, decides which treatment fits. Each aligner system is designed for a specific stage of growth, so your age group decides which one applies."
        />
        <CompareTable
          head={['Treatment', 'Children', 'Teens', 'Adults', 'Typical length']}
          rows={[
            ['Invisalign®', '—', '—', '✓', '6–18 months'],
            ['Invisalign Teen®', '—', '✓', '—', '6–18 months'],
            ['Invisalign First®', '✓', '—', '—', '6–12 months'],
            ['Metal braces', '✓', '✓', '✓', '18–24 months'],
            ['Clear (ceramic) braces', 'Sometimes', '✓', '✓', '18–24 months'],
            ['Palatal expander', '✓', 'Sometimes', '—', 'Weeks of turns, then holding'],
            ['Surgical orthodontics', '—', 'Sometimes', '✓', '18–30 months + surgery'],
          ]}
        />
      </div>
    </section>

    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Still deciding?"
          title="Who is being treated?"
          body="Start with the age group that applies to you."
        />
        <div class="path" style="margin-top:3rem">
          <a class="path__card path__card--kids" href="/kids-braces">
            <div class="path__media">
              <Pic name="family" alt="A mother and her daughter smiling together" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={640} />
              <span class="path__tag">For parents</span>
            </div>
            <div class="path__body">
              <span class="eb">Children &amp; teens</span>
              <h2 style="color:var(--navy-600)">Braces, Invisalign First® and Invisalign Teen® for kids</h2>
              <p>
                Children and teens often benefit from a first orthodontic check by age 7. We offer braces at every age
                and Invisalign First® and Invisalign Teen® for growing smiles. Your complimentary exam answers one
                question clearly: does your child need treatment now, or is it simply a good time to keep an eye on
                things?
              </p>
              <span class="path__go">
                See the options <Icon name="arrowRight" size={12} />
              </span>
            </div>
          </a>
          <a class="path__card path__card--adults" href="/adults">
            <div class="path__media">
              <Pic name="invisalign" alt="A clear Invisalign® aligner" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={640} />
              <span class="path__tag">For adults</span>
            </div>
            <div class="path__body">
              <span class="eb">Adults</span>
              <h2 style="color:var(--navy-600)">Invisalign®, braces and surgical orthodontics for adults</h2>
              <p>
                Every adult option, with a clear comparison, one fee for every appliance, and 0% interest plans
                after a down payment.
              </p>
              <span class="path__go">
                See the options <Icon name="arrowRight" size={12} />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <CLOSING_CTA from="treatments_cta" />

    <CrossLinks
      links={[
        {
          eyebrow: 'Also for children',
          title: 'Braces for kids & teens in Franklin',
          body: 'Metal and clear braces, and early screening from age 7.',
          href: '/kids-braces',
          more: "Kids' treatment options",
        },
        {
          eyebrow: 'Complex care',
          title: 'Surgical orthodontics',
          body: 'When the jaw, not the teeth, is the problem — planned with your oral surgeon.',
          href: '/surgical-orthodontics',
          more: 'How it works',
        },
        {
          eyebrow: 'Cost',
          title: 'What treatment costs, and how families pay',
          body: 'One fee for every appliance, insurance verified, 0% plans after a down payment.',
          href: '/financing',
          more: 'Cost & financing',
        },
      ]}
    />
  </main>
)

/* ══ KIDS & TEENS ═════════════════════════════════════════════════════════ */
const KIDS_FAQ: Faq[] = [
  {
    q: 'At what age should my child first see an orthodontist?',
    a: 'The American Association of Orthodontists recommends a first screening by age 7. At that age most children still have a mix of baby and adult teeth, which is exactly when jaw-growth problems are easiest to guide. Most of those visits end with no treatment at all — just a baseline and a plan to watch. Screenings at our office are complimentary.',
  },
  {
    q: 'Does my child need braces if the baby teeth are going to fall out anyway?',
    a: 'Not always, and that is precisely what the screening answers. Some problems — a crossbite, a very narrow upper arch, front teeth that sit far enough forward to be at risk of injury — are much easier to guide while the jaw is still growing. Others are best left until the adult teeth have arrived. We tell you which one you are looking at, and we are comfortable saying nothing is needed yet.',
  },
  {
    q: 'Braces or aligners for a teenager?',
    a: 'Both correct the same problems, so it usually comes down to the teenager. Aligners are clear and removable for sport and band, but they need around 20 to 22 hours of wear a day. Braces work regardless of compliance. We will show you both, and tell you honestly which we think will give a more reliable result for your child.',
  },
  {
    q: 'How long will my child be in treatment?',
    a: 'A first phase of early treatment usually runs 6 to 12 months. Comprehensive treatment once the adult teeth are through typically runs 18 to 24 months. Aligner cases often finish in 6 to 18 months. Your own estimate is given in writing at the free exam.',
  },
  {
    q: 'What does it cost, and does insurance help?',
    a: 'Comprehensive treatment at our office generally falls between $3,400 and $6,250, and a shorter early interceptive phase between $1,900 and $3,400. Most dental plans that include orthodontic benefits contribute toward either, usually from a lifetime orthodontic maximum. We verify your specific coverage and give you a written figure at the free exam.',
  },
]

export const KidsPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="family"
      imgAlt="A mother and her daughter smiling together"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Kids & Teens' }]}
      h1="Orthodontics for Kids & Teens in Franklin, TN"
      sub="The American Association of Orthodontists recommends a first screening by age 7, while growth can still be guided. We offer braces at every age and Invisalign First® and Invisalign Teen® for growing smiles. Your complimentary exam tells you whether treatment is needed now."
      eager
    />

    <FactStrip
      items={[
        ['First screening', 'Age 7', 'The age the American Association of Orthodontists recommends, while growth can still be guided.'],
        ['Treatment length', '6–24 months', 'A first phase runs 6–12 months; comprehensive treatment 18–24 months.'],
        ['The exam', 'No charge', 'Photographs, an x-ray and a digital iTero scan, with a written plan before you decide.'],
      ]}
    />

    <section class="sec sec--paper cv" id="signs">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="What to look for at home"
          title="Six signs to look for at home"
          body="Most children who need early treatment show at least one of these. None is a diagnosis on its own."
        />
        <div class="grid-3" style="margin-top:3rem">
          {[
            ['Early or late loss of baby teeth', 'Losing the first tooth before 4, or still having baby teeth at 13, is worth a look.'],
            ['Crowding or overlapping teeth', 'Adult teeth arriving behind, above or in front of the baby teeth.'],
            ['A bite that does not meet', 'Front teeth that do not touch when the back teeth are closed, or a lower jaw that sits to one side.'],
            ['Mouth breathing or snoring', 'Persistent mouth breathing can be related to a narrow upper arch.'],
            ['Thumb or finger sucking past 4', 'Continued sucking past four can change how the front of the mouth develops.'],
            ['Chewing or speech difficulty', 'Trouble biting through food, or a lisp that has not resolved.'],
          ].map(([t, b]) => (
            <div class="card reveal" style="padding:1.75rem">
              <h3 style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .5rem">
                {t}
              </h3>
              <p style="font-size:var(--fs-body-sm);margin:0">{b}</p>
            </div>
          ))}
        </div>
        <Callout max="54rem">
          <b>Nothing here is a diagnosis.</b> Only a screening can tell you what your child needs. It is complimentary,
          takes about 45 minutes, and most visits end with a plan to watch rather than a plan to treat.
        </Callout>
      </div>
    </section>

    <section class="sec sec--cream cv" id="options">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Treatment options"
          title="Every option, matched to your child's age"
          body="Braces work well at any age. Each aligner system is designed for a particular stage of growth."
        />
        <div class="grid-3" style="margin-top:3rem">
          {[
            ['Metal braces', 'The proven option, chosen by the bite rather than the age. A reliable choice at any age.'],
            ['Clear braces', 'Tooth-colored brackets that are less visible, with the same dependable mechanics as metal.'],
            ['Invisalign First®', 'Clear aligners designed for growing mouths, typically from about age 7 to 10.'],
            ['Invisalign Teen®', 'Clear, removable aligners built for teenage life, with wear tracked at each visit.'],
            ['Palatal expander', 'A fixed appliance that gently widens a narrow upper jaw while the growth center is still open.'],
          ].map(([t, b]) => (
            <div class="card reveal" style="padding:1.75rem">
              <h3 style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .5rem">
                {t}
              </h3>
              <p style="font-size:var(--fs-body-sm);margin:0">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">The first visit</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              A screening takes about 45 minutes
            </h2>
            <p>
              There are no impression trays and no needles. We take photographs and a digital scan with our
              iTero scanner, and Dr. Roark reviews how the bite closes and how the jaw is developing.
            </p>
            <Ticks
              items={[
                'Complimentary — no charge for the screening itself',
                'Photographs and a digital iTero scan, no messy impression trays',
                'A clear answer: nothing needed yet, watch and re-check, or treat now',
                'A written fee and what your dental plan contributes, before you decide',
                'Dr. Roark sees every patient herself, at every visit',
              ]}
            />
            <p style="margin-top:1.5rem">
              Our office is at 212 E Main St, Ste 100 in historic downtown Franklin, with free parking in front of
              the office and in the 2nd Street garage across the street. Open Monday to Wednesday, 7:30am to 4:00pm.
            </p>
            <a class="btn btn--pri" href="/book?from=kids_visit" data-book="kids_visit" style="margin-top:1.5rem">
              <Icon name="calendar" size={11} /> Book a free screening
            </a>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic name="gallery-1-storefront" alt="The Roark Orthodontics storefront on East Main Street" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={640} />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="cost">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Cost &amp; insurance</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              What kids’ treatment costs in Franklin
            </h2>
            <p>
              A comprehensive phase at our office generally runs <b>$3,400 to $6,250</b>, and a shorter early
              interceptive phase <b>$1,900 to $3,400</b>. We will tell you at the screening whether we expect a
              second phase to be needed.
            </p>
            <Ticks
              items={[
                'One fee covering records, the scan, all appliances and the first retainers',
                '0% interest plans — down payment at the start',
                'Sibling and family treatment discounts',
                'HSA and FSA dollars welcome',
              ]}
            />
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem">
              <a class="btn btn--out-ink" href="/financing">
                Full cost breakdown <Icon name="arrowRight" size={11} />
              </a>
              <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="kids_cost">
                <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
              </a>
            </div>
          </div>
          <div class="reveal">
            <ContactPanel
              id="kids-contact"
              location="kids_cost"
              title="Ask us anything"
              lede="A question about your child's bite, timing or cost? Send it here and we will reply by email."
            />
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--paper cv" id="faq">
      <div class="wrap wrap-narrow">
        <SectionHead eyebrow="Parents usually ask" title="Common questions from Franklin parents" narrow />
        <div style="margin-top:2.5rem">
          <FaqList items={KIDS_FAQ} idPrefix="kidsfaq" />
        </div>
      </div>
    </section>

    <CLOSING_CTA from="kids_cta" title="Let's find out what your child needs" body="Book a complimentary screening and you'll leave with a clear picture of where your child stands." />

    <CrossLinks
      links={[
        { eyebrow: 'Children', title: 'Invisalign First® for kids', body: 'Clear aligners designed specifically for growing mouths.', href: '/invisalign-first', more: 'Aligners for children' },
        { eyebrow: 'Children', title: 'Palatal expander', body: 'A fixed appliance that gently widens a narrow upper jaw.', href: '/palatal-expander', more: 'How it works' },
        { eyebrow: 'All ages', title: 'What treatment costs', body: 'One fee for every appliance, insurance verified, 0% plans.', href: '/financing', more: 'Cost & financing' },
      ]}
    />
  </main>
)

/* ══ ADULTS ═══════════════════════════════════════════════════════════════ */
const ADULT_FAQ: Faq[] = [
  {
    q: 'Is it too late to start in my 40s or 50s?',
    a: 'Not at all. Teeth move at any age, as long as your teeth and gums are healthy. Adult treatment typically runs 6 to 18 months.',
  },
  {
    q: 'Will anyone notice I am wearing braces?',
    a: 'Clear aligners are the more aesthetic option, since they are clear and removable. Clear (ceramic) braces use tooth-colored brackets, so they are much less visible than metal, though they are still visible up close. We will be honest with you about what to expect from either one.',
  },
  {
    q: 'Can adults use Invisalign®?',
    a: 'Yes. Invisalign® is the adult system in our aligner range. Teenagers are treated with Invisalign Teen®, and children with Invisalign First®.',
  },
  {
    q: 'What if I need jaw surgery?',
    a: "For a small number of adults, the problem is the position or size of the jaw rather than the teeth, and moving teeth alone won't correct it. In those cases we plan surgical orthodontics with an oral and maxillofacial surgeon. Most adult cases need no surgery at all.",
  },
  {
    q: 'How much does adult treatment cost?',
    a: 'Most treatment at our office falls between $3,400 and $6,250. That range is the same for metal braces, clear braces and Invisalign®, because we price by how complex your bite is, not by the appliance you choose. Your exact fee is quoted in writing at the free exam.',
  },
  {
    q: 'Does insurance cover adult orthodontics?',
    a: 'Many adult dental plans exclude orthodontics entirely, which does not change whether treatment is possible — only how it is paid for. We are in-network with most major PPO plans that do carry orthodontic benefits, and we will verify your specific coverage and give you the same written quote either way.',
  },
]

export const AdultsPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="invisalign"
      imgAlt="A clear Invisalign® aligner held up to the light"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Adults' }]}
      h1="Orthodontics for Adults in Franklin, TN: Braces & Invisalign®"
      sub="Braces, or clear, removable Invisalign® aligners that suit work and everyday life. One fee whichever you choose, and a written price before you commit."
      eager
    />

    <FactStrip
      items={[
        ['Typical length', '6–18 months', 'Most adult cases, depending on how much movement is needed.'],
        ['The fee', 'One price', 'The same range for braces, clear braces or aligners — priced by complexity.'],
        ['Payment', '0% interest', 'Monthly plans with a down payment at the start.'],
      ]}
    />

    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Adult treatment</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              It is never too late — as long as your teeth and gums are healthy
            </h2>
            <p>
              Teeth move at any age. What changes is how treatment fits around work, photographs, meetings and everyday life.
            </p>
            <p>
              Clear aligners and braces both straighten teeth and correct the bite, so the right choice comes down to
              your lifestyle. Clear aligners are removable, so you can eat and drink normally, while braces stay in
              place throughout treatment. Clear (ceramic) brackets are much less visible than metal.
            </p>
            <p>
              A small number of adult cases need more than tooth movement. Where the jaw itself is the issue, we plan
              <a href="/surgical-orthodontics">surgical orthodontics</a> with an oral and maxillofacial surgeon.
            </p>
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.5rem">
              <a class="btn btn--pri" href="/book?from=adults_hero" data-book="adults_hero">
                <Icon name="calendar" size={11} /> Book a free exam
              </a>
              <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="adults_hero">
                <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
              </a>
            </div>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic name="invisalign" alt="A clear Invisalign® aligner" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={640} />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="compare">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="How we decide"
          title="Aligners or braces — the honest comparison"
          body="Both straighten teeth and correct the bite. Each has its own strengths, and the right choice depends on your lifestyle."
        />
        <CompareTable
          head={['Consideration', 'Invisalign®', 'Braces']}
          rows={[
            ['Visibility', 'Clear; the more aesthetic option', 'Metal is visible; clear brackets much less so'],
            ['Removable', 'Yes — out to eat and to brush', 'No'],
            ['Eating', 'Trays out for meals', 'Avoid hard, sticky foods'],
            ['Cleaning teeth', 'Normal brushing and flossing', 'Extra care around brackets'],
            ['Depends on', '20–22 hours of wear a day', 'Regular wear is not required'],
            ['Best for', 'Adults who will keep trays in', 'Adults who would rather not manage trays'],
          ]}
          minWidth="40rem"
        />
      </div>
    </section>

    <section class="sec sec--paper cv" id="cost">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Cost &amp; insurance</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              What adult treatment costs in Franklin
            </h2>
            <p>
              Most adult treatment falls between <b>$3,400 and $6,250</b> — the same range for metal braces, clear
              braces and Invisalign®. That fee covers records, the iTero scan, every adjustment, your first set of
              retainers and the post-treatment check-ins.
            </p>
            <Ticks
              items={[
                'One fee for every appliance — we price by complexity, not by product',
                '0% interest plans — down payment at the start',
                'HSA and FSA dollars welcome',
                'Insurance verified before your first visit',
              ]}
            />
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem">
              <a class="btn btn--out-ink" href="/financing">
                Cost &amp; payment details <Icon name="arrowRight" size={11} />
              </a>
              <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="adults_cost">
                <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
              </a>
            </div>
          </div>
          <div class="reveal">
            <ContactPanel
              id="adults-contact"
              location="adults_page"
              bookFrom="adults_page"
              title="Ask us about adult treatment"
              lede="A question about your bite, your options or the fee? Send it here and we will reply by email."
            />
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="faq">
      <div class="wrap wrap-narrow">
        <SectionHead eyebrow="Adults usually ask" title="Common questions from adults" narrow />
        <div style="margin-top:2.5rem">
          <FaqList items={ADULT_FAQ} idPrefix="adultfaq" />
        </div>
      </div>
    </section>

    <CLOSING_CTA from="adults_cta" title="Ready to see what is possible?" body="The free exam includes a digital scan and a written plan with fees." />

    <CrossLinks
      links={[
        { eyebrow: 'Adults', title: 'Invisalign® clear aligners', body: 'The adult system in the aligner range — clear and removable.', href: '/invisalign', more: 'Aligners for adults' },
        { eyebrow: 'Teens & adults', title: 'Surgical orthodontics', body: 'When jaw surgery and orthodontics are planned together.', href: '/surgical-orthodontics', more: 'How it works' },
        { eyebrow: 'All ages', title: 'What treatment costs', body: 'One fee for every appliance, insurance verified, 0% plans.', href: '/financing', more: 'Cost & financing' },
      ]}
    />
  </main>
)

/* ══ INVISALIGN FIRST ═════════════════════════════════════════════════════ */
export const InvisalignFirstPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="family"
      imgAlt="A mother and her daughter smiling together"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Treatments', href: '/treatments' }, { name: 'Invisalign First®' }]}
      h1="Invisalign First® for Kids in Franklin, TN"
      sub="Clear aligners made specifically for growing mouths — an alternative to early braces for many children."
      eager
    />

    <FactStrip
      items={[
        ['Best age range', '7–10 years', 'While adult teeth are still arriving and the jaw is still growing.'],
        ['Daily wear', '20–22 hours', 'Removable, so the trays come out for meals and brushing stays normal.'],
        ['Phase one length', '6–12 months', 'Often followed by a comprehensive phase once the adult teeth erupt.'],
      ]}
    />

    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Children's clear aligners</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Yes — Children Can Have Aligners
            </h2>
            <p>
              Parents are usually surprised to learn this, but Invisalign® makes an aligner system designed
              specifically for children, called <b>Invisalign First®</b>. It is not an adult tray scaled down. The
              aligners are shaped to fit a smaller mouth with baby teeth still present, and they can work around
              teeth that have not fully erupted yet.
            </p>
            <p>
              For crowding and spacing, that means we can guide the way the jaw develops <em>while</em> straightening
              the teeth — the same objective as early braces, reached differently.
            </p>
            <p>
              We recommend it often. It is comfortable, there is far less hardware to clean around than with
              brackets, and children generally find it easier to live with.
            </p>
            <Callout>
              <b>When braces make more sense.</b> Both reach similar results, so it usually comes down to your child.
              One who will not realistically keep trays in for 20 hours a day is better served by braces — we will
              talk it through at the screening.
            </Callout>
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.5rem">
              <a class="btn btn--pri" href="/book?from=if_hero" data-book="if_hero">
                <Icon name="calendar" size={11} /> Book a free screening
              </a>
              <a class="btn btn--out-ink" href="/braces">
                Compare with braces
              </a>
            </div>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic name="family" alt="A mother and her daughter smiling together" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={640} />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="treats">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="What it corrects"
          title="The problems Invisalign First® is designed for"
          body="Early treatment is about guiding growth, not just straightening teeth. These are the situations where aligners can help a growing child."
        />
        <div class="grid-3" style="margin-top:3rem">
          {[
            ['Crowding', 'Not enough room for the adult teeth coming through. Creating space early often prevents a tooth becoming impacted later.'],
            ['Excessive spacing', 'Some spacing is normal and healthy in children, but excessive gaps can affect how the bite develops.'],
            ['Narrow upper arch', 'Invisalign First® does not widen the upper jaw on its own, but it can be used together with a palatal expander to correct a narrow arch.'],
            ['Crossbite', 'Upper teeth sitting inside the lower. Easier to correct while the jaw can still be guided.'],
            ['Protruding front teeth', 'Front teeth that sit too far forward and are vulnerable to injury in sport or a fall.'],
            ['Eruption guidance', 'Steering adult teeth into the right position as they arrive, rather than correcting them afterwards.'],
          ].map(([t, b]) => (
            <div class="card reveal" style="padding:1.75rem">
              <h3 style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .5rem">
                {t}
              </h3>
              <p style="font-size:var(--fs-body-sm);margin:0">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section class="sec sec--paper cv" id="cost">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Cost &amp; insurance</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              What Invisalign First® costs in Franklin
            </h2>
            <p>
              Phase-one early treatment at our office generally runs <b>$1,900 to $3,400</b>. A comprehensive second
              phase, if one is needed once the adult teeth have erupted, runs <b>$3,400 to $6,250</b> — and we will
              tell you at the screening whether we expect that to be necessary.
            </p>
            <p>
              Most dental plans that include orthodontic benefits contribute toward early treatment, usually drawn
              from a lifetime orthodontic maximum. Our patient coordinator verifies your specific plan before the
              first visit.
            </p>
            <Ticks
              items={[
                'One fee covering records, the scan, all aligners and your first retainers',
                '0% interest plans — down payment at the start',
                'Sibling and family treatment discounts',
                'HSA and FSA dollars welcome',
              ]}
            />
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem">
              <a class="btn btn--out-ink" href="/blog/braces-cost-franklin">
                Full cost breakdown <Icon name="arrowRight" size={11} />
              </a>
              <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="if_cost">
                <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
              </a>
            </div>
          </div>
          <div class="reveal">
            <ContactPanel
              id="if-contact"
              location="if_cost"
              title="Ask about Invisalign First®"
              lede="A question about your child's case, timing or cost? Send it here and we will reply by email."
            />
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="faq">
      <div class="wrap wrap-narrow">
        <SectionHead eyebrow="Parents usually ask" title="Invisalign First® questions" narrow />
        <div style="margin-top:2.5rem">
          <FaqList items={FIRST_FAQ} idPrefix="iffaq" />
        </div>
      </div>
    </section>

    <CLOSING_CTA from="if_cta" title="An aligner made for a growing mouth" body="Book a complimentary screening and we will tell you whether aligners or braces suit your child better." />

    <CrossLinks
      links={[
        { eyebrow: 'Also for children', title: 'Braces for kids & teens in Franklin', body: 'Metal and clear braces, and early screening from age 7.', href: '/kids-braces', more: "Kids' treatment options" },
        { eyebrow: 'Franklin Orthodontics Blog', title: 'Aligners before braces: a parent’s guide', body: 'What Invisalign First® treats, at what age, and how it differs from adult aligners.', href: '/blog/invisalign-first-kids', more: 'Read the article' },
        { eyebrow: 'All options', title: 'Compare every treatment we offer', body: 'Braces, aligners, expanders and surgical orthodontics, side by side.', href: '/treatments', more: 'Treatment menu' },
      ]}
    />
  </main>
)

/* ══ BRACES / INVISALIGN / EXPANDER — treatment detail ════════════════════ */
export const BracesPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="braces"
      imgAlt="Braces on a model of teeth in the Roark Orthodontics treatment room"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Treatments', href: '/treatments' }, { name: 'Braces' }]}
      h1="Braces in Franklin, TN — Metal & Clear, Every Age"
      sub="A proven, reliable option, chosen by the bite rather than the age. Metal or tooth-colored ceramic, and a perfectly reasonable choice at any age."
      eager
    />
    <FactStrip
      items={[
        ['Typical length', '18–24 months', 'Comprehensive treatment once the adult teeth are through.'],
        ['Adjustments', 'Every 6–8 weeks', 'Short visits to change the wire and check progress.'],
        ['The fee', '$3,400–$6,250', 'The same range as aligners — priced by complexity, not appliance.'],
      ]}
    />
    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Braces</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Fixed braces that work at every stage
            </h2>
            <p>
              Braces are fixed to the teeth, so they work regardless of how many hours a day anyone remembers to wear
              them. They are often used for complex bites, for impacted teeth, and by anyone who would rather not manage a tray.
            </p>
            <p>
              <b>Metal braces</b> use stainless brackets and a wire. <b>Clear (ceramic) braces</b> use tooth-colored
              brackets, which are much less visible — but they are still braces, and they are still visible up close.
            </p>
            <Ticks
              items={[
                'Open to children, teenagers and adults alike',
                'Adjustments every 6–8 weeks, in short visits',
                'Clear (ceramic) brackets available for all ages',
                'One fee covering records, appliances, adjustments and retainers',
              ]}
            />
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem">
              <a class="btn btn--pri" href="/book?from=braces_hero" data-book="braces_hero">
                <Icon name="calendar" size={11} /> Book a complimentary exam
              </a>
              <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="braces_hero">
                <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
              </a>
            </div>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic name="braces" alt="Braces on a model of teeth" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={640} />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="sec sec--cream cv">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Cost &amp; care</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              What braces cost, and what to expect
            </h2>
            <p>
              Comprehensive treatment runs <b>$3,400 to $6,250</b> — the same whether you choose metal or clear,
              because we price by how complex the bite is. Your fee includes records, the appliances, every
              adjustment, your first retainers and post-treatment check-ins.
            </p>
            <Ticks
              items={[
                '0% interest plans — down payment at the start',
                'In-network with most major PPO plans',
                'HSA and FSA dollars welcome',
                'No separate charge for a broken bracket',
              ]}
            />
          </div>
          <div class="reveal">
            <ContactPanel id="braces-contact" location="braces_cost" title="Ask about braces" lede="A question about brackets, timing or cost? Send it here and we will reply by email." />
          </div>
        </div>
      </div>
    </section>
    <CLOSING_CTA from="braces_cta" />
    <CrossLinks
      links={[
        { eyebrow: 'All ages', title: 'Invisalign® clear aligners', body: 'Three systems, one for each stage of growth.', href: '/invisalign', more: 'Aligners for every age' },
        { eyebrow: 'Children', title: 'Braces for kids & teens', body: 'Early screening from age 7, and both options open at every age.', href: '/kids-braces', more: "Kids' treatment options" },
        { eyebrow: 'Cost', title: 'What treatment costs', body: 'One fee for every appliance, insurance verified, 0% plans.', href: '/financing', more: 'Cost & financing' },
      ]}
    />
  </main>
)

export const InvisalignPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="invisalign"
      imgAlt="A clear Invisalign® aligner held up to the light"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Treatments', href: '/treatments' }, { name: 'Invisalign®' }]}
      h1="Invisalign® Clear Aligners in Franklin, TN"
      sub="Clear, removable, and the more aesthetic option at work or in photographs. Three systems, one for each stage of growth — and the adult one is Invisalign®."
      eager
    />
    <FactStrip
      items={[
        ['Typical length', '6–18 months', 'Aligner cases are often shorter than braces for the same correction.'],
        ['Wear time', '20–22 hours', 'Out for meals and brushing; changed every 7 days.'],
        ['Office checks', 'Every 8–12 weeks', 'Short visits to check fit and hand over the next sets.'],
      ]}
    />
    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Clear aligners</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Named by audience, not interchangeable
            </h2>
            <p>
              The aligner range is built in three systems and the names matter: <b>Invisalign®</b> is the adult
              system, <b>Invisalign Teen®</b> is for teenagers, and <b>Invisalign First®</b> is for children. Your
              age group decides which one applies.
            </p>
            <p>
              Aligners are clear, removable, and you eat and drink normally. They are the more aesthetic option at
              work, at school or in photographs — and they are still visible, particularly up close. What they ask
              in return is wear time: around 20 to 22 hours a day, changed every 7 days.
            </p>
            <Ticks
              items={[
                'Clear and removable — out to eat, brush and floss',
                'Changed every 7 days; office checks every 8–12 weeks',
                'Digital iTero scan instead of impression trays',
                'One fee covering all aligners and your first retainers',
              ]}
            />
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem">
              <a class="btn btn--pri" href="/book?from=invisalign_hero" data-book="invisalign_hero">
                <Icon name="calendar" size={11} /> Book a free exam
              </a>
              <a class="btn btn--out-ink" href="/braces">
                Compare with braces
              </a>
            </div>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic name="invisalign" alt="A clear Invisalign® aligner" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={640} />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="sec sec--cream cv">
      <div class="wrap wrap-wide">
        <SectionHead eyebrow="Which system" title="The right aligner for each stage of growth" body="Choosing the wrong one is not a preference — it is a clinical mismatch." />
        <CompareTable
          head={['System', 'For', 'Typical length', 'Notes']}
          rows={[
            ['Invisalign®', 'Adults', '6–18 months', 'The adult system. Clear and removable; more aesthetic at work.'],
            ['Invisalign Teen®', 'Teenagers', '6–18 months', 'Compliance indicators so wear is visible at each visit.'],
            ['Invisalign First®', 'Children (7–10)', '6–12 months', 'Designed for growing mouths with baby teeth present.'],
          ]}
          minWidth="40rem"
        />
      </div>
    </section>
    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Cost</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              What aligners cost in Franklin
            </h2>
            <p>
              <b>$3,400 to $6,250</b> for comprehensive treatment, whichever appliance you choose — and aligners are
              not priced higher than braces. The fee covers records, the iTero scan, all aligners, your first set of
              retainers and the post-treatment check-ins.
            </p>
            <Ticks items={['0% interest plans — down payment at the start', 'In-network with most major PPO plans', 'HSA and FSA dollars welcome']} />
          </div>
          <div class="reveal">
            <ContactPanel
              id="invisalign-contact"
              location="invisalign"
              bookFrom="invisalign"
              title="Ask us about aligners"
              lede="A question about your case, your options or the fee? Send it here and we will reply by email."
            />
          </div>
        </div>
      </div>
    </section>
    <CLOSING_CTA from="invisalign_cta" />
  </main>
)

export const ExpanderPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="gallery-3"
      imgAlt="A treatment bay at Roark Orthodontics in downtown Franklin"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Treatments', href: '/treatments' }, { name: 'Palatal Expander' }]}
      h1="Palatal Expander for Children in Franklin, TN"
      sub="A fixed appliance that gently widens a narrow upper jaw — often the right answer for a crossbite while the growth center is still open."
      eager
    />
    <FactStrip
      items={[
        ['Best age range', '7–10 years', 'While the growth center of the upper jaw is still open.'],
        ['How long', 'Weeks of turns', 'Then the appliance stays in place to hold the new width while bone fills in.'],
        ['Turned at home', 'Twice a day', 'A small key, a quarter turn — we show you how before you start.'],
      ]}
    />
    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Palatal expander</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Widening the upper jaw while growth can still be guided
            </h2>
            <p>
              A narrow upper jaw is not simply a cosmetic matter. When the upper arch is too narrow for the lower,
              the upper teeth bite inside the lower ones — a crossbite — and the airway is often narrower than it
              should be. A palatal expander applies gentle, controlled pressure across the roof of the mouth to
              widen the arch.
            </p>
            <p>
              It works because the suture between the two halves of the upper jaw has not yet fused. After growth
              finishes, that same widening usually requires surgery, which is why timing matters.
            </p>
            <Ticks
              items={[
                'A fixed appliance — nothing to remember to wear',
                'Parents turn it at home, twice a day, with a small key',
                'Often used alongside Invisalign First® or braces',
                'Holding period afterwards while new bone fills the gap',
              ]}
            />
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem">
              <a class="btn btn--pri" href="/book?from=expander_hero" data-book="expander_hero">
                <Icon name="calendar" size={11} /> Book a free screening
              </a>
              <a class="btn btn--out-ink" href="/kids-braces">
                Kids' treatment options
              </a>
            </div>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic name="family" alt="A mother and her daughter smiling together" sizes="(max-width: 1000px) 100vw, 50vw" widths={[480, 960]} w={960} h={640} />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="sec sec--cream cv">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Questions</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Ask about your child's arch
            </h2>
            <p>
              Whether an expander is appropriate depends on the width of the arch, the way the back teeth meet, and
              how much growth is left. A screening with photographs and a scan answers it.
            </p>
            <Ticks items={['Complimentary screening — no charge', 'A written plan with fees before you decide', 'Dr. Roark sees every patient herself']} />
          </div>
          <div class="reveal">
            <ContactPanel id="expander-contact" location="expander_cost" title="Ask about expanders" lede="A question about your child's bite or timing? Send it here and we will reply by email." />
          </div>
        </div>
      </div>
    </section>
    <CLOSING_CTA from="expander_cta" />
  </main>
)

/* ══ FINANCING ════════════════════════════════════════════════════════════ */
const FIN_FAQ: Faq[] = [
  {
    q: 'How much do braces or Invisalign® cost in Franklin, TN?',
    a: 'Most treatment at our office falls between $3,400 and $6,250 — and that range is the same whether you choose metal braces, clear (ceramic) braces or Invisalign®. We do not price by appliance. What sets your fee is how complex the bite is. A shorter early interceptive phase is $1,900 to $3,400. Your exact fee is quoted in writing at the free exam.',
  },
  {
    q: 'Does the fee include everything, or are there extra charges?',
    a: 'It includes everything: your records (x-rays, photographs and the digital iTero scan), the appliance itself, every adjustment visit during treatment, your first set of retainers and the post-treatment check-ins. There is no separate charge for a broken bracket, and the fee does not change if treatment runs longer than estimated.',
  },
  {
    q: 'Does dental insurance cover braces or Invisalign®?',
    a: 'Many dental plans include an orthodontic benefit, and it often works as a lifetime maximum rather than a percentage of each visit. We are in-network with most major PPO plans that carry orthodontic benefits, and our patient coordinator verifies your specific coverage before your first visit so you already know your out-of-pocket figure when you arrive.',
  },
  {
    q: 'What if my plan has no orthodontic coverage?',
    a: 'That is common, and especially so for adults — many adult dental plans exclude orthodontics entirely. It does not change whether treatment is possible, only how it is paid for, which is exactly what the 0% interest payment plan is for. We will give you the same quote either way.',
  },
  {
    q: 'Is there a payment plan?',
    a: 'Yes. We offer 0% interest monthly payment plans. A down payment is due at the start of treatment, and the balance is spread across a term matched to your expected treatment length — so a 24-month case runs 24 months with no finance charge and no interest added. If you would rather settle the whole fee at once, we also offer a pay-in-full discount.',
  },
  {
    q: 'Can I use my HSA or FSA to pay for orthodontics?',
    a: 'Yes — orthodontic treatment is an eligible expense for both health savings accounts and flexible spending accounts, including group plans through an employer. If your FSA plan year is about to reset, we can time treatment so more of the fee falls inside a single plan year.',
  },
  {
    q: 'Do you offer a discount if more than one child needs treatment?',
    a: 'Yes. When more than one child in a family is in treatment we apply a sibling discount to the additional cases. It is applied automatically to the second and subsequent cases, and it is worth mentioning at the first visit so the quote reflects it.',
  },
  {
    q: 'How does insurance work for jaw surgery?',
    a: "The orthodontic work is usually claimed against your dental plan's orthodontic benefit, and we verify that for you. Insurance for the surgery itself is handled by the surgeon's office.",
  },
]

export const FinancingPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="treatment-header"
      imgAlt="Inside the Roark Orthodontics practice"
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Financing' }]}
      h1="Orthodontic Cost, Insurance & Payment Plans in Franklin, TN"
      sub="One fee for every appliance, insurance checked before your first visit, and 0% interest payment plans with a down payment at the start."
    />

    <FactStrip
      items={[
        ['Comprehensive treatment', '$3,400–$6,250', 'The same range for braces, clear braces and aligners.'],
        ['Early interceptive phase', '$1,900–$3,400', 'Quoted separately from a later comprehensive phase.'],
        ['Payment plans', '0% interest', 'Down payment at the start, then monthly to the end of treatment.'],
      ]}
    />

    <section class="sec sec--paper cv" id="cost">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">What it costs</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Your fee depends on your bite, not your appliance
            </h2>
            <p>
              A mild crowding case and a case with a deep overbite, a crossbite and impacted teeth are not the same
              job. So the fee follows the complexity of the bite, and braces and aligners cost the same. That keeps
              the choice clinical rather than financial.
            </p>
            <p>
              Your written fee covers records, the iTero scan, the appliance, every adjustment, your first set of
              retainers and the post-treatment check-ins.
            </p>
            <Ticks
              items={[
                'One fee, quoted in writing at the free exam',
                'No separate charge for a broken bracket',
                'Sibling and family treatment discounts applied automatically',
              ]}
            />
          </div>
          <div class="reveal">
            <ContactPanel
              id="fin-contact"
              location="financing_cost"
              title="Ask about cost or insurance"
              lede="Send a question about fees, your plan or a payment plan and we will reply by email."
            />
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="insurance">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Insurance"
          title="In-network with most major PPO plans"
          body="We verify your specific benefit before the first visit, so you know your out-of-pocket figure before anything starts."
        />
        <div class="grid-3" style="margin-top:3rem">
          {[
            ['We check it for you', 'Our patient coordinator verifies your plan and shows you exactly what it covers — before your first visit, not after.'],
            ['Often a lifetime maximum', 'Many plans pay from a lifetime orthodontic maximum rather than a percentage per visit, so the number matters more than the percentage.'],
            ['Adults are often excluded', 'Many adult dental plans exclude orthodontics entirely. That changes how it is paid for, not whether treatment is possible.'],
          ].map(([t, b]) => (
            <div class="card reveal" style="padding:2rem">
              <h3 style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .5rem">{t}</h3>
              <p style="font-size:var(--fs-body-sm);margin:0">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section class="sec sec--paper cv" id="plans">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Paying for it"
          title="0% interest, with a down payment at the start"
          body="A down payment when treatment starts, then the balance spread across the months of treatment — with no finance charge added."
        />
        <div class="grid-3" style="margin-top:3rem">
          {[
            ['0% interest plans', 'A 24-month case runs 24 months with no interest added. Set-up is simple at the office.'],
            ['Pay in full', 'A pay-in-full discount is available if you would rather settle the whole fee at once.'],
            ['HSA and FSA', 'Orthodontic treatment is an eligible expense for both. We can time treatment around your plan year.'],
          ].map(([t, b]) => (
            <div class="card reveal" style="padding:2rem">
              <h3 style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .5rem">{t}</h3>
              <p style="font-size:var(--fs-body-sm);margin:0">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="faq">
      <div class="wrap wrap-narrow">
        <SectionHead eyebrow="Common questions" title="Cost, insurance and payment" narrow />
        <div style="margin-top:2.5rem">
          <FaqList items={FIN_FAQ} idPrefix="finfaq" />
        </div>
      </div>
    </section>

    <CLOSING_CTA from="financing_cta" title="Get a written price before you decide" body="The free exam ends with a treatment plan, a fee breakdown and what your insurance contributes." />
  </main>
)

/* ══ AREAS WE SERVE ═══════════════════════════════════════════════════════ */
export const AreasPage: FC = () => (
  <main id="main">
    <section class="sec-sm sec--cream sec--hair" style="padding-top:calc(var(--header-h) + 3rem)">
      <div class="wrap wrap-wide">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span>Areas we serve</span>
        </nav>
        <span class="eb">Franklin &amp; Williamson County</span>
        <h1 class="h-section" style="max-width:44rem;margin-bottom:1.25rem">
          An easy drive from across Williamson County
        </h1>
        <p class="lead" style="max-width:54rem">
          The office is on East Main Street in historic downtown Franklin, with free parking in front of the
          building and in the 2nd Street garage across the street. Most of our patients are within about fifteen
          minutes.
        </p>
      </div>
    </section>

    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Where our patients come from</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.5rem">
              Communities we treat
            </h2>
            <div class="prox__cities" style="gap:.6rem 1.5rem">
              {SERVICE_AREAS.map((a) => (
                <span style="font-size:var(--fs-body-sm);color:var(--ink-700)">{a}</span>
              ))}
            </div>
            <div style="display:grid;gap:1.5rem;margin-top:2.5rem">
              <InfoRow icon="pin" title="The office">
                {BIZ.street}
                <br />
                {BIZ.city}, {BIZ.region} {BIZ.postal}
              </InfoRow>
              <InfoRow icon="clock" title="Hours">
                Monday to Wednesday, 7:30am – 4:00pm. Closed Thursday to Sunday.
              </InfoRow>
              <InfoRow icon="directions" title="Parking">
                Free parking in front of the office (please avoid the spaces marked reserved on the other side of
                the building), on Main Street, and in the 2nd Street garage across the street.
              </InfoRow>
            </div>
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:2rem">
              <a class="btn btn--pri" href="/book?from=areas" data-book="areas">
                <Icon name="calendar" size={11} /> Book a free exam
              </a>
              <a class="btn btn--out-ink" href={BIZ.gbp} target="_blank" rel="noopener">
                <Icon name="directions" size={11} /> Get directions
              </a>
            </div>
          </div>
          <div class="reveal">
            <div
              class="mapfacade"
              id="mapfacade-areas"
              data-src={
                'https://www.google.com/maps?q=' +
                encodeURIComponent(BIZ.name + ' ' + BIZ.street + ', ' + BIZ.city + ', ' + BIZ.region) +
                '&output=embed'
              }
              style="height:28rem"
            >
              <Icon name="pin" size={30} />
              <b>212 E Main St, Ste 100</b>
              <span>Click to load the Google Map · downtown Franklin, TN</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CLOSING_CTA from="areas_cta" title="Fifteen minutes from most of the county" body="Book a complimentary exam and you will leave with a written plan and price." />
  </main>
)

/* ══ BLOG INDEX ═══════════════════════════════════════════════════════════ */
export const BlogPage: FC = () => (
  <main id="main">
    <section class="sec-sm sec--cream sec--hair" style="padding-top:calc(var(--header-h) + 3rem)">
      <div class="wrap wrap-wide">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span>Franklin Orthodontics Blog</span>
        </nav>
        <span class="eb">Franklin Orthodontics Blog</span>
        <h1 class="h-section" style="max-width:44rem;margin-bottom:1rem">
          Braces and Invisalign advice for Franklin families
        </h1>
        <p class="lead" style="max-width:52rem">
          What treatment really costs, when to bring your child in, and how we choose between aligners and braces.
        </p>
      </div>
    </section>

    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="posts">
          {POSTS.map((p) => (
            <a class="post" href={p.href}>
              <div class="post__img">
                <img src={p.imgSm} srcset={p.imgSm + ' 480w, ' + p.img + ' 960w'} sizes="(max-width: 768px) 100vw, 33vw" alt={p.alt} loading="lazy" decoding="async" />
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
      </div>
    </section>

    <CLOSING_CTA from="blog_cta" title="Still have a question?" body="Send it through the contact form, or book a complimentary exam and ask Dr. Roark directly." />
  </main>
)

/* ══ BLOG ARTICLE ══════════════════════════════════════════════════════════ */
export const BlogArticlePage: FC<{ post: (typeof POSTS)[number]; body: { h: string; p: string[] }[] }> = ({ post, body }) => (
  <main id="main">
    <section class="sec-sm sec--cream sec--hair" style="padding-top:calc(var(--header-h) + 3rem)">
      <div class="wrap wrap-narrow">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <a href="/blog">Franklin Orthodontics Blog</a>
          <span aria-hidden="true">/</span>
          <span>{post.tag}</span>
        </nav>
        <span class="eb">
          {post.tag} · {post.mins} min read
        </span>
        <h1 class="h-section" style="margin-bottom:1rem">
          {post.title}
        </h1>
        <p class="lead">{post.ex}</p>
        <p class="caption" style="margin-top:1.5rem">
          {post.dateText} · {BIZ.doctor}
        </p>
      </div>
    </section>

    <section class="sec sec--paper cv">
      <div class="wrap wrap-narrow">
        <article class="article">
          <img src={post.img} alt={post.alt} style="width:100%;border-radius:var(--r-xs);margin-bottom:2rem" loading="lazy" decoding="async" />
          {body.map((s) => (
            <>
              <h2>{s.h}</h2>
              {s.p.map((t) => (
                <p>{t}</p>
              ))}
            </>
          ))}
          <div class="callout">
            <p>
              <b>Book the complimentary exam.</b> Photographs, an x-ray, a digital iTero scan and a written plan
              with fees — at no charge, with no obligation to treat.{' '}
              <a href="/book?from=blog_article">Book a time</a> or call{' '}
              <a href={BIZ.phoneHref}>{BIZ.phoneDisplay}</a>.
            </p>
          </div>
        </article>
      </div>
    </section>

    <CrossLinks
      links={[
        { eyebrow: 'Adults', title: 'Every treatment option for adults', body: 'Most adult cases need no surgery at all — here are the options.', href: '/adults', more: 'Adult treatment' },
        { eyebrow: 'All options', title: 'Compare every treatment we offer', body: 'The full menu, with which appliance suits which age group.', href: '/treatments', more: 'Treatment menu' },
        { eyebrow: 'Cost', title: 'What treatment costs', body: 'One fee for every appliance, insurance verified, 0% plans.', href: '/financing', more: 'Cost & financing' },
      ]}
    />
  </main>
)

export { CredentialsRow, CLOSING_CTA, CrossLinks, CompareTable }
