'use client'

import { useRef, useState } from 'react'
import { useAdmin } from './AdminApp'
import { prepareImage } from './image'
import Thumb, { Img } from './Thumb'
import { Area, Chips, ConfirmButton, Field, move, Section, Tags, Text } from './ui'
import { slugify } from '@/lib/admin/validate'
import { money } from '@/lib/format'
import { DISCIPLINES, type Discipline, type StoredProject } from '@/lib/types'

export default function ProjectEditor({ index }: { index: number }) {
  const { content, setContent, addUpload, go, replaceView, mode } = useAdmin()
  const p = content.projects[index]
  const [uploading, setUploading] = useState<string[]>([])
  const [upErr, setUpErr] = useState('')
  const [drag, setDrag] = useState<number | null>(null)
  const [over, setOver] = useState(false)
  const fileIn = useRef<HTMLInputElement>(null)

  const update = (patch: Partial<StoredProject>) =>
    setContent((c) => ({ ...c, projects: c.projects.map((x, i) => (i === index ? { ...x, ...patch } : x)) }))

  const setName = (name: string) => {
    // Keep the address in step with the name until someone edits it by hand.
    const follows = p.slug === slugify(p.name) || /^new-project-\d+$/.test(p.slug)
    const slug = follows ? slugify(name) || p.slug : p.slug
    update({ name, slug })
    if (slug !== p.slug) replaceView(`project/${slug}`)
  }
  const setSlug = (v: string) => {
    const slug = slugify(v)
    update({ slug })
    if (slug) replaceView(`project/${slug}`)
  }

  async function upload(files: FileList | File[]) {
    setUpErr('')
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setUpErr(`${file.name} is not an image.`)
        continue
      }
      setUploading((u) => [...u, file.name])
      try {
        const img = await prepareImage(file)
        const fd = new FormData()
        fd.set('file', new File([img.blob], file.name, { type: img.type }))
        fd.set('slug', p.slug)
        fd.set('name', file.name)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Upload failed.')
        addUpload(data.src, URL.createObjectURL(img.blob), data.sha ? { path: data.path, sha: data.sha } : undefined)
        const alt = file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ')
        setContent((c) => ({
          ...c,
          projects: c.projects.map((x, i) => (i === index ? { ...x, media: [...x.media, { src: data.src, alt, w: img.w, h: img.h }] } : x)),
        }))
      } catch (e) {
        setUpErr(`${file.name}: ${e instanceof Error ? e.message : 'upload failed.'}`)
      } finally {
        setUploading((u) => u.filter((n) => n !== file.name))
      }
    }
  }

  const media = p.media
  const setMedia = (m: StoredProject['media']) => update({ media: m })

  return (
    <div className="editor">
      <div className="ehead pad">
        <a className="mono grey" href="#projects">
          ← All projects
        </a>
        <input className="input title" value={p.name} aria-label="Project name" onChange={(e) => setName(e.target.value)} placeholder="Project name" />
      </div>

      <div className="ecols pad">
        <div className="ebody">
          <Section title="Details">
            <Text label="Sector" value={p.sector} onChange={(v) => update({ sector: v })} placeholder="e.g. Aesthetic clinic" />
            <Text label="Year" value={p.year ? String(p.year) : ''} onChange={(v) => update({ year: v ? Number(v.replace(/\D/g, '').slice(0, 4)) || undefined : undefined })} placeholder="2026" />
            <Text
              label={`Similar project cost (${content.settings.currency})`}
              value={p.cost ? String(p.cost) : ''}
              onChange={(v) => update({ cost: Number(v.replace(/[^0-9]/g, '')) || undefined })}
              placeholder="8000"
              hint={p.cost ? `Shows as: A similar project costs about ${money(p.cost, content.settings.currency)}` : 'Leave empty to hide it on the site.'}
            />
            <Text label="Web address" value={p.slug} onChange={setSlug} hint={`/work/${p.slug || '…'}`} wide />
            <Field label="Disciplines" hint="Used for the filters on the Work page." wide>
              {() => <Chips options={DISCIPLINES} value={p.disciplines} onChange={(v) => update({ disciplines: v as Discipline[] })} />}
            </Field>
            <Tags label="Services" value={p.services} onChange={(v) => update({ services: v })} placeholder="e.g. Brand identity" hint="Shown as tags on cards and the case study." />
            <Field label="Homepage" wide>
              {() => <Chips options={['Show on homepage']} value={p.featured ? ['Show on homepage'] : []} onChange={(v) => update({ featured: v.length > 0 })} />}
            </Field>
          </Section>

          <Section title="Words">
            <Area label="Summary" rows={2} value={p.summary} onChange={(v) => update({ summary: v })} hint="One line for cards and lists." placeholder="Identity and website for…" />
            <Area label="Introduction" rows={6} value={p.intro} onChange={(v) => update({ intro: v })} hint="The large paragraph at the top of the case study." />
          </Section>

          <Section title="Images" note={media.length ? 'First image is the cover. Drag to reorder.' : 'No images yet: the site shows typographic placeholders.'}>
            <div
              className={`drop wide${over ? ' over' : ''}`}
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes('Files')) {
                  e.preventDefault()
                  setOver(true)
                }
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                if (!e.dataTransfer.files.length) return
                e.preventDefault()
                setOver(false)
                upload(e.dataTransfer.files)
              }}
            >
              <button type="button" className="send" onClick={() => fileIn.current?.click()} disabled={mode === 'unconfigured'}>
                Add images
              </button>
              <span className="grey">or drop them here. Large photos are resized to 2400 px automatically.</span>
              <input ref={fileIn} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && (upload(e.target.files), (e.target.value = ''))} />
              {uploading.length > 0 && <span className="mono">Uploading {uploading.length}…</span>}
              {upErr && (
                <span className="note err" role="alert">
                  {upErr}
                </span>
              )}
            </div>

            {media.length > 0 && (
              <ul className="imgs wide">
                {media.map((m, i) => (
                  <li
                    key={m.src}
                    className={drag === i ? 'dragging' : ''}
                    draggable
                    onDragStart={() => setDrag(i)}
                    onDragEnd={() => setDrag(null)}
                    onDragOver={(e) => {
                      if (drag === null || drag === i) return
                      e.preventDefault()
                      setMedia(move(media, drag, i))
                      setDrag(i)
                    }}
                  >
                    <div className="imgbox" style={{ aspectRatio: `${m.w} / ${m.h}` }}>
                      <Img m={m} />
                      {i === 0 && <span className="badge mono">Cover</span>}
                    </div>
                    <input
                      className="input small"
                      value={m.alt}
                      aria-label={`Description of image ${i + 1}`}
                      placeholder="Describe the image"
                      onChange={(e) => setMedia(media.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))}
                    />
                    <div className="imgact">
                      <span className="mono grey">
                        {m.w}×{m.h}
                      </span>
                      <span>
                        <button type="button" className="chip" aria-label="Move earlier" disabled={i === 0} onClick={() => setMedia(move(media, i, i - 1))}>
                          ←
                        </button>
                        <button type="button" className="chip" aria-label="Move later" disabled={i === media.length - 1} onClick={() => setMedia(move(media, i, i + 1))}>
                          →
                        </button>
                        <ConfirmButton label="Remove" confirm="Remove?" className="chip" onConfirm={() => setMedia(media.filter((_, k) => k !== i))} />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Credits">
            <div className="credlist wide">
              {p.credits.map((c, i) => (
                <div className="credrow" key={i}>
                  <input className="input" value={c.name} placeholder="Name" aria-label="Credit name" onChange={(e) => update({ credits: p.credits.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })} />
                  <input className="input" value={c.role} placeholder="Role" aria-label="Credit role" onChange={(e) => update({ credits: p.credits.map((x, k) => (k === i ? { ...x, role: e.target.value } : x)) })} />
                  <button type="button" className="chip" onClick={() => update({ credits: p.credits.filter((_, k) => k !== i) })}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="chip" onClick={() => update({ credits: [...p.credits, { name: '', role: '' }] })}>
                Add credit
              </button>
            </div>
          </Section>

          <div className="danger">
            <ConfirmButton
              label="Delete this project"
              confirm="Click again to delete. Its images are removed on publish."
              onConfirm={() => {
                setContent((c) => ({ ...c, projects: c.projects.filter((_, i) => i !== index) }))
                go('projects')
              }}
            />
          </div>
        </div>

        <aside className="eprev" aria-label="Preview">
          <span className="mono grey">Homepage card preview</span>
          <div className="pcard">
            <div className="pmedia">
              <Thumb p={p} />
            </div>
            <h3>{p.name || 'Untitled'}</h3>
            <span className="grey">{p.sector || 'Sector'}</span>
            <div className="tags">
              {p.services.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <p>{p.summary || 'The summary appears here.'}</p>
            {p.cost ? <span className="grey" style={{ fontSize: 14 }}>A similar project costs about {money(p.cost, content.settings.currency)}</span> : null}
          </div>
          <a className="linkbtn" href={`/work/${p.slug}`} target="_blank" rel="noopener">
            Open the published page ↗
          </a>
        </aside>
      </div>
    </div>
  )
}
