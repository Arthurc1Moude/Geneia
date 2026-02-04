#!/bin/bash

# Geneia Installer Build Script
# Builds installer packages for all platforms

set -e

echo "🚀 Building Geneia Installer Packages..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf release dist-electron out build

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Next.js app
echo "⚛️  Building Next.js frontend..."
npm run build:next

# Build Electron main process
echo "⚡ Building Electron main process..."
npm run build:electron

# Build C++ native addon
echo "🔧 Building C++ native addon..."
npm run build:cpp

# Build installer packages
echo "📦 Building installer packages..."

# Detect platform and build accordingly
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Building Linux packages (AppImage, deb, rpm)..."
    npm run package:linux
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Building macOS packages (dmg, zip)..."
    npm run package:mac
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Building Windows packages (NSIS, portable)..."
    npm run package:win
else
    echo "❓ Unknown platform, building for all..."
    npm run package
fi

echo "✅ Build complete! Installers are in the 'release' directory."
ls -lh release/
