import Link from 'next/link'
import { notFound } from 'next/navigation'
import SplitTitle from './SplitTitle'
import { getLegal, getSettings } from '@/lib/content'
import { blocks, fillTokens } from '@/lib/format'
import type { LegalKey } from '@/lib/types'

const PAGES: { key: LegalKey; href: string; label: string }[] = [
  { key: 'privacy', href: '/privacy', label: 'Privacy' },
  { key: 'terms', href: '/terms', label: 'Terms' },
  { key: 'cookies', href: '/cookies', label: 'Cookies' },
]

const fmtDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00Z')
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/** Shared layout for the legal pages: big title, page switcher, numbered sections. */
export default async function LegalPage({ which }: { which: LegalKey }) {
  const [page, s] = await Promise.all([getLegal(which), getSettings()])
  if (!page) notFound()
  const fill = (t: string) => fillTokens(t, s)
  return (
    <article className="page">
      <header className="ptitle pad">
        <SplitTitle lines={[PAGES.find((p) => p.key === which)!.label]} />
        <div className="side">
          <span className="mono grey">Last updated {fmtDate(page.updated)}</span>
          <nav className="filters" aria-label="Legal pages">
            {PAGES.map((p) => (
              <Link key={p.key} href={p.href} className="chip" aria-current={p.key === which ? 'page' : undefined}>
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="legal pad">
        <p className="lead">{fill(page.intro)}</p>
        {page.sections.map((sec, i) => (
          <section className="lsec" key={i}>
            <span className="mono grey">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2>{sec.heading}</h2>
              {blocks(fill(sec.body)).map((b, k) =>
                b.type === 'ul' ? (
                  <ul key={k}>
                    {b.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={k}>
                    {b.lines.map((l, j) => (
                      <span key={j}>
                        {l}
                        {j < b.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
