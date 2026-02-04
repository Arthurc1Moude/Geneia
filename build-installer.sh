#!/bin/bash

# Simple one-command Geneia Installer builder
# Just run: ./build-installer.sh

echo "🚀 Building Geneia Installer..."
echo ""

cd geneia-installer-app

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time only)..."
    npm install
fi

echo "🔨 Building installer package..."
npm run build-all

echo ""
echo "✅ Done! Your installer is ready in: geneia-installer-app/release/"
echo ""
ls -lh release/ 2>/dev/null || echo "Check the release folder for your installer packages"
