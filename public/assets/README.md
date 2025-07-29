# Assets Directory

This directory contains the visual assets for the Upload & Preview System.

## Structure

```
public/assets/
├── noggles/          # Noggle color overlays (PNG files)
│   ├── original.png
│   ├── neon-green.png
│   ├── hot-pink.png
│   ├── electric-blue.png
│   ├── gold.png
│   └── ... (23 total colors)
└── eyes/             # Eye animation overlays (GIF files)
    ├── normal.gif
    ├── slow-blink.gif
    ├── quick-wink.gif
    ├── rainbow-glow.gif
    └── ... (16 total animations)
```

## Noggle Colors (PNG files)

Store 23 noggle color overlays as PNG files. Each file should be:
- **Format**: PNG with transparency
- **Size**: 800x800 pixels (same as output)
- **Naming**: Use kebab-case (e.g., `neon-green.png`, `hot-pink.png`)
- **Content**: Color overlay that will be applied to the noggles area

### Required Noggle Colors:
1. `original.png` - No color change
2. `neon-green.png`
3. `hot-pink.png`
4. `electric-blue.png`
5. `gold.png`
6. `purple.png`
7. `orange.png`
8. `red.png`
9. `yellow.png`
10. `cyan.png`
11. `magenta.png`
12. `lime.png`
13. `teal.png`
14. `indigo.png`
15. `violet.png`
16. `rose.png`
17. `amber.png`
18. `emerald.png`
19. `sky.png`
20. `fuchsia.png`
21. `slate.png`
22. `zinc.png`
23. `stone.png`

## Eye Animations (GIF files)

Store 16 eye animation overlays as GIF files. Each file should be:
- **Format**: Animated GIF
- **Size**: 800x800 pixels (same as output)
- **Duration**: 2-3 seconds loop
- **Naming**: Use kebab-case (e.g., `slow-blink.gif`, `rainbow-glow.gif`)
- **Content**: Animated overlay for the eyes area

### Required Eye Animations:
1. `normal.gif` - No animation
2. `slow-blink.gif`
3. `quick-wink.gif`
4. `rainbow-glow.gif`
5. `fire.gif`
6. `ice.gif`
7. `sparkle.gif`
8. `pulse.gif`
9. `wave.gif`
10. `spin.gif`
11. `bounce.gif`
12. `shake.gif`
13. `zoom.gif`
14. `fade.gif`
15. `slide.gif`
16. `rotate.gif`

## Usage in Code

These assets are accessed in your components like this:

```typescript
// In your ImagePreview component
const noggleUrl = `/assets/noggles/${selectedNoggleColor}.png`;
const eyeUrl = `/assets/eyes/${selectedEyeAnimation}.gif`;

// Apply to canvas
const noggleImg = new Image();
noggleImg.src = noggleUrl;
```

## File Requirements

### Noggle PNGs:
- **Resolution**: 800x800 pixels
- **Format**: PNG with alpha channel
- **File size**: < 100KB each
- **Color space**: sRGB
- **Transparency**: Required for proper compositing

### Eye GIFs:
- **Resolution**: 800x800 pixels
- **Format**: Animated GIF
- **Frame rate**: 30fps
- **Duration**: 2-3 seconds loop
- **File size**: < 500KB each
- **Transparency**: Required for proper compositing

## Optimization

Before uploading:
1. **Compress PNGs** using tools like TinyPNG or ImageOptim
2. **Optimize GIFs** using tools like GIMP or online GIF optimizers
3. **Test file sizes** to ensure fast loading
4. **Verify transparency** works correctly

## Version Control

- **Include all assets** in your Git repository
- **Use Git LFS** if files are large (> 100MB total)
- **Document changes** when updating assets
- **Test locally** before pushing to production 