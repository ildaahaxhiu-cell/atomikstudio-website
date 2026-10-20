'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Clock from './Clock'
import { gsap, useGSAP } from '@/lib/gsap'

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/studio', label: 'Studio' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav({ city }: { city: string }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const seal = useRef<HTMLSpanElement>(null)

  useEffect(() => setOpen(false), [path])

  // The seal turns as the page scrolls.
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(seal.current, { rotation: 1080, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.6 } })
      })
    },
    { dependencies: [path], revertOnUpdate: true },
  )

  const active = (href: string) => path === href || path.startsWith(href + '/')

  return (
    <>
      <header className={`nav pad${path === '/' ? ' on-home' : ''}`}>
        <Link className="home" href="/" data-home-link aria-label="Atomik Studio, home">
          atomik
        </Link>
        <nav className="pills" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="pill" aria-current={active(l.href) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-r">
          <span className="clock">
            {city} <Clock />
          </span>
          <button className="menu-btn" type="button" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Menu'}
          </button>
          <span className="seal" ref={seal} aria-hidden="true">
            a
          </span>
        </div>
      </header>
      {open && (
        <nav id="drawer" className="drawer pad" aria-label="Menu">
          <Link href="/">Home</Link>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
