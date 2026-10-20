import 'server-only'
import { createClient, defineQuery } from 'next-sanity'
import { apiVersion, dataset, hasSanity, projectId } from '@/sanity/env'
import { seedProjects, seedSettings } from './seed'
import type { Discipline, Media, Project, Settings } from './types'

const client = hasSanity ? createClient({ projectId, dataset, apiVersion, useCdn: true }) : null
const REVALIDATE = 60

const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(coalesce(order, 999) asc, _createdAt asc){
  name, "slug": slug.current, sector, disciplines, services, year, summary, intro, featured, credits,
  media[]{ _key, alt, "src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height }
}`)

const settingsQuery = defineQuery(`*[_type == "settings" && _id == "settings"][0]`)

type RawProject = Omit<Project, 'media' | 'disciplines'> & {
  disciplines?: Discipline[] | null
  media?: { _key: string; alt?: string; src?: string; w?: number; h?: number }[] | null
}

function normalise(p: RawProject): Project {
  const media: Media[] = (p.media ?? [])
    .filter((m) => m.src)
    .map((m) => ({ key: m._key, kind: 'image', src: m.src, alt: m.alt ?? p.name, w: m.w ?? 4, h: m.h ?? 5 }))
  return {
    ...p,
    sector: p.sector ?? '',
    summary: p.summary ?? '',
    intro: p.intro ?? '',
    services: p.services ?? [],
    credits: p.credits ?? [],
    featured: p.featured ?? true,
    disciplines: p.disciplines ?? [],
    media,
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!client) return seedProjects
  try {
    const rows = await client.fetch<RawProject[]>(projectsQuery, {}, { next: { revalidate: REVALIDATE } })
    return rows.length ? rows.map(normalise) : seedProjects
  } catch {
    return seedProjects
  }
}

export async function getProject(slug: string) {
  const all = await getProjects()
  const i = all.findIndex((p) => p.slug === slug)
  if (i < 0) return null
  return { project: all[i], index: i, total: all.length, next: all[(i + 1) % all.length] }
}

export async function getSettings(): Promise<Settings> {
  if (!client) return seedSettings
  try {
    const s = await client.fetch<Partial<Settings> | null>(settingsQuery, {}, { next: { revalidate: REVALIDATE } })
    if (!s) return seedSettings
    // Keep sample values for anything not filled in yet.
    const merged = { ...seedSettings }
    for (const k of Object.keys(seedSettings) as (keyof Settings)[]) {
      const v = s[k]
      if (v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0) && v !== '') {
        ;(merged as Record<string, unknown>)[k] = v
      }
    }
    return merged
  } catch {
    return seedSettings
  }
}
