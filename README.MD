# ◉ DOT BY DOT · POINTILLISM STUDIO

A modern interactive web application that transforms images into animated dot-by-dot pointillism reveals. Watch as dots progressively appear to form your image, with full control over animation parameters and multiple export options.

## 🎨 Features

### Image Processing
- **Upload Support**: Accept JPG, PNG, and WEBP images
- **Canvas Rendering**: Automatically scales images to 700×700px for consistent processing
- **Dot Grid Generation**: Converts uploaded images into customizable dot grids based on image color data
- **Real-time Preview**: Live canvas preview showing the dot animation process

### Animation Control
- **Start Dot Animation** (`✨ START DOT ANIMATION`): Begins the progressive reveal of dots in a randomized organic order
- **Reset Animation** (`⟳ RESET`): Stops current animation and generates a fresh random reveal order for a new animation cycle
- **Adjustable Speed**: Control how many dots are revealed per animation frame (25-400 dots/frame)
- **Live Adjustments**: Modify parameters in real-time without stopping the animation

### Customization Parameters

#### 1. **Dot Size** (`🎯`)
- Range: 2.0 - 14.0 pixels
- Controls the radius of individual dots in the pointillism effect
- Real-time rendering updates as you adjust the slider
- Default: 5.0 px

#### 2. **Animation Speed** (`⚡`)
- Range: 25 - 400 dots per frame
- Determines how many dots are revealed each animation frame
- Higher values = faster animation completion
- Lower values = smoother, slower reveal
- Default: 85 dots/frame

#### 3. **Dot Spacing/Grid Step** (`🔘`)
- Range: 4 - 16 pixels
- Controls the distance between dots in the grid
- Smaller spacing = more dots = finer detail
- Larger spacing = fewer dots = simpler composition
- Dynamically rebuilds the dot grid when changed
- Default: 6 px

### Export & Download Options

#### 1. **MP4 Video Download** (`🎬 DOWNLOAD AS MP4`)
- Records the complete dot-by-dot animation sequence
- **Automatic Full Animation**: Captures from empty canvas to fully revealed image
- **Browser-Compatible Codec**: Detects best available video codec (MP4 in Safari, WebM in Chrome/Firefox)
- **One-Click Download**: Initiates automatic download upon completion
- **Fallback Download**: "Tap Again to Save" option for mobile browsers that block auto-download
- **Isolated Recording State**: Creates fresh recording with randomized dot reveal order
- **Video Specifications**:
  - **Frame Rate**: 30 FPS
  - **Format**: WebM (VP8/VP9) or MP4 (depending on browser support)
  - **Quality**: Based on canvas capture quality
  - **Filename**: `dot_reveal_[timestamp].[ext]`

#### 2. **PNG Export** (`📸 EXPORT PNG`)
- Exports the current canvas frame as a PNG image
- **Lossless Quality**: Preserves all dot details without compression artifacts
- **Filename**: `dot_art_[timestamp].png`
- Great for sharing static images of partially or fully animated states

#### 3. **JPEG Export** (`🖼️ EXPORT JPEG`)
- Exports the current canvas frame as a JPEG image
- **Compression Quality**: 92% quality setting for optimal file size vs. detail balance
- **Filename**: `dot_art_[timestamp].jpg`
- Ideal for web sharing and smaller file sizes

### User Interface

#### Status Messages
Real-time status indicator shows:
- Current animation state (animating, complete, idle)
- Total dots in current grid
- Download readiness
- Error messages and notifications

#### Visual Design
- **Modern Glass-Morphism UI**: Semi-transparent frosted glass effect with backdrop blur
- **Dark Theme**: Optimized for visual comfort during extended use
- **Responsive Layout**: Adapts to different screen sizes
- **Color-Coded Buttons**: Visual hierarchy with different button styles
  - Primary (blue): Main actions
  - Download (red): MP4 download
  - Export (teal): PNG/JPEG exports
  - Secondary (gray): Reset and utility functions

#### Canvas Preview
- **Live Display**: 700×700px canvas showing real-time dot animation
- **Black Background**: High contrast for dot visibility
- **Responsive Scaling**: Canvas scales to fit screen while maintaining aspect ratio
- **Placeholder**: Instructions displayed when no image is loaded

## 🚀 How to Use

### Step 1: Upload an Image
1. Click the **"📁 UPLOAD IMAGE"** button
2. Select a JPG, PNG, or WEBP file from your device
3. The image is automatically processed and scaled to 700×700px
4. Status shows total number of dots generated

### Step 2: Configure Animation Parameters
- **Adjust Dot Size**: Use the dot size slider to make dots larger or smaller
- **Set Speed**: Control how fast dots appear with the speed slider
- **Change Spacing**: Modify dot grid density with the spacing slider
  - Adjusting spacing rebuilds the entire dot grid

