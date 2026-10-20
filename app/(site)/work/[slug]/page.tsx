import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CaseHero from '@/components/case/CaseHero'
import Frame from '@/components/Frame'
import InkText from '@/components/InkText'
import Rise from '@/components/Rise'
import SplitTitle from '@/components/SplitTitle'
import { getProject, getProjects, getSettings } from '@/lib/content'
import { money } from '@/lib/format'
import type { Media } from '@/lib/types'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const data = await getProject(slug)
  if (!data) return {}
  const cover = data.project.media.find((m) => m.kind === 'image')
  return {
    title: data.project.name,
    description: data.project.summary,
    openGraph: cover?.src ? { images: [{ url: `${cover.src}?w=1200&h=630&fit=crop` }] } : undefined,
  }
}

const wide = (m: Media) => m.w / m.h >= 1.2

/** Wide images run alone; tall ones are paired, and an unpaired tall image sits centred. */
function toLines(media: Media[]) {
  const lines: Media[][] = []
  let open: Media[] | null = null
  for (const m of media) {
    if (wide(m)) {
      lines.push([m])
      open = null
    } else if (open) {
      open.push(m)
      open = null
    } else {
      open = [m]
      lines.push(open)
    }
  }
  return lines
}

// Split a long project name into roughly balanced lines for the masked title.
function titleLines(name: string) {
  const words = name.split(' ')
  if (words.length < 3) return [name]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

const pad2 = (n: number) => String(n).padStart(2, '0')

export default async function CasePage(props: PageProps<'/work/[slug]'>) {
  const { slug } = await props.params
  const [data, settings] = await Promise.all([getProject(slug), getSettings()])
  if (!data) notFound()
  const { project: p, index, total, next } = data
  const [cover, ...rest] = p.media

  return (
    <article className="page">
      <header className="case-head pad">
        <div className="crumbs mono">
          <Link href="/work">Work</Link>
          <span>/</span>
          <span>
            {pad2(index + 1)} of {pad2(total)}
          </span>
        </div>
        <SplitTitle lines={titleLines(p.name)} />
        <dl className="facts">
          <div>
            <dt>Client</dt>
            <dd>{p.name}</dd>
          </div>
          <div>
            <dt>Sector</dt>
            <dd>{p.sector || '-'}</dd>
          </div>
          <div>
            <dt>Services</dt>
            <dd>{p.services.join(', ') || '-'}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{p.year ?? '-'}</dd>
          </div>
          {p.cost ? (
            <div>
              <dt>Similar project</dt>
              <dd>about {money(p.cost, settings.currency)}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      {cover && <CaseHero media={cover} project={p} />}

      <section className="case-intro pad">
        <span className="lab mono">The project</span>
        <InkText text={p.intro || p.summary} />
      </section>

      <Rise className="lines pad">
        {toLines(rest).map((line, i) => (
          <div key={i} className={`line${line.length === 2 ? ' pair' : !wide(line[0]) ? ' single' : ''}`}>
            {line.map((m) => (
              <div key={m.key} className="box" style={{ aspectRatio: `${m.w} / ${m.h}` }} data-rise>
                <div className="par" data-par>
                  <Frame media={m} project={p} sizes={line.length === 2 ? '(min-width: 761px) 50vw, 100vw' : '100vw'} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </Rise>

      {p.cost ? (
        <section className="cost pad" aria-label="Project cost">
          <span className="lab mono">Budget</span>
          <div>
            <p className="big">
              A similar project costs about <b>{money(p.cost, settings.currency)}</b>.
            </p>
            <p className="grey">An indication from past work, not a quote. Every project is priced in a written proposal.</p>
            <Link className="send" href={`/contact?project=${p.slug}`}>
              Start a similar project
            </Link>
          </div>
        </section>
      ) : null}

      {p.credits.length > 0 && (
        <section className="credits pad">
          <h2>Credits</h2>
          <ul>
            {p.credits.map((c, i) => (
              <li key={i}>
                {c.name} <span>· {c.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {next && next.slug !== p.slug && (
        <Link href={`/work/${next.slug}`} className="nextp pad">
          <span className="top">
            <span>Next project</span>
            <span>{next.sector}</span>
          </span>
          <span className="name">{next.name}</span>
        </Link>
      )}
    </article>
  )
}
