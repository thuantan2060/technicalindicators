#!/usr/bin/env node

// SVG to PNG converter utility using svg2png-wasm
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  IMAGES_DIR: path.join(__dirname, '..', 'candlestick', 'images'),
  WASM_PATH: path.join(__dirname, '../../node_modules/svg2png-wasm/svg2png_wasm_bg.wasm'),
  OUTPUT_SCALE: 2,
  OUTPUT_WIDTH: 800 * 2,
  OUTPUT_HEIGHT: 400 * 2
};

/**
 * Initialize WASM module
 */
async function initializeWasm() {
  const { initialize } = require('svg2png-wasm');
  
  if (!fs.existsSync(CONFIG.WASM_PATH)) {
    throw new Error(`WASM file not found: ${CONFIG.WASM_PATH}`);
  }
  
  await initialize(fs.readFileSync(CONFIG.WASM_PATH));
  console.log('✅ WASM initialized');
}

/**
 * Get all SVG files from images directory
 */
function getSvgFiles() {
  if (!fs.existsSync(CONFIG.IMAGES_DIR)) {
    throw new Error(`Images directory not found: ${CONFIG.IMAGES_DIR}`);
  }
  
  const files = fs.readdirSync(CONFIG.IMAGES_DIR);
  const svgFiles = files.filter(file => file.endsWith('.svg'));
  
  if (svgFiles.length === 0) {
    console.log('📄 No SVG files found to convert');
    return [];
  }
  
  console.log(`📊 Found ${svgFiles.length} SVG files`);
  return svgFiles;
}

/**
 * Convert single SVG file to PNG
 */
async function convertSvgFile(svgFile) {
  const { svg2png } = require('svg2png-wasm');
  
  const svgPath = path.join(CONFIG.IMAGES_DIR, svgFile);
  const pngFile = svgFile.replace(/\.svg$/i, '.png');
  const pngPath = path.join(CONFIG.IMAGES_DIR, pngFile);
  
  try {
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    const pngBuffer = await svg2png(svgContent, {
      width: CONFIG.OUTPUT_WIDTH,
      height: CONFIG.OUTPUT_HEIGHT,
      scale: 1
    });
    
    fs.writeFileSync(pngPath, pngBuffer);
    
    return {
      success: true,
      inputFile: svgFile,
      outputFile: pngFile,
      size: pngBuffer.length
    };
    
  } catch (error) {
    return {
      success: false,
      inputFile: svgFile,
      error: error.message
    };
  }
}

/**
 * Main conversion function
 */
async function convertAllSvgFiles() {
  console.log('🔧 Starting SVG to PNG conversion...');
  
  try {
    await initializeWasm();
    
    const svgFiles = getSvgFiles();
    if (svgFiles.length === 0) {
      return;
    }
    
    console.log('🖼️  Converting files...');
    
    let converted = 0;
    let failed = 0;
    
    for (const svgFile of svgFiles) {
      const result = await convertSvgFile(svgFile);
      
      if (result.success) {
        console.log(`   ✅ ${result.outputFile} (${result.size} bytes)`);
        converted++;
      } else {
        console.error(`   ❌ ${result.inputFile}: ${result.error}`);
        failed++;
      }
    }
    
    // Summary
    console.log(`🎉 Conversion complete! ${converted} files converted`);
    if (failed > 0) {
      console.log(`⚠️  ${failed} files failed to convert`);
    }
    
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📖 SVG to PNG Converter

Usage: node convert-svg-to-png.js [options]

Options:
  --help, -h     Show this help message
  
Features:
  🖼️  Converts all SVG files in test/candlestick/images/
  📏 Output: ${CONFIG.OUTPUT_WIDTH}x${CONFIG.OUTPUT_HEIGHT}px (2x scale)
  ✅ High-quality conversion using svg2png-wasm
  🧹 Preserves original SVG files
  
Examples:
  node convert-svg-to-png.js              # Convert all SVG files
`);
    process.exit(0);
  }
  
  convertAllSvgFiles();
}

module.exports = { convertAllSvgFiles }; 