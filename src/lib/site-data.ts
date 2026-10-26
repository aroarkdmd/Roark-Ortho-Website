/* ============================================================================
   SITE DATA — single source of truth for NAP, navigation, hours and copy.
   Ported from the design handoff (site/data.jsx) so the visible page, the
   structured data and the footer can never drift apart.
   ========================================================================= */

export const BIZ = {
  name: 'Roark Orthodontics',
  legalName: 'Roark Orthodontics, PLLC',
  tagline: 'Board certified orthodontics in historic downtown Franklin',
  street: '212 E Main St, Ste 100',
  city: 'Franklin',
  region: 'TN',
  postal: '37064',
  country: 'US',
  phoneDisplay: '(615) 814-4884',
  phoneHref: 'tel:+16158144884',
  phoneE164: '+1-615-814-4884',
  email: 'hello@roarkortho.com',
  url: 'https://roarkortho.com/',
  lat: 35.9248,
  lng: -86.8714,
  hours: 'Mon–Wed · 7:30am–4:00pm',
  doctor: 'Dr. Ashley Roark, DMD',
  doctorRole: 'Board Certified Orthodontist',
  instagram: 'https://www.instagram.com/roarkortho/',
  facebook: 'https://www.facebook.com/p/Roark-Orthodontics-61558370755753/',
  gbp:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Roark Orthodontics, 212 E Main St Ste 100, Franklin, TN 37064'),
}

/* ── WHERE WEBSITE ENQUIRIES GO ────────────────────────────────────────────
   Every contact form on the site delivers to BOTH addresses. The practice
   asked for this explicitly: info@ is the front desk, admin@ is the office
   manager, and an enquiry must never depend on one person's inbox.

   `BIZ.email` is a different thing — it is the address PRINTED on the site
   for patients to write to. Delivery targets and the published address are
   deliberately separate so changing one does not silently change the other.
   Override at runtime with the CONTACT_INBOXES env var (comma separated). */
export const CONTACT_INBOXES: string[] = ['info@roarkortho.com', 'admin@roarkortho.com']

export type Hour = { day: string; open: string; close: string; closed?: boolean }

export const HOURS: Hour[] = [
  { day: 'Monday', open: '07:30', close: '16:00' },
  { day: 'Tuesday', open: '07:30', close: '16:00' },
  { day: 'Wednesday', open: '07:30', close: '16:00' },
  { day: 'Thursday', open: '07:30', close: '16:00', closed: true },
  { day: 'Friday', open: '07:30', close: '16:00', closed: true },
  { day: 'Saturday', open: '07:30', close: '16:00', closed: true },
  { day: 'Sunday', open: '07:30', close: '16:00', closed: true },
]

export const SERVICE_AREAS = [
  'Downtown Franklin',
  'Cool Springs',
  'Westhaven',
  'Berry Farms',
  'Fieldstone Farms',
  "McKay's Mill",
  'Brentwood',
  'Nolensville',
  "Thompson's Station",
  'Spring Hill',
  'College Grove',
  'Grassland',
  'Arrington',
  "Leiper's Fork",
]

export type NavItem = { id: string; label: string; href: string }

/* Header navigation. The Franklin Orthodontics Blog is deliberately absent: the practice
   wants it reachable from the footer only. It is still linked sitewide from
   FOOTER_PATIENTS below, and from the homepage and the cross-link cards, so
   the blog keeps its internal links — it is simply not in the top bar.
   Nothing about a link's SEO value depends on whether it sits in the header
   or the footer; both are sitewide. See the note above FOOTER_PATIENTS. */
export const NAV: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'kids', label: 'Kids & Teens', href: '/kids-braces' },
  { id: 'adults', label: 'Adults', href: '/adults' },
  { id: 'treatments', label: 'Treatments', href: '/treatments' },
  { id: 'financing', label: 'Financing', href: '/financing' },
  { id: 'contact', label: 'Contact', href: '/contact' },
]

