'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/** Big heading whose lines slide up out of a mask on load. Pass lines explicitly to control breaks. */
export default function SplitTitle({ lines, className }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(ref.current!.querySelectorAll('.ln > span'), { yPercent: 105, duration: 1.2, stagger: 0.09, ease: 'expo.out', delay: 0.1 })
      })
    },
    { scope: ref },
  )
  return (
    <h1 ref={ref} className={className}>
      {lines.map((l, i) => (
        <span className="ln" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </h1>
  )
}
