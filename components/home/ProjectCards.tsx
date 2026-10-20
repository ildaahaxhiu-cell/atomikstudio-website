'use client'

import Link from 'next/link'
import { useRef } from 'react'
import StoryMedia from '../StoryMedia'
import { gsap, useGSAP } from '@/lib/gsap'
import type { Project } from '@/lib/types'

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Sticky full-screen project cards; each new card pushes the previous one back. */
export default function ProjectCards({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.card')
        const nav = (document.querySelector('.nav') as HTMLElement)?.offsetHeight ?? 64
        cards.forEach((c, i) => {
          if (i === cards.length - 1) return
          gsap
            .timeline({ scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: `top top+=${nav + 12}`, scrub: true } })
            .to(c.querySelector('.card-in'), { scale: 0.94, ease: 'none' }, 0)
            .to(c.querySelectorAll('.meta, .story'), { opacity: 0.2, ease: 'none' }, 0)
        })
      })
    },
    { scope: ref },
  )
  return (
    <div className="cards" ref={ref}>
      {projects.map((p, i) => (
        <article className="card" key={p.slug} style={{ zIndex: i + 1 }}>
          <div className="card-in">
            <div className="meta">
              <div>
                <span className="num mono">
                  {pad2(i + 1)} / {pad2(projects.length)}
                </span>
                <h3>{p.name}</h3>
                <div className="cat">{p.sector}</div>
                <div className="tags">
                  {p.services.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                <p>{p.summary}</p>
                <Link className="open" href={`/work/${p.slug}`}>
                  View project
                </Link>
              </div>
            </div>
            <StoryMedia project={p} />
          </div>
        </article>
      ))}
    </div>
  )
}
