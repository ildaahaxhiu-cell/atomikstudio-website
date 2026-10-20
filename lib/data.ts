import type { Media, Project, Settings } from './types'

// All site content. Project facts come from Atomik's Instagram posts; descriptions are drafts to confirm.
//
// Adding real images: put files in public/work/<slug>/ and replace a project's `placeholders(...)`
// with `images('<slug>', [['01.jpg', 1600, 900, 'Alt text'], ...])` (width and height in pixels).
// Wide images run full width on the case study, tall ones are paired. The first is the cover.

export function images(slug: string, files: [file: string, w: number, h: number, alt: string][]): Media[] {
  return files.map(([file, w, h, alt]) => ({ key: `${slug}-${file}`, kind: 'image', src: `/work/${slug}/${file}`, alt, w, h }))
}

const ratios: [number, number][] = [
  [16, 9],
  [4, 5],
  [4, 5],
  [16, 10],
  [1, 1],
  [3, 4],
  [3, 4],
]
const variants = ['rep', 'init', 'grid'] as const

function placeholders(name: string): Media[] {
  return ratios.map(([w, h], i) => ({
    key: `${name}-${i}`,
    kind: 'placeholder',
    alt: `${name}, image ${i + 1}`,
    w,
    h,
    variant: variants[i % variants.length],
  }))
}

export const projects: Project[] = [
  {
    slug: 'skin-puls',
    name: 'Skin Puls',
    sector: 'Aesthetic clinic',
    disciplines: ['Branding', 'Web design'],
    services: ['Brand identity', 'Website'],
    summary: 'Identity and website for a skin and aesthetics clinic.',
    intro:
      'Skin Puls offers advanced skin treatments in a clinical setting. We built an identity that feels precise without feeling cold, and a website that explains each treatment plainly and makes booking simple.',
    media: placeholders('Skin Puls'),
    credits: [{ role: 'Brand identity, website', name: 'Atomik Studio' }],
    featured: true,
  },
  {
    slug: 'harmona',
    name: 'Harmona',
    sector: "Women's health clinic",
    disciplines: ['Branding', 'Art direction'],
    services: ['Brand identity', 'Digital direction'],
    summary: 'A calm, clinical identity for a clinic focused on hormonal and fertility care.',
    intro:
      'Harmona is a women’s health clinic specialising in hormonal balance and fertility. The identity is quiet and warm, carried through signage, stationery and the clinic’s digital channels.',
    media: placeholders('Harmona'),
    credits: [{ role: 'Brand identity, digital direction', name: 'Atomik Studio' }],
    featured: true,
  },
  {
    slug: 'tirana-independent-film-festival',
    name: 'Tirana Independent Film Festival',
    sector: 'Culture',
    disciplines: ['Branding', 'Art direction', 'Web design'],
    services: ['Identity', 'Campaign', 'Website'],
    summary: 'Festival identity, poster campaign and website.',
    intro:
      'For the Tirana Independent Film Festival we designed an identity that works across posters, screens and the city itself, along with a campaign and a programme website.',
    media: placeholders('Tirana Independent Film Festival'),
    credits: [{ role: 'Identity, campaign, website', name: 'Atomik Studio' }],
    featured: true,
  },
  {
    slug: 'tenzor',
    name: 'Tenzor',
    sector: 'Real estate',
    disciplines: ['Branding'],
    services: ['Visual identity', 'Stationery'],
    summary: 'Identity and stationery for a real estate partner.',
    intro:
      'Tenzor works with buyers and developers across Albania. We gave the company a clear visual identity and a stationery system for its day-to-day work with clients.',
    media: placeholders('Tenzor'),
    credits: [{ role: 'Visual identity, stationery', name: 'Atomik Studio' }],
    featured: true,
  },
  {
    slug: 'the-brand-soul',
    name: 'The Brand Soul',
    sector: 'Publication',
    disciplines: ['Art direction', 'Production'],
    services: ['Editorial', 'Art direction'],
    summary: 'A printed publication on how brands are built.',
    intro:
      'The Brand Soul is a printed publication on how brands are made, from the first idea to the finished system. We wrote, designed and produced it in-house.',
    media: placeholders('The Brand Soul'),
    credits: [{ role: 'Editorial, art direction', name: 'Atomik Studio' }],
    featured: true,
  },
]

export const settings: Settings = {
  email: 'hello@atomik.studio',
  instagram: 'https://www.instagram.com/atomikkstudio/',
  city: 'Tirana',
  country: 'Albania',
  heroLine: 'Independent design studio in Tirana, working with companies in Albania and abroad.',
  statement:
    'Atomik is an independent design studio. We build brand identities, produce photography and film, and design websites for companies that care how they are seen. We stay with each project from the first brief to the day it launches.',
  clients: ['Skin Puls', 'Harmona', 'Tenzor', 'TIFF', 'The Brand Soul'],
  services: [
    {
      name: 'Branding',
      description: 'Positioning, naming and identity systems, with guidelines your team can actually use.',
      items: ['Strategy', 'Naming', 'Identity', 'Guidelines', 'Packaging'],
    },
    {
      name: 'Production',
      description: 'Photography, film and content, produced and art directed in-house.',
      items: ['Photography', 'Film', 'Social content', 'Post-production'],
    },
    {
      name: 'Web design',
      description: 'Websites designed and developed by the same team that made the brand.',
      items: ['UX', 'Interface', 'Development', 'CMS'],
    },
    {
      name: 'Art direction',
      description: 'Campaigns, launches and editorial work, directed from concept to final frame.',
      items: ['Campaigns', 'Editorial', 'Launches', 'Events'],
    },
  ],
  approach: [
    { title: 'Listen', text: 'We start with your business, your audience and what has to change. Most of the answers are already in the room.' },
    { title: 'Define', text: 'We agree on a position and a direction in writing before anything is designed, so every later decision has something to answer to.' },
    { title: 'Make', text: 'Identity, photography, film and web are designed by one team, so the pieces are made to work together.' },
    { title: 'Launch', text: 'We prepare the files, guidelines and handover, and stay on after launch to help the brand settle in.' },
  ],
}
