import { useCallback, useEffect, useRef, useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { DotViewport } from './components/DotViewport'
import { DropOverlay } from './components/DropOverlay'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { DotMatrixEngine } from './lib/DotMatrixEngine'
import {
  downloadBlob,
  downloadDataUrl,
  extensionForMime,
  pickBestMimeType,
  timestampFilename,
} from './lib/video'

const REPO_URL = 'https://github.com/charlespura/DotMatrixAnimator'
const FRAME_INTERVAL = 1000 / 30
const MAX_RECORDING_MS = 60_000

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export default function App() {
  const [dotSize, setDotSize] = useState(5)
  const [speed, setSpeed] = useState(85)
  const [step, setStep] = useState(6)
  const [status, setStatus] = useState('🎨 Ready — upload an image')
  const [hasImage, setHasImage] = useState(false)
  const [dotCount, setDotCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const engineRef = useRef<DotMatrixEngine | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const recordingRef = useRef(false)

  useEffect(() => {
    const container = viewportRef.current
    if (!container) return

    let engine: DotMatrixEngine | null = null

    try {
      engine = new DotMatrixEngine(container)
    } catch (error) {
      console.error(error)
      setStatus('❌ WebGL is not available in this browser. Try Chrome, Edge or Firefox.')
      return
    }

    engine.callbacks.onProgress = (revealed, total) => {
      setProgress(total > 0 ? revealed / total : 0)
    }
    engine.callbacks.onComplete = (total) => {
      setIsAnimating(false)
      setProgress(1)
      setStatus(`✅ Complete! All ${total.toLocaleString()} dots revealed.`)
    }

    engineRef.current = engine

    return () => {
      engineRef.current = null
      engine.dispose()
    }
  }, [])

  const loadImageFile = useCallback((file: File) => {
    const engine = engineRef.current
    if (!engine) return

    engine.pause()
    setIsAnimating(false)
    setProgress(0)
    setStatus('⏳ Processing image…')

    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      try {
        engine.loadImage(image)
        setHasImage(true)
        setDotCount(engine.dotCount)
        setIsAnimating(false)
        setProgress(0)
        setStatus(`✅ Loaded: ${engine.dotCount.toLocaleString()} dots (spacing ${engine.spacing}px). Press START.`)
      } catch (error) {
        console.error(error)
        setStatus('❌ Could not process that image.')
      }
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      setStatus('❌ Could not read that image file.')
    }

    image.src = objectUrl
  }, [])

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      if (recordingRef.current) {
        setStatus('⏳ Please wait, video generation is in progress…')
        return
      }

      const list = Array.from(files)
      const imageFile = list.find((file) => file.type.startsWith('image/'))

      if (!imageFile) {
        setStatus('❌ No image found. Drop a JPG, PNG, or WEBP file.')
        return
      }

      loadImageFile(imageFile)
    },
    [loadImageFile],
  )

  useEffect(() => {
    let depth = 0

    const carriesFiles = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes('Files')

    const handleDragEnter = (event: DragEvent) => {
      event.preventDefault()
      if (!carriesFiles(event)) return
      depth += 1
      setIsDragging(true)
    }

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    }

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault()
      depth = Math.max(0, depth - 1)
      if (depth === 0) setIsDragging(false)
    }

    const handleDrop = (event: DragEvent) => {
      event.preventDefault()
      depth = 0
      setIsDragging(false)

      if (event.dataTransfer?.files.length) {
        handleFiles(event.dataTransfer.files)
      }
    }

    window.addEventListener('dragenter', handleDragEnter)
    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)

    return () => {
      window.removeEventListener('dragenter', handleDragEnter)
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
    }
  }, [handleFiles])

  const handleStart = () => {
    if (recordingRef.current) {
      setStatus('⏳ Video generation is in progress, please wait…')
      return
    }

    const engine = engineRef.current
    if (!engine?.hasImage) {
      setStatus('❌ Please upload an image first.')
      return
    }
    if (engine.isAnimating) {
      setStatus('⏳ Animation already running.')
      return
    }

    engine.play()
    setIsAnimating(true)
    setStatus(`✨ Animating … ${speed} dots/frame ✨`)
  }

  const handleReset = () => {
    if (recordingRef.current) {
      setStatus('Cannot reset while generating the video.')
      return
    }

    const engine = engineRef.current
    if (!engine) return

    engine.reset()
    setIsAnimating(false)
    setProgress(0)
    setStatus(
      engine.hasImage
        ? '⟳ Reset complete. Press START for a fresh dot animation.'
        : '🎨 Ready — upload an image',
    )
  }

  const handleDotSizeChange = (value: number) => {
    setDotSize(value)
    engineRef.current?.setDotSize(value)
  }

  const handleSpeedChange = (value: number) => {
    setSpeed(value)
    engineRef.current?.setSpeed(value)
  }

  const handleStepChange = (value: number) => {
    setStep(value)

    const engine = engineRef.current
    if (!engine) return

    engine.setStep(value)

    if (engine.hasImage) {
      setDotCount(engine.dotCount)
      setIsAnimating(false)
      setProgress(0)
      setStatus(`🔄 Spacing updated: ${value}px, ${engine.dotCount.toLocaleString()} dots.`)
    }
  }

  const handleExport = (kind: 'png' | 'jpeg') => {
    const engine = engineRef.current
    if (!engine?.hasImage) {
      setStatus('⚠️ No image loaded. Upload an image first.')
      return
    }

    try {
      const dataUrl =
        kind === 'png'
          ? engine.exportImage('image/png')
          : engine.exportImage('image/jpeg', 0.92)
      downloadDataUrl(dataUrl, timestampFilename('dot_art', kind === 'png' ? 'png' : 'jpg'))
      setStatus(kind === 'png' ? '📸 PNG saved!' : '🖼️ JPEG saved!')
    } catch (error) {
      console.error(error)
      setStatus('❌ Export failed. Please try again.')
    }
  }

  const handleDownloadVideo = async () => {
    const engine = engineRef.current
    if (!engine?.hasImage) {
      setStatus('❌ No image loaded. Please upload an image first.')
      return
    }
    if (recordingRef.current) {
      setStatus('⏳ Video generation is already running, please wait…')
      return
    }

    const canvas = engine.getCanvas()
    if (typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
      setStatus("❌ Your browser doesn't support video recording. Try Chrome or Edge.")
      return
    }

    const snapshot = engine.beginRecording()
    const total = engine.dotCount
    const restoredProgress = total > 0 ? snapshot.count / total : 0

    recordingRef.current = true
    setIsRecording(true)
    setIsAnimating(false)
    setProgress(0)
    setStatus('🎬 Recording the full dot reveal… please wait ⏳')

    const stream = canvas.captureStream(30)
    const mimeType = pickBestMimeType()

    let recorder: MediaRecorder | null = null
    try {
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
        : new MediaRecorder(stream)
    } catch (error) {
      console.error(error)
      recorder = null
    }

    if (!recorder) {
      stream.getTracks().forEach((track) => track.stop())
      engine.restoreSnapshot(snapshot)
      recordingRef.current = false
      setIsRecording(false)
      setProgress(restoredProgress)
      setStatus('❌ Could not start the video recorder in this browser.')
      return
    }

    const mediaRecorder = recorder
    const chunks: BlobPart[] = []
    const recorderDone = new Promise<Blob>((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }
      mediaRecorder.onerror = () => reject(new Error('The video encoder reported an error.'))
      mediaRecorder.onstop = () => {
        const type = mediaRecorder.mimeType || mimeType || 'video/webm'
        resolve(new Blob(chunks, { type }))
      }
    })

    mediaRecorder.start(100)
    let complete = false

    try {
      await sleep(250)
      const startedAt = Date.now()

      while (!complete && Date.now() - startedAt < MAX_RECORDING_MS) {
        complete = engine.revealForRecording(speed)
        if (!complete) await sleep(FRAME_INTERVAL)
      }

      // Let the last pop-in animation settle and the encoder flush its frames.
      await sleep(500)
      if (mediaRecorder.state === 'recording') mediaRecorder.stop()

      const blob = await recorderDone
      const extension = extensionForMime(mediaRecorder.mimeType || mimeType)
      downloadBlob(blob, timestampFilename('dot_reveal', extension))
      setStatus(complete ? '✅ Video downloaded successfully!' : '⚠️ Recording stopped (timeout).')
    } catch (error) {
      console.error(error)
      if (mediaRecorder.state === 'recording') mediaRecorder.stop()
      setStatus('❌ Video export failed. Please try again.')
    } finally {
      stream.getTracks().forEach((track) => track.stop())
      engine.restoreSnapshot(snapshot)
      recordingRef.current = false
      setIsRecording(false)
      setProgress(restoredProgress)
    }
  }

  const handleStar = () => {
    window.open(REPO_URL, '_blank', 'noopener,noreferrer')
    setStatus('⭐ Thanks! Open the repo and click ★ to star.')
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-3 py-5 sm:px-5 sm:py-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-[-10%] h-[420px] w-[420px] rounded-full bg-[#4f6eff]/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-[-15%] h-[480px] w-[480px] rounded-full bg-[#a855f7]/10 blur-[140px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#2a5f6e]/10 blur-[120px]" />
      </div>

      <main className="w-full max-w-[1300px] rounded-[2rem] border border-white/5 bg-[#0f1320]/75 p-4 shadow-[0_25px_45px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-6">
        <Header onStar={handleStar} />

        <div className="mt-5 flex flex-col gap-5 lg:mt-4 lg:flex-row lg:gap-7">
          <ControlPanel
            hasImage={hasImage}
            isAnimating={isAnimating}
            isRecording={isRecording}
            isDragging={isDragging}
            dotSize={dotSize}
            speed={speed}
            step={step}
            dotCount={dotCount}
            progress={progress}
            status={status}
            onUpload={loadImageFile}
            onStart={handleStart}
            onReset={handleReset}
            onDotSizeChange={handleDotSizeChange}
            onSpeedChange={handleSpeedChange}
            onStepChange={handleStepChange}
            onDownloadVideo={handleDownloadVideo}
            onExportPng={() => handleExport('png')}
            onExportJpeg={() => handleExport('jpeg')}
          />

          <DotViewport
            containerRef={viewportRef}
            hasImage={hasImage}
            isAnimating={isAnimating}
            isRecording={isRecording}
            dotCount={dotCount}
            progress={progress}
          />
        </div>

        <Footer />
      </main>

      <DropOverlay visible={isDragging} />
    </div>
  )
}
