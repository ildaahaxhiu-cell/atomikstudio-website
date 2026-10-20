'use client'

import { useState, type FormEvent } from 'react'

export default function Login() {
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const password = String(new FormData(e.currentTarget).get('password') ?? '')
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) return location.reload()
    const data = await res.json().catch(() => ({}))
    setErr(data.error || 'Could not sign in.')
    setBusy(false)
  }

  return (
    <main className="login pad">
      <h1 className="lmark">atomik</h1>
      <form className="lform" onSubmit={submit}>
        <span className="mono grey">Content editor</span>
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input id="pw" name="password" type="password" className="input" autoComplete="current-password" required autoFocus />
        </div>
        {err && (
          <p className="note err" role="alert">
            {err}
          </p>
        )}
        <button className="send" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
