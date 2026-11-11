interface HeaderProps {
  onStar: () => void
}

const REPO_URL = 'https://github.com/charlespura/DotMatrixAnimator'

export function Header({ onStar }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-[260px] flex-1">
        <h1 className="bg-gradient-to-br from-white to-[#b7ccff] bg-clip-text text-[1.5rem] font-bold leading-tight tracking-tight text-transparent sm:text-[1.9rem]">
          ◉ DOT BY DOT · POINTILLISM STUDIO
        </h1>
        <p className="mt-2 border-l-[3px] border-[#5f7cff] pl-3.5 text-[0.82rem] leading-relaxed text-[#9aa5ce] sm:text-sm">
          upload image → watch dot-by-dot transition → download as MP4, PNG, or JPEG
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[0.8rem] font-medium text-[#cddcff] transition hover:text-white hover:[text-shadow:0_0_6px_#5f7cff]"
        >
          <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
        <button
          type="button"
          onClick={onStar}
          className="inline-flex items-center gap-1.5 rounded-[40px] border border-[#ffd700]/30 bg-[#2a2f4a] px-3.5 py-1.5 text-[0.8rem] font-semibold text-[#ffdf6c] transition hover:bg-[#3e3f6e] hover:text-[#ffea8a] active:scale-[0.98]"
        >
          ⭐ STAR
        </button>
      </div>
    </header>
  )
}
