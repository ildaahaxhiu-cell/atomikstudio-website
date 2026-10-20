import { NextResponse } from 'next/server'

type Body = { name?: string; email?: string; company?: string; message?: string; services?: string[]; budget?: string }

const clean = (s: unknown, max = 4000) => (typeof s === 'string' ? s.trim().slice(0, max) : '')

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as Body | null
  const name = clean(b?.name, 200)
  const email = clean(b?.email, 200)
  const message = clean(b?.message)
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please add your name, email and a few words about the project.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 })
  }

  const key = process.env.RESEND_API_KEY
  const to = process.env.ENQUIRY_TO
  const from = process.env.ENQUIRY_FROM
  if (!key || !to || !from) {
    return NextResponse.json({ error: 'The form is not connected yet.' }, { status: 503 })
  }

  const services = Array.isArray(b?.services) ? b!.services.map((s) => clean(s, 40)).join(', ') : ''
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${clean(b?.company, 200) || '-'}`,
    `Services: ${services || '-'}`,
    `Budget: ${clean(b?.budget, 40) || '-'}`,
    '',
    message,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to, reply_to: email, subject: `New enquiry from ${name}`, text }),
  })
  if (!res.ok) return NextResponse.json({ error: 'We could not send your message.' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
