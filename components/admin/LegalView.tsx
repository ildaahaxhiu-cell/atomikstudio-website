'use client'

import { useState } from 'react'
import { useAdmin } from './AdminApp'
import { Area, ConfirmButton, Field, move, Section, Text } from './ui'
import type { LegalKey, LegalPage } from '@/lib/types'

const PAGES: { key: LegalKey; label: string; href: string }[] = [
  { key: 'privacy', label: 'Privacy Policy', href: '/privacy' },
  { key: 'terms', label: 'Terms of Use', href: '/terms' },
  { key: 'cookies', label: 'Cookie Policy', href: '/cookies' },
]

const today = () => new Date().toISOString().slice(0, 10)

export default function LegalView() {
  const { content, setContent } = useAdmin()
  const [which, setWhich] = useState<LegalKey>('privacy')
  const page = content.legal[which]
  const meta = PAGES.find((p) => p.key === which)!

  const update = (patch: Partial<LegalPage>) => setContent((c) => ({ ...c, legal: { ...c.legal, [which]: { ...c.legal[which], ...patch } } }))
  const sections = page.sections
  const setSections = (s: LegalPage['sections']) => update({ sections: s })

  return (
    <>
      <header className="ptitle pad">
        <h1>Legal</h1>
        <div className="side">
          <span className="mono grey">Privacy, terms and cookies</span>
          <div className="filters" role="group" aria-label="Legal page">
            {PAGES.map((p) => (
              <button key={p.key} type="button" className="chip" aria-pressed={p.key === which} onClick={() => setWhich(p.key)}>
                {p.label}
              </button>
            ))}
          </div>
          <a className="linkbtn" href={meta.href} target="_blank" rel="noopener" style={{ justifySelf: 'start' }}>
            Open the published page ↗
          </a>
        </div>
      </header>

      <div className="pad sbody">
        <p className="note" style={{ maxWidth: '70ch' }}>
          These are drafts written for a studio in Albania with clients in the EU. Have a lawyer read them before you rely on them. Words in braces fill in
          from Site settings: {'{company}'}, {'{email}'}, {'{city}'}, {'{country}'}, {'{address}'}, {'{registration}'} and {'{details}'} (all company details on
          separate lines). Start a line with “- ” to make a bullet list; leave an empty line between paragraphs.
        </p>

        <Section title={meta.label}>
          <Text label="Page title" value={page.title} onChange={(v) => update({ title: v })} />
          <Field label="Last updated" hint="Change this whenever you change the text.">
            {(id) => (
              <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
                <input id={id} className="input" value={page.updated} placeholder="YYYY-MM-DD" onChange={(e) => update({ updated: e.target.value })} />
                <button type="button" className="chip" onClick={() => update({ updated: today() })}>
                  Today
                </button>
              </div>
            )}
          </Field>
          <Area label="Introduction" rows={3} value={page.intro} onChange={(v) => update({ intro: v })} />
        </Section>

        <Section title="Sections" note="Numbered on the page in this order">
          {sections.map((s, i) => (
            <div className="card-edit wide" key={i}>
              <div className="steprow">
                <span className="mono grey">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <button type="button" className="chip" aria-label="Move up" disabled={i === 0} onClick={() => setSections(move(sections, i, i - 1))}>
                    ↑
                  </button>
                  <button type="button" className="chip" aria-label="Move down" disabled={i === sections.length - 1} onClick={() => setSections(move(sections, i, i + 1))}>
                    ↓
                  </button>
                  <ConfirmButton label="Remove" confirm="Remove?" className="chip" onConfirm={() => setSections(sections.filter((_, k) => k !== i))} />
                </span>
              </div>
              <Text label="Heading" value={s.heading} onChange={(v) => setSections(sections.map((x, k) => (k === i ? { ...x, heading: v } : x)))} big />
              <Area label="Text" rows={8} value={s.body} onChange={(v) => setSections(sections.map((x, k) => (k === i ? { ...x, body: v } : x)))} />
            </div>
          ))}
          <button type="button" className="chip" onClick={() => setSections([...sections, { heading: 'New section', body: '' }])}>
            Add section
          </button>
        </Section>
      </div>
    </>
  )
}
