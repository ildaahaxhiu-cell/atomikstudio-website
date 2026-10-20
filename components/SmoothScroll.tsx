'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null)
  const path = usePathname()

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('no-motion')
      return
    }
    const l = new Lenis({ lerp: 0.09, anchors: { offset: -72 } })
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
      lenis.current = null
    }
  }, [])

  // New page: start at the top and re-measure every trigger.
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [path])

  return null
}
