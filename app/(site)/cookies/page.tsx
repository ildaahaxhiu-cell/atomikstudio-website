import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Cookie Policy', description: 'Cookies used on the Atomik Studio website.' }

export default function Page() {
  return <LegalPage which="cookies" />
}
