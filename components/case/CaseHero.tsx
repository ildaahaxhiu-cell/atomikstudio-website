'use client'

import { useRef } from 'react'
import Frame from '../Frame'
import { gsap, useGSAP } from '@/lib/gsap'
import type { Media, Project } from '@/lib/types'

/** Cover image that opens from the page gutters to full bleed as you scroll. */
export default function CaseHero({ media, project }: { media: Media; project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const clip = ref.current!.querySelector('.clip')!
        gsap.to(clip, { clipPath: 'inset(0px 0px 0px 0px)', ease: 'none', scrollTrigger: { trigger: clip, start: 'top 85%', end: 'top 15%', scrub: true } })
        gsap.fromTo(clip.querySelector('.par'), { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: clip, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    },
    { scope: ref },
  )
  return (
    <div className="case-hero" ref={ref}>
      <div className="clip" style={{ aspectRatio: `${Math.max(media.w / media.h, 1.5)}` }}>
        <div className="par">
          <Frame media={media} project={project} priority sizes="100vw" />
        </div>
      </div>
    </div>
  )
}
