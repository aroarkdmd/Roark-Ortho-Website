import type { FC } from 'hono/jsx'
import { BIZ, SURG_FAQ } from '../lib/site-data'
import { Icon, Ticks } from '../components/icons'
import { SectionHead, FaqList, ContactPanel, SiloBanner, FactStrip, Callout } from '../components/blocks'

const SIGNS: [string, string][] = [
  [
    'An underbite',
    'The lower jaw sits noticeably ahead of the upper, so the lower front teeth overlap the upper.',
  ],
  [
    'A significant overbite',
    'The lower jaw is set well back, often with a receding chin and a strained profile.',
  ],
  [
    'An open bite',
    'The front teeth do not meet when the back teeth are closed, making it hard to bite through food.',
  ],
  [
    'A chin that shifts sideways',
    'The jaw swings to one side when closing, often with uneven wear on one side of the teeth.',
  ],
  [
    'Difficulty chewing or speaking',
    'Persistent trouble biting through food, or a lisp related to the jaw relationship.',
  ],
  [
    'Severe joint issues',
    'Significant problems with the jaw joints. Only an examination and imaging can tell whether they are part of the picture.',
  ],
]

const SEQUENCE: { icon: string; t: string; b: string }[] = [
  {
    icon: 'calendar',
    t: '1 · Consultation & records',
    b: 'Photographs, x-rays, a digital iTero scan and often a CBCT scan of the jaws. Dr. Roark assesses whether the correction is possible with tooth movement alone, or whether a surgical referral is appropriate.',
  },
  {
    icon: 'star',
    t: '2 · Planning together with the surgeon',
    b: 'You meet the oral and maxillofacial surgeon. The surgical movement is planned digitally and the orthodontic targets are set from it, so both specialists are working to the same final position.',
  },
  {
    icon: 'check',
    t: '3 · Pre-surgical orthodontics',
    b: 'About 9 to 15 months of braces (or aligners, where suitable) to set the teeth up so the surgeon can position the jaws in the best place.',
  },
  {
    icon: 'check',
    t: '4 · The surgery',
    b: 'Performed by your oral and maxillofacial surgeon. Your surgeon explains the procedure and recovery to you directly.',
  },
  {
    icon: 'check',
    t: '5 · Post-surgical orthodontics',
    b: 'Roughly 6 to 12 months to settle the bite and fine-tune the fit of the teeth now the jaws are in their corrected position.',
  },
  { icon: 'check', t: '6 · Retainers', b: 'Retainers hold the teeth in their new positions for life.' },
]

const Card: FC<{ title: string; body: string; pad?: string }> = ({ title, body, pad = '1.75rem' }) => (
  <div class="card reveal" style={'padding:' + pad}>
    <h3 style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .5rem">
      {title}
    </h3>
    <p style="font-size:var(--fs-body-sm);margin:0">{body}</p>
  </div>
)

