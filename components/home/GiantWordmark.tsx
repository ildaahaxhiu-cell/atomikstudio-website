'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

const NAV_SIZE = 22 // px, matches .nav .home

/** Full-width "atomik" that shrinks into the nav logo as the hero scrolls away. */
export default function GiantWordmark() {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const g = ref.current!
    const hero = g.parentElement!
    const fit = () => {
      g.style.fontSize = '100px'
      const left = parseFloat(getComputedStyle(g).left) || 24
      const avail = document.documentElement.clientWidth - left * 2
      g.style.fontSize = `${(100 * avail) / g.getBoundingClientRect().width}px`
      document.documentElement.style.setProperty('--giant-h', `${g.offsetHeight}px`)
    }
    fit()
    const onResize = () => fit()
    addEventListener('resize', onResize)
    document.fonts?.ready.then(fit)

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(g.firstElementChild, { yPercent: 40, duration: 1.4, ease: 'expo.out' })
      gsap.from(hero.querySelectorAll('.hero-meta p, .scrollcue'), { y: 14, opacity: 0, duration: 1, stagger: 0.08, delay: 0.35, ease: 'power3.out' })

      const home = document.querySelector<HTMLElement>('[data-home-link]')!
      g.classList.add('live')
      const ratio = () => (NAV_SIZE / parseFloat(g.style.fontSize)) * 1.06
      gsap.fromTo(
        g,
        { y: () => hero.offsetHeight - 12 - g.offsetHeight, scale: 1 },
        {
          y: () => {
            const r = home.getBoundingClientRect()
            return r.top + r.height / 2 - ratio() * g.offsetHeight * 0.5
          },
          scale: ratio,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top+=120', scrub: true, invalidateOnRefresh: true },
        },
      )
      return () => g.classList.remove('live')
    })
    return () => removeEventListener('resize', onResize)
  })

  return (
    <h1 className="giant" ref={ref} aria-label="Atomik Studio">
      <span aria-hidden="true">atomik</span>
    </h1>
  )
}
