'use client'

import { useState } from 'react'

/** Shows the address as text and copies it on click; mailto is unreliable for many visitors. */
export default function CopyEmail({ email, className = 'copy' }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className={className}
      title="Copy email address"
      onClick={() =>
        navigator.clipboard
          ?.writeText(email)
          .then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1400)
          })
          .catch(() => {})
      }
    >
      {copied ? 'Copied to clipboard' : email}
    </button>
  )
}
