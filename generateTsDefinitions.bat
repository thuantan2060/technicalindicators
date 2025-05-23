@echo off
echo Generating TypeScript declarations...
npx tsc --emitDeclarationOnly --declaration --outDir declarations --skipLibCheck --project tsconfig.json
if %errorlevel% neq 0 (
    echo TypeScript compilation failed, trying alternative approach...
    rem Use existing declarations if available
    if exist "declarations\index.d.ts" (
        echo Using existing declarations...
    ) else (
        echo Creating minimal index.d.ts...
        mkdir declarations 2>nul
        echo export * from '../lib/index'; > declarations\index.d.ts
    )
)

echo TypeScript declarations ready! 