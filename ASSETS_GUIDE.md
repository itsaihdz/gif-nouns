# Assets Upload Guide

## 📁 Where to Upload Assets

You need to upload your noggle PNGs and eye animation GIFs to your GitHub repository in the following structure:

```
public/assets/
├── noggles/          # 23 noggle color overlays (PNG files)
│   ├── original.png
│   ├── neon-green.png
│   ├── hot-pink.png
│   └── ... (20 more colors)
└── eyes/             # 16 eye animation overlays (GIF files)
    ├── normal.gif
    ├── slow-blink.gif
    ├── quick-wink.gif
    └── ... (13 more animations)
```

## 🎨 Noggle PNG Files (22 total)

### Actual Files from GitHub:
1. `blue.png`
2. `deep teal.png`
3. `gomita.png`
4. `grass.png`
5. `green blue.png`
6. `grey light.png`
7. `guava.png`
8. `hip rose.png`
9. `honey.png`
10. `hyper.png`
11. `hyperliquid.png`
12. `lavender.png`
13. `magenta.png`
14. `orange.png`
15. `pink purple.png`
16. `purple.png`
17. `red.png`
18. `smoke.png`
19. `teal.png`
20. `watermelon.png`
21. `yellow orange.png`
22. `yellow.png`

### Noggle PNG Requirements:
- **Resolution**: 800x800 pixels
- **Format**: PNG with alpha channel (transparency)
- **File size**: < 100KB each
- **Content**: Color overlay that will be applied to noggles area
- **Transparency**: Required for proper compositing

## 👁️ Eye Animation GIF Files (17 total)

### Actual Files from GitHub:
1. `nouns.gif`
2. `ojos nouns.gif`
3. `ojos pepepunk.gif`
4. `ojos pepepunk en medio.gif`
5. `arriba.gif`
6. `arriba derecha.gif`
7. `arriba izquierda.gif`
8. `abajo.gif`
9. `abajo derecha.gif`
10. `abajo izquierda.gif`
11. `viscos.gif`
12. `viscos derecha.gif`
13. `viscos izquierda.gif`
14. `locos.gif`
15. `serpiente.gif`
16. `vampiro.gif`

### Eye GIF Requirements:
- **Resolution**: 800x800 pixels
- **Format**: Animated GIF
- **Frame rate**: 8fps (for final output)
- **Duration**: 2 seconds loop (16 frames)
- **File size**: < 500KB each
- **Transparency**: Required for proper compositing

## 📤 How to Upload to GitHub

### Method 1: GitHub Web Interface
1. Go to your repository on GitHub
2. Navigate to `public/assets/`
3. Click "Add file" → "Upload files"
4. Drag and drop your PNG/GIF files into the appropriate folders
5. Commit with message: "Add noggle and eye animation assets"

### Method 2: Git Command Line
```bash
# Add your assets to the repository
git add public/assets/noggles/*.png
git add public/assets/eyes/*.gif

# Commit the changes
git commit -m "Add noggle and eye animation assets"

# Push to GitHub
git push origin main
```

### Method 3: Git LFS (for large files)
If your assets are large (> 100MB total), use Git LFS:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "public/assets/**/*.png"
git lfs track "public/assets/**/*.gif"

# Add and commit
git add .gitattributes
git add public/assets/
git commit -m "Add noggle and eye animation assets with LFS"
git push origin main
```

## 🎯 Asset Creation Guidelines

### Noggle PNGs:
- Create color overlays that match the noggle shapes in Noun PFPs
- Use transparency to only affect the noggle areas
- Test with different Noun backgrounds
- Ensure colors are vibrant and distinct

### Eye GIFs:
- Create animations that work well with different eye shapes
- Keep animations subtle but noticeable
- Use transparency to only affect eye areas
- Test with different Noun styles

## 🔧 Optimization Tips

### Before Uploading:
1. **Compress PNGs** using tools like:
   - TinyPNG (online)
   - ImageOptim (Mac)
   - PNGGauntlet (Windows)

2. **Optimize GIFs** using tools like:
   - GIMP (free)
   - Photoshop
   - Online GIF optimizers

3. **Test file sizes** to ensure fast loading

4. **Verify transparency** works correctly

### File Naming:
- Use kebab-case: `neon-green.png`, `slow-blink.gif`
- Be consistent with naming conventions
- Avoid spaces or special characters

## 🧪 Testing Your Assets

### Local Testing:
1. Place your assets in the correct folders
2. Run the development server: `npm run dev`
3. Navigate to `/upload` page
4. Upload a Noun image
5. Test different noggle colors and eye animations
6. Verify the preview updates correctly

### Asset Validation:
- Check that all files load without errors
- Verify transparency works properly
- Test with different Noun images
- Ensure animations loop smoothly

## 📊 Asset Management

### Version Control:
- Include all assets in your Git repository
- Use descriptive commit messages
- Tag releases when updating assets
- Document any asset changes

### Backup Strategy:
- Keep original asset files in a separate location
- Use cloud storage for backups
- Document asset creation process

## 🎬 GIF Output Specifications

### Final GIF Requirements:
- **Resolution**: 800x800 pixels
- **Frame rate**: 8 fps
- **Total frames**: 16 frames
- **Duration**: 2.0 seconds
- **Format**: Animated GIF
- **File size**: Optimized for web sharing (< 5MB)
- **Quality**: High quality with transparency support

### Generation Process:
1. **Base image**: Original Noun PFP (800x800px)
2. **Noggle overlay**: Color overlay applied with multiply blend
3. **Eye animation**: Animated overlay applied with overlay blend
4. **Frame generation**: 16 frames created with animation effects
5. **GIF assembly**: Frames combined at 8 fps for 2-second loop

## 🚀 Production Deployment

### Vercel Deployment:
- Assets in `public/` are automatically served
- No additional configuration needed
- CDN caching for fast loading

### Performance Monitoring:
- Monitor asset loading times
- Track file sizes
- Optimize based on user feedback

## 📞 Support

If you need help:
1. Check the asset requirements above
2. Verify file naming conventions
3. Test locally before uploading
4. Check browser console for loading errors

## 🎉 Next Steps

After uploading your assets:
1. Test the upload flow with real assets
2. Gather user feedback on color/animation options
3. Optimize based on usage patterns
4. Consider adding more variations based on demand

Your assets will be automatically loaded by the ImagePreview component and used for the live preview functionality! 