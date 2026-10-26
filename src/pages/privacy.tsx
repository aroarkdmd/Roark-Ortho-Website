import type { FC } from 'hono/jsx'
import { BIZ } from '../lib/site-data'

/* ── PRIVACY POLICY ────────────────────────────────────────────────────────
   Scope note, because it matters legally: this page describes the WEBSITE
   only — the forms, the appointment scheduler and the advertising measurement. It is
   deliberately NOT a HIPAA Notice of Privacy Practices. How the practice uses
   and discloses protected health information is a separate document that the
   practice already gives patients; inventing that text here would be wrong,
   so section 2 points to it instead.

   Every factual claim below is checked against the code that actually runs:
     · /api/contact   → D1 `submissions`, then emailed to the practice inboxes
                        (info@ and admin@) via src/lib/mail.ts → Resend
     · /book  → WaveOrtho, browser-to-central.waveortho.com (NOT our database)
     · localStorage roark-consent-v1   (public/static/tagging.js)
     · sessionStorage roark-conv-fired (public/static/tagging.js)
     · no document.cookie anywhere in src/ or public/static
     · fonts self-hosted from /static/fonts — no Google Fonts request
     · the Google map is a facade; no iframe until the visitor taps it

   NOTE ON THE FORMS. The short "scheduler request" panel that used to appear
   on the treatment pages is gone. Those pages now carry the same contact form
   as everywhere else, plus a plain link to /book for anyone who would rather
   pick a time. That means there is exactly ONE way to send us a message, and
   ONE scheduler (WaveOrtho, at /book). If either changes, this page changes.

   NOTE ON THE BOOKING FLOW. /book used to be a form of our own that posted to
   /api/booking and was saved in our D1 database. It is now the practice's real
   WaveOrtho scheduler, mounted from Wave's JavaScript library: the patient's
   booking details are sent straight from their browser to WaveOrtho and never
   reach this website. Any sentence here that claims otherwise is a bug.

   If any of that changes, this page has to change with it.            */
