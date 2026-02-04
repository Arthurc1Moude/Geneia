# Geneia IDE Installer

**Modern installer built with Next.js, TypeScript, C++, and Electron**

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Desktop**: Electron 28
- **Backend**: C++ (Node.js Native Addons)
- **Build**: node-gyp, electron-builder

## ✨ Features

- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast C++ backend for file operations
- 🖥️ Cross-platform (Windows, macOS, Linux)
- 📦 Two installation modes (Full/Minimal)
- 🔄 Real-time progress tracking
- 💻 System detection & validation
- 🎯 Clean, frameless window design

## 📦 Installation

```bash
cd geneia-installer-app
npm install
```

## 🛠️ Development

```bash
# Run in development mode
npm run dev

# This will start:
# - Next.js dev server on http://localhost:3000
# - Electron window
```

## 🏗️ Build

```bash
# Build everything
npm run build

# Build for specific platform
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

## 📁 Project Structure

```
geneia-installer-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── TitleBar.tsx
│   ├── WelcomeScreen.tsx
│   ├── InstallScreen.tsx
│   ├── ProgressScreen.tsx
│   └── SuccessScreen.tsx
├── electron/              # Electron main process
│   ├── main.ts           # Main process
│   └── preload.ts        # Preload script
├── cpp/                   # C++ native modules
│   ├── installer.cpp     # Main installer logic
│   ├── system_utils.cpp  # System utilities
│   └── file_operations.cpp # File operations
├── types/                 # TypeScript definitions
│   └── electron.d.ts
├── binding.gyp           # Node-gyp config
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🎯 How It Works

1. **Frontend (Next.js + TypeScript)**
   - Beautiful UI with Tailwind CSS
   - Type-safe React components
   - Smooth animations and transitions

2. **Desktop (Electron)**
   - Frameless window with custom title bar
   - IPC communication between renderer and main
   - System integration (file dialogs, shortcuts)

3. **Backend (C++)**
   - Fast file operations
   - System path management
   - Cross-platform compatibility

## 🔧 Build Process

1. **Next.js Build**: Exports static HTML/CSS/JS
2. **TypeScript Compilation**: Compiles Electron code
3. **C++ Compilation**: Builds native addons with node-gyp
4. **Electron Packaging**: Creates installers with electron-builder

## 📦 Output Files

### Windows
- `Geneia Installer Setup.exe` - NSIS installer
- `Geneia Installer.exe` - Portable version

### macOS
- `Geneia Installer.dmg` - Disk image
- `Geneia Installer.app` - Application bundle

### Linux
- `Geneia Installer.AppImage` - Universal Linux app
- `geneia-installer_1.0.0_amd64.deb` - Debian package
- `geneia-installer-1.0.0.x86_64.rpm` - RPM package

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
    }
  }
}
```

### Modify Installation Steps
Edit `cpp/installer.cpp` to add custom installation logic.

### Add New Screens
Create new components in `components/` and add to `app/page.tsx`.

## 🚀 Deployment

### GitHub Releases
```bash
npm run package
# Upload files from release/ to GitHub Releases
```

### Auto-Update
Configure `electron-builder` with update server:
```json
"publish": {
  "provider": "github",
  "owner": "moude-ai",
  "repo": "geneia"
}
```

## 📝 License

MIT © Moude AI Inc.

---

❤ **Developed with care by Moude AI Inc.**
