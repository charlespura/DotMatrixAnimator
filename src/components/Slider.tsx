interface SliderProps {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  disabled?: boolean
  onChange: (value: number) => void
}

export function Slider({ label, value, display, min, max, step, disabled = false, onChange }: SliderProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between gap-2 text-xs font-medium text-[#cdd6ff]">
        <span>{label}</span>
        <span className="font-mono text-[11px] text-[#8fa4ff]">{display}</span>
      </span>
      <input
        type="range"
        className="dm-range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}
