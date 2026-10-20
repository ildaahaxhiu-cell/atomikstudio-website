import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE = 'atomik_admin'
const DAYS = 14

const password = () => process.env.ADMIN_PASSWORD || ''
export const adminConfigured = () => password().length >= 8

function sign(exp: number) {
  return createHmac('sha256', password()).update(`atomik-admin:${exp}`).digest('hex')
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function checkPassword(attempt: string) {
  return adminConfigured() && safeEqual(attempt, password())
}

export async function startSession() {
  const exp = Date.now() + DAYS * 864e5
  const jar = await cookies()
  jar.set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(exp),
  })
}

export async function endSession() {
  ;(await cookies()).delete(COOKIE)
}

export async function isAuthed() {
  if (!adminConfigured()) return false
  const raw = (await cookies()).get(COOKIE)?.value
  if (!raw) return false
  const [exp, sig] = raw.split('.')
  const n = Number(exp)
  return Number.isFinite(n) && n > Date.now() && !!sig && safeEqual(sig, sign(n))
}
