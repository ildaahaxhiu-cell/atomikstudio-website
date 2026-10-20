'use client'

import { useEffect, useMemo, useState } from 'react'
import DragStrip from './DragStrip'
import ProjectIndex from '../ProjectIndex'
import Rise from '../Rise'
import { ScrollTrigger } from '@/lib/gsap'
import { DISCIPLINES, type Discipline, type Project } from '@/lib/types'

type View = 'strips' | 'index'

export default function WorkBrowser({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Discipline | 'All'>('All')
  const [view, setView] = useState<View>('strips')

  const counts = useMemo(() => {
    const c = new Map<string, number>()
    for (const d of DISCIPLINES) c.set(d, projects.filter((p) => p.disciplines.includes(d)).length)
    return c
  }, [projects])

  const shown = filter === 'All' ? projects : projects.filter((p) => p.disciplines.includes(filter))

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [filter, view])

  return (
    <>
      <div className="toolbar pad">
        <div className="filters" role="group" aria-label="Filter by discipline">
          <button type="button" className="chip" aria-pressed={filter === 'All'} onClick={() => setFilter('All')}>
            All<sup>{projects.length}</sup>
          </button>
          {DISCIPLINES.filter((d) => counts.get(d)).map((d) => (
            <button key={d} type="button" className="chip" aria-pressed={filter === d} onClick={() => setFilter(d)}>
              {d}
              <sup>{counts.get(d)}</sup>
            </button>
          ))}
        </div>
        <div className="views" role="group" aria-label="Layout">
          <button type="button" className="chip" aria-pressed={view === 'strips'} onClick={() => setView('strips')}>
            Images
          </button>
          <button type="button" className="chip" aria-pressed={view === 'index'} onClick={() => setView('index')}>
            Index
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="empty pad">No projects in {filter} yet.</p>
      ) : view === 'strips' ? (
        <Rise key={filter} className="strips">
          {shown.map((p) => (
            <DragStrip key={p.slug} project={p} />
          ))}
        </Rise>
      ) : (
        <section className="index pad" key={filter} aria-label="Project index">
          <ProjectIndex projects={shown} />
        </section>
      )}
    </>
  )
}
