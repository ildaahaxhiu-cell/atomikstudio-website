'use client'

import { useAdmin } from './AdminApp'
import Thumb from './Thumb'
import { move } from './ui'

const pad2 = (n: number) => String(n).padStart(2, '0')

export default function ProjectsView() {
  const { content, setContent, go } = useAdmin()
  const list = content.projects
  const reorder = (from: number, to: number) => setContent((c) => ({ ...c, projects: move(c.projects, from, to) }))

  // New projects go to the top as drafts; they reach the site on the next publish.
  const create = () => {
    const taken = new Set(list.map((p) => p.slug))
    let n = 1
    while (taken.has(`new-project-${n}`)) n++
    const slug = `new-project-${n}`
    setContent((c) => ({
      ...c,
      projects: [{ slug, name: `New project ${n}`, sector: '', disciplines: [], services: [], summary: '', intro: '', featured: false, credits: [], media: [] }, ...c.projects],
    }))
    go(`project/${slug}`)
  }

  return (
    <>
      <header className="ptitle pad">
        <h1>Projects</h1>
        <div className="side">
          <span className="mono grey">{pad2(list.length)} projects</span>
          <p style={{ margin: 0 }}>The order here is the order on the site. Projects marked “On homepage” appear as the big cards.</p>
          <button type="button" className="send" style={{ justifySelf: 'start' }} onClick={create}>
            New project
          </button>
        </div>
      </header>
      <ul className="plist pad">
        {list.map((p, i) => (
          <li key={p.slug}>
            <span className="mono grey num">{pad2(i + 1)}</span>
            <button type="button" className="prow" onClick={() => go(`project/${p.slug}`)}>
              <Thumb p={p} />
              <span className="pname">{p.name}</span>
              <span className="grey">{p.sector}</span>
              <span className="pmeta">
                <span className={`tag${p.featured ? ' on' : ''}`}>{p.featured ? 'On homepage' : 'Work page only'}</span>
                <span className="grey">{p.media.length ? `${p.media.length} images` : 'No images yet'}</span>
              </span>
            </button>
            <span className="order">
              <button type="button" className="chip" aria-label={`Move ${p.name} up`} disabled={i === 0} onClick={() => reorder(i, i - 1)}>
                ↑
              </button>
              <button type="button" className="chip" aria-label={`Move ${p.name} down`} disabled={i === list.length - 1} onClick={() => reorder(i, i + 1)}>
                ↓
              </button>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