export const FOOTER_TREATMENTS = [
  { label: 'Invisalign® Clear Aligners (all ages)', href: '/invisalign' },
  { label: 'Orthodontics for Adults', href: '/adults' },
  { label: 'Invisalign Teen®', href: '/kids-braces#options' },
  { label: 'Invisalign First® for Kids', href: '/invisalign-first' },
  { label: 'Braces — Metal & Clear (all ages)', href: '/braces' },
  { label: 'Braces for Kids & Teens', href: '/kids-braces' },
  { label: 'Surgical Orthodontics', href: '/surgical-orthodontics' },
  { label: 'Palatal Expander', href: '/palatal-expander' },
  { label: 'Treatment Costs', href: '/financing#cost' },
]

/* Footer "Patients" column. This is where the Franklin Orthodontics Blog now lives — it is
   the only navigation that carries it, by the practice's request. Nothing is
   lost: the footer appears on every page, so /blog keeps a sitewide internal
   link with descriptive anchor text, which is what crawlers and AI answer
   engines actually read. Header-vs-footer position carries no ranking weight.
   The blog is also linked in-page from the homepage and the treatment pages. */
export const FOOTER_PATIENTS = [
  { label: 'About the Practice', href: '/about' },
  { label: 'Meet the Team', href: '/about#meet-the-team' },
  { label: 'Your First Visit', href: '/#patients' },
  { label: 'Insurance & Financing', href: '/financing#insurance' },
  { label: 'Book Online', href: '/book' },
  { label: 'Contact the Office', href: '/contact' },
  { label: 'Franklin Orthodontics Blog', href: '/blog' },
  { label: 'Areas We Serve', href: '/areas-we-serve' },
  { label: 'FAQs', href: '/#faq' },
]

/* ── TREATMENTS ────────────────────────────────────────────────────────────
   Braces are open to every age group; the aligner range is named by audience
   and the names are not interchangeable (adults → Invisalign®, teens →
   Invisalign Teen®, children → Invisalign First®).                       */
export type Treatment = {
  id: string
  name: string
  audience: string
  href: string
  img: string
  blurb: string
}

export const TREATMENTS: Treatment[] = [
  {
    id: 'invisalign',
    name: 'Invisalign®',
    audience: 'Children, teens & adults',
    href: '/invisalign',
    img: 'invisalign',
    blurb:
      'Clear, removable aligners for every age. Each system is matched to the stage of growth.',
  },
  {
    id: 'braces',
    name: 'Braces',
    audience: 'Children, teens & adults',
    href: '/braces',
    img: 'braces',
    blurb:
      'Traditional metal braces and tooth-colored clear (ceramic) braces. A proven, reliable option — and a perfectly reasonable choice at any age.',
  },
  {
    id: 'surgical',
    name: 'Surgical Orthodontics',
    audience: 'Teens & adults',
    href: '/surgical-orthodontics',
    img: 'gallery-7',
    blurb:
      'For jaw discrepancies that moving teeth alone cannot correct. Dr. Roark plans and coordinates treatment together with your oral and maxillofacial surgeon, in both phases either side of surgery.',
  },
  {
    id: 'expander',
    name: 'Palatal Expander',
    audience: 'Children',
    href: '/palatal-expander',
    img: 'gallery-3',
    blurb:
      'A fixed appliance that gently widens a narrow upper jaw — often the right answer for a crossbite while the growth center is still open.',
  },
]

export type Faq = { q: string; a: string }

