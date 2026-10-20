'use client'

const MAX_EDGE = 2400

/** Resizes an image in the browser so uploads stay small, keeping GIFs as they are (animation). */
export async function prepareImage(file: File): Promise<{ blob: Blob; w: number; h: number; type: string }> {
  if (file.type === 'image/gif') {
    const { w, h } = await dims(file)
    return { blob: file, w, h, type: file.type }
  }
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale)
  const h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h)
  bmp.close()
  let quality = 0.86
  let blob = await toBlob(canvas, quality)
  while (blob.size > 3.5 * 1024 * 1024 && quality > 0.5) {
    quality -= 0.12
    blob = await toBlob(canvas, quality)
  }
  return { blob, w, h, type: 'image/webp' }
}

function toBlob(canvas: HTMLCanvasElement, q: number) {
  return new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Could not read that image.'))), 'image/webp', q))
}

function dims(file: File) {
  return new Promise<{ w: number; h: number }>((res, rej) => {
    const img = new Image()
    img.onload = () => {
      res({ w: img.naturalWidth, h: img.naturalHeight })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => rej(new Error('Could not read that image.'))
    img.src = URL.createObjectURL(file)
  })
}
