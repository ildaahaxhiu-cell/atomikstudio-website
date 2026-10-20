import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import SmoothScroll from '@/components/SmoothScroll'
import { getSettings } from '@/lib/content'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <SmoothScroll />
      <Nav city={settings.city} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  )
}
