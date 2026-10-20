import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Terms of Use', description: 'Terms for using the Atomik Studio website.' }

export default function Page() {
  return <LegalPage which="terms" />
}
