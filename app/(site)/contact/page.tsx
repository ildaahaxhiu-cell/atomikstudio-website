import type { Metadata } from 'next'
import CopyEmail from '@/components/CopyEmail'
import EnquiryForm from '@/components/EnquiryForm'
import SplitTitle from '@/components/SplitTitle'
import { getProjects, getSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Atomik Studio.',
}

export default async function ContactPage() {
  const [s, projects] = await Promise.all([getSettings(), getProjects()])
  return (
    <div className="page">
      <header className="ptitle pad">
        <SplitTitle lines={['Enquiries']} />
        <div className="side">
          <span className="mono grey">New projects</span>
          <p style={{ margin: 0 }}>Tell us a little about what you are making. We reply to every enquiry within two working days.</p>
        </div>
      </header>
      <section className="contact pad">
        <EnquiryForm email={s.email} currency={s.currency} projects={Object.fromEntries(projects.map((p) => [p.slug, p.name]))} />
        <aside className="aside">
          <div>
            <span className="grey">Email</span>
            <CopyEmail email={s.email} className="copy" />
          </div>
          <div>
            <span className="grey">Studio</span>
            <span>
              {s.city}, {s.country}
            </span>
          </div>
          <div>
            <span className="grey">Follow</span>
            <a href={s.instagram} target="_blank" rel="noopener">
              Instagram
            </a>
          </div>
        </aside>
      </section>
    </div>
  )
}
