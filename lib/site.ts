// Public URL of the site: explicit setting first, then the production domain Vercel provides.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : 'http://localhost:3030')
