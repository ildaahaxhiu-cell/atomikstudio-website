'use client'

import { useAdmin } from './AdminApp'
import { Area, Chips, ConfirmButton, Field, move, Section, Tags, Text } from './ui'
import { CURRENCIES } from '@/lib/admin/validate'
import type { Settings } from '@/lib/types'

export default function SettingsView() {
  const { content, setContent } = useAdmin()
  const s = content.settings
  const update = (patch: Partial<Settings>) => setContent((c) => ({ ...c, settings: { ...c.settings, ...patch } }))

  return (
    <>
      <header className="ptitle pad">
        <h1>Site</h1>
        <div className="side">
          <span className="mono grey">Text used across pages</span>
          <p style={{ margin: 0 }}>Contact details, the homepage words, services, clients and how you work.</p>
        </div>
      </header>
      <div className="pad sbody">
        <Section title="Contact">
          <Text label="Email" value={s.email} onChange={(v) => update({ email: v })} placeholder="hello@…" />
          <Text label="Instagram link" value={s.instagram} onChange={(v) => update({ instagram: v })} placeholder="https://www.instagram.com/…" />
          <Text label="City" value={s.city} onChange={(v) => update({ city: v })} />
          <Text label="Country" value={s.country} onChange={(v) => update({ country: v })} />
        </Section>

        <Section title="Company" note="Used on the legal pages and in the footer">
          <Text label="Legal name" value={s.legalName} onChange={(v) => update({ legalName: v })} placeholder="Atomik Studio" />
          <Text label="Registration number (NUIS)" value={s.registration} onChange={(v) => update({ registration: v })} placeholder="Optional" />
          <Text label="Registered address" value={s.address} onChange={(v) => update({ address: v })} placeholder={`Street, ${s.city}, ${s.country}`} wide />
          <Field label="Currency" hint="For project costs and the budget options on the contact form." wide>
            {() => <Chips single options={CURRENCIES} value={[s.currency]} onChange={(v) => v[0] && update({ currency: v[0] })} />}
          </Field>
        </Section>

        <Section title="Homepage">
          <Area label="Intro line" rows={2} value={s.heroLine} onChange={(v) => update({ heroLine: v })} hint="Top left of the homepage, above the big wordmark." />
          <Area label="Studio statement" rows={4} value={s.statement} onChange={(v) => update({ statement: v })} hint="The paragraph that darkens word by word as you scroll (homepage and Studio page)." />
        </Section>

        <Section title="Services" note="Shown in the sideways-scrolling section">
          {s.services.map((sv, i) => (
            <div className="card-edit wide" key={i}>
              <Text label="Name" value={sv.name} onChange={(v) => update({ services: s.services.map((x, k) => (k === i ? { ...x, name: v as typeof x.name } : x)) })} big />
              <Area label="Description" rows={2} value={sv.description} onChange={(v) => update({ services: s.services.map((x, k) => (k === i ? { ...x, description: v } : x)) })} />
              <Tags label="Includes" value={sv.items} onChange={(v) => update({ services: s.services.map((x, k) => (k === i ? { ...x, items: v } : x)) })} />
            </div>
          ))}
        </Section>

        <Section title="How we work" note="Studio page, in this order">
          {s.approach.map((a, i) => (
            <div className="card-edit wide" key={i}>
              <div className="steprow">
                <span className="mono grey">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <button type="button" className="chip" aria-label="Move up" disabled={i === 0} onClick={() => update({ approach: move(s.approach, i, i - 1) })}>
                    ↑
                  </button>
                  <button type="button" className="chip" aria-label="Move down" disabled={i === s.approach.length - 1} onClick={() => update({ approach: move(s.approach, i, i + 1) })}>
                    ↓
                  </button>
                  <ConfirmButton label="Remove" confirm="Remove?" className="chip" onConfirm={() => update({ approach: s.approach.filter((_, k) => k !== i) })} />
                </span>
              </div>
              <Text label="Title" value={a.title} onChange={(v) => update({ approach: s.approach.map((x, k) => (k === i ? { ...x, title: v } : x)) })} big />
              <Area label="Text" rows={3} value={a.text} onChange={(v) => update({ approach: s.approach.map((x, k) => (k === i ? { ...x, text: v } : x)) })} />
            </div>
          ))}
          <button type="button" className="chip" onClick={() => update({ approach: [...s.approach, { title: 'New step', text: '' }] })}>
            Add step
          </button>
        </Section>

        <Section title="Clients">
          <Tags label="Selected clients" value={s.clients} onChange={(v) => update({ clients: v })} placeholder="Add a client and press Enter" hint="Listed on the Studio page." />
        </Section>
      </div>
    </>
  )
}
