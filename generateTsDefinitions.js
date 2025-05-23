#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Generating TypeScript declarations...');

// Ensure declarations directory exists
if (!fs.existsSync('declarations')) {
    fs.mkdirSync('declarations', { recursive: true });
}

try {
    // Generate TypeScript declarations
    console.log('📄 Running TypeScript compiler...');
    execSync('npx tsc --emitDeclarationOnly --declaration --outDir declarations --skipLibCheck --project tsconfig.json', {
        stdio: 'inherit'
    });
    console.log('✅ TypeScript compilation successful');
} catch (error) {
    console.log('⚠️  TypeScript compilation failed, trying alternative approach...');
    
    // Check if declarations/index.d.ts exists
    const declarationPath = path.join('declarations', 'index.d.ts');
    if (fs.existsSync(declarationPath)) {
        console.log('📁 Using existing declarations...');
    } else {
        console.log('📝 Creating minimal index.d.ts...');
        const content = "export * from '../lib/index';";
        fs.writeFileSync(declarationPath, content, 'utf8');
    }
}

try {
    // Bundle TypeScript declarations
    console.log('📦 Bundling TypeScript declarations...');
    execSync('npx dts-bundle --name indicators --main declarations/index.d.ts --out generated.d.ts --baseDir declarations --outputAsModuleFolder', {
        stdio: 'inherit'
    });
    
    // Check if generated file exists and clean it up
    const generatedPath = path.join('declarations', 'generated.d.ts');
    if (fs.existsSync(generatedPath)) {
        console.log('🧹 Cleaning up generated.d.ts...');
        let content = fs.readFileSync(generatedPath, 'utf8');
        
        // Replace "default class" with "class"
        content = content.replace(/default class/g, 'class');
        
        // Remove export statements
        content = content.replace(/export \{ .* \};/g, '');
        
        fs.writeFileSync(generatedPath, content, 'utf8');
        console.log('✅ TypeScript declarations generated successfully!');
    } else {
        console.log('⚠️  Generated.d.ts not created, but declarations are ready');
    }
} catch (error) {
    console.log('⚠️  dts-bundle failed, but basic declarations are available');
}

console.log('🎉 TypeScript declarations process completed!'); 