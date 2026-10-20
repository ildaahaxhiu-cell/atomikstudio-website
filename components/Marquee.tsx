'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

/** Endless "Enquiries" line that speeds up with scroll velocity. */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      const loop = gsap.to(track.current, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 })
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (s) => {
          const v = Math.min(Math.abs(s.getVelocity()) / 300, 6)
          gsap.to(loop, {
            timeScale: 1 + v,
            duration: 0.2,
            overwrite: true,
            onComplete: () => void gsap.to(loop, { timeScale: 1, duration: 1.2, overwrite: true }),
          })
        },
      })
    })
  })
  const item = (
    <span>
      Enquiries <i>·</i> New projects <i>·</i>
    </span>
  )
  return (
    <Link href="/contact" className="marquee" aria-label="Enquiries: start a project">
      <div className="mq" ref={track} aria-hidden="true">
        {item}
        {item}
      </div>
    </Link>
  )
}
