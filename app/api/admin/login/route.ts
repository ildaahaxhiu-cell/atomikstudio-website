import { NextResponse } from 'next/server'
import { adminConfigured, checkPassword, endSession, startSession } from '@/lib/admin/auth'

export async function POST(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ error: 'The editor has no password set yet.' }, { status: 503 })
  const body = (await req.json().catch(() => null)) as { password?: string } | null
  // Small fixed delay to slow down guessing.
  await new Promise((r) => setTimeout(r, 400))
  if (!checkPassword(body?.password ?? '')) return NextResponse.json({ error: 'That password is not right.' }, { status: 401 })
  await startSession()
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await endSession()
  return NextResponse.json({ ok: true })
}
