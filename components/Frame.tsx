import Image from 'next/image'
import type { Media, PlaceholderVariant, Project } from '@/lib/types'

type Props = {
  media?: Media
  project: Pick<Project, 'name' | 'services'>
  /** Used when there is no media, e.g. for cursor previews. */
  variant?: PlaceholderVariant
  sizes?: string
  priority?: boolean
  className?: string
}

const SCALE = [1, 0.82, 0.66, 0.52, 0.4]

/** A project image, or a typographic stand-in until real images are uploaded. */
export default function Frame({ media, project, variant, sizes = '100vw', priority, className = '' }: Props) {
  if (media?.kind === 'image' && media.src) {
    return (
      <div className={`fr fr-img ${className}`}>
        <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} />
      </div>
    )
  }
  const v = media?.variant ?? variant ?? 'rep'
  const label = <span className="ph mono">Image placeholder</span>
  if (v === 'init') {
    return (
      <div className={`fr fr-init ${className}`} role="img" aria-label={media?.alt ?? project.name}>
        <span aria-hidden="true">{project.name.charAt(0).toLowerCase()}</span>
        <em aria-hidden="true">{project.name}</em>
        {label}
      </div>
    )
  }
  if (v === 'grid') {
    return (
      <div className={`fr fr-grid ${className}`} role="img" aria-label={media?.alt ?? project.name}>
        <span aria-hidden="true">{project.name}</span>
        <em className="mono" aria-hidden="true">
          {project.services.join(' / ')}
        </em>
        {label}
      </div>
    )
  }
  const word = project.name.split(' ')[0]
  return (
    <div className={`fr fr-rep ${className}`} role="img" aria-label={media?.alt ?? project.name}>
      {SCALE.map((s) => (
        <span key={s} aria-hidden="true" style={{ fontSize: `calc(${s} * min(26cqw, 20cqh))` }}>
          {word}
        </span>
      ))}
      {label}
    </div>
  )
}
