import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin/auth'
import { mode, putImage } from '@/lib/admin/store'
import { slugify } from '@/lib/admin/validate'

export const dynamic = 'force-dynamic'

const MAX = 4 * 1024 * 1024 // Vercel functions accept bodies up to 4.5 MB; the editor resizes before sending.
const TYPES: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif' }

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  if (mode() === 'unconfigured') return NextResponse.json({ error: 'Uploads are not set up yet (GITHUB_TOKEN is missing on Vercel).' }, { status: 503 })
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const slug = slugify(String(form?.get('slug') ?? ''))
  if (!(file instanceof File) || !slug) return NextResponse.json({ error: 'No image received.' }, { status: 400 })
  const ext = TYPES[file.type]
  if (!ext) return NextResponse.json({ error: 'Use JPG, PNG, WebP or GIF images.' }, { status: 415 })
  if (file.size > MAX) return NextResponse.json({ error: 'That image is over 4 MB even after resizing.' }, { status: 413 })
  const base = slugify(String(form?.get('name') ?? '').replace(/\.[a-z0-9]+$/i, '')) || 'image'
  const name = `${base.slice(0, 40)}-${Date.now().toString(36)}.${ext}`
  try {
    const out = await putImage(slug, name, Buffer.from(await file.arrayBuffer()))
    return NextResponse.json(out)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'The upload failed. Try again.' }, { status: 502 })
  }
}
