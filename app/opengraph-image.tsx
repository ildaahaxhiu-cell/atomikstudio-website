import { ImageResponse } from 'next/og'

export const alt = 'Atomik Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#fff', color: '#0a0a0a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 56 }}>
        <div style={{ fontSize: 28, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>Independent design studio</span>
          <span>Tirana</span>
        </div>
        <div style={{ fontSize: 300, fontWeight: 600, letterSpacing: -20, lineHeight: 0.8 }}>atomik</div>
      </div>
    ),
    size,
  )
}
