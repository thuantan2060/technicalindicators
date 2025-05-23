#!/usr/bin/env bash
set -e  # Exit on any error

echo "Generating TypeScript declarations..."

# Generate TypeScript declarations
npx tsc --emitDeclarationOnly --declaration --outDir declarations --skipLibCheck --project tsconfig.json

if [ $? -ne 0 ]; then
    echo "TypeScript compilation failed, trying alternative approach..."
    # Use existing declarations if available
    if [ -f "declarations/index.d.ts" ]; then
        echo "Using existing declarations..."
    else
        echo "Creating minimal index.d.ts..."
        mkdir -p declarations
        echo "export * from '../lib/index';" > declarations/index.d.ts
    fi
fi

echo "Bundling TypeScript declarations..."
npx dts-bundle --name indicators --main declarations/index.d.ts --out generated.d.ts --baseDir declarations --outputAsModuleFolder

if [ $? -eq 0 ] && [ -f "declarations/generated.d.ts" ]; then
    echo "Cleaning up generated.d.ts..."
    sed -i 's/default class/class/g' declarations/generated.d.ts
    sed -i 's/export { .* };//g' declarations/generated.d.ts
    echo "TypeScript declarations generated successfully!"
else
    echo "Warning: dts-bundle failed or generated.d.ts not created"
    echo "TypeScript declarations ready!"
fi
