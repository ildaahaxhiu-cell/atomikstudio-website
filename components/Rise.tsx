'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Children marked [data-rise] fade up as they enter; [data-par] elements drift
 * against the scroll inside their (overflow-hidden) parent.
 */
export default function Rise({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
          gsap.from(el, { y: 32, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
        })
        gsap.utils.toArray<HTMLElement>('[data-par]').forEach((el) => {
          gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
      })
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
