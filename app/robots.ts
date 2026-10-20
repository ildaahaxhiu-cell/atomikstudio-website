import type { MetadataRoute } from 'next'

import { SITE_URL as site } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api'] }], sitemap: `${site}/sitemap.xml` }
}
