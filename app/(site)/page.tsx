import GiantWordmark from '@/components/home/GiantWordmark'
import ProjectCards from '@/components/home/ProjectCards'
import InkText from '@/components/InkText'
import ProjectIndex from '@/components/ProjectIndex'
import ServicesRail from '@/components/ServicesRail'
import { getProjects, getSettings } from '@/lib/content'

export default async function Home() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()])
  const featured = projects.filter((p) => p.featured).slice(0, 6)
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const half = Math.ceil(settings.services.length / 2)

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-meta">
          <p className="a">{settings.heroLine}</p>
          <p className="b">
            {settings.services.slice(0, half).map((s) => (
              <span key={s.name}>
                {s.name}
                <br />
              </span>
            ))}
          </p>
          <p className="c">
            {settings.services.slice(half).map((s) => (
              <span key={s.name}>
                {s.name}
                <br />
              </span>
            ))}
          </p>
        </div>
        <span className="scrollcue mono">Scroll</span>
        <GiantWordmark />
      </section>

      <section className="statement pad" aria-label="About the studio">
        <span className="lab mono">The studio</span>
        <InkText text={settings.statement} />
      </section>

      <section className="pad" id="work" aria-label="Selected work">
        <div className="shead">
          <span>Selected work</span>
          <span>{pad2(featured.length)} projects</span>
        </div>
        <ProjectCards projects={featured} currency={settings.currency} />
      </section>

      <section className="index pad" aria-label="Project index">
        <div className="shead">
          <span>Index</span>
          <span>Client · Sector · Services</span>
        </div>
        <ProjectIndex projects={projects} />
      </section>

      <ServicesRail services={settings.services} />
    </>
  )
}
