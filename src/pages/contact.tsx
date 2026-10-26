import type { FC } from 'hono/jsx'
import { BIZ, CONTACT_FAQ } from '../lib/site-data'
import { Icon, Ticks } from '../components/icons'
import { Pic } from '../components/chrome'
import { SectionHead, FaqList, InfoRow, SiloCrumbs, ContactPanel } from '../components/blocks'

export const ContactPage: FC = () => (
  <main id="main">
    <section class="pbanner">
      <Pic
        name="office-hall"
        alt="The hallway at Roark Orthodontics in downtown Franklin, with the treatment room and digital lab"
        eager
        sizes="100vw"
        widths={[480, 960]}
        w={960}
        h={640}
      />
      <div class="wrap wrap-wide">
        <div class="pbanner__in">
          <SiloCrumbs trail={[{ name: 'Home', href: '/' }, { name: 'Contact' }]} />
          <h1>Contact Roark Orthodontics in downtown Franklin, TN</h1>
          <p>
            We are on East Main Street in historic downtown Franklin, in Suite 100, with one step up from the
            sidewalk to the door and free parking in front of the office and in the 2nd Street garage across the
            street. Call, message, or book a time directly.
          </p>
        </div>
      </div>
    </section>

    <section class="sec sec--paper cv" id="reach">
      <div class="wrap wrap-wide">
        <div class="split" style="align-items:start;gap:3.5rem">
          <div class="reveal">
            <span class="eb">Get in touch with us</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.25rem">
              Call, message, or book online
            </h2>
            <p>
              Appointments can be made online or by calling the office directly. If you have questions about
              treatment, insurance or financing, just ask — we are glad to help.
            </p>

            <div style="display:grid;gap:1.5rem;margin-top:2rem">
              <InfoRow icon="pin" title="Visit us">
                <a href={BIZ.gbp} target="_blank" rel="noopener">
                  {BIZ.street}
                  <br />
                  {BIZ.city}, {BIZ.region} {BIZ.postal}
                </a>
              </InfoRow>
              <InfoRow icon="phone" title="Call or text">
                <a href={BIZ.phoneHref} data-phone="contact_page">
                  {BIZ.phoneDisplay}
                </a>
              </InfoRow>
              <InfoRow icon="envelope" title="Email">
                <a href={'mailto:' + BIZ.email}>{BIZ.email}</a>
              </InfoRow>
              <InfoRow icon="clock" title="Office hours">
                Monday to Wednesday, 7:30am – 4:00pm.
                <br />
                Closed Thursday to Sunday.
              </InfoRow>
            </div>

            <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:2rem">
              <a class="btn btn--pri" href="/book?from=contact_page" data-book="contact_page">
                <Icon name="calendar" size={11} /> Schedule online
              </a>
              <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="contact_page">
                <Icon name="phone" size={11} /> {BIZ.phoneDisplay}
              </a>
            </div>
          </div>

          {/* the Contact Us panel — the design's own conversion component */}
          <div class="reveal">
            <ContactPanel id="contact-panel" location="contact_page" />
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--cream cv" id="directions">
      <div class="wrap wrap-wide">
        <div class="split">
          <div class="reveal">
            <span class="eb">Getting here</span>
            <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1.5rem">
              Parking, entrances and the drive in
            </h2>
            <div style="display:grid;gap:1.5rem;margin-bottom:2rem">
              <InfoRow icon="directions" title="Parking">
                There is free parking right in front of our office, down to Sweet Haven — please do not park in the
                spaces marked reserved on the other side of our building. There is also free parking on Main
                Street, and the 2nd Street parking garage directly across the street is free too.
              </InfoRow>
              <InfoRow icon="pin" title="Finding the door">
                We are in Suite 100 on the north side of East Main Street — look for the hanging sign. There is one
                step up from the sidewalk to the door.
              </InfoRow>
              <InfoRow icon="clock" title="Opening hours">
                Monday to Wednesday, 7:30am – 4:00pm. Closed Thursday to Sunday.
              </InfoRow>
            </div>
            <p style="margin-bottom:2rem">
              Downtown Franklin is an easy drive from Cool Springs, Westhaven, Berry Farms, Brentwood, Nolensville,
              Thompson&rsquo;s Station and Spring Hill — most of our patients are within about twenty minutes.
            </p>
            <div style="display:flex;gap:.75rem;flex-wrap:wrap">
              <a class="btn btn--pri" href={BIZ.gbp} target="_blank" rel="noopener">
                <Icon name="directions" size={11} /> Get directions
              </a>
              <a class="btn btn--out-ink" href="/areas-we-serve">
                Areas we serve <Icon name="arrowRight" size={11} />
              </a>
            </div>
          </div>
          <div class="reveal">
            <div
              class="mapfacade"
              id="mapfacade-contact"
              data-src={
                'https://www.google.com/maps?q=' +
                encodeURIComponent(BIZ.name + ' ' + BIZ.street + ', ' + BIZ.city + ', ' + BIZ.region) +
                '&output=embed'
              }
              style="height:24rem"
            >
              <Icon name="pin" size={30} />
              <b>212 E Main St, Ste 100</b>
              <span>Click to load the Google Map · downtown Franklin, TN</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--paper cv" id="faq">
      <div class="wrap wrap-narrow">
        <SectionHead eyebrow="Common questions" title="Before you call or write" narrow />
        <div style="margin-top:2.5rem">
          <FaqList items={CONTACT_FAQ} idPrefix="contactfaq" />
        </div>
      </div>
    </section>

    <section class="sec sec--rose on-rose">
      <div class="wrap wrap-narrow center">
        <h2 class="h-section" style="margin-bottom:1rem">
          Book your complimentary exam online
        </h2>
        <p class="lead" style="margin-bottom:2rem">
          The complimentary new patient exam takes about 45 minutes and includes photographs, an x-ray and a
          digital scan.
        </p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
          <a class="btn btn--white" href="/book?from=contact_footer" data-book="contact_footer">
            <Icon name="calendar" size={12} /> Book a complimentary exam
          </a>
          <a class="btn btn--out" href={BIZ.phoneHref} data-phone="contact_footer">
            <Icon name="phone" size={11} /> Call {BIZ.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  </main>
)
