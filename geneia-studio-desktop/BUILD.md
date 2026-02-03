# Building Geneia Studio

This guide explains how to build Geneia Studio for multiple platforms.

## Prerequisites

- Node.js 18+ and npm
- For Windows builds on Linux/Mac: Wine
- For macOS builds: macOS system

## Quick Build

### Build for Current Platform
```bash
npm install
npm run electron:build
```

### Build for All Platforms
```bash
chmod +x build-all.sh
./build-all.sh
```

## Platform-Specific Builds

### Linux (AppImage, deb, rpm, snap)
```bash
npm run electron:build -- --linux
```

Generated files:
- `release/Geneia-Studio-*.AppImage` - Universal Linux package
- `release/geneia-studio_*.deb` - Debian/Ubuntu package
- `release/geneia-studio-*.rpm` - RedHat/Fedora package
- `release/geneia-studio_*.snap` - Snap package

### Windows (exe, portable)
```bash
npm run electron:build -- --win
```

Generated files:
- `release/Geneia-Studio-Setup-*.exe` - Windows installer
- `release/Geneia-Studio-*-portable.exe` - Portable version

### macOS (dmg, zip)
```bash
npm run electron:build -- --mac
```

Generated files:
- `release/Geneia-Studio-*.dmg` - macOS disk image
- `release/Geneia-Studio-*-mac.zip` - macOS zip archive

## Build Configuration

The build configuration is in `package.json` under the `build` section:

- **appId**: `com.geneia.studio`
- **productName**: Geneia Studio
- **Output directory**: `release/`

## Icon Requirements

Place platform-specific icons in the `public/` directory:
- `icon.icns` - macOS (512x512)
- `icon.ico` - Windows (256x256)
- `icon.png` - Linux (512x512)

## Troubleshooting

### Missing Dependencies
```bash
npm install
```

### Build Fails
```bash
# Clean and rebuild
rm -rf dist/ release/ node_modules/
npm install
npm run build
npm run electron:build
```

### Wine Issues (Windows builds on Linux)
```bash
# Install Wine on Ubuntu/Debian
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install wine64 wine32
```

## Distribution

After building, you can distribute the installers from the `release/` directory:

- Upload to GitHub Releases
- Host on your website
- Publish to package managers (Snap Store, Microsoft Store, etc.)

## Automated Builds

For CI/CD, use GitHub Actions or similar:

```yaml
- name: Build Electron App
  run: |
    cd geneia-studio-desktop
    npm install
    npm run electron:build -- --linux --win
```

## License

MIT © Moude AI Inc.
