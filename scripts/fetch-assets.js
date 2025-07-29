#!/usr/bin/env node

/**
 * Asset Fetching Script
 * 
 * This script helps you fetch and organize noggle PNGs and eye animation GIFs
 * from your GitHub repository or other sources.
 * 
 * Usage:
 * node scripts/fetch-assets.js
 */

const fs = require('fs');
const path = require('path');

// Asset specifications
const ASSET_SPECS = {
  noggles: {
    count: 24,
    format: 'png',
    resolution: '800x800',
    files: [
      'original.png',
      'blue.png', 'green.png', 'red.png', 'yellow.png',
      'purple.png', 'orange.png', 'pink.png', 'cyan.png',
      'magenta.png', 'lime.png', 'teal.png', 'indigo.png',
      'violet.png', 'rose.png', 'amber.png', 'emerald.png',
      'sky.png', 'fuchsia.png', 'slate.png', 'zinc.png',
      'stone.png', 'gray.png', 'neutral.png'
    ]
  },
  eyes: {
    count: 16,
    format: 'gif',
    resolution: '800x800',
    fps: 8,
    frames: 16,
    duration: 2.0,
    files: [
      'normal.gif',
      'blink.gif', 'wink.gif', 'glow.gif', 'rainbow.gif',
      'laser.gif', 'fire.gif', 'ice.gif', 'electric.gif',
      'cosmic.gif', 'neon.gif', 'holographic.gif', 'matrix.gif',
      'galaxy.gif', 'sunset.gif', 'ocean.gif'
    ]
  }
};

// Directories
const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const NOGGLES_DIR = path.join(ASSETS_DIR, 'noggles');
const EYES_DIR = path.join(ASSETS_DIR, 'eyes');

function createDirectories() {
  console.log('📁 Creating asset directories...');
  
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(NOGGLES_DIR)) {
    fs.mkdirSync(NOGGLES_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(EYES_DIR)) {
    fs.mkdirSync(EYES_DIR, { recursive: true });
  }
  
  console.log('✅ Directories created successfully');
}

function createAssetList() {
  console.log('📋 Creating asset lists...');
  
  // Create noggles list
  const nogglesList = ASSET_SPECS.noggles.files.map(file => ({
    name: file.replace('.png', ''),
    file: file,
    status: 'missing'
  }));
  
  // Create eyes list
  const eyesList = ASSET_SPECS.eyes.files.map(file => ({
    name: file.replace('.gif', ''),
    file: file,
    status: 'missing'
  }));
  
  // Save lists
  fs.writeFileSync(
    path.join(NOGGLES_DIR, 'asset-list.json'),
    JSON.stringify(nogglesList, null, 2)
  );
  
  fs.writeFileSync(
    path.join(EYES_DIR, 'asset-list.json'),
    JSON.stringify(eyesList, null, 2)
  );
  
  console.log('✅ Asset lists created');
}

function checkExistingAssets() {
  console.log('🔍 Checking existing assets...');
  
  let nogglesFound = 0;
  let eyesFound = 0;
  
  // Check noggles
  ASSET_SPECS.noggles.files.forEach(file => {
    const filePath = path.join(NOGGLES_DIR, file);
    if (fs.existsSync(filePath)) {
      nogglesFound++;
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
    }
  });
  
  // Check eyes
  ASSET_SPECS.eyes.files.forEach(file => {
    const filePath = path.join(EYES_DIR, file);
    if (fs.existsSync(filePath)) {
      eyesFound++;
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
    }
  });
  
  console.log(`\n📊 Asset Summary:`);
  console.log(`   Noggles: ${nogglesFound}/${ASSET_SPECS.noggles.count} found`);
  console.log(`   Eyes: ${eyesFound}/${ASSET_SPECS.eyes.count} found`);
  
  return { nogglesFound, eyesFound };
}

function generatePlaceholderAssets() {
  console.log('🎨 Generating placeholder assets...');
  
  // Create a simple placeholder PNG (1x1 transparent pixel)
  const placeholderPNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  
  // Create placeholder files for noggles
  ASSET_SPECS.noggles.files.forEach(file => {
    const filePath = path.join(NOGGLES_DIR, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, placeholderPNG);
      console.log(`📝 Created placeholder: ${file}`);
    }
  });
  
  // Create placeholder files for eyes (simple 1x1 GIF)
  const placeholderGIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  
  ASSET_SPECS.eyes.files.forEach(file => {
    const filePath = path.join(EYES_DIR, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, placeholderGIF);
      console.log(`📝 Created placeholder: ${file}`);
    }
  });
  
  console.log('✅ Placeholder assets created');
}

function createUploadInstructions() {
  console.log('📝 Creating upload instructions...');
  
  const instructions = `# Asset Upload Instructions

## Required Assets

### Noggle PNGs (24 files)
Place these PNG files in \`public/assets/noggles/\`:

${ASSET_SPECS.noggles.files.map(file => `- ${file}`).join('\n')}

**Requirements:**
- Resolution: 800x800 pixels
- Format: PNG with transparency
- File size: < 100KB each
- Content: Color overlay for noggle areas

### Eye Animation GIFs (16 files)
Place these GIF files in \`public/assets/eyes/\`:

${ASSET_SPECS.eyes.files.map(file => `- ${file}`).join('\n')}

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
2. Navigate to \`public/assets/\`
3. Click "Add file" → "Upload files"
4. Drag and drop your PNG/GIF files
5. Commit with message: "Add noggle and eye animation assets"

### Method 2: Git Command Line
\`\`\`bash
git add public/assets/noggles/*.png
git add public/assets/eyes/*.gif
git commit -m "Add noggle and eye animation assets"
git push origin main
\`\`\`

## Testing
After uploading, run the development server and test the upload flow:
\`\`\`bash
npm run dev
\`\`\`

Navigate to \`/upload\` and test with a Noun image.
`;

  fs.writeFileSync(
    path.join(ASSETS_DIR, 'UPLOAD_INSTRUCTIONS.md'),
    instructions
  );
  
  console.log('✅ Upload instructions created');
}

function main() {
  console.log('🚀 Asset Management Script\n');
  
  try {
    createDirectories();
    createAssetList();
    const { nogglesFound, eyesFound } = checkExistingAssets();
    
    if (nogglesFound === 0 && eyesFound === 0) {
      console.log('\n⚠️  No assets found. Creating placeholders for development...');
      generatePlaceholderAssets();
    }
    
    createUploadInstructions();
    
    console.log('\n🎉 Asset setup complete!');
    console.log('\nNext steps:');
    console.log('1. Upload your actual noggle PNGs to public/assets/noggles/');
    console.log('2. Upload your actual eye GIFs to public/assets/eyes/');
    console.log('3. Test the upload flow with npm run dev');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ASSET_SPECS }; 