### Step 3: Start Animation
1. Click **"✨ START DOT ANIMATION"** to begin
2. Watch as dots gradually fill in to reveal your image
3. Animation runs automatically to completion
4. Status updates to show completion status

### Step 4: Download or Export
- **Record as Video**: Click **"🎬 DOWNLOAD AS MP4"** to record the complete animation and download
- **Save Current State**: Use **"📸 EXPORT PNG"** or **"🖼️ EXPORT JPEG"** to save the current canvas
- **Multiple Downloads**: Can export from different animation states

### Resetting
- Click **"⟳ RESET"** to:
  - Stop current animation
  - Generate new random reveal order
  - Clear animation progress
  - Prepare for fresh animation start

## 🔧 Technical Details

### Core Functions

#### `buildDotGridFromImageData()`
Converts ImageData from uploaded image into array of dot objects with position and RGB color values

#### `resetRevealState()`
Initialize reveal animation by:
- Creating boolean flags for each dot
- Generating Fisher-Yates shuffled reveal order for organic appearance
- Resetting reveal counter
- Rendering initial state

#### `renderDots()`
Draws only revealed dots using their stored RGB color values:
- Clears canvas with black background
- Iterates through revealed dots
- Renders circles at dot positions with correct colors and sizes

#### `animationStep()`
Main animation loop (requestAnimationFrame):
- Reveals specified number of dots per frame
- Updates canvas rendering
- Continues until all dots revealed
- Handles animation completion

#### `startAnimation()` / `stopAnimation()`
Controls animation state and lifecycle

#### `generateAndDownloadMP4()`
Complex video recording function that:
1. Saves current animation state
2. Rebuilds fresh dot grid for recording
3. Initializes MediaRecorder or CCapture.js
4. Runs complete animation sequence while recording
5. Generates blob and triggers download
6. Restores previous application state
7. Provides fallback "tap again" download option

#### `exportPNG()` / `exportJPEG()`
Generates static image exports from current canvas state using `canvas.toDataURL()` API

#### `updateDotSize()` / `updateSpeed()` / `updateStep()`
Event handlers for slider inputs that update parameters and trigger re-rendering or grid rebuilding

### Browser Compatibility
- **Primary Support**: Chrome, Edge, Firefox, Safari
- **Video Codec Detection**: Automatically selects best available format
- **Fallback**: CCapture.js library for browsers without MediaRecorder support
- **Mobile**: Special handling for browsers with auto-download restrictions

### Performance Considerations
- Canvas fixed at 700×700px for consistent processing
- Dot grid built once per image upload (or parameter change)
- RequestAnimationFrame for smooth 60fps animation
- MediaRecorder for efficient video capture at 30fps
- Object reuse and minimal garbage generation during animation

## 📦 Dependencies

- **CCapture.js** (v1.1.0): Fallback video recording via CDN
  - URL: `https://cdn.jsdelivr.net/npm/ccapture.js@1.1.0/build/CCapture.min.js`
- **Native Browser APIs**: Canvas, MediaRecorder, FileReader, Blob

## 🎯 Use Cases

- **Artistic Projects**: Create unique pointillism-style animations of photos
- **Marketing Content**: Generate eye-catching dot-reveal animations for social media
- **Education**: Demonstrate image composition and animation concepts
- **Data Visualization**: Convert datasets into animated dot-based visualizations
- **Entertainment**: Create animated visual effects and transitions

## 💡 Tips & Tricks

1. **Fine Detail**: Reduce dot spacing (4-5px) for more detail, reduce dot size slightly
2. **Artistic Effect**: Increase dot spacing (10-16px) for minimalist abstract look
3. **Video Quality**: Slow down animation speed (low dots/frame) for smoother video output
4. **Performance**: If animation lags, reduce total dot count by increasing spacing
5. **Export Strategy**: Pause at interesting moments to capture PNG/JPEG exports
6. **Custom Sizes**: Combine different parameters for unique artistic effects

## 🖥️ System Requirements

- Modern web browser with Canvas API support
- 700×700px minimum viewport space for full interface
- JavaScript enabled
- For MP4 download: Browser with MediaRecorder API (Chrome, Firefox, Edge) or CCapture.js fallback

## 📄 File Structure

```
DotMatrixAnimator/
├── index.html          # Main application (HTML + CSS + JavaScript)
└── README.md          # This documentation file
```

## 🎨 Color Palette

- **Background**: Dark gradient (#0f111f to #05070f)
- **Primary Button**: Blue (#4f6eff)
- **Download Button**: Rose/Red (#b8405e)
- **Export Buttons**: Teal (#2a5f6e)
- **Text**: Light gray/white (#f0f3ff)
- **Accent**: Purple-blue (#7c96ff)

## 📝 Version History

- **v1.0**: Initial release with full pointillism animation, MP4/PNG/JPEG export, customizable parameters

---

**Made with ✨ for creative visual exploration and animation**
