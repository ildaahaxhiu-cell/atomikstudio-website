import 'server-only'
import { projects, settings } from './data'

// All content lives in lib/data.ts. These stay async so pages don't change if a CMS is added later.

export async function getProjects() {
  return projects
}

export async function getProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i < 0) return null
  return { project: projects[i], index: i, total: projects.length, next: projects[(i + 1) % projects.length] }
}

export async function getSettings() {
  return settings
}
