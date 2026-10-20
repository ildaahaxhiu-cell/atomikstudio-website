import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Atomik Studio collects and uses personal data.' }

export default function Page() {
  return <LegalPage which="privacy" />
}
