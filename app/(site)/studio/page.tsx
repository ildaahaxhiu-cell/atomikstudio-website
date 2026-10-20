import type { Metadata } from 'next'
import Clock from '@/components/Clock'
import CopyEmail from '@/components/CopyEmail'
import InkText from '@/components/InkText'
import Rise from '@/components/Rise'
import ServicesRail from '@/components/ServicesRail'
import SplitTitle from '@/components/SplitTitle'
import { getSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Studio',
  description: 'Atomik is an independent design studio in Tirana working across branding, production, web design and art direction.',
}

const pad2 = (n: number) => String(n).padStart(2, '0')

export default async function StudioPage() {
  const s = await getSettings()
  return (
    <div className="page">
      <header className="ptitle pad">
        <SplitTitle lines={['Studio']} />
        <div className="side">
          <span className="mono grey">
            {s.city}, {s.country}
          </span>
          <p style={{ margin: 0 }}>{s.heroLine}</p>
        </div>
      </header>

      <section className="statement pad" aria-label="About">
        <span className="lab mono">About</span>
        <InkText text={s.statement} />
      </section>

      <Rise className="approach pad">
        <div className="stick">
          <h2>How we work</h2>
          <p>Every project runs through the same four stages, with the same people from start to finish.</p>
        </div>
        <ol className="steps">
          {s.approach.map((a, i) => (
            <li className="step" key={a.title} data-rise>
              <span className="mono grey">{pad2(i + 1)}</span>
              <div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Rise>

      <ServicesRail services={s.services} title="What we do" />

      <section className="clients pad" aria-label="Clients">
        <span className="grey">Selected clients</span>
        <ul>
          {s.clients.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="place pad" aria-label="Location">
        <div className="big" aria-label={`Local time in ${s.city}`}>
          <Clock seconds={false} />
        </div>
        <div className="info">
          <span className="grey">Local time in {s.city}</span>
          <p style={{ margin: 0 }}>
            We work from {s.city} with clients across Albania, Europe and further away, in person or remotely.
          </p>
          <CopyEmail email={s.email} className="copy" />
        </div>
      </section>
    </div>
  )
}