export const SURG_FAQ: Faq[] = [
  {
    q: 'What is surgical orthodontics?',
    a: 'It is treatment where braces or aligners and corrective jaw surgery are planned together as a single course. The orthodontist straightens and aligns the teeth, the oral and maxillofacial surgeon repositions the jaw itself, and then the orthodontist finishes the bite. It is used when the underlying problem is the position or size of the jaws, which moving teeth alone cannot correct.',
  },
  {
    q: 'How do I know if I need jaw surgery rather than just braces?',
    a: 'The signs are usually functional rather than cosmetic: a lower jaw that sits noticeably too far forward or back, an open bite where the front teeth do not meet, a chin that shifts to one side when you close, difficulty chewing or biting through food, or severe jaw joint problems. A board certified orthodontist can identify this from your records and will refer you to a surgeon for a joint assessment if it applies.',
  },
  {
    q: 'Who performs the surgery?',
    a: "An oral and maxillofacial surgeon. Dr. Roark does not perform the surgery — she plans the orthodontic phases around it in conjunction with the surgeon, and coordinates the timing with them. You will typically meet the surgeon at the consultation stage, before committing to anything.",
  },
  {
    q: 'How long does the whole process take?',
    a: 'Typically 18 to 30 months in total. The usual sequence is a pre-surgical orthodontic phase of 9 to 15 months to align the teeth, the surgery itself, then a post-surgical phase of roughly 6 to 12 months to finish the bite. Recovery from the surgery usually means about two weeks away from normal routine.',
  },
  {
    q: 'How does insurance work for surgical orthodontics?',
    a: "The orthodontic phase is usually filed with your dental plan, and we verify that benefit for you. Insurance for the surgery itself is handled by the surgeon's office.",
  },
]

export const HOME_FAQ: Faq[] = [
  {
    q: 'How much do braces cost in Franklin, TN?',
    a: 'Most treatment at our office falls between $3,400 and $6,250 — and that range is the same for metal braces, clear braces and clear aligners, because we price by how complex the bite is rather than by the appliance. That figure includes everything — records, the iTero scan, all your adjustments, your first set of retainers and post-treatment check-ins. Your exact fee is quoted in writing at the free initial exam, before you commit to anything.',
  },
  {
    q: 'At what age should my child first see an orthodontist?',
    a: 'The American Association of Orthodontists recommends a first screening by age 7. At that age most children still have a mix of baby and adult teeth, which is exactly when jaw-growth problems are easiest to guide. Most of those visits end with no treatment at all — just a baseline and a plan to watch. Screenings at our office are complimentary.',
  },
  {
    q: 'Do you treat adults, and is it too late if I am in my 40s or 50s?',
    a: 'It is never too late — as long as your teeth and gums are healthy, teeth will move at any age. A large share of our adult patients choose Invisalign® clear aligners specifically because they are clear and removable — the more aesthetic option at work. Adult treatment typically runs 6 to 18 months.',
  },
  {
    q: 'Does Roark Orthodontics take insurance, and are payment plans available?',
    a: 'We are in-network with most major PPO plans that include orthodontic benefits, and our patient coordinator will verify your specific coverage before your first visit and show you exactly what it covers. We also offer 0% interest monthly payment plans: a down payment when treatment starts, then the balance spread across the months of treatment.',
  },
  {
    q: 'Where exactly is the office, and is there parking?',
    a: 'We are at 212 E Main St, Ste 100, Franklin, TN 37064 — in the heart of historic downtown Franklin. There is free parking right in front of our office, down to Sweet Haven — please do not park in the spaces marked reserved on the other side of our building. There is also free parking on Main Street, and the 2nd Street parking garage directly across the street is free too.',
  },
]

export const CONTACT_FAQ: Faq[] = [
  {
    q: 'How do I contact Roark Orthodontics?',
    a: 'Call or text (615) 814-4884, email hello@roarkortho.com, or use the form on this page. We are at 212 E Main St, Ste 100, Franklin, TN 37064 — on the north side of East Main Street in historic downtown Franklin. The fastest way to get a time booked is the online scheduler.',
  },
  {
    q: 'Where do I park, and how do I find the entrance?',
    a: 'There is free parking right in front of our office, down to Sweet Haven — please do not park in the spaces marked reserved on the other side of our building. There is also free parking on Main Street, and the 2nd Street parking garage directly across the street is free too. We are in Suite 100 — look for the hanging sign on the storefront. The entrance is directly off East Main Street, with one step up from the sidewalk.',
  },
  { q: 'When are you open?', a: 'Monday to Wednesday, 7:30am to 4:00pm. The office is closed Thursday through Sunday.' },
  {
    q: 'How quickly will you reply to a message?',
    a: 'We reply by email, usually the same or next business day. For anything urgent — a broken bracket, a wire poking, or pain you cannot manage — please call rather than message, so we can get you in.',
  },
]

