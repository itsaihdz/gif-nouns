#!/usr/bin/env node

/**
 * Performance Audit Script for Nouns Remix Studio
 * Run with: node scripts/audit.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Performance Audit for Nouns Remix Studio\n');

// Check bundle size
function checkBundleSize() {
  console.log('📦 Bundle Size Analysis:');
  
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      const jsDir = path.join(staticDir, 'chunks');
      if (fs.existsSync(jsDir)) {
        const files = fs.readdirSync(jsDir);
        let totalSize = 0;
        
        files.forEach(file => {
          if (file.endsWith('.js')) {
            const filePath = path.join(jsDir, file);
            const stats = fs.statSync(filePath);
            const sizeInKB = (stats.size / 1024).toFixed(2);
            totalSize += parseFloat(sizeInKB);
            console.log(`  - ${file}: ${sizeInKB} KB`);
          }
        });
        
        console.log(`  📊 Total JS Bundle: ${totalSize.toFixed(2)} KB`);
        
        if (totalSize > 500) {
          console.log('  ⚠️  Bundle size is large. Consider code splitting.');
        } else {
          console.log('  ✅ Bundle size is acceptable.');
        }
      }
    }
  } else {
    console.log('  ℹ️  Run "npm run build" first to analyze bundle size.');
  }
}

// Check environment variables
function checkEnvironmentVariables() {
  console.log('\n🔧 Environment Variables Check:');
  
  const requiredVars = [
    'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
    'NEXT_PUBLIC_URL'
  ];
  
  const optionalVars = [
    'NEXT_PUBLIC_NFT_CONTRACT_ADDRESS',
    'NEXT_PUBLIC_REMIX_CONTRACT_ADDRESS',
    'NEXT_PUBLIC_FARCASTER_NETWORK'
  ];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}: Set`);
    } else {
      console.log(`  ❌ ${varName}: Missing (Required)`);
    }
  });
  
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}: Set`);
    } else {
      console.log(`  ⚠️  ${varName}: Not set (Optional)`);
    }
  });
}

// Check image optimization
function checkImageOptimization() {
  console.log('\n🖼️  Image Optimization Check:');
  
  const publicDir = path.join(process.cwd(), 'public');
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file)
    );
    
    imageFiles.forEach(file => {
      const filePath = path.join(publicDir, file);
      const stats = fs.statSync(filePath);
      const sizeInKB = (stats.size / 1024).toFixed(2);
      
      if (stats.size > 100 * 1024) { // 100KB
        console.log(`  ⚠️  ${file}: ${sizeInKB} KB (Consider optimizing)`);
      } else {
        console.log(`  ✅ ${file}: ${sizeInKB} KB`);
      }
    });
  }
}

// Check TypeScript errors
function checkTypeScript() {
  console.log('\n📝 TypeScript Check:');
  
  try {
    const { execSync } = require('child_process');
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('  ✅ No TypeScript errors found.');
  } catch (error) {
    console.log('  ❌ TypeScript errors found:');
    console.log(error.stdout.toString());
  }
}

// Check ESLint
function checkESLint() {
  console.log('\n🔍 ESLint Check:');
  
  try {
    const { execSync } = require('child_process');
    execSync('npm run lint', { stdio: 'pipe' });
    console.log('  ✅ No ESLint errors found.');
  } catch (error) {
    console.log('  ❌ ESLint errors found:');
    console.log(error.stdout.toString());
  }
}

// Check dependencies
function checkDependencies() {
  console.log('\n📦 Dependencies Check:');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  
  console.log(`  📊 Production dependencies: ${dependencies.length}`);
  console.log(`  📊 Development dependencies: ${devDependencies.length}`);
  
  // Check for known large packages
  const largePackages = ['@coinbase/onchainkit', 'wagmi', 'viem'];
  largePackages.forEach(pkg => {
    if (dependencies.includes(pkg)) {
      console.log(`  ℹ️  Large package detected: ${pkg}`);
    }
  });
}

// Main audit function
function runAudit() {
  checkBundleSize();
  checkEnvironmentVariables();
  checkImageOptimization();
  checkTypeScript();
  checkESLint();
  checkDependencies();
  
  console.log('\n🎯 Audit Complete!');
  console.log('\n📋 Next Steps:');
  console.log('  1. Fix any errors found above');
  console.log('  2. Optimize large images');
  console.log('  3. Set up all required environment variables');
  console.log('  4. Run "npm run build" to test production build');
  console.log('  5. Deploy to Vercel');
}

// Run the audit
runAudit(); 