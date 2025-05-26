#!/usr/bin/env node

// Unit test runner with automatic SVG to PNG conversion and cleanup
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  IMAGES_DIR: path.join(__dirname, 'candlestick', 'images'),
  TEST_TIMEOUT: 30000,
  MAX_BUFFER: 1024 * 1024 * 10, // 10MB
  DISPLAY_EXAMPLES: 5,
  CONVERSION_TIMEOUT: 60000, // 60 seconds for conversion
  CONVERTER_SCRIPT: path.join(__dirname, 'convert-svg-to-png.js'),
  WASM_PATH: path.join(__dirname, '../node_modules/svg2png-wasm/svg2png_wasm_bg.wasm')
};

// Track conversion state using global to persist across requires
if (typeof global.conversionCompleted === 'undefined') {
  global.conversionCompleted = false;
}

/**
 * Get all SVG files in the images directory
 */
function getSvgFiles() {
  if (!fs.existsSync(CONFIG.IMAGES_DIR)) {
    return [];
  }
  return fs.readdirSync(CONFIG.IMAGES_DIR).filter(file => file.endsWith('.svg'));
}

/**
 * Convert SVG files to PNG using external converter script
 */
async function convertSvgToPng() {
  const svgFiles = getSvgFiles();
  
  if (svgFiles.length === 0) {
    console.log('📄 No SVG files to convert');
    return;
  }
  
  console.log(`🖼️  Converting ${svgFiles.length} SVG files to PNG...`);
  
  try {
    const result = await execAsync(`node "${CONFIG.CONVERTER_SCRIPT}"`, {
      cwd: path.dirname(CONFIG.CONVERTER_SCRIPT)
    });
    
    // Extract and display conversion summary
    const lines = result.stdout.trim().split('\n');
    const summaryLine = lines.find(line => line.includes('Conversion complete'));
    if (summaryLine) {
      console.log(`   ${summaryLine.trim()}`);
    }
    
  } catch (error) {
    console.warn('⚠️  External converter failed, attempting fallback...');
    await fallbackConversion(svgFiles);
  }
}

/**
 * Fallback conversion using direct svg2png-wasm
 */
async function fallbackConversion(svgFiles) {
  try {
    const { svg2png, initialize } = require('svg2png-wasm');
    
    if (fs.existsSync(CONFIG.WASM_PATH)) {
      await initialize(fs.readFileSync(CONFIG.WASM_PATH));
      
      let converted = 0;
      for (const svgFile of svgFiles) {
        try {
          const svgPath = path.join(CONFIG.IMAGES_DIR, svgFile);
          const pngPath = path.join(CONFIG.IMAGES_DIR, svgFile.replace('.svg', '.png'));
          
          const svgContent = fs.readFileSync(svgPath, 'utf8');
          const pngBuffer = await svg2png(svgContent, { scale: 2 });
          
          fs.writeFileSync(pngPath, pngBuffer);
          converted++;
        } catch (fileError) {
          console.warn(`   ⚠️  Failed: ${svgFile}`);
        }
      }
      
      console.log(`   Fallback conversion: ${converted}/${svgFiles.length} files converted`);
    } else {
      throw new Error('WASM file not found');
    }
    
  } catch (error) {
    console.warn('   ⚠️  Fallback conversion failed - SVG files preserved');
  }
}

/**
 * Clean up SVG files after successful PNG conversion
 */
function cleanupSvgFiles() {
  const svgFiles = getSvgFiles();
  
  if (svgFiles.length === 0) {
    console.log('🧹 No SVG files to clean up');
    return;
  }
  
  let deleted = 0;
  let preserved = 0;
  
  for (const svgFile of svgFiles) {
    const svgPath = path.join(CONFIG.IMAGES_DIR, svgFile);
    const pngPath = path.join(CONFIG.IMAGES_DIR, svgFile.replace('.svg', '.png'));
    
    if (fs.existsSync(pngPath)) {
      try {
        fs.unlinkSync(svgPath);
        deleted++;
      } catch (error) {
        preserved++;
      }
    } else {
      preserved++;
    }
  }
  
  console.log(`🧹 Cleanup: ${deleted} SVG files deleted, ${preserved} preserved`);
}

