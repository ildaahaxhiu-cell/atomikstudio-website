import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin/auth'
import { mode, readContent, saveContent } from '@/lib/admin/store'
import { cleanContent } from '@/lib/admin/validate'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  return NextResponse.json(await readContent())
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Your session ended. Sign in again, your changes are still on screen.' }, { status: 401 })
  if (mode() === 'unconfigured') return NextResponse.json({ error: 'Publishing is not set up yet (GITHUB_TOKEN is missing on Vercel).' }, { status: 503 })
  const body = (await req.json().catch(() => null)) as { content?: unknown; blobs?: { path: string; sha: string }[]; message?: string } | null
  const { content, error } = cleanContent(body?.content)
  if (!content) return NextResponse.json({ error }, { status: 400 })
  const blobs = (body?.blobs ?? []).filter((b) => typeof b?.path === 'string' && /^public\/work\/[a-z0-9-]+\/[a-z0-9.-]+$/.test(b.path) && typeof b.sha === 'string')
  try {
    const { commit } = await saveContent(content, blobs, (body?.message || 'Update content').slice(0, 120))
    return NextResponse.json({ ok: true, commit, content, mode: mode() })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Publishing failed. Nothing was changed on the site. Try again in a minute.' }, { status: 502 })
  }
}
