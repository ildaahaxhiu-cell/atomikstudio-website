'use client'

import { useAdmin } from './AdminApp'
import type { StoredImage, StoredProject } from '@/lib/types'

/** Image in the editor: the local preview if it was just uploaded, else the file on the site. */
export function Img({ m, className }: { m: StoredImage; className?: string }) {
  const { previews } = useAdmin()
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={previews[m.src] ?? m.src} alt={m.alt} draggable={false} />
}

/** A project's cover, or the same typographic placeholder the site shows. */
export default function Thumb({ p }: { p: Pick<StoredProject, 'name' | 'media'> }) {
  const cover = p.media[0]
  if (cover) return <Img m={cover} className="thumb" />
  const word = (p.name || 'Untitled').split(' ')[0]
  return (
    <div className="thumb fr-rep" aria-hidden="true">
      {[1, 0.82, 0.66].map((s) => (
        <span key={s} style={{ fontSize: `calc(${s} * min(26cqw, 20cqh))` }}>
          {word}
        </span>
      ))}
    </div>
  )
}
