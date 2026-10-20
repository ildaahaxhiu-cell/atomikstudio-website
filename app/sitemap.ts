import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/content'
import { SITE_URL as site } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()
  return [
    { url: `${site}/`, priority: 1 },
    { url: `${site}/work`, priority: 0.9 },
    ...projects.map((p) => ({ url: `${site}/work/${p.slug}`, priority: 0.8 })),
    { url: `${site}/studio`, priority: 0.7 },
    { url: `${site}/contact`, priority: 0.7 },
    ...['privacy', 'terms', 'cookies'].map((k) => ({ url: `${site}/${k}`, priority: 0.2 })),
  ]
}
