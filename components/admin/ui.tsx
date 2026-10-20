'use client'

import { useId, useState, type ReactNode } from 'react'

export function Field({ label, hint, children, wide }: { label: string; hint?: string; children: (id: string) => ReactNode; wide?: boolean }) {
  const id = useId()
  return (
    <div className={`field${wide ? ' wide' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}

export function Text({ label, value, onChange, hint, placeholder, wide, big }: { label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string; wide?: boolean; big?: boolean }) {
  return (
    <Field label={label} hint={hint} wide={wide}>
      {(id) => <input id={id} className={`input${big ? ' big' : ''}`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  )
}

export function Area({ label, value, onChange, hint, placeholder, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string; rows?: number }) {
  return (
    <Field label={label} hint={hint} wide>
      {(id) => <textarea id={id} className="input" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  )
}

/** Pill buttons that toggle values on and off. */
export function Chips({ options, value, onChange, single }: { options: string[]; value: string[]; onChange: (v: string[]) => void; single?: boolean }) {
  return (
    <div className="filters">
      {options.map((o) => {
        const on = value.includes(o)
        return (
          <button key={o} type="button" className="chip" aria-pressed={on} onClick={() => onChange(single ? (on ? [] : [o]) : on ? value.filter((x) => x !== o) : [...value, o])}>
            {o}
          </button>
        )
      })}
    </div>
  )
}

/** Free-form tags: type and press Enter or comma to add; click a tag's × to remove. */
export function Tags({ label, value, onChange, placeholder, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; hint?: string }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))])
    setDraft('')
  }
  return (
    <Field label={label} hint={hint} wide>
      {(id) => (
        <div className="tagbox">
          {value.map((t, i) => (
            <span className="tag on" key={t}>
              {t}
              <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((_, k) => k !== i))}>
                ×
              </button>
            </span>
          ))}
          <input
            id={id}
            className="tagin"
            value={draft}
            placeholder={placeholder ?? 'Type and press Enter'}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={add}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                add()
              } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
            }}
          />
        </div>
      )}
    </Field>
  )
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="asec">
      <div className="shead">
        <span>{title}</span>
        {note ? <span>{note}</span> : <span />}
      </div>
      <div className="agrid">{children}</div>
    </section>
  )
}

/** Two-step confirm built into the button, since the page cannot use browser dialogs reliably. */
export function ConfirmButton({ label, confirm, onConfirm, className = 'linkbtn' }: { label: string; confirm: string; onConfirm: () => void; className?: string }) {
  const [armed, setArmed] = useState(false)
  return (
    <button
      type="button"
      className={`${className}${armed ? ' armed' : ''}`}
      onBlur={() => setArmed(false)}
      onClick={() => (armed ? (setArmed(false), onConfirm()) : setArmed(true))}
    >
      {armed ? confirm : label}
    </button>
  )
}

export function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length || from === to) return list
  const next = list.slice()
  const [x] = next.splice(from, 1)
  next.splice(to, 0, x)
  return next
}
