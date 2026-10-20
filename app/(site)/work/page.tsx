import type { Metadata } from 'next'
import SplitTitle from '@/components/SplitTitle'
import WorkBrowser from '@/components/work/WorkBrowser'
import { getProjects } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected branding, production, web design and art direction projects by Atomik Studio.',
}

export default async function WorkPage() {
  const projects = await getProjects()
  return (
    <div className="page">
      <header className="ptitle pad">
        <SplitTitle lines={['Work']} />
        <div className="side">
          <span className="mono grey">{String(projects.length).padStart(2, '0')} projects</span>
          <p style={{ margin: 0 }}>Identities, campaigns, films and websites made with clients in Albania and abroad. Drag the rows to see more of each project.</p>
        </div>
      </header>
      <WorkBrowser projects={projects} />
    </div>
  )
}
