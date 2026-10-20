import type { Settings } from './types'

/** "about $8,000" style amount in the site currency. */
export function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString('en-US')}`
  }
}

/** Fills {company}, {email}, {city}, {country}, {address}, {registration} and {details} in legal text. */
export function fillTokens(text: string, s: Settings) {
  const details = [s.legalName || 'Atomik Studio', s.address || `${s.city}, ${s.country}`, s.registration ? `Registration no. ${s.registration}` : '', s.email]
    .filter(Boolean)
    .join('\n')
  const map: Record<string, string> = {
    company: s.legalName || 'Atomik Studio',
    email: s.email,
    city: s.city,
    country: s.country,
    address: s.address || `${s.city}, ${s.country}`,
    registration: s.registration,
    details,
  }
  return text.replace(/\{(\w+)\}/g, (m, k: string) => map[k] ?? m)
}

/** Splits text into paragraphs and "- " bullet lists. */
export function blocks(text: string): ({ type: 'p'; lines: string[] } | { type: 'ul'; items: string[] })[] {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.split('\n').filter((l) => l.trim()))
    .filter((lines) => lines.length)
    .map((lines) => (lines.every((l) => l.trim().startsWith('- ')) ? { type: 'ul' as const, items: lines.map((l) => l.trim().slice(2)) } : { type: 'p' as const, lines }))
}
