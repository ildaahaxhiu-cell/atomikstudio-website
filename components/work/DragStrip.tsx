'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import Frame from '../Frame'
import type { Project } from '@/lib/types'

const TILE_H = 420 // reference height used to size tiles by aspect ratio

/** A project's images in a row you can drag sideways with momentum (mouse) or swipe (touch). */
export default function DragStrip({ project }: { project: Project }) {
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scroller.current!
    let down = false
    let moved = false
    let startX = 0
    let startLeft = 0
    let lastX = 0
    let lastT = 0
    let v = 0
    let raf = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      cancelAnimationFrame(raf)
      down = true
      moved = false
      startX = lastX = e.clientX
      startLeft = el.scrollLeft
      lastT = performance.now()
      v = 0
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > 4) {
        moved = true
        el.classList.add('dragging')
      }
      if (!moved) return
      el.scrollLeft = startLeft - dx
      const t = performance.now()
      v = (e.clientX - lastX) / Math.max(t - lastT, 1)
      lastX = e.clientX
      lastT = t
    }
    const onUp = () => {
      if (!down) return
      down = false
      el.classList.remove('dragging')
      if (!moved) return
      const glide = () => {
        v *= 0.94
        if (Math.abs(v) < 0.02) return
        el.scrollLeft -= v * 16
        raf = requestAnimationFrame(glide)
      }
      raf = requestAnimationFrame(glide)
    }
    // Swallow the click that ends a drag so tiles don't navigate.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }
    el.addEventListener('pointerdown', onDown)
    addEventListener('pointermove', onMove)
    addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', onDown)
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [])

  const media = project.media.length ? project.media : [undefined]
  return (
    <article className="strip" data-rise>
      <div className="strip-head pad">
        <Link href={`/work/${project.slug}`}>
          {project.name} <span>· {project.sector}</span>
        </Link>
        <div className="tags">
          {project.services.map((s) => (
            <span className="tag" key={s}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="strip-scroll" ref={scroller} tabIndex={0} aria-label={`${project.name}, images. Scroll sideways.`}>
        <div className="strip-track">
          {media.map((m, i) => (
            <Link
              key={m?.key ?? i}
              href={`/work/${project.slug}`}
              className="tile"
              draggable={false}
              style={{ aspectRatio: m ? `${m.w} / ${m.h}` : '4 / 5' }}
              tabIndex={-1}
            >
              <Frame media={m} project={project} sizes={`${Math.round((TILE_H * (m ? m.w / m.h : 0.8)) / 1)}px`} />
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
