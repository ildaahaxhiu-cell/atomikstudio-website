'use client'

import Link from 'next/link'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import LegalView from './LegalView'
import ProjectEditor from './ProjectEditor'
import ProjectsView from './ProjectsView'
import SettingsView from './SettingsView'
import type { SiteContent, StoredProject } from '@/lib/types'

type Mode = 'github' | 'local' | 'unconfigured'
type Blob = { path: string; sha: string }
type Status = { kind: 'idle' | 'saving' | 'ok' | 'error'; text?: string }

type Ctx = {
  content: SiteContent
  setContent: (fn: (c: SiteContent) => SiteContent) => void
  /** Local previews for images uploaded this session (the live site serves them after the next deploy). */
  previews: Record<string, string>
  addUpload: (src: string, preview: string, blob?: Blob) => void
  go: (view: string) => void
  /** Changes the address without a history entry or scroll, e.g. when a project's slug is edited. */
  replaceView: (view: string) => void
  mode: Mode
}

const AdminCtx = createContext<Ctx | null>(null)
export const useAdmin = () => useContext(AdminCtx)!

const readHash = () => (typeof window === 'undefined' ? 'projects' : decodeURIComponent(location.hash.slice(1)) || 'projects')

export default function AdminApp({ initial, mode }: { initial: SiteContent; mode: Mode }) {
  const [content, setState] = useState(initial)
  const [published, setPublished] = useState(() => JSON.stringify(initial))
  const [blobs, setBlobs] = useState<Blob[]>([])
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [view, setView] = useState('projects')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const dirty = JSON.stringify(content) !== published || blobs.length > 0

  useEffect(() => {
    const sync = () => setView(readHash())
    sync()
    addEventListener('hashchange', sync)
    return () => removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    addEventListener('beforeunload', warn)
    return () => removeEventListener('beforeunload', warn)
  }, [dirty])

  const go = useCallback((v: string) => {
    location.hash = encodeURIComponent(v)
    scrollTo({ top: 0 })
  }, [])

  const replaceView = useCallback((v: string) => {
    history.replaceState(null, '', '#' + encodeURIComponent(v))
    setView(v)
  }, [])

  const setContent = useCallback((fn: (c: SiteContent) => SiteContent) => {
    setState(fn)
    setStatus((s) => (s.kind === 'ok' || s.kind === 'error' ? { kind: 'idle' } : s))
  }, [])

  const addUpload = useCallback((src: string, preview: string, blob?: Blob) => {
    setPreviews((p) => ({ ...p, [src]: preview }))
    if (blob) setBlobs((b) => [...b, blob])
  }, [])

  async function publish() {
    setStatus({ kind: 'saving' })
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content, blobs, message: 'Update content from the editor' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Publishing failed.')
      setState(data.content)
      setPublished(JSON.stringify(data.content))
      setBlobs([])
      setStatus({ kind: 'ok', text: data.mode === 'github' ? 'Published. The live site updates in about a minute.' : 'Saved to content/site.json.' })
    } catch (e) {
      setStatus({ kind: 'error', text: e instanceof Error ? e.message : 'Publishing failed.' })
    }
  }

  async function signOut() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    location.reload()
  }

  const ctx = useMemo<Ctx>(() => ({ content, setContent, previews, addUpload, go, replaceView, mode }), [content, setContent, previews, addUpload, go, replaceView, mode])

  const editing = view.startsWith('project/') ? view.slice(8) : null
  const index = editing === null ? -1 : content.projects.findIndex((p: StoredProject) => p.slug === editing)

  return (
    <AdminCtx.Provider value={ctx}>
      <header className="abar pad">
        <a className="home" href="#projects" onClick={() => go('projects')}>
          atomik <span className="mono grey">Content</span>
        </a>
        <nav className="pills" aria-label="Editor">
          <a className="pill" href="#projects" aria-current={view === 'projects' || editing ? 'page' : undefined}>
            Projects
          </a>
          <a className="pill" href="#settings" aria-current={view === 'settings' ? 'page' : undefined}>
            Site
          </a>
          <a className="pill" href="#legal" aria-current={view === 'legal' ? 'page' : undefined}>
            Legal
          </a>
          <Link className="pill" href="/" target="_blank">
            View site ↗
          </Link>
        </nav>
        <div className="nav-r">
          <span className={`state${dirty ? ' dirty' : ''}`} role="status">
            {status.kind === 'saving' ? 'Publishing…' : dirty ? 'Unpublished changes' : 'Up to date'}
          </span>
          <button type="button" className="send" disabled={!dirty || status.kind === 'saving' || mode === 'unconfigured'} onClick={publish}>
            Publish
          </button>
          <button type="button" className="linkbtn" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {(status.kind === 'ok' || status.kind === 'error') && (
        <div className={`toast pad${status.kind === 'error' ? ' err' : ''}`} role={status.kind === 'error' ? 'alert' : 'status'}>
          {status.text}
        </div>
      )}
      {mode === 'unconfigured' && (
        <div className="toast pad err" role="alert">
          Publishing is not set up: add GITHUB_TOKEN in Vercel. You can look around, but changes cannot be saved yet.
        </div>
      )}

      <main className="apage">
        {view === 'settings' ? (
          <SettingsView />
        ) : view === 'legal' ? (
          <LegalView />
        ) : index >= 0 ? (
          <ProjectEditor key={index} index={index} />
        ) : (
          <ProjectsView />
        )}
      </main>
    </AdminCtx.Provider>
  )
}
