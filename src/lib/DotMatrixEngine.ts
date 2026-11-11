import * as THREE from 'three'
import { CANVAS_SIZE, buildDotGrid, extractImageData, shuffledIndices, type Dot } from './dotGrid'

const BACKGROUND = '#03050c'
const HALF = CANVAS_SIZE / 2
const POP_DURATION = 260 // ms
const EASE_C1 = 1.70158
const EASE_C3 = EASE_C1 + 1

export interface RevealSnapshot {
  order: number[]
  count: number
}

export interface DotMatrixCallbacks {
  onProgress?: (revealed: number, total: number) => void
  onComplete?: (total: number) => void
}

function easeOutBack(progress: number): number {
  const p = progress - 1
  return 1 + EASE_C3 * p * p * p + EASE_C1 * p * p
}

/**
 * Three.js renderer for the pointillism grid.
 *
 * Every dot is an instance of a small circle. Hidden dots are scaled to zero,
 * and newly revealed dots pop in with a short ease-out-back animation. The
 * WebGL canvas is exported directly for PNG/JPEG and captured for video, so the
 * preview and the exported artwork always match.
 */
export class DotMatrixEngine {
  callbacks: DotMatrixCallbacks = {}

  private readonly container: HTMLElement
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera: THREE.OrthographicCamera
  private readonly geometry = new THREE.CircleGeometry(0.5, 20)
  private readonly material = new THREE.MeshBasicMaterial({ toneMapped: false })
  private readonly matrix = new THREE.Matrix4()
  private readonly scratchColor = new THREE.Color()

  private mesh: THREE.InstancedMesh | null = null
  private imageData: ImageData | null = null
  private dots: Dot[] = []
  private order: number[] = []
  private revealed = new Uint8Array(0)
  private popStart = new Float32Array(0)
  private activePops: number[] = []

  private revealedCount = 0
  private playing = false
  private raf = 0
  private matrixDirty = false
  private lastProgress = -1

  private dotSize = 5
  private step = 6
  private dotsPerFrame = 85

