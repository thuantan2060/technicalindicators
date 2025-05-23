#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating build artifacts...');

const requiredFiles = [
  'dist/index.js',
  'lib/index.js',
  'declarations/index.d.ts',
  'package.json'
];

const requiredDirectories = [
  'dist',
  'lib', 
  'declarations',
  'tf_model',
  'typings'
];

let hasErrors = false;

// Check required directories
console.log('\n📁 Checking directories...');
for (const dir of requiredDirectories) {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MISSING`);
    hasErrors = true;
  }
}

// Check required files
console.log('\n📄 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    hasErrors = true;
  }
}

// Validate package.json
console.log('\n📦 Validating package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredFields = ['name', 'version', 'main', 'module', 'types'];
  for (const field of requiredFields) {
    if (packageJson[field]) {
      console.log(`✅ ${field}: ${packageJson[field]}`);
    } else {
      console.log(`❌ ${field} - MISSING`);
      hasErrors = true;
    }
  }
  
  // Check if it's a scoped package
  if (packageJson.name.startsWith('@thuantan2060/')) {
    console.log('✅ Scoped package name');
  } else {
    console.log('❌ Package name should be scoped (@thuantan2060/*)');
    hasErrors = true;
  }
  
  // Check publishConfig
  if (packageJson.publishConfig && packageJson.publishConfig.access === 'public') {
    console.log('✅ Public access configured');
  } else {
    console.log('❌ publishConfig.access should be "public"');
    hasErrors = true;
  }
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  hasErrors = true;
}

// Check TypeScript declarations
console.log('\n🔧 Checking TypeScript declarations...');
if (fs.existsSync('declarations')) {
  const declarationFiles = fs.readdirSync('declarations', { recursive: true })
    .filter(file => file.endsWith('.d.ts'));
  
  if (declarationFiles.length > 0) {
    console.log(`✅ Found ${declarationFiles.length} TypeScript declaration files`);
  } else {
    console.log('❌ No TypeScript declaration files found');
    hasErrors = true;
  }
}

// Check dist and lib contents
console.log('\n🗂️  Checking build outputs...');
['dist', 'lib'].forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir, { recursive: true })
      .filter(file => file.endsWith('.js'));
    
    if (files.length > 0) {
      console.log(`✅ ${dir}/ contains ${files.length} JavaScript files`);
    } else {
      console.log(`❌ ${dir}/ contains no JavaScript files`);
      hasErrors = true;
    }
  }
});

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Build validation FAILED');
  console.log('Please fix the issues above before publishing.');
  process.exit(1);
} else {
  console.log('✅ Build validation PASSED');
  console.log('All required artifacts are present and valid.');
  process.exit(0);
} 