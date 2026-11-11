import type { RefObject } from 'react'

interface DotViewportProps {
  containerRef: RefObject<HTMLDivElement | null>
  hasImage: boolean
  isAnimating: boolean
  isRecording: boolean
  dotCount: number
  progress: number
}

export function DotViewport({
  containerRef,
  hasImage,
  isAnimating,
  isRecording,
  dotCount,
  progress,
}: DotViewportProps) {
  const showProgress = hasImage && (isAnimating || isRecording || progress > 0)

  return (
    <section className="flex min-w-0 flex-1 flex-col rounded-3xl bg-[#03050c] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_12px_28px_#000] sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3 px-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7683b4]">
        <span className="inline-flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isRecording
                ? 'animate-soft-pulse bg-[#ff5c7c]'
                : isAnimating
                  ? 'animate-soft-pulse bg-[#7c96ff]'
                  : 'bg-[#3d4a78]'
            }`}
          />
          {isRecording ? 'Recording' : isAnimating ? 'Animating' : 'Live preview'}
        </span>
        <span className="text-[#5f6c9e]">{dotCount.toLocaleString()} dots</span>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[700px] overflow-hidden rounded-2xl bg-[#03050c] ring-1 ring-white/5">
        <div ref={containerRef} className="absolute inset-0 z-0" />

        {!hasImage && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-[#7c96ff]/30 bg-[#0b0e1a]/60 text-3xl text-[#7c96ff]">
              ⬆
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-[#cbd5ff]">UPLOAD AN IMAGE</p>
              <p className="mt-2 font-mono text-xs text-[#8f9cd0]">dot-by-dot pointillism transition</p>
            </div>
            <p className="max-w-[260px] text-[11px] leading-relaxed text-[#5f6c9e]">
              Drop a JPG, PNG or WEBP anywhere on this page, or use the upload button.
            </p>
          </div>
        )}

        {isRecording && (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full border border-[#b8405e]/40 bg-[#2a0d17]/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff9bb0] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-[#ff5c7c]" />
            REC
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-0.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#4f6eff] to-[#b7ccff] transition-[width] duration-150 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 px-1 text-[11px] text-[#6f7aaa]">
        <span>⬇ live preview — organic dot transition</span>
        <span className="inline-flex items-center gap-2 font-mono">
          <span className="hidden sm:inline">WebGL</span>
          {showProgress && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[#9db2ff]">
              {Math.round(progress * 100)}%
            </span>
          )}
        </span>
      </div>
    </section>
  )
}
