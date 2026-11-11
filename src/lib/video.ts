const MIME_CANDIDATES = [
  'video/mp4;codecs=avc1.42E01E',
  'video/mp4',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
]

export function pickBestMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return null
  }

  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null
}

export function extensionForMime(mimeType: string | undefined | null): 'mp4' | 'webm' {
  return mimeType?.includes('mp4') ? 'mp4' : 'webm'
}

export function timestampFilename(prefix: string, extension: string): string {
  return `${prefix}_${Date.now()}.${extension}`
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}
