const REPO_URL = 'https://github.com/charlespura/DotMatrixAnimator'

export function Footer() {
  return (
    <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
      <a
        href={`${REPO_URL}/issues/new`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-[11px] text-[#b9c3ec] transition hover:bg-[#2f3557] hover:text-white"
      >
        📋 Report Issue / Feedback
      </a>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#5b6692]">
        <span>⚡ DotMatrixAnimator v2.1</span>
        <span className="text-[#354168]">|</span>
        <span className="font-mono">React · TS · Vite · Tailwind · Three.js</span>
        <span className="text-[#354168]">|</span>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8f9ee0] transition hover:text-white"
        >
          github.com/charlespura/DotMatrixAnimator
        </a>
      </div>
    </footer>
  )
}
