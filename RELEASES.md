# Geneia Releases - All Platforms

## 🎉 Available Builds

### 📦 Desktop Applications

#### Linux
- **AppImage** (Universal) - `Geneia Studio-1.0.0.AppImage` (129 MB)
  - Works on all Linux distributions
  - No installation required, just make executable and run
  - `chmod +x "Geneia Studio-1.0.0.AppImage" && ./Geneia\ Studio-1.0.0.AppImage`

- **Debian/Ubuntu (.deb)** - `geneia-studio_1.0.0_amd64.deb` (89 MB)
  - For Debian, Ubuntu, Linux Mint, Pop!_OS, etc.
  - `sudo dpkg -i geneia-studio_1.0.0_amd64.deb`

- **Snap** - `geneia-studio_1.0.0_amd64.snap` (111 MB)
  - Universal Linux package
  - `sudo snap install geneia-studio_1.0.0_amd64.snap --dangerous`

- **RPM** - `geneia-studio-1.0.0.x86_64.rpm` (Building...)
  - For Fedora, RHEL, CentOS, openSUSE
  - `sudo rpm -i geneia-studio-1.0.0.x86_64.rpm`

#### Windows
- **Installer (.exe)** - `Geneia Studio Setup 1.0.0.exe` (Building...)
  - Full Windows installer with shortcuts
  - Double-click to install

- **Portable (.exe)** - `Geneia Studio 1.0.0.exe` (169 MB)
  - No installation required
  - Run directly from any folder

#### macOS
- **DMG** - `Geneia Studio-1.0.0.dmg` (Requires macOS to build)
  - Drag and drop installer
  - For macOS 10.13+

- **ZIP** - `Geneia Studio-1.0.0-mac.zip` (Requires macOS to build)
  - Extract and run

### 🌐 Web Version
The web version is available at: **https://geneia.dev/studio**

To deploy your own:
```bash
cd geneia-studio-desktop
npm run build
# Deploy the 'dist' folder to any static hosting
```

### 📦 NPM Package (CLI)
Install the Geneia compiler globally:
```bash
npm install -g geneia
```

Or use from the packages directory:
```bash
cd packages/geneia-cli
npm install
npm link
```

## 🚀 Quick Start

### Linux
```bash
# AppImage (Recommended)
chmod +x "Geneia Studio-1.0.0.AppImage"
./Geneia\ Studio-1.0.0.AppImage

# Debian/Ubuntu
sudo dpkg -i geneia-studio_1.0.0_amd64.deb

# Snap
sudo snap install geneia-studio_1.0.0_amd64.snap --dangerous

# Fedora/RHEL
sudo rpm -i geneia-studio-1.0.0.x86_64.rpm
```

### Windows
1. Download `Geneia Studio Setup 1.0.0.exe`
2. Double-click to install
3. Launch from Start Menu

Or use portable version - just run the .exe file!

### macOS
1. Download `Geneia Studio-1.0.0.dmg`
2. Open DMG file
3. Drag Geneia Studio to Applications
4. Launch from Applications folder

## 📥 Download Links

All releases are available at:
- **GitHub Releases**: https://github.com/Arthurc1Moude/Geneia/releases
- **Website**: https://geneia.dev/download

## 🔧 Build from Source

### Prerequisites
- Node.js 18+
- npm or yarn
- For Windows builds: Wine (on Linux/Mac)
- For macOS builds: macOS system

### Build All Platforms
```bash
cd geneia-studio-desktop
npm install
./build-all.sh
```

### Build Specific Platform
```bash
# Linux
npm run electron:build -- --linux

# Windows
npm run electron:build -- --win

# macOS (requires macOS)
npm run electron:build -- --mac
```

## 📊 File Sizes

| Platform | Format | Size | Notes |
|----------|--------|------|-------|
| Linux | AppImage | 129 MB | Universal, recommended |
| Linux | .deb | 89 MB | Debian/Ubuntu |
| Linux | .snap | 111 MB | Universal snap |
| Linux | .rpm | ~90 MB | Fedora/RHEL |
| Windows | Portable | 169 MB | No install needed |
| Windows | Installer | ~90 MB | Full installer |
| macOS | .dmg | ~130 MB | Drag & drop |
| Web | Static | 658 KB | Browser-based |

## 🎯 Platform Support

### Linux
- ✅ Ubuntu 18.04+
- ✅ Debian 10+
- ✅ Fedora 32+
- ✅ CentOS 8+
- ✅ Arch Linux
- ✅ openSUSE
- ✅ Linux Mint
- ✅ Pop!_OS
- ✅ Elementary OS

### Windows
- ✅ Windows 10 (64-bit)
- ✅ Windows 11
- ✅ Windows Server 2016+

### macOS
- ✅ macOS 10.13 (High Sierra)+
- ✅ macOS 11 (Big Sur)+
- ✅ macOS 12 (Monterey)+
- ✅ macOS 13 (Ventura)+
- ✅ macOS 14 (Sonoma)+

### Web Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔐 Verification

All releases are signed and can be verified:
```bash
# Check SHA256
sha256sum "Geneia Studio-1.0.0.AppImage"

# Verify signature (when available)
gpg --verify geneia-studio-1.0.0.sig
```

## 📝 Changelog

### Version 1.0.0 (2024-02-02)
- 🎉 Initial release
- ✨ Full IDE with Monaco editor
- 🎨 Syntax highlighting for Geneia
- 🔧 Built-in compiler integration
- 🌍 Multi-language support (50+ languages)
- 🎯 Code completion and IntelliSense
- 🐛 Debugging support
- 📦 Extension system
- 🔌 Git integration
- 🎨 Multiple themes
- 📱 Responsive UI

## 🆘 Support

- **Documentation**: https://geneia.dev/docs
- **Issues**: https://github.com/Arthurc1Moude/Geneia/issues
- **Discord**: https://discord.gg/geneia
- **Email**: support@moude.ai

## 📄 License

MIT © Moude AI Inc.

---

**Made with ❤️ by Moude AI Inc.**
