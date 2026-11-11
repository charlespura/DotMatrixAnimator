import { useId } from 'react'
import { Slider } from './Slider'

interface ControlPanelProps {
  hasImage: boolean
  isAnimating: boolean
  isRecording: boolean
  isDragging: boolean
  dotSize: number
  speed: number
  step: number
  dotCount: number
  progress: number
  status: string
  onUpload: (file: File) => void
  onStart: () => void
  onReset: () => void
  onDotSizeChange: (value: number) => void
  onSpeedChange: (value: number) => void
  onStepChange: (value: number) => void
  onDownloadVideo: () => void
  onExportPng: () => void
  onExportJpeg: () => void
}

const BUTTON_BASE =
  'inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[0.82rem] font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100'
const PRIMARY_BUTTON = `${BUTTON_BASE} bg-[#4f6eff] text-white shadow-[0_4px_16px_rgba(79,110,255,0.35)] hover:bg-[#3b5be0] active:scale-[0.98]`
const SECONDARY_BUTTON = `${BUTTON_BASE} border border-white/10 bg-[#252c48] text-[#f0f3ff] hover:bg-[#363f62] active:scale-[0.98]`
const DANGER_BUTTON = `${BUTTON_BASE} bg-[#b8405e] text-white shadow-[0_4px_16px_rgba(184,64,94,0.3)] hover:bg-[#9e2e4a] active:scale-[0.98]`
const TEAL_BUTTON = `${BUTTON_BASE} bg-[#2a5f6e] text-white hover:bg-[#337587] active:scale-[0.98]`

export function ControlPanel({
  hasImage,
  isAnimating,
  isRecording,
  isDragging,
  dotSize,
  speed,
  step,
  dotCount,
  progress,
  status,
  onUpload,
  onStart,
  onReset,
  onDotSizeChange,
  onSpeedChange,
  onStepChange,
  onDownloadVideo,
  onExportPng,
  onExportJpeg,
}: ControlPanelProps) {
  const inputId = useId()

  return (
    <section className="flex w-full min-w-0 flex-col gap-5 rounded-3xl bg-[#080b16]/60 p-4 sm:p-5 lg:w-[330px] lg:shrink-0 xl:w-[350px]">
      <div className="flex flex-col gap-2">
        <input
          id={inputId}
          type="file"
          accept="image/jpeg, image/png, image/jpg, image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onUpload(file)
            event.target.value = ''
          }}
        />
        <label
          htmlFor={inputId}
          className={`flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-3.5 text-center transition ${
            isDragging
              ? 'scale-[1.02] border-[#7c96ff] bg-[#2a3553] shadow-[0_0_16px_rgba(124,150,255,0.35),inset_0_0_8px_rgba(124,150,255,0.1)]'
              : 'border-[#7f7cff]/30 bg-[#1e233e] hover:border-[#7c96ff]/60 hover:bg-[#242b49]'
          }`}
        >
          <span className="text-[0.82rem] font-semibold text-[#e8edff]">📁 UPLOAD IMAGE</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7c87b0]">JPG · PNG · WEBP</span>
        </label>
      </div>

      <div className="flex flex-col gap-2.5">
        <button type="button" className={PRIMARY_BUTTON} onClick={onStart} disabled={isRecording}>
          ✨ START DOT ANIMATION
        </button>
        <button type="button" className={SECONDARY_BUTTON} onClick={onReset} disabled={isRecording}>
          ⟳ RESET <span className="font-normal text-[#9aa5ce]">(fresh reveal order)</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#0b0e1a]/60 px-3.5 py-4">
        <Slider
          label="🎯 Dot size"
          display={`${dotSize.toFixed(1)} px`}
          value={dotSize}
          min={2}
          max={14}
          step={0.5}
          disabled={isRecording}
          onChange={onDotSizeChange}
        />
        <Slider
          label="⚡ Speed"
          display={`${speed} dots/frame`}
          value={speed}
          min={25}
          max={400}
          step={5}
          disabled={isRecording}
          onChange={onSpeedChange}
        />
        <Slider
          label="🔘 Dot spacing"
          display={`${step} px`}
          value={step}
          min={4}
          max={16}
          step={1}
          disabled={isRecording}
          onChange={onStepChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div
          className="flex min-h-[38px] items-center justify-center rounded-full bg-[#0b0e1a] px-3.5 py-2 text-center font-mono text-[11px] leading-snug text-[#c2caf0]"
          aria-live="polite"
        >
          {status}
        </div>

        <div className="flex items-center gap-2 px-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#131829]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4f6eff] to-[#9db2ff] transition-[width] duration-150 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-[10px] text-[#7c87b0]">
            {hasImage ? `${Math.round(progress * 100)}%` : '—'}
          </span>
        </div>

        {hasImage && (
          <p className="text-center font-mono text-[10px] text-[#5f6c9e]">
            {dotCount.toLocaleString()} dots · 700 × 700 canvas
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f7aaa]">
          ▼ direct download buttons ▼
        </p>
        <button type="button" className={DANGER_BUTTON} onClick={onDownloadVideo} disabled={isRecording}>
          {isRecording ? (
            <>
              <span className="h-3.5 w-3.5 animate-recorder-spin rounded-full border-2 border-white/30 border-t-white" />
              RECORDING ANIMATION…
            </>
          ) : (
            '🎬 DOWNLOAD AS MP4'
          )}
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" className={TEAL_BUTTON} onClick={onExportPng} disabled={isRecording}>
            📸 PNG
          </button>
          <button type="button" className={TEAL_BUTTON} onClick={onExportJpeg} disabled={isRecording}>
            🖼️ JPEG
          </button>
        </div>
        <p className="text-center text-[10px] leading-relaxed text-[#5f6c9e]">
          💡 One click records the full reveal and downloads it as a video (MP4 where supported, otherwise WebM).
        </p>
      </div>

      {isAnimating && !isRecording && (
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#7c96ff]">
          ● animating {speed} dots / frame
        </p>
      )}
    </section>
  )
}
