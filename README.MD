# ◉ DOT BY DOT · POINTILLISM STUDIO

A modern interactive web app that transforms images into animated dot-by-dot
pointillism reveals. Watch dots progressively appear to form your image, tweak
the look live, then export a video, PNG, or JPEG.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and
**Three.js** (WebGL instanced rendering).

## 🎨 Features

### Image processing
- Upload **JPG / PNG / WEBP** via the picker or drag & drop anywhere on the page
- Images are flattened to a **700 × 700** canvas, so the preview and exports match
- The grid is sampled from real pixel colours to reproduce your image
- Transparent images are composited over black for a clean result

### Three.js dot rendering
- Every dot is an **InstancedMesh** instance — thousands of dots in one draw call
- Newly revealed dots **pop in** with a short ease-out-back animation
- The WebGL canvas is the single source of truth for preview, image exports, and video

### Animation controls
- **✨ START DOT ANIMATION** — progressive, randomised reveal order
- **⟳ RESET** — stops playback and generates a fresh reveal order
- **Dot size** (2–14 px, 0.5 steps)
- **Speed** (25–400 dots per animation frame)
- **Dot spacing** (4–16 px grid step; rebuilding the grid when changed)
- Live status line and progress bar with dot count

### Export & download
- **🎬 DOWNLOAD AS MP4** — records the complete reveal (empty → full) with the
  MediaRecorder API and downloads it automatically. MP4/H.264 is used when the
  browser supports it, otherwise WebM (VP9/VP8). A 30 FPS canvas stream is used.
- **📸 EXPORT PNG** — lossless snapshot of the current frame
- **🖼️ EXPORT JPEG** — 92 % quality snapshot of the current frame
- Recording uses a fresh random reveal order, then restores the frame you were on

### Interface
- Glass-morphism dark UI with responsive desktop/mobile layouts
- Drop overlay + highlighted upload target while dragging files
- Colour-coded actions: blue primary, rose video, teal image exports
- Accessible controls, `aria-live` status messages, reduced-motion support

## 🚀 Quick start

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## 🧭 How to use

1. **Upload** a JPG, PNG, or WEBP — or drop it anywhere on the page.
2. **Tune** dot size, speed, and spacing with the sliders.
3. **Start** the animation and watch the image appear dot by dot.
4. **Export** the current frame as PNG/JPEG, or record the full reveal as video.
5. **Reset** any time to get a new random reveal order.

## 🏗️ Architecture

```
src/
├── main.tsx                     # React entry point (StrictMode)
├── App.tsx                      # State, uploads, drag & drop, export orchestration
├── index.css                    # Tailwind import, theme, slider & keyframe styles
├── components/
│   ├── Header.tsx               # Title, GitHub link, star button
│   ├── ControlPanel.tsx         # Upload, actions, sliders, status, downloads
│   ├── Slider.tsx               # Reusable range control
│   ├── DotViewport.tsx          # Canvas host, placeholder, live/REC badges
│   ├── DropOverlay.tsx          # Full-screen drag & drop overlay
│   └── Footer.tsx               # Report link, version, stack info
└── lib/
    ├── DotMatrixEngine.ts       # Three.js scene, instanced dots, reveal & pop engine
    ├── dotGrid.ts               # 700×700 sampling + Fisher-Yates shuffle
    └── video.ts                 # MediaRecorder MIME detection & downloads
```

### Rendering pipeline

1. `extractImageData` draws the upload to an offscreen 700 × 700 canvas.
2. `buildDotGrid` samples pixels at the chosen spacing and stores RGB per dot.
3. `DotMatrixEngine` creates one `InstancedMesh` of circles. Hidden dots are
   scaled to zero; colours are stored per instance.
4. Each animation frame reveals `speed` dots along a shuffled order, triggering a
   scale pop. An orthographic camera maps world units 1:1 to pixels, so positions
   match the source grid exactly.
5. `exportImage()` re-renders and calls `toDataURL` (the renderer keeps a
   preserved drawing buffer). Video uses `canvas.captureStream(30)`.

## 🎞️ Video notes

- **Chrome/Edge** typically records `video/mp4` (H.264) or WebM; Safari supports
  MP4 recording; Firefox records WebM.
- The download filename extension follows the actual recorded MIME type
  (`dot_reveal_<timestamp>.mp4` / `.webm`).
- Recording stops automatically after 60 seconds as a safety net.
- `videoBitsPerSecond` is set to 8 Mbps for crisp 700 × 700 output.

## 🌐 Browser support

- Chrome, Edge, Firefox, Safari (modern versions)
- WebGL required for the Three.js renderer
- `MediaRecorder` + `canvas.captureStream` required for video export
- Image export works wherever WebGL works

## ⚡ Performance tips

- More detail: spacing **4–5 px** (more dots)
- Minimal/abstract: spacing **10–16 px** (fewer dots)
- Smoother videos: lower dots/frame and slightly larger dot size
- If playback is heavy on low-end GPUs, increase spacing first

## 🎨 Palette

| Role           | Colour    |
| -------------- | --------- |
| Background     | `#05070f` |
| Glass panel    | `#0f1320` |
| Primary button | `#4f6eff` |
| Video button   | `#b8405e` |
| Image exports  | `#2a5f6e` |
| Accent         | `#7c96ff` |
| Text           | `#f0f3ff` |

## 📝 Version history

- **v2.1** — Rebuilt with React, TypeScript, Vite, Tailwind CSS, and Three.js;
  WebGL instanced dots with pop-in animation, responsive UI, preserved exports.
- **v2.0** — Single-file pointillism studio with MP4/PNG/JPEG export.
- **v1.0** — Initial release.

---

**Made with ✨ for creative visual exploration and animation**
