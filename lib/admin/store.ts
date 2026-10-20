import 'server-only'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { SiteContent } from '@/lib/types'

/**
 * Content storage for /admin.
 * With GITHUB_TOKEN set (production), reads and commits straight to the repo; Vercel redeploys on each commit.
 * Without it (local dev), reads and writes the files on disk.
 */

const CONTENT_PATH = 'content/site.json'
const repo = () => process.env.GITHUB_REPO || 'ildaahaxhiu-cell/atomikstudio-website'
const branch = () => process.env.GITHUB_BRANCH || 'main'
const token = () => process.env.GITHUB_TOKEN || ''

export const mode = () => (token() ? 'github' : process.env.NODE_ENV === 'production' ? 'unconfigured' : 'local')

async function gh<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://api.github.com/repos/${repo()}${url}`, {
    ...init,
    cache: 'no-store',
    headers: {
      authorization: `Bearer ${token()}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
    },
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`GitHub ${res.status}: ${detail.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

export async function readContent(): Promise<SiteContent> {
  if (mode() === 'github') {
    const f = await gh<{ content: string }>(`/contents/${CONTENT_PATH}?ref=${branch()}`)
    return JSON.parse(Buffer.from(f.content, 'base64').toString('utf8'))
  }
  return JSON.parse(await readFile(path.join(process.cwd(), CONTENT_PATH), 'utf8'))
}

/** Stores an uploaded image. Returns its public src and, on GitHub, the blob to include in the next commit. */
export async function putImage(slug: string, name: string, bytes: Buffer) {
  const rel = `public/work/${slug}/${name}`
  const src = `/work/${slug}/${name}`
  if (mode() === 'github') {
    const blob = await gh<{ sha: string }>('/git/blobs', { method: 'POST', body: JSON.stringify({ content: bytes.toString('base64'), encoding: 'base64' }) })
    return { src, path: rel, sha: blob.sha }
  }
  const abs = path.join(process.cwd(), rel)
  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, bytes)
  return { src, path: rel }
}

const srcs = (c: SiteContent) => new Set(c.projects.flatMap((p) => p.media.map((m) => m.src)))

/**
 * Saves content and new images in one commit, and removes image files no project uses any more.
 * `blobs` are the uploads returned by putImage since the last save.
 */
export async function saveContent(next: SiteContent, blobs: { path: string; sha: string }[], message: string) {
  const prev = await readContent().catch(() => null)
  const keep = srcs(next)
  const removed = prev ? [...srcs(prev)].filter((s) => !keep.has(s) && s.startsWith('/work/')) : []
  const json = JSON.stringify(next, null, 2) + '\n'

  if (mode() !== 'github') {
    await writeFile(path.join(process.cwd(), CONTENT_PATH), json)
    await Promise.all(removed.map((s) => unlink(path.join(process.cwd(), 'public', s)).catch(() => {})))
    return { commit: null as string | null }
  }

  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${branch()}`)
  const head = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`)
  const used = blobs.filter((b) => keep.has('/' + b.path.replace(/^public\//, '')))
  const tree = await gh<{ sha: string }>('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: head.tree.sha,
      tree: [
        { path: CONTENT_PATH, mode: '100644', type: 'blob', content: json },
        ...used.map((b) => ({ path: b.path, mode: '100644', type: 'blob', sha: b.sha })),
        ...removed.map((s) => ({ path: `public${s}`, mode: '100644', type: 'blob', sha: null })),
      ],
    }),
  })
  const commit = await gh<{ sha: string }>('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: tree.sha, parents: [ref.object.sha] }),
  })
  await gh(`/git/refs/heads/${branch()}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha }) })
  return { commit: commit.sha }
}
