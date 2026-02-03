# Geneia Studio IDE

A modern, glassy IDE for the Geneia programming language. Available as both a web application and desktop app.

## 🚀 Features

- ✨ Beautiful glassmorphism UI with multiple themes
- 📝 Full Geneia syntax highlighting
- ▶️ Live code execution
- 📁 Multi-file project support
- 💾 Auto-save to local storage
- ⌨️ Keyboard shortcuts
- 🖥️ Desktop app (Electron) + Web Codespaces

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Build**: Vite
- **Desktop**: Electron

## 📦 Installation

```bash
# Install dependencies
npm install

# Run web version (development)
npm run dev

# Run desktop version (development)
npm run electron:dev

# Build for production
npm run build

# Build desktop app
npm run electron:build
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| F5 | Run code |
| Ctrl+S | Save file |
| Ctrl+N | New file |
| Escape | Stop execution |
| Tab | Insert 4 spaces |

## 🎨 Themes

- **Dark** (default)
- **Light**
- **Midnight Blue**
- **Forest Green**

## 📖 Geneia Language

```geneia
! Comment !
"Tip message"

peat 'Hello, World!'

var {name} = 'Alice'
hold (age) = (25)

turn (5) {
    peat 'Loop iteration'
}

repeat 'Loading...' & t.s = (3)

exit (0)
```

## 📁 Project Structure

```
geneia-studio-desktop/
├── src/
│   ├── components/     # React components
│   ├── interpreter/    # Geneia interpreter
│   ├── store/          # Zustand store
│   └── styles/         # CSS styles
├── electron/           # Electron main process
├── public/             # Static assets
└── package.json
```

## 🌐 Web Codespaces

The web version can be deployed to any static hosting:

```bash
npm run build
# Deploy the 'dist' folder
```

## 📄 License

Part of the Geneia Programming Language project.
