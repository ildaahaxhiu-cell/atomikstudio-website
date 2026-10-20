'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import Frame from './Frame'
import { gsap, useGSAP } from '@/lib/gsap'
import type { Project } from '@/lib/types'

/** Project list with a preview that follows the cursor on hover. */
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  const list = useRef<HTMLUListElement>(null)
  const peek = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const qx = gsap.quickTo(peek.current, 'x', { duration: 0.55, ease: 'power3' })
      const qy = gsap.quickTo(peek.current, 'y', { duration: 0.55, ease: 'power3' })
      const move = (e: PointerEvent) => {
        qx(e.clientX + 150)
        qy(e.clientY)
      }
      list.current!.addEventListener('pointermove', move)
      return () => list.current?.removeEventListener('pointermove', move)
    })
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>(list.current!.children).forEach((el) => {
        gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%' } })
      })
    })
  }, { dependencies: [projects.length], revertOnUpdate: true })

  const p = hover !== null ? projects[hover] : null
  return (
    <>
      <ul className="rows" ref={list} onPointerLeave={() => setHover(null)}>
        {projects.map((x, i) => (
          <li key={x.slug}>
            <Link href={`/work/${x.slug}`} onPointerEnter={() => setHover(i)}>
              <span className="n">{x.name}</span>
              <span className="c">{x.sector}</span>
              <span className="s">{x.services.join(', ')}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className={`peek${p ? ' on' : ''}`} ref={peek} aria-hidden="true">
        {p && <Frame media={p.media[0]} project={p} variant={(['rep', 'init', 'grid'] as const)[hover! % 3]} sizes="260px" />}
      </div>
    </>
  )
}
