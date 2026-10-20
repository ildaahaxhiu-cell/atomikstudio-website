'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Frame from './Frame'
import { gsap } from '@/lib/gsap'
import type { Project } from '@/lib/types'

const DURATION = 3600
const COUNT = 3

/** Story-style slideshow: auto-advances while visible, image drifts toward the cursor. */
export default function StoryMedia({ project }: { project: Project }) {
  const root = useRef<HTMLAnchorElement>(null)
  const frames = useRef<HTMLDivElement>(null)
  const bars = useRef<(HTMLElement | null)[]>([])
  const [cur, setCur] = useState(0)
  const media = project.media.slice(0, COUNT)
  const count = Math.max(media.length, 1)

  useEffect(() => {
    const el = root.current!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || count < 2) {
      if (bars.current[0]) bars.current[0].style.transform = 'scaleX(1)'
      return
    }
    let visible = false
    let acc = 0
    let last = performance.now()
    let i = 0
    let raf = 0
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    const loop = (now: number) => {
      const dt = now - last
      last = now
      if (visible) {
        acc += dt
        const b = bars.current[i]
        if (b) b.style.transform = `scaleX(${Math.min(acc / DURATION, 1)})`
        if (acc >= DURATION) {
          acc = 0
          i = (i + 1) % count
          if (i === 0) bars.current.forEach((x) => x && (x.style.transform = 'scaleX(0)'))
          setCur(i)
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Cursor drift on fine pointers.
    let cleanupMove = () => {}
    if (matchMedia('(hover: hover) and (pointer: fine)').matches && frames.current) {
      const qx = gsap.quickTo(frames.current, 'x', { duration: 0.9, ease: 'power3' })
      const qy = gsap.quickTo(frames.current, 'y', { duration: 0.9, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        qx(((e.clientX - r.left) / r.width - 0.5) * -28)
        qy(((e.clientY - r.top) / r.height - 0.5) * -28)
      }
      const leave = () => {
        qx(0)
        qy(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      cleanupMove = () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    }
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      cleanupMove()
    }
  }, [count])

  return (
    <Link href={`/work/${project.slug}`} className="story" ref={root} aria-label={`${project.name}, view project`}>
      <div className="bars" aria-hidden="true">
        {Array.from({ length: count }, (_, k) => (
          <i key={k}>
            <b ref={(n) => void (bars.current[k] = n)} />
          </i>
        ))}
      </div>
      <div className="frames" ref={frames}>
        {(media.length ? media : [undefined]).map((m, k) => (
          <Frame key={m?.key ?? k} media={m} project={project} className={k === cur ? 'on' : ''} sizes="(min-width: 761px) 66vw, 100vw" />
        ))}
      </div>
    </Link>
  )
}