export const FIRST_FAQ: Faq[] = [
  {
    q: 'What age is Invisalign First® for?',
    a: 'It is designed for children from about age 7 to 10, while the adult teeth are still arriving and the jaw is still growing. The aligners are made wider and shorter than adult trays to fit a smaller mouth with baby teeth still present, and they can be used where some teeth have not yet erupted fully.',
  },
  {
    q: 'Can a child really wear aligners instead of braces?',
    a: 'Frequently, yes. For crowding and spacing problems, Invisalign First® can correct the issue while guiding the way the jaw develops — which is the same goal as early braces, using a different tool. Braces reach similar results, so if trays are not practical for your child, they are a good alternative.',
  },
  {
    q: 'Does Invisalign First® mean my child will not need braces later?',
    a: 'Sometimes. Early treatment can create room and correct a growth problem so that a second phase is shorter — and occasionally unnecessary. But many children will still need a comprehensive phase once all the adult teeth have erupted. We will give you a realistic expectation rather than a promise, and re-assess as your child grows.',
  },
]

export type Post = {
  slug: string
  href: string
  title: string
  ex: string
  date: string
  dateText: string
  tag: string
  mins: number
  img: string
  imgSm: string
  alt: string
}

export const POSTS: Post[] = [
  {
    slug: 'surgical-orthodontics',
    href: '/blog/surgical-orthodontics',
    title: 'Surgical Orthodontics: When Braces Alone Are Not Enough',
    ex: 'Some jaw discrepancies cannot be fixed by orthodontics alone. How combined orthodontic and oral-surgery treatment works, who it is for, and what the timeline looks like.',
    date: '2026-09-05',
    dateText: 'September 5, 2026',
    tag: 'Complex Care',
    mins: 8,
    img: '/static/photos/gallery-3-960.webp',
    imgSm: '/static/photos/gallery-3-480.webp',
    alt: 'A treatment bay at Roark Orthodontics in Franklin, Tennessee',
  },
  {
    slug: 'braces-cost-franklin',
    href: '/blog/braces-cost-franklin',
    title: 'How Much Do Braces Cost in Franklin, TN?',
    ex: 'A straight answer on treatment fees, what insurance actually covers, and the ways families here pay for braces without a surprise.',
    date: '2026-08-14',
    dateText: 'August 14, 2026',
    tag: 'Braces & Cost',
    mins: 7,
    img: '/static/photos/braces-960.webp',
    imgSm: '/static/photos/braces-480.webp',
    alt: 'Braces on a model of teeth in the Roark Orthodontics treatment room',
  },
  {
    slug: 'invisalign-first-kids',
    href: '/blog/invisalign-first-kids',
    title: 'Invisalign First® for Kids: Aligners Before Braces',
    ex: 'Yes — children can have aligners. What Invisalign First® corrects, the age that works best, and how it differs from aligners for adults.',
    date: '2026-09-18',
    dateText: 'September 18, 2026',
    tag: 'Kids & Aligners',
    mins: 7,
    img: '/static/photos/family-960.webp',
    imgSm: '/static/photos/family-480.webp',
    alt: 'A mother and her daughter smiling together',
  },
].sort((a, b) => (a.date < b.date ? 1 : -1)) as Post[]

export const HOLIDAY_NOTE = 'Dr. Roark sees patients Monday–Wednesday. Thursday–Sunday the office is closed.'

export const CONSENT_COPY =
  'We use cookies to measure which pages are useful and whether our Google Ads are working. Nothing is shared for advertising unless you say yes.'
