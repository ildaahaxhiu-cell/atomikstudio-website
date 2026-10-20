'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { DISCIPLINES } from '@/lib/types'

function budgets(currency: string) {
  let f: (n: number) => string
  try {
    const nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', notation: 'compact', maximumFractionDigits: 0 })
    f = (n) => nf.format(n)
  } catch {
    f = (n) => `${n / 1000}k ${currency}`
  }
  return [`Under ${f(5000)}`, `${f(5000)}–${f(15000)}`, `${f(15000)}–${f(40000)}`, `${f(40000)}+`, 'Not sure yet']
}
type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; message?: string }

function Toggle({ options, value, onChange, multi }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean }) {
  return (
    <div className="filters">
      {options.map((o) => {
        const on = value.includes(o)
        return (
          <button
            key={o}
            type="button"
            className="chip"
            aria-pressed={on}
            onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : on ? [] : [o])}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export default function EnquiryForm({ email, currency, projects }: { email: string; currency: string; projects: Record<string, string> }) {
  const BUDGETS = budgets(currency)
  const message = useRef<HTMLTextAreaElement>(null)

  // Arriving from a case study ("Start a similar project"): note which one.
  useEffect(() => {
    const name = projects[new URLSearchParams(location.search).get('project') ?? '']
    if (name && message.current && !message.current.value) message.current.value = `We would like something similar to your ${name} project. `
  }, [projects])
  const [services, setServices] = useState<string[]>([])
  const [budget, setBudget] = useState<string[]>([])
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    if (fd.get('website')) return // honeypot
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          company: fd.get('company'),
          message: fd.get('message'),
          services,
          budget: budget[0] ?? '',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus({ kind: 'sent' })
      form.reset()
      setServices([])
      setBudget([])
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="form" role="status">
        <p className="ink" style={{ color: 'var(--ink)' }}>
          Thank you. We read every enquiry and reply within two working days.
        </p>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={submit} noValidate={false}>
      <div className="row2">
        <div className="field">
          <label htmlFor="f-name">Your name</label>
          <input className="input" id="f-name" name="name" required autoComplete="name" placeholder="Full name" />
        </div>
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input className="input" id="f-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-company">Company</label>
        <input className="input" id="f-company" name="company" autoComplete="organization" placeholder="Company or project name" />
      </div>
      <fieldset className="field">
        <legend>What do you need?</legend>
        <Toggle options={DISCIPLINES} value={services} onChange={setServices} multi />
      </fieldset>
      <fieldset className="field">
        <legend>Budget</legend>
        <Toggle options={BUDGETS} value={budget} onChange={setBudget} />
      </fieldset>
      <div className="field">
        <label htmlFor="f-message">About the project</label>
        <textarea ref={message} className="input" id="f-message" name="message" required placeholder="What are you making, and when does it need to launch?" />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr" aria-hidden="true" />
      {status.kind === 'error' && (
        <p className="note err" role="alert">
          {status.message} You can also write to {email}.
        </p>
      )}
      <button className="send" type="submit" disabled={status.kind === 'sending'}>
        {status.kind === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
