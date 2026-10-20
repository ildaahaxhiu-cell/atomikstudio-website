import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page nf pad">
      <h1>404</h1>
      <p style={{ margin: 0, fontSize: 18 }}>
        This page does not exist. <Link href="/work" style={{ borderBottom: '1px solid var(--ink)' }}>See the work</Link> instead.
      </p>
    </div>
  )
}
