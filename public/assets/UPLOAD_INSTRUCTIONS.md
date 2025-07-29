# Asset Upload Instructions

## Required Assets

### Noggle PNGs (24 files)
Place these PNG files in `public/assets/noggles/`:

- original.png
- blue.png
- green.png
- red.png
- yellow.png
- purple.png
- orange.png
- pink.png
- cyan.png
- magenta.png
- lime.png
- teal.png
- indigo.png
- violet.png
- rose.png
- amber.png
- emerald.png
- sky.png
- fuchsia.png
- slate.png
- zinc.png
- stone.png
- gray.png
- neutral.png

**Requirements:**
- Resolution: 800x800 pixels
- Format: PNG with transparency
- File size: < 100KB each
- Content: Color overlay for noggle areas

### Eye Animation GIFs (16 files)
Place these GIF files in `public/assets/eyes/`:

- normal.gif
- blink.gif
- wink.gif
- glow.gif
- rainbow.gif
- laser.gif
- fire.gif
- ice.gif
- electric.gif
- cosmic.gif
- neon.gif
- holographic.gif
- matrix.gif
- galaxy.gif
- sunset.gif
- ocean.gif

**Requirements:**
- Resolution: 800x800 pixels
- Format: Animated GIF
- Frame rate: 8fps
- Duration: 2 seconds (16 frames)
- File size: < 500KB each
- Content: Animated overlay for eye areas

## Upload Methods

### Method 1: GitHub Web Interface
1. Go to your repository on GitHub
2. Navigate to `public/assets/`
3. Click "Add file" → "Upload files"
4. Drag and drop your PNG/GIF files
5. Commit with message: "Add noggle and eye animation assets"

### Method 2: Git Command Line
```bash
git add public/assets/noggles/*.png
git add public/assets/eyes/*.gif
git commit -m "Add noggle and eye animation assets"
git push origin main
```

## Testing
After uploading, run the development server and test the upload flow:
```bash
npm run dev
```

Navigate to `/upload` and test with a Noun image.
