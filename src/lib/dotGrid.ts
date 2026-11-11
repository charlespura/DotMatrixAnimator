export const CANVAS_SIZE = 700

export interface Dot {
  x: number
  y: number
  r: number
  g: number
  b: number
}

/**
 * Flattens an uploaded image onto a 700x700 black canvas and returns its pixel
 * data. A black underlay keeps transparent PNGs looking correct.
 */
export function extractImageData(image: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('A 2D canvas context is required to process images.')

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  ctx.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE)

  return ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)
}

/** Samples the image on a grid and stores the colour of every dot. */
export function buildDotGrid(imageData: ImageData, step: number): Dot[] {
  const dots: Dot[] = []
  const { data } = imageData

  for (let y = 0; y < CANVAS_SIZE; y += step) {
    for (let x = 0; x < CANVAS_SIZE; x += step) {
      const ix = Math.min(x, CANVAS_SIZE - 1)
      const iy = Math.min(y, CANVAS_SIZE - 1)
      const offset = (iy * CANVAS_SIZE + ix) * 4

      dots.push({
        x: ix,
        y: iy,
        r: data[offset],
        g: data[offset + 1],
        b: data[offset + 2],
      })
    }
  }

  return dots
}

/** Fisher-Yates shuffle so every reveal feels organic. */
export function shuffledIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, index) => index)

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  return indices
}
