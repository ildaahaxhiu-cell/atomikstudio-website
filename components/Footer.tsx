import type { Settings } from '@/lib/types'
import CopyEmail from './CopyEmail'
import Marquee from './Marquee'

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <>
      <Marquee />
      <footer className="foot pad">
        <div className="e">
          <span className="k">Write to us</span>
          <CopyEmail email={settings.email} />
        </div>
        <div className="x">
          <span className="k">Studio</span>
          {settings.city}, {settings.country}
        </div>
        <div className="x">
          <span className="k">Follow</span>
          <a href={settings.instagram} target="_blank" rel="noopener">
            Instagram
          </a>
        </div>
        <div className="x">
          <span className="k">© {new Date().getFullYear()}</span>
          Atomik Studio
        </div>
      </footer>
    </>
  )
}
