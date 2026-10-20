'use client'

import { NextStudio } from 'next-sanity/studio/client-component'
import config from '@/sanity.config'
import { hasSanity } from '@/sanity/env'

export default function Studio() {
  if (!hasSanity) {
    return (
      <div style={{ padding: 40, fontFamily: 'system-ui', maxWidth: 560 }}>
        <h1 style={{ fontWeight: 500 }}>Content editor not connected</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in <code>.env.local</code> (and on Vercel) to open the editor. Until then the site
          shows the sample content in <code>lib/seed.ts</code>.
        </p>
      </div>
    )
  }
  return <NextStudio config={config} />
}
