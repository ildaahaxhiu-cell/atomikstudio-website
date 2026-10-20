import 'server-only'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import site from '@/content/site.json'
import type { Media, Project, SiteContent, StoredProject } from './types'

// Site content is content/site.json, edited through /admin. Production is rebuilt on every publish,
// so it uses the bundled copy; local dev re-reads the file so editor saves show up straight away.
function load(): SiteContent {
  if (process.env.NODE_ENV === 'development') {
    return JSON.parse(readFileSync(path.join(process.cwd(), 'content/site.json'), 'utf8'))
  }
  return site as SiteContent
}

// Typographic stand-ins for projects that have no images yet.
const RATIOS: [number, number][] = [[16, 9], [4, 5], [4, 5], [16, 10], [1, 1], [3, 4], [3, 4]]
const VARIANTS = ['rep', 'init', 'grid'] as const

function toProject(p: StoredProject): Project {
  const media: Media[] = p.media.length
    ? p.media.map((m, i) => ({ key: `${p.slug}-${i}-${m.src}`, kind: 'image', ...m }))
    : RATIOS.map(([w, h], i) => ({ key: `${p.slug}-ph-${i}`, kind: 'placeholder', alt: `${p.name}, image ${i + 1}`, w, h, variant: VARIANTS[i % 3] }))
  return { ...p, media }
}

export async function getProjects() {
  return load().projects.map(toProject)
}

export async function getProject(slug: string) {
  const projects = await getProjects()
  const i = projects.findIndex((p) => p.slug === slug)
  if (i < 0) return null
  return { project: projects[i], index: i, total: projects.length, next: projects[(i + 1) % projects.length] }
}

export async function getSettings() {
  return load().settings
}