export const SurgicalOrthoPage: FC = () => (
  <main id="main">
    <SiloBanner
      img="surgical-scan"
      imgAlt="A jaw scan on a computer screen, used to plan surgical orthodontics"
      crumbs={[
        { name: 'Home', href: '/' },
        { name: 'Treatments', href: '/treatments' },
        { name: 'Surgical Orthodontics' },
      ]}
      h1="Surgical Orthodontics in Franklin, TN"
      sub="When the problem is the jaw rather than the teeth. Braces or aligners planned around corrective jaw surgery, coordinated with your oral and maxillofacial surgeon."
      eager
    />

    {/* ── fact strip ───────────────────────────────────────────────────── */}
    <FactStrip
      items={[
        [
          'Typical total time',
          '18–30 months',
          'Roughly 9–15 months of orthodontics, then surgery, then 6–12 months of finishing.',
        ],
        [
          'Surgery performed by',
          'Oral surgeon',
          'Dr. Roark plans the orthodontic phases around it and coordinates timing with them.',
        ],
        [
          'Planning',
          'Together',
          'Dr. Roark and your surgeon plan the timing of each phase together.',
        ],
      ]}
    />

    {/* ── what it is ───────────────────────────────────────────────────── */}
    <section class="sec sec--paper cv">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">What it is</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Sometimes the teeth are not the problem — the jaw is
            </h2>
            <p>
              Orthodontics moves teeth. It cannot change the size or position of a jaw. So when the underlying
              issue is that the lower jaw sits too far forward or too far back, or the upper jaw is
              underdeveloped, or the bite is open, moving the teeth alone may not give a stable result, because
              the jaw relationship is the underlying issue.
            </p>
            <p>
              <b>Surgical orthodontics</b> (also called orthognathic treatment) solves this by planning the
              orthodontic work and corrective jaw surgery together as one course. Braces or aligners align the
              teeth before surgery so the jaws can be positioned accurately, the surgeon repositions the jaw, and
              then a finishing phase of orthodontics fine-tunes the bite.
            </p>
            <p>
              Dr. Roark completed her orthodontic residency at Montefiore Medical
              Center in New York, and plans and coordinates surgical cases here in Franklin in conjunction with your
              oral and maxillofacial surgeon.
            </p>
          </div>
          <div class="split__media reveal">
            <div class="frame-rose">
              <Pic
                name="surgical-scan"
                alt="A jaw scan on a computer screen, used to plan surgical orthodontics"
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

    {/* ── signs ────────────────────────────────────────────────────────── */}
    <section class="sec sec--cream cv" id="signs">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="Is this you?"
          title="Signs the jaw, not just the teeth, may be the issue"
          body="These are functional signs rather than aesthetic ones."
        />
        <div class="grid-3" style="margin-top:3rem">
          {SIGNS.map(([t, b]) => (
            <Card title={t} body={b} />
          ))}
        </div>
        <Callout max="54rem">
          <b>Nothing here is a diagnosis.</b> Only an examination and imaging can confirm whether jaw surgery is
          indicated for you. If you recognize several of these, it is worth a consultation — and if surgery is not
          needed, we will say so plainly and treat you with braces or aligners alone.
        </Callout>
      </div>
    </section>

    {/* ── sequence ─────────────────────────────────────────────────────── */}
    <section class="sec sec--paper cv" id="timeline">
      <div class="wrap wrap-wide">
        <SectionHead
          eyebrow="How it works"
          title="The treatment sequence, phase by phase"
          body="Roughly 18 to 30 months end to end. Your own timeline depends on how much the teeth need to move before the jaws are repositioned."
        />
        <div class="grid-3" style="margin-top:3rem">
          {SEQUENCE.map((s) => (
            <div class="card reveal" style="padding:2rem">
              <div style="display:flex;gap:1rem;align-items:flex-start">
                <span style="flex:none;width:2.6rem;height:2.6rem;border-radius:50%;background:var(--rose-100);color:var(--rose-800);display:flex;align-items:center;justify-content:center">
                  <Icon name={s.icon} size={16} />
                </span>
                <div>
                  <h3 style="font-family:var(--font-display);font-size:var(--fs-h5);font-weight:var(--fw-medium);color:var(--navy-600);margin:0 0 .25rem">
                    {s.t}
                  </h3>
                  <div style="font-size:var(--fs-body-sm);color:var(--ink-700)">{s.b}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── insurance + the Contact Us panel ─────────────────────────────── */}
    <section class="sec sec--cream cv" id="insurance">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start">
          <div class="reveal">
            <span class="eb">Coverage &amp; cost</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Insurance and Cost
            </h2>
            <p>
              The orthodontic phase is usually claimed against your <b>dental</b> plan and its orthodontic lifetime
              maximum. Insurance for the surgery itself is handled by the surgeon&rsquo;s office.
            </p>
            <Ticks
              items={[
                'A consultation together with the oral surgeon before you commit to anything',
                'The orthodontic phase quoted separately, with your dental benefit verified',
                '0% interest payment plans — down payment at the start',
                'HSA and FSA dollars welcome',
              ]}
            />
            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.75rem">
              <a class="btn btn--pri" href="/book?from=surg_cost" data-book="surg_cost">
                <Icon name="calendar" size={11} /> Book a consultation
              </a>
              <a class="btn btn--out-ink" href="/financing">
                Insurance &amp; payment plans
              </a>
              <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="surg_cost">
                <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
              </a>
            </div>
          </div>

          <div class="reveal">
            <ContactPanel
              id="surg-contact"
              location="surg_cost"
              title="Contact Us"
              lede="Send any question here and we will reply by email."
            />
          </div>
        </div>
      </div>
    </section>

    {/* ── FAQ ──────────────────────────────────────────────────────────── */}
    <section class="sec sec--paper cv" id="faq">
      <div class="wrap wrap-narrow">
        <SectionHead eyebrow="Usually asked" title="Surgical orthodontics questions" narrow />
        <div style="margin-top:2.5rem">
          <FaqList items={SURG_FAQ} idPrefix="surgfaq" />
        </div>
      </div>
    </section>

    {/* ── cross-links ──────────────────────────────────────────────────── */}
    <section class="sec-sm sec--cream sec--hair">
      <div class="wrap wrap-wide">
        <div class="grid-3">
          <a class="card" href="/adults" style="padding:2rem">
            <span class="eb">Adults</span>
            <h3 style="font-family:var(--font-display);font-size:var(--fs-h4);color:var(--navy-600);margin:0 0 .5rem">
              Every treatment option for adults
            </h3>
            <p style="font-size:var(--fs-body-sm)">
              Most adult cases need no surgery at all — here are the options that do not.
            </p>
            <span class="post__more">
              Adult treatment <Icon name="arrowRight" size={11} />
            </span>
          </a>
          <a class="card" href="/blog/surgical-orthodontics" style="padding:2rem">
            <span class="eb">Franklin Orthodontics Blog</span>
            <h3 style="font-family:var(--font-display);font-size:var(--fs-h4);color:var(--navy-600);margin:0 0 .5rem">
              When braces alone are not enough
            </h3>
            <p style="font-size:var(--fs-body-sm)">
              How jaw surgery and orthodontics work together, and who it is actually for.
            </p>
            <span class="post__more">
              Read the article <Icon name="arrowRight" size={11} />
            </span>
          </a>
          <a class="card" href="/treatments" style="padding:2rem">
            <span class="eb">All options</span>
            <h3 style="font-family:var(--font-display);font-size:var(--fs-h4);color:var(--navy-600);margin:0 0 .5rem">
              Compare every treatment we offer
            </h3>
            <p style="font-size:var(--fs-body-sm)">
              The full menu, with which appliance suits which age group.
            </p>
            <span class="post__more">
              Treatment menu <Icon name="arrowRight" size={11} />
            </span>
          </a>
        </div>
      </div>
    </section>
  </main>
)

/* Pic is imported here so the page reads standalone. */
import { Pic } from '../components/chrome'
