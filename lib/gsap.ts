'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Breakpoint conditions shared by every animated component. */
export const MOTION = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 761px)',
  wide: '(min-width: 901px)',
  fine: '(hover: hover) and (pointer: fine)',
}

export { gsap, ScrollTrigger, useGSAP }
