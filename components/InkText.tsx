'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/** Paragraph whose words darken from grey to ink as it scrolls through the viewport. */
export default function InkText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(ref.current!.querySelectorAll('.w'), {
          color: '#0a0a0a',
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', end: 'bottom 42%', scrub: true },
        })
      })
    },
    { scope: ref },
  )
  const words = text.split(' ')
  return (
    <p className={`ink ${className}`} ref={ref}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="w">{w}</span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