/**
 * Main post-test processing function
 */
async function postTestProcessing() {
  // Immediate check and atomic flag setting
  if (global.conversionCompleted) {
    console.log('🔄 Post-test processing already completed, skipping...');
    return;
  }
  
  // Set flag immediately to prevent race conditions
  global.conversionCompleted = true;
  
  console.log('\n🔄 Post-test processing started...');
  
  try {
    await convertSvgToPng();
    cleanupSvgFiles();
    console.log('✅ Post-test processing completed\n');
  } catch (error) {
    console.error('❌ Post-test processing failed:', error.message);
    // Don't fail tests due to conversion issues
  }
}

/**
 * Clear previous test images
 */
function clearPreviousImages() {
  if (!fs.existsSync(CONFIG.IMAGES_DIR)) {
    return 0;
  }
  
  const files = fs.readdirSync(CONFIG.IMAGES_DIR);
  const imageFiles = files.filter(file => file.endsWith('.svg') || file.endsWith('.png'));
  
  imageFiles.forEach(file => {
    fs.unlinkSync(path.join(CONFIG.IMAGES_DIR, file));
  });
  
  return imageFiles.length;
}

/**
 * Parse test results from Mocha output
 */
function parseTestResults(output) {
  const lines = output.split('\n');
  
  let passing = 0;
  let failing = 0;
  let pending = 0;
  
  lines.forEach(line => {
    const passingMatch = line.match(/(\d+) passing/);
    const failingMatch = line.match(/(\d+) failing/);
    const pendingMatch = line.match(/(\d+) pending/);
    
    if (passingMatch) passing = parseInt(passingMatch[1]);
    if (failingMatch) failing = parseInt(failingMatch[1]);
    if (pendingMatch) pending = parseInt(pendingMatch[1]);
  });
  
  return { passing, failing, pending };
}



/**
 * Get generated file statistics
 */
function getFileStats() {
  if (!fs.existsSync(CONFIG.IMAGES_DIR)) {
    return { pngFiles: [], svgFiles: [] };
  }
  
  const files = fs.readdirSync(CONFIG.IMAGES_DIR);
  const pngFiles = files.filter(f => f.endsWith('.png'));
  const svgFiles = files.filter(f => f.endsWith('.svg'));
  
  return { pngFiles, svgFiles };
}

/**
 * Display test execution summary
 */
function displaySummary(duration, testResults, fileStats) {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TEST EXECUTION SUMMARY');
  console.log('='.repeat(60));
  console.log(`⏱️  Duration: ${duration} seconds`);
  console.log(`✅ Passing: ${testResults.passing}`);
  
  if (testResults.failing > 0) {
    console.log(`❌ Failing: ${testResults.failing}`);
  }
  if (testResults.pending > 0) {
    console.log(`⏭️  Skipped: ${testResults.pending}`);
  }
  
  const totalTests = testResults.passing + testResults.failing + testResults.pending;
  if (totalTests > 0) {
    const successRate = Math.round((testResults.passing / totalTests) * 100);
    console.log(`🎯 Success rate: ${successRate}%`);
  }
  
  // File generation summary
  console.log('\n📁 Generated files:');
  console.log(`   📈 PNG files: ${fileStats.pngFiles.length}`);
  console.log(`   📄 SVG files: ${fileStats.svgFiles.length} (${fileStats.svgFiles.length > 0 ? 'preserved' : 'cleaned'})`);
  
  if (fileStats.pngFiles.length > 0) {
    console.log(`   📂 Location: test/candlestick/images/`);
    
    // Show example files
    const examples = fileStats.pngFiles.slice(0, CONFIG.DISPLAY_EXAMPLES);
    console.log('   📋 Examples:');
    examples.forEach(file => {
      console.log(`      • ${file}`);
    });
    
    if (fileStats.pngFiles.length > CONFIG.DISPLAY_EXAMPLES) {
      console.log(`      ... and ${fileStats.pngFiles.length - CONFIG.DISPLAY_EXAMPLES} more files`);
    }
  }
  
  // Final status
  if (testResults.failing === 0) {
    console.log('\n🎉 All tests passed successfully!');
    console.log('   Charts generated and converted automatically');
    console.log('   SVG cleanup completed');
  } else {
    console.log('\n⚠️  Some tests failed. See output above for details.');
  }
}

