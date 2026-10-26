/* ============================================================================
   MAIL — delivers website enquiries to the practice inboxes.

   Why this file exists: the practice asked for every contact form on the site
   to arrive at info@roarkortho.com AND admin@roarkortho.com. Storing a row in
   D1 is not delivery — nobody reads a database on a Tuesday morning. This
   module turns a stored submission into an actual email.

   Cloudflare Workers cannot send SMTP. There is no `net` module and no
   long-running socket, so an outbound relay is the only honest option. This
   uses Resend because it is a plain HTTPS endpoint (one fetch, no SDK, no
   bundle weight) and a one-line setup for the practice:

       npx wrangler pages secret put RESEND_API_KEY --project-name roark-orthodontics

   `MAIL_FROM` must be an address on a domain verified in Resend, e.g.
   `noreply@roarkortho.com`. Until it is set it falls back to Resend's own
   sandbox sender, which only delivers to the account owner — enough to prove
   the wiring, not enough for production.

   Failure policy: a mail failure must never destroy the submission. The row
   is already in D1 by the time this runs, and the visitor is told the truth
   about what happened. See the caller in src/index.tsx.
   ========================================================================= */

import { CONTACT_INBOXES } from './site-data'

export type MailEnv = {
  RESEND_API_KEY?: string
  MAIL_FROM?: string
  CONTACT_INBOXES?: string
}

/* Recipients. The env var wins so the practice can add a third inbox without
   a code change; otherwise the two addresses they asked for. */
export function inboxes(env: MailEnv): string[] {
  const raw = (env.CONTACT_INBOXES || '').trim()
  const list = raw
    ? raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : CONTACT_INBOXES
  return list.filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s))
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  message: 'Message',
  page: 'Sent from',
  source: 'Form',
  kind: 'Type',
  gotcha: 'Spam trap',
}

export type Enquiry = { subject: string; fields: Record<string, string>; replyTo?: string }

function bodyText(e: Enquiry): string {
  const lines = Object.entries(e.fields)
    .filter(([, v]) => String(v || '').trim() !== '')
    .map(([k, v]) => (FIELD_LABELS[k] || k) + ': ' + v)
  return [
    ...lines,
    '',
    '—',
    'Sent from the website contact form.',
    'Reply directly to this email to answer the patient.',
  ].join('\n')
}

function bodyHtml(e: Enquiry): string {
  const rows = Object.entries(e.fields)
    .filter(([, v]) => String(v || '').trim() !== '')
    .map(
      ([k, v]) =>
        '<tr><th align="left" style="padding:6px 14px 6px 0;vertical-align:top;font:600 12px/1.5 Arial,sans-serif;color:#003d69;white-space:nowrap">' +
        esc(FIELD_LABELS[k] || k) +
        '</th><td style="padding:6px 0;vertical-align:top;font:14px/1.6 Arial,sans-serif;color:#1c2b36">' +
        esc(String(v)).replace(/\n/g, '<br>') +
        '</td></tr>',
    )
    .join('')

  return (
    '<div style="background:#f8f4ef;padding:24px">' +
    '<table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e3d9cd;border-radius:10px">' +
    '<tr><td style="padding:18px 24px;border-bottom:3px solid #e8a0b4;background:#003d69">' +
    '<div style="font:600 13px/1.4 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#fff">Roark Orthodontics</div>' +
    '<div style="font:15px/1.4 Arial,sans-serif;color:rgba(255,255,255,.85);margin-top:2px">' +
    esc(e.subject) +
    '</div></td></tr>' +
    '<tr><td style="padding:20px 24px"><table role="presentation" width="100%">' +
    rows +
    '</table></td></tr>' +
    '<tr><td style="padding:14px 24px;border-top:1px solid #eee6db;font:12px/1.6 Arial,sans-serif;color:#66757f">' +
    'Sent from the website contact form. Reply directly to this email to answer the patient.' +
    '</td></tr></table></div>'
  )
}

export type SendResult = { sent: boolean; skipped?: string; error?: string }

/* Sends one enquiry to every configured inbox in a single request.
   Returns rather than throws: the caller has already persisted the enquiry,
   so the outcome here must not be able to lose it. */
export async function sendEnquiry(env: MailEnv, e: Enquiry): Promise<SendResult> {
  const key = (env.RESEND_API_KEY || '').trim()
  const to = inboxes(env)

  if (!key) return { sent: false, skipped: 'no_api_key' }
  if (!to.length) return { sent: false, skipped: 'no_recipients' }

  const from = (env.MAIL_FROM || '').trim() || 'Roark Website <onboarding@resend.dev>'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: e.subject,
        text: bodyText(e),
        html: bodyHtml(e),
        ...(e.replyTo ? { reply_to: e.replyTo } : {}),
      }),
    })

    if (!res.ok) {
      const detail = (await res.text().catch(() => '')).slice(0, 300)
      console.error('mail send failed', res.status, detail)
      return { sent: false, error: 'provider_' + res.status }
    }
    return { sent: true }
  } catch (err) {
    console.error('mail send threw', err)
    return { sent: false, error: 'network' }
  }
}
