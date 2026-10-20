import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/content'

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3030'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()
  return [
    { url: `${site}/`, priority: 1 },
    { url: `${site}/work`, priority: 0.9 },
    ...projects.map((p) => ({ url: `${site}/work/${p.slug}`, priority: 0.8 })),
    { url: `${site}/studio`, priority: 0.7 },
    { url: `${site}/contact`, priority: 0.7 },
  ]
}