/**
 * Display help message
 */
function displayHelp() {
  console.log(`
📚 Unit Test Runner with Chart Conversion

Usage: node run-unit-tests.js [options]

Options:
  --help, -h     Show this help message
  --verbose, -v  Show detailed test output
  
Features:
  ✅ Runs all Mocha unit tests recursively
  📊 Automatically generates candlestick charts in tests
  🖼️  Converts SVG charts to PNG format after tests complete
  🧹 Cleans up SVG files after conversion
  📁 Preserves PNG files in test/candlestick/images/
  🔄 Single execution prevents multiple conversions
  
Test Configuration:
  • Timeout: ${CONFIG.TEST_TIMEOUT / 1000} seconds per test
  • Conversion timeout: ${CONFIG.CONVERSION_TIMEOUT / 1000} seconds
  • Bail on first failure: Yes
  • Recursive test discovery: Yes
  • Integrated post-test processing
  
Alternative Commands:
  npm test                    # Direct Mocha execution
  npm run test:charts         # This script with npm
  
View Generated Charts:
  dir test\\candlestick\\images\\*.png    # Windows
  ls test/candlestick/images/*.png        # Unix/Linux
`);
}

/**
 * Main test execution function
 */
async function runUnitTests() {
  console.log('🧪 Running unit tests with automatic chart conversion...\n');
  
  // Display configuration
  console.log('📋 Test Configuration:');
  console.log('   • Recursive test execution from test/ folder');
  console.log('   • SVG files auto-converted to PNG after tests');
  console.log('   • SVG files cleaned up after conversion');
  console.log(`   • Test timeout: ${CONFIG.TEST_TIMEOUT / 1000} seconds per test\n`);
  
  try {
    // Clear previous images
    const clearedCount = clearPreviousImages();
    if (clearedCount > 0) {
      console.log(`🧹 Cleared ${clearedCount} files from previous runs\n`);
    }
    
    // Execute tests
    console.log('🧪 Executing Mocha test suite...\n');
    
    const startTime = Date.now();
    const result = await execAsync('npm test', {
      cwd: __dirname,
      maxBuffer: CONFIG.MAX_BUFFER
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Run post-test processing (SVG→PNG conversion + cleanup)
    console.log('\n🔄 Running post-test processing...');
    await postTestProcessing();
    
    // Process results
    const testResults = parseTestResults(result.stdout);
    const fileStats = getFileStats();
    
    // Display summary
    displaySummary(duration, testResults, fileStats);
    
    if (result.stderr && result.stderr.trim()) {
      console.log('\n⚠️  Warnings:');
      console.log(result.stderr.trim());
    }
    
  } catch (error) {
    console.error('\n❌ Test execution failed:');
    console.error(`   ${error.message}`);
    
    if (error.stdout) {
      const lines = error.stdout.split('\n');
      const relevantLines = lines.slice(-10).filter(line => line.trim());
      
      if (relevantLines.length > 0) {
        console.log('\n📄 Last output:');
        relevantLines.forEach(line => {
          console.log(`   ${line}`);
        });
      }
    }
    
    if (error.stderr) {
      console.log('\n📄 Error details:');
      console.log(error.stderr);
    }
    
    process.exit(1);
  }
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  displayHelp();
  process.exit(0);
}

if (args.includes('--verbose') || args.includes('-v')) {
  console.log('📝 Verbose mode enabled\n');
} else {
  console.log('💡 Run with --verbose for detailed test output\n');
}

// Execute tests
runUnitTests().catch(error => {
  console.error('💥 Script execution failed:', error.message);
  process.exit(1);
}); 