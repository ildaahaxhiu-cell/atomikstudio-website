'use client'

import { useEffect, useState } from 'react'

const fmt = (seconds: boolean) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    ...(seconds ? { second: '2-digit' } : {}),
    timeZone: 'Europe/Tirane',
  })

/** Live Tirana time. Renders a stable placeholder on the server to avoid a hydration mismatch. */
export default function Clock({ seconds = true }: { seconds?: boolean }) {
  const [now, setNow] = useState<string | null>(null)
  useEffect(() => {
    const f = fmt(seconds)
    const tick = () => setNow(f.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [seconds])
  return <span suppressHydrationWarning>{now ?? (seconds ? '--:--:--' : '--:--')}</span>
}
