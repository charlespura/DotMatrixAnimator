interface DropOverlayProps {
  visible: boolean
}

export function DropOverlay({ visible }: DropOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f111f]/85 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <div className="animate-float-y px-6 text-center">
        <div className="text-5xl">📥</div>
        <p className="mt-5 text-xl font-bold tracking-[0.2em] text-[#7c96ff] [text-shadow:0_0_24px_rgba(124,150,255,0.6)] sm:text-2xl">
          DROP IMAGE HERE
        </p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-[#8f9cd0]">JPG · PNG · WEBP</p>
      </div>
    </div>
  )
}
