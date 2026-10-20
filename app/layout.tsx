import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SITE_URL as site } from '@/lib/site'
import './globals.css'

const geist = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist', weight: ['300', '400', '500'] })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', weight: ['400'] })

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'Atomik Studio', template: '%s · Atomik Studio' },
  description: 'Independent design studio in Tirana. Branding, production, web design and art direction for companies in Albania and abroad.',
  openGraph: { siteName: 'Atomik Studio', type: 'website' },
}

export const viewport: Viewport = { themeColor: '#ffffff', viewportFit: 'cover' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
