import { DISCIPLINES, type Discipline, type SiteContent, type StoredProject } from '@/lib/types'

const str = (v: unknown, max = 5000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const strs = (v: unknown, max = 200) => (Array.isArray(v) ? v.map((x) => str(x, max)).filter(Boolean) : [])

export const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

/** Cleans content sent from the editor. Returns an error message for anything a person needs to fix. */
export function cleanContent(input: unknown): { content?: SiteContent; error?: string } {
  const c = input as Partial<SiteContent> | null
  if (!c || typeof c !== 'object' || !c.settings || !Array.isArray(c.projects)) return { error: 'The content could not be read.' }
  const s = c.settings
  const seen = new Set<string>()
  const projects: StoredProject[] = []
  for (const raw of c.projects) {
    const p = raw as Partial<StoredProject>
    const name = str(p.name, 120)
    if (!name) return { error: 'Every project needs a name.' }
    const slug = slugify(str(p.slug, 80) || name)
    if (!slug) return { error: `"${name}" needs a web address.` }
    if (seen.has(slug)) return { error: `Two projects use the address /work/${slug}. Change one of them.` }
    seen.add(slug)
    const year = Number(p.year)
    projects.push({
      slug,
      name,
      sector: str(p.sector, 120),
      disciplines: strs(p.disciplines).filter((d): d is Discipline => (DISCIPLINES as string[]).includes(d)),
      services: strs(p.services, 60),
      ...(Number.isInteger(year) && year > 1990 && year < 2100 ? { year } : {}),
      summary: str(p.summary, 300),
      intro: str(p.intro, 3000),
      featured: p.featured !== false,
      credits: (Array.isArray(p.credits) ? p.credits : [])
        .map((x) => ({ role: str(x?.role, 120), name: str(x?.name, 120) }))
        .filter((x) => x.name || x.role),
      media: (Array.isArray(p.media) ? p.media : [])
        .filter((m) => typeof m?.src === 'string' && m.src.startsWith('/work/'))
        .map((m) => ({ src: m.src, alt: str(m.alt, 200) || name, w: Math.max(1, Math.round(Number(m.w) || 4)), h: Math.max(1, Math.round(Number(m.h) || 5)) })),
    })
  }
  return {
    content: {
      settings: {
        email: str(s.email, 200),
        instagram: str(s.instagram, 300),
        city: str(s.city, 80),
        country: str(s.country, 80),
        heroLine: str(s.heroLine, 300),
        statement: str(s.statement, 1200),
        clients: strs(s.clients, 80),
        services: (Array.isArray(s.services) ? s.services : [])
          .map((x) => ({ name: str(x?.name, 40) as Discipline, description: str(x?.description, 400), items: strs(x?.items, 40) }))
          .filter((x) => x.name),
        approach: (Array.isArray(s.approach) ? s.approach : []).map((x) => ({ title: str(x?.title, 60), text: str(x?.text, 600) })).filter((x) => x.title),
      },
      projects,
    },
  }
}