export const PrivacyPage: FC = () => (
  <main id="main">
    <section class="sec-sm sec--cream sec--hair" style="padding-top:calc(var(--header-h) + 3rem)">
      <div class="wrap wrap-narrow">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span>Privacy</span>
        </nav>
        <span class="eb">Your information</span>
        <h1 class="h-section" style="margin-bottom:1rem">
          Privacy policy
        </h1>
        <p class="lead">
          What this website collects, why we collect it, and how to have it removed. Plain language, with each point
          explained.
        </p>
        <p class="caption" style="margin-top:1.5rem">
          Last updated <time datetime="2026-10-26">October 26, 2026</time> · Applies to roarkortho.com
        </p>
      </div>
    </section>

    <section class="sec sec--paper">
      <div class="wrap wrap-narrow">
        <article class="article">
          <div class="toc">
            <h2>On this page</h2>
            <ol>
              <li>
                <a href="#short-version">The short version</a>
              </li>
              <li>
                <a href="#who-we-are">Who we are</a>
              </li>
              <li>
                <a href="#what-this-covers">What this policy covers</a>
              </li>
              <li>
                <a href="#what-you-give-us">What you give us through the forms</a>
              </li>
              <li>
                <a href="#automatic">What is collected automatically</a>
              </li>
              <li>
                <a href="#storage">Cookies and storage on your device</a>
              </li>
              <li>
                <a href="#ads">Google Ads and your consent</a>
              </li>
              <li>
                <a href="#maps">The map on our contact page</a>
              </li>
              <li>
                <a href="#how-we-use">How we use what we collect</a>
              </li>
              <li>
                <a href="#sharing">Who else touches it</a>
              </li>
              <li>
                <a href="#retention">How long we keep it</a>
              </li>
              <li>
                <a href="#security">How it is protected</a>
              </li>
              <li>
                <a href="#your-choices">Your choices and your rights</a>
              </li>
              <li>
                <a href="#children">Children and teenagers</a>
              </li>
              <li>
                <a href="#changes">Changes to this policy</a>
              </li>
              <li>
                <a href="#contact-us">How to reach us</a>
              </li>
            </ol>
          </div>

          <h2 id="short-version">1. The short version</h2>
          <p>
            If you only read one part, read this one. We collect the details you type into our forms so that we can
            answer you and prepare for your visit. Those details are stored in a database we control. We do not sell
            them, and we do not hand them to advertisers.
          </p>
          <p>There are three things worth knowing beyond that:</p>
          <ul>
            <li>
              <b>Our forms are the only place we ask for anything personal.</b> This site sets no cookies of its own
              — not for a shopping cart, not for a login, not for preferences.
            </li>
            <li>
              <b>Advertising measurement is optional.</b> Where the law requires it, nothing is measured until you
              accept. You can decline and still use every part of the site.
            </li>
            <li>
              <b>You can ask us to delete what you sent.</b> One phone call or one email, and it is removed from our
              enquiry records.
            </li>
          </ul>
          <div class="callout">
            <p>
              <b>This is not our medical privacy notice.</b> This page covers the website. Once you are a patient,
              how we use and share your health information is governed by a separate HIPAA Notice of Privacy
              Practices, which we give you before your first visit and which is always available at the front desk.
              Ask for a copy any time — we are glad to go through it with you.
            </p>
          </div>

          <h2 id="who-we-are">2. Who we are</h2>
          <p>
            This website is run by <b>{BIZ.legalName}</b>, an orthodontic practice in Franklin, Tennessee. For the
            purposes of this policy, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean that practice, and &ldquo;this
            site&rdquo; means roarkortho.com.
          </p>
          <ul>
            <li>
              <b>Address:</b> {BIZ.street}, {BIZ.city}, {BIZ.region} {BIZ.postal}
            </li>
            <li>
              <b>Phone:</b> <a href={BIZ.phoneHref}>{BIZ.phoneDisplay}</a>
            </li>
            <li>
              <b>Email:</b> <a href={'mailto:' + BIZ.email}>{BIZ.email}</a>
            </li>
          </ul>

          <h2 id="what-this-covers">3. What this policy covers</h2>
          <p>
            It covers everything that happens on this website: the pages you read, the contact form, the appointment
            scheduler, and the advertising measurement described in section 7.
          </p>
          <p>It does not cover:</p>
          <ul>
            <li>
              <b>Your clinical record.</b> What Dr. Roark and the team record about your treatment lives in our
              practice management system, not in this website. That is covered by the HIPAA Notice of Privacy
              Practices described above.
            </li>
            <li>
              <b>Other companies&rsquo; sites.</b> If you follow a link from here to Google Maps, Instagram or
              Facebook, the privacy policy of that company applies once you leave.
            </li>
            <li>
              <b>Insurance and payment portals.</b> If we send you to a third party to pay a bill or check benefits,
              that company&rsquo;s policy governs that page.
            </li>
          </ul>

          <h2 id="what-you-give-us">4. What you give us through the forms</h2>
          <p>
            There are two places to type something into this site. Here is exactly what each one asks for — nothing
            hidden, nothing implied.
          </p>

          <h3>The contact form</h3>
          <p>
            The same short form appears in panels across the site — on the <a href="/contact">contact page</a>, and on
            the pages about children, adults, aligners, braces, cost and surgical treatment. We ask for your name,
            your email address, your phone number and a message. It also records which page you sent it from, so we
            know what you were reading when you wrote to us.
          </p>
          <p>
            <b>What happens to it.</b> Your message is saved in our own enquiry database and is also emailed to the
            practice&rsquo;s two office inboxes, <b>info@roarkortho.com</b> and <b>admin@roarkortho.com</b>, so that it
            reaches more than one person and does not sit unread. The email is sent by Resend, a delivery service named
            in section 10. If you would rather not be emailed at all, call the office instead and we will take your
            details over the phone.
          </p>
          <p>
            The contact form never books an appointment. Where you see it, there is also a plain link to
            <a href="/book">the scheduler</a> for anyone who would rather pick a time.
          </p>

          <h3>The appointment scheduler</h3>
          <p>
            <a href="/book">The scheduler</a> is the longest form, because we are trying to get the administrative
            work out of your first visit. It asks for your first and last name, email address and phone number, a date
            of birth for the patient, how you heard about the practice, and any notes you want us to read before you
            arrive.
          </p>
          <p>
            <b>This one is different from the other two.</b> The scheduler is provided by WaveOrtho, the system that
            holds our appointment book. When you press submit, your details go <b>directly from your browser to
            WaveOrtho</b> and are written straight into our practice schedule. They do not pass through, and are not
            stored by, this website. WaveOrtho is named in section 10 along with the other companies involved.
          </p>
          <p>
            A date of birth is what lets the scheduler offer the right kind of examination and keep two patients with
            the same name apart. It is also the one field here that is genuinely sensitive, so it is worth saying
            plainly: it is sent to WaveOrtho over an encrypted connection and is covered by WaveOrtho&rsquo;s own
            agreement with the practice. If you would rather not type it, leave it out and call the office instead.
          </p>
          <p>
            The scheduler also shows which appointment times are free. To do that it asks WaveOrtho for the
            practice&rsquo;s current availability for the dates on screen. That request contains no information about
            you — it is the same request any visitor makes simply by opening the page.
          </p>

          <h2 id="automatic">5. What is collected automatically</h2>
          <p>
            As with any website, the computers that serve these pages record basic technical detail in order to
            deliver them and to keep them working. That means:
          </p>
          <ul>
            <li>the address of the page you requested, and the time of the request;</li>
            <li>your IP address, and the country and city it resolves to;</li>
            <li>your browser and operating system, and the referring page;</li>
            <li>anything the server needs to distinguish a real visitor from automated traffic.</li>
          </ul>
          <p>
            This is standard web server logging, performed by our hosting provider. It is not used to build a profile
            of you, and we do not attempt to link it back to a form submission except when investigating a technical
            fault or abuse of the site.
          </p>
          <p>
            <b>Our fonts are served from our own server</b>, so loading a page here does not send a request — or your
            IP address — to Google Fonts or to any other font service.
          </p>

          <h2 id="storage">6. Cookies and storage on your device</h2>
          <p>
            This site sets <b>no cookies of its own</b>. It does use your browser&rsquo;s local and session storage
            for three small, specific jobs. These never leave your device and are never readable by anyone except
            this site.
          </p>
          <div class="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">Stored in</th>
                  <th scope="col">Name</th>
                  <th scope="col">What it holds</th>
                  <th scope="col">How long</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Local storage</td>
                  <td>
                    <code>roark-consent-v1</code>
                  </td>
                  <td>
                    Whether you accepted or declined advertising measurement, so that we do not ask you again on every
                    page.
                  </td>
                  <td>Until you clear your browser</td>
                </tr>
                <tr>
                  <td>Session storage</td>
                  <td>
                    <code>roark-conv-fired</code>
                  </td>
                  <td>
                    A flag so that one confirmed appointment is counted once, even if you refresh the confirmation
                    screen. It contains no personal detail.
                  </td>
                  <td>Until you close the tab</td>
                </tr>
                <tr>
                  <td>Cookies</td>
                  <td>None</td>
                  <td>
                    We set no cookies. If you accept advertising measurement, Google may set its own — see section 7.
                  </td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            You can clear any of this at any time from your browser&rsquo;s settings. Clearing it while part-way
            through a form means the form will start empty next time; nothing is sent anywhere until you press the
            submit button.
          </p>

          <h2 id="ads">7. Google Ads and your consent</h2>
          <p>
            We advertise the practice on Google, and we need to know whether those adverts lead to real appointment
            requests — otherwise we would be spending money blindly. To do that, this site loads a Google Tag Manager
            container that reports two kinds of event: <b>that the contact form was submitted</b>, and <b>that an
            appointment was booked</b>, together with which page it came from. The event also carries a fixed conversion value of one US dollar and the page address and title, and no booking number.
          </p>
          <p>
            <b>Those events carry no patient information.</b> No name, no email, no phone number, no message, no date
            of birth and no clinical note is passed to Google. They say &ldquo;a form was sent&rdquo; or &ldquo;an
            appointment was booked&rdquo; and nothing about who it was for.
          </p>
          <p>
            We also do not run a separate analytics product on this site. There is no per-page behavioral profile
            being assembled here.
          </p>
          <h3>How consent works</h3>
          <p>
            We use Google&rsquo;s consent signalling. Before any Google tag is allowed to load, the site tells it
            whether it may store or read anything, and that answer starts as <b>no</b> for visitors in the European
            Economic Area, the United Kingdom and Switzerland. Those visitors see a small bar at the bottom of the
            screen with Accept and Decline.
          </p>
          <ul>
            <li>
              <b>If you accept,</b> Google may set its own cookies and use the measurement data for advertising.
            </li>
            <li>
              <b>If you decline,</b> the tag is instructed not to store anything. You can still book, call and read
              every page normally.
            </li>
            <li>
              <b>For visitors elsewhere,</b> including in Tennessee, consent is granted by default, because the
              statutes that require a prompt do not apply. You can still decline — see section 13.
            </li>
          </ul>
          <p>
            Where a request comes from a country without such a statute, no banner is shown. That is a deliberate
            choice to keep the site quiet for the people who use it most.
          </p>

          <h2 id="maps">8. The map on our contact page</h2>
          <p>
            The map is not loaded until you ask for it. What you see first is a picture of a map with a
            &ldquo;click to load&rdquo; prompt; only when you tap it does an embedded Google Map load, and only then
            can Google see your request or set its own cookies. If you never tap it, Google never hears from you.
          </p>
          <p>
            There is always a plain link to Google Maps as well, if you would rather open directions in a new tab.
          </p>

          <h2 id="how-we-use">9. How we use what we collect</h2>
          <ul>
            <li>
              <b>To reply to you.</b> Answering a question, confirming a time, or telling you we need to move an
              appointment.
            </li>
            <li>
              <b>To prepare for your visit.</b> Checking benefits, requesting records, and making sure the clinical
              team knows what you are coming in for.
            </li>
            <li>
              <b>To run the practice.</b> Keeping a record of enquiries so that nothing is dropped, and
              understanding which pages and adverts actually help people.
            </li>
            <li>
              <b>To keep the site working and safe.</b> Diagnosing faults and blocking automated abuse.
            </li>
          </ul>
          <p>
            We do not use your details to build advertising audiences, we do not sell them, and we do not rent our
            contact list to anyone. We do not send marketing email to someone who only asked a question.
          </p>

          <h2 id="sharing">10. Who else touches it</h2>
          <p>
            We are a small practice and we keep the list short. These are the only companies that process website
            information on our behalf:
          </p>
          <div class="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">Provider</th>
                  <th scope="col">What they do for us</th>
                  <th scope="col">Where</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Cloudflare, Inc.</b>
                  </td>
                  <td>
                    Serves this website and hosts the database that stores form submissions. Cloudflare also provides
                    the server logs described in section 5.
                  </td>
                  <td>United States</td>
                </tr>
                <tr>
                  <td>
                    <b>Google LLC</b>
                  </td>
                  <td>
                    Measures whether our adverts lead to appointment requests (section 7). Serves the embedded map,
                    but only after you tap it (section 8).
                  </td>
                  <td>United States</td>
                </tr>
                <tr>
                  <td>
                    <b>WaveOrtho</b>
                  </td>
                  <td>
                    Provides the appointment scheduler on <a href="/book">the booking page</a> and holds the
                    practice&rsquo;s appointment book. The details you enter there are submitted directly to WaveOrtho
                    from your browser (section 4), not to us.
                  </td>
                  <td>United States</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Beyond those, we disclose information only when we have to:</p>
          <ul>
            <li>
              <b>Because the law requires it</b> — a court order, a subpoena, or a lawful request from a regulator.
            </li>
            <li>
              <b>To protect someone</b> — where there is a genuine risk to a person&rsquo;s safety.
            </li>
            <li>
              <b>If the practice is sold or merged</b>, in which case the records would transfer to the successor
              practice, still bound by this policy and by the same confidentiality obligations.
            </li>
          </ul>

          <h2 id="retention">11. How long we keep it</h2>
          <p>
            Form submissions stay in our enquiry records while they are useful: while we are arranging your visit,
            and for a reasonable period afterwards so that we can pick the conversation back up if you return months
            later. If a submission never becomes a patient record, we clear it out periodically.
          </p>
          <p>
            If you become a patient, the details that form part of your clinical record are kept for as long as
            Tennessee law and our professional obligations require — which is longer than a website enquiry, and is
            explained in the HIPAA Notice of Privacy Practices.
          </p>
          <p>
            Ask us to delete a submission you sent through this site and we will do it, unless we are required to
            keep it or it has become part of your clinical record.
          </p>

          <h2 id="security">12. How it is protected</h2>
          <ul>
            <li>The whole site is served over HTTPS, so what you type is encrypted in transit.</li>
            <li>
              Enquiries sent through the contact form are held in a database that is not publicly readable, and are
              emailed to two office inboxes. Access requires a credential that is held by the practice, not by the
              website&rsquo;s visitors.
            </li>
            <li>
              Appointments booked through <a href="/book">the scheduler</a> are held by WaveOrtho in the practice&rsquo;s
              appointment system, which the practice reaches through its own account.
            </li>
            <li>Access to enquiry records is limited to the people in the practice who need it to do their jobs.</li>
          </ul>
          <p>
            No system is perfect, and no one can promise that a breach will never happen. If one ever affected your
            information, we would tell you directly and tell you what we knew.
          </p>
          <p>
            Please do not send clinical detail — x-rays, photographs of your teeth, insurance documents — through the
            forms on this site. Call the office and we will give you a secure way to send them.
          </p>

          <h2 id="your-choices">13. Your choices and your rights</h2>
          <p>You do not need to give a reason to exercise any of these.</p>
          <ul>
            <li>
              <b>Change your mind about measurement.</b> Open any page with <code>?consent=1</code> added to the
              address — for example <code>roarkortho.com/?consent=1</code> — and the choice bar will appear again so
              you can accept or decline. Clearing your browser&rsquo;s site data does the same thing.
            </li>
            <li>
              <b>Ask what we hold.</b> Call or email and we will tell you what we have from you, and where it came
              from.
            </li>
            <li>
              <b>Ask us to correct it.</b> If a name is misspelled or a phone number is wrong, we will fix it.
            </li>
            <li>
              <b>Ask us to delete it.</b> We will remove what came through this website, subject to the retention
              points in section 11.
            </li>
            <li>
              <b>Opt out of texts.</b> Say so on the form, or tell us on the phone, or reply STOP to any message. It
              does not affect your appointment.
            </li>
            <li>
              <b>Turn off advertising measurement entirely.</b> Declining in the bar, or using your browser&rsquo;s
              tracker blocking, is enough. Nothing about the site stops working.
            </li>
          </ul>
          <p>
            If you are in the EEA or the UK, you also have the right to object to processing, to ask us to restrict
            it, and to complain to your local data protection authority. We would rather you called us first — most
            things are sorted out in one conversation.
          </p>

          <h2 id="children">14. Children and teenagers</h2>
          <p>
            Most of our patients are children, but the forms on this site are not designed for them to fill in
            themselves. Bookings for a child should be made by a parent or guardian, and the details of a child
            should be entered by that adult.
          </p>
          <p>
            We do not knowingly collect information through this website from a child under 13 without a parent or
            guardian involved. If you believe a child has sent us something, call the office and we will delete it.
          </p>
          <p>
            Teenagers are welcome to read everything here, and welcome to ask us questions directly about their own
            treatment — that conversation is part of the care, and it is covered by the clinical privacy notice, not
            this page.
          </p>

          <h2 id="changes">15. Changes to this policy</h2>
          <p>
            If we change how the site handles information — adding a form field, turning on a new measurement tool,
            or changing how long we keep enquiries — we will update this page and change the date at the top. We
            will not quietly widen what we collect without saying so here.
          </p>
          <p>
            Material changes that affect people who have already sent us something will be described plainly in the
            summary at the top, not buried in the middle.
          </p>

          <h2 id="contact-us">16. How to reach us</h2>
          <p>
            Questions about this policy, or about something you sent through this site, go to the practice directly.
            A person reads them — there is no ticket queue.
          </p>
          <ul>
            <li>
              <b>Call or text:</b> <a href={BIZ.phoneHref}>{BIZ.phoneDisplay}</a>
            </li>
            <li>
              <b>Email:</b> <a href={'mailto:' + BIZ.email}>{BIZ.email}</a>
            </li>
            <li>
              <b>Write to:</b> {BIZ.legalName}, {BIZ.street}, {BIZ.city}, {BIZ.region} {BIZ.postal}
            </li>
            <li>
              <b>Office hours:</b> {BIZ.hours}
            </li>
          </ul>
          <p>
            If you would rather just ask your question in person, that is fine too — the front desk is the shortest
            route to an answer.
          </p>
        </article>
      </div>
    </section>

    <section class="sec-sm sec--cream sec--hair">
      <div class="wrap wrap-narrow center">
        <h2 class="h-section" style="font-size:var(--fs-h3);margin-bottom:1rem">
          Want to talk it through?
        </h2>
        <p class="lead" style="margin-bottom:2rem">
          The complimentary exam is the easiest way to get your questions answered — including the ones this page
          does not cover.
        </p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
          <a class="btn btn--pri" href="/book?from=privacy" data-book="privacy">
            Book a complimentary exam
          </a>
          <a class="btn btn--out-ink" href={BIZ.phoneHref} data-phone="privacy">
            Call {BIZ.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  </main>
)
