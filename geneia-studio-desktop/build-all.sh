#!/bin/bash

# Build script for Geneia Studio - All Platforms
# This script builds the Electron app for Linux, Windows, and macOS

echo "🚀 Building Geneia Studio for all platforms..."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the web app first
echo "🔨 Building web application..."
npm run build

# Build for Linux
echo ""
echo "🐧 Building for Linux (AppImage, deb, rpm, snap)..."
npm run electron:build -- --linux

# Build for Windows (if on Linux/Mac with wine)
echo ""
echo "🪟 Building for Windows (exe, portable)..."
npm run electron:build -- --win

# Build for macOS (only works on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo ""
    echo "🍎 Building for macOS (dmg, zip)..."
    npm run electron:build -- --mac
else
    echo ""
    echo "⚠️  Skipping macOS build (requires macOS)"
fi

echo ""
echo "✅ Build complete! Check the 'release' directory for installers."
echo ""
echo "Generated files:"
ls -lh release/
