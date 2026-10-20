import Link from 'next/link'
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
          {settings.legalName || 'Atomik Studio'}
        </div>
        <nav className="legal-links" aria-label="Legal">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </nav>
      </footer>
    </>
  )
}
