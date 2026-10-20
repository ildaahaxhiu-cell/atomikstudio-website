export type Discipline = 'Branding' | 'Production' | 'Web design' | 'Art direction'

export const DISCIPLINES: Discipline[] = ['Branding', 'Production', 'Web design', 'Art direction']

/** Placeholder layouts used until a project has real images. */
export type PlaceholderVariant = 'rep' | 'init' | 'grid'

export type Media = {
  key: string
  kind: 'image' | 'placeholder'
  src?: string
  alt: string
  w: number
  h: number
  variant?: PlaceholderVariant
}

export type Credit = { role: string; name: string }

export type Project = {
  slug: string
  name: string
  sector: string
  disciplines: Discipline[]
  services: string[]
  year?: number
  summary: string
  intro: string
  media: Media[]
  credits: Credit[]
  featured: boolean
  /** Typical cost of a similar project, in settings.currency. Hidden when empty. */
  cost?: number
}

export type Service = { name: Discipline; description: string; items: string[] }

export type Settings = {
  email: string
  instagram: string
  city: string
  country: string
  heroLine: string
  statement: string
  clients: string[]
  services: Service[]
  approach: { title: string; text: string }[]
  /** ISO currency for project costs and the contact form budgets, e.g. "USD". */
  currency: string
  /** Legal entity details shown on the legal pages. */
  legalName: string
  address: string
  registration: string
}

/** An uploaded image as stored in content/site.json. */
export type StoredImage = { src: string; alt: string; w: number; h: number }

/** A project as stored; `media` holds only real images (placeholders are generated when empty). */
export type StoredProject = Omit<Project, 'media'> & { media: StoredImage[] }

export type LegalSection = { heading: string; body: string }
export type LegalPage = { title: string; updated: string; intro: string; sections: LegalSection[] }
export type LegalKey = 'privacy' | 'terms' | 'cookies'

export type SiteContent = { settings: Settings; projects: StoredProject[]; legal: Record<LegalKey, LegalPage> }
