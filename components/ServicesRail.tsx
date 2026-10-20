'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import type { Service } from '@/lib/types'

/** Services pinned in place while the panels slide past horizontally (desktop only). */
export default function ServicesRail({ services, title = 'Services', note = 'Four disciplines, one team' }: { services: Service[]; title?: string; note?: string }) {
  const sec = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        const tr = track.current!
        const nav = () => (document.querySelector('.nav') as HTMLElement)?.offsetHeight ?? 64
        gsap.to(tr, {
          x: () => -(tr.scrollWidth - sec.current!.clientWidth + 48),
          ease: 'none',
          scrollTrigger: { trigger: sec.current, start: () => `top top+=${nav() + 8}`, end: () => `+=${tr.scrollWidth}`, pin: true, scrub: true, invalidateOnRefresh: true },
        })
      })
    },
    { scope: sec },
  )
  return (
    <section className="services pad" id="services" ref={sec} aria-label={title}>
      <div className="shead">
        <span>{title}</span>
        <span>{note}</span>
      </div>
      <div className="htrack" ref={track}>
        {services.map((s) => (
          <article className="panel" key={s.name}>
            <h4>{s.name}</h4>
            <p>{s.description}</p>
            <ul className="chips">
              {s.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
