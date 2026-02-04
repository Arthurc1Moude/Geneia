# How to Build Geneia Installer

## Super Simple - One Command

Just run this from the root of the Geneia project:

```bash
./build-installer.sh
```

That's it! The script will:
1. Install dependencies (if needed)
2. Build everything
3. Create installer packages
4. Put them in `geneia-installer-app/release/`

## What You Get

Depending on your platform:

**Linux:**
- `Geneia-Installer-1.0.0.AppImage` - Universal Linux app (double-click to run)
- `geneia-installer_1.0.0_amd64.deb` - For Ubuntu/Debian
- `geneia-installer-1.0.0.x86_64.rpm` - For Fedora/RHEL

**macOS:**
- `Geneia-Installer-1.0.0.dmg` - Drag to Applications
- `Geneia-Installer-1.0.0-mac.zip` - Zip archive

**Windows:**
- `Geneia-Installer-Setup-1.0.0.exe` - Standard installer
- `Geneia-Installer-1.0.0.exe` - Portable (no install needed)

## What the Installer Does for Users

When someone runs your installer, it will:

1. ✅ Check if they have required tools (git, make, g++, node)
2. 📁 Let them choose where to install Geneia
3. 🔨 Compile the Geneia compiler
4. 📦 Install all files
5. 🖥️ **Create a desktop shortcut automatically**
6. 🔧 Add Geneia to their PATH
7. ✨ Ready to use!

## Distributing

Just share the installer file from `geneia-installer-app/release/` with users. They double-click it and everything is set up automatically, including the desktop icon.

## Troubleshooting

If the build fails:

```bash
cd geneia-installer-app
rm -rf node_modules package-lock.json
npm install
npm run build-all
```