  constructor(container: HTMLElement) {
    this.container = container

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    })
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(CANVAS_SIZE, CANVAS_SIZE, false)
    this.renderer.setClearColor(BACKGROUND, 1)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.NoToneMapping

    const canvas = this.renderer.domElement
    canvas.className = 'absolute inset-0 block h-full w-full'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    canvas.style.zIndex = '0'
    container.appendChild(canvas)

    this.camera = new THREE.OrthographicCamera(-HALF, HALF, HALF, -HALF, 0.1, 1000)
    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(0, 0, 0)
    this.camera.updateProjectionMatrix()

    this.raf = requestAnimationFrame(this.tick)
  }

  get hasImage(): boolean {
    return this.imageData !== null && this.dots.length > 0
  }

  get dotCount(): number {
    return this.dots.length
  }

  get revealedDots(): number {
    return this.revealedCount
  }

  get isAnimating(): boolean {
    return this.playing
  }

  get spacing(): number {
    return this.step
  }

  getCanvas(): HTMLCanvasElement {
    return this.renderer.domElement
  }

  loadImage(image: HTMLImageElement): void {
    this.pause()
    this.imageData = extractImageData(image)
    this.rebuildGrid()
  }

  setStep(step: number): void {
    this.step = step
    if (!this.imageData) return

    this.pause()
    this.dots = buildDotGrid(this.imageData, step)
    this.rebuildMesh()
    this.reset()
  }

  setDotSize(size: number): void {
    this.dotSize = size
    this.activePops = []

    for (let i = 0; i < this.dots.length; i += 1) {
      this.setDotMatrix(i, this.revealed[i] ? size : 0)
    }
  }

  setSpeed(dotsPerFrame: number): void {
    this.dotsPerFrame = dotsPerFrame
  }

  play(): boolean {
    if (!this.hasImage) return false
    if (this.playing) return true

    if (this.revealedCount >= this.dots.length) {
      this.reset()
    }

    this.playing = true
    this.emitProgress(true)
    return true
  }

  pause(): void {
    this.playing = false
  }

  reset(): void {
    this.pause()
    this.order = shuffledIndices(this.dots.length)
    this.resetReveal()
    this.emitProgress(true)
  }

  snapshot(): RevealSnapshot {
    return { order: [...this.order], count: this.revealedCount }
  }

  restoreSnapshot(snapshot: RevealSnapshot): void {
    this.pause()
    this.order = snapshot.order.slice()
    this.revealed.fill(0)
    this.activePops = []
    this.revealedCount = 0

    for (let i = 0; i < this.dots.length; i += 1) {
      this.setDotMatrix(i, 0)
    }

    const limit = Math.min(snapshot.count, this.dots.length)
    for (let k = 0; k < limit; k += 1) {
      const index = this.order[k]
      if (index === undefined) continue
      this.revealed[index] = 1
      this.setDotMatrix(index, this.dotSize)
    }

    this.revealedCount = limit
    this.emitProgress(true)
  }

  /**
   * Saves the current frame state, then prepares a fresh blank grid for a
   * video take. Pass the returned snapshot to `restoreSnapshot` afterwards.
   */
  beginRecording(): RevealSnapshot {
    const snapshot = this.snapshot()
    this.pause()
    this.order = shuffledIndices(this.dots.length)
    this.resetReveal()
    this.emitProgress(true)
    return snapshot
  }

  /** Reveals `amount` dots during a recording take. Returns true when done. */
  revealForRecording(amount: number): boolean {
    return this.revealDots(amount)
  }

  exportImage(type: 'image/png' | 'image/jpeg', quality?: number): string {
    this.renderNow()
    return this.renderer.domElement.toDataURL(type, quality)
  }

  renderNow(): void {
    this.flushMatrices()
    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    cancelAnimationFrame(this.raf)
    this.playing = false

    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.dispose()
      this.mesh = null
    }

    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
    this.container.removeAttribute('data-engine-ready')
  }

  private rebuildGrid(): void {
    if (!this.imageData) return

    this.dots = buildDotGrid(this.imageData, this.step)
    this.rebuildMesh()
    this.reset()
  }

  private rebuildMesh(): void {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.dispose()
    }

    const total = this.dots.length
    const mesh = new THREE.InstancedMesh(this.geometry, this.material, Math.max(total, 1))
    mesh.frustumCulled = false
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.count = total
    this.mesh = mesh

    for (let i = 0; i < total; i += 1) {
      const dot = this.dots[i]
      this.scratchColor.setRGB(dot.r / 255, dot.g / 255, dot.b / 255, THREE.SRGBColorSpace)
      mesh.setColorAt(i, this.scratchColor)
      this.setDotMatrix(i, 0)
    }

    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    this.flushMatrices()

    this.scene.add(mesh)
    this.container.setAttribute('data-engine-ready', 'true')
    this.renderNow()
  }

  private resetReveal(): void {
    this.revealed = new Uint8Array(this.dots.length)
    this.popStart = new Float32Array(this.dots.length)
    this.activePops = []
    this.revealedCount = 0
    this.lastProgress = -1

    for (let i = 0; i < this.dots.length; i += 1) {
      this.setDotMatrix(i, 0)
    }
  }

  private setDotMatrix(index: number, scale: number): void {
    if (!this.mesh) return
    const dot = this.dots[index]
    if (!dot) return

    this.matrix.makeScale(scale, scale, 1)
    this.matrix.setPosition(dot.x - HALF, HALF - dot.y, 0)
    this.mesh.setMatrixAt(index, this.matrix)
    this.matrixDirty = true
  }

  private revealDots(amount: number): boolean {
    const total = this.dots.length
    if (!total) return true

    const now = performance.now()
    let revealedNow = 0

    while (revealedNow < amount && this.revealedCount < total) {
      const index = this.order[this.revealedCount]
      this.revealedCount += 1
      revealedNow += 1

      if (index === undefined || this.revealed[index]) continue

      this.revealed[index] = 1
      this.popStart[index] = now
      this.activePops.push(index)
      this.setDotMatrix(index, 0)
    }

    this.emitProgress()
    return this.revealedCount >= total
  }

  private updatePops(now: number): void {
    if (!this.activePops.length) return

    for (let k = this.activePops.length - 1; k >= 0; k -= 1) {
      const index = this.activePops[k]
      const progress = Math.min(1, (now - this.popStart[index]) / POP_DURATION)
      this.setDotMatrix(index, this.dotSize * easeOutBack(progress))

      if (progress >= 1) {
        this.activePops.splice(k, 1)
      }
    }
  }

  private flushMatrices(): void {
    if (!this.matrixDirty || !this.mesh) return
    this.mesh.instanceMatrix.needsUpdate = true
    this.matrixDirty = false
  }

  private emitProgress(force = false): void {
    const total = this.dots.length
    const percent = total ? Math.round((this.revealedCount / total) * 100) : 0

    if (force || percent !== this.lastProgress) {
      this.lastProgress = percent
      this.callbacks.onProgress?.(this.revealedCount, total)
    }
  }

  private tick = (now: number): void => {
    this.raf = requestAnimationFrame(this.tick)

    if (this.playing) {
      const complete = this.revealDots(this.dotsPerFrame)
      if (complete) {
        this.playing = false
        this.callbacks.onComplete?.(this.dots.length)
      }
    }

    this.updatePops(now)
    this.flushMatrices()
    this.renderer.render(this.scene, this.camera)
  }
}
