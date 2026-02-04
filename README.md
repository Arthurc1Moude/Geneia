# Geneia
Code with clarity. Build with confidence.

## Geneia Programming Language

Geneia is a next-generation programming language crafted with elegance and efficiency in mind. Designed to empower developers with an intuitive, human-readable syntax, Geneia eliminates unnecessary complexity while delivering powerful capabilities.

With its comprehensive built-in module system—including String, Time, Math, and System operations—Geneia enables you to accomplish more with less code. The innovative flag-based command structure provides a seamless development experience, making common tasks effortless and enjoyable.

Whether you're building command-line applications, desktop GUIs with GeneiaUI, or exploring creative possibilities with OpenGSL, Geneia adapts to your vision. Cross-platform by design, it runs beautifully on Windows, macOS, and Linux.

Experience the joy of coding with a language that respects your time and creativity.

###### ❤  *Developed with care by Moude AI Inc.*

---

## Open Tools Ecosystem

Geneia comes with a powerful suite of open tools that extend its capabilities:

### OpenGSL
Open Public Geneia Styling Library. A comprehensive graphics and styling toolkit for creating 2D/3D visuals, shapes, and canvas-based applications directly in Geneia.

### OpenGWS
Open Public Geneia Web Server Services Kit. A complete web development solution combining package management and server capabilities—think npm meets Node.js, built natively for Geneia.

### OpenW2G
Open Public Web to Geneia Kit. Seamlessly convert HTML and web content into native Geneia code, bridging the gap between web technologies and Geneia applications.

### OpenGNEL
Open Geneia Element LanScript. A powerful command-line scripting environment using Geneia syntax, enabling shell automation and system scripting with the elegance of Geneia.

### GeneiaUI
Native cross-platform GUI framework for building beautiful desktop applications on Windows, macOS, and Linux with minimal code.

### G_Render
Universal rendering module that outputs the same UI to web, desktop, terminal, or other platforms from a single codebase.

### G_Web.Kit
Complete web development toolkit for generating modern, responsive websites directly from Geneia code.

###### ❤  *All Open tools are part of the Geneia ecosystem, developed by Moude AI Inc.*

---

## Features

- 🎨 **Syntax Highlighting** — Beautiful, accurate colorization for all Geneia syntax
- ⚡ **41 Code Snippets** — Quick templates for functions, loops, modules, and more
- ▶️ **Run Command** — Execute `.gn` files directly from VS Code (Ctrl+Shift+R)
- 💡 **Hover Documentation** — Instant help for keywords and built-in functions
- 🔧 **Bracket Matching** — Auto-close and match `()`, `{}`, `[]`
- 📝 **Comment Toggling** — Quick toggle with `Ctrl+/`

---

## Quick Start

### Installation via npm

```bash
npm install -g geneia
```

Verify installation:

```bash
geneia --version
```

### Your First Program

Create `hello.gn`:

```geneia
out 'Hello, Geneia!'

set name = 'World'
out 'Welcome to {name}!'

rep 3
    out 'Geneia is ready!'
end
```

Run it:

```bash
geneia hello.gn
```

---

## Syntax Overview

### Variables & Output

```geneia
set name = 'Alice'
set age = 25
set active = true

out 'Name: {name}'
out 'Age: {age}'
```

### Loops

```geneia
rep 5
    out 'Hello!'
end

whl condition
    out 'Running...'
end
```

### Functions

```geneia
fn greet(who)
    out 'Welcome, {who}!'
endfn

greet('Developer')
```

### Conditionals

```geneia
if score > 90
    out 'Excellent!'
eli score > 70
    out 'Good!'
els
    out 'Keep trying!'
end
```

---

## Inner Functions (Flag-Based)

### String Operations

| Flag | Long Flag | Description | Example |
|------|-----------|-------------|---------|
| `-u` | `--upper` | Uppercase | `str -u 'hello'` → `HELLO` |
| `-l` | `--lower` | Lowercase | `str -l 'WORLD'` → `world` |
| `-t` | `--trim` | Trim whitespace | `str -t '  text  '` → `text` |
| `-r` | `--rev` | Reverse | `str -r 'abc'` → `cba` |

### Time Operations

| Flag | Long Flag | Description | Example |
|------|-----------|-------------|---------|
| `-n` | `--now` | Current datetime | `time -n` |
| `-u` | `--unix` | Unix timestamp | `time -u` |
| `-y` | `--year` | Current year | `time -y` |
| `-m` | `--month` | Current month | `time -m` |
| `-d` | `--day` | Current day | `time -d` |
| `-h` | `--hour` | Current hour | `time -h` |

### Math Operations

| Flag | Long Flag | Description | Example |
|------|-----------|-------------|---------|
| `-s` | `--sqrt` | Square root | `gmath -s 16` → `4` |
| `-a` | `--abs` | Absolute value | `gmath -a -5` → `5` |
| `-f` | `--floor` | Floor | `gmath -f 3.7` → `3` |
| `-i` | `--ceil` | Ceiling | `gmath -i 3.2` → `4` |
| `-r` | `--round` | Round | `gmath -r 3.5` → `4` |
| `-p` | `--pi` | Pi constant | `gmath -p` → `3.14159...` |
| `-E` | `--e` | Euler's number | `gmath -E` → `2.71828...` |

### Unit Conversion

| Category | Example |
|----------|---------|
| Length | `gmath -C 100 'cm' 'm'` → `1` |
| Weight | `gmath -C 1000 'g' 'kg'` → `1` |
| Temperature | `gmath -C 32 'F' 'C'` → `0` |
| Time | `gmath -C 1 'hour' 'min'` → `60` |
| Data | `gmath -C 1024 'MB' 'GB'` → `1` |
| Speed | `gmath -C 100 'km/h' 'm/s'` → `27.78` |
| Area | `gmath -C 1 'm2' 'cm2'` → `10000` |
| Volume | `gmath -C 1 'L' 'mL'` → `1000` |
| Angle | `gmath -C 180 'deg' 'rad'` → `3.14159` |
| Pressure | `gmath -C 1 'atm' 'Pa'` → `101325` |
| Energy | `gmath -C 1 'kWh' 'J'` → `3600000` |
| Power | `gmath -C 1 'hp' 'W'` → `745.7` |
| Frequency | `gmath -C 1 'MHz' 'Hz'` → `1000000` |

### System Operations

| Flag | Long Flag | Description | Example |
|------|-----------|-------------|---------|
| `-o` | `--os` | OS name | `sys -o` |
| `-a` | `--arch` | Architecture | `sys -a` |
| `-w` | `--sleep` | Sleep (ms) | `sys -w 1000` |

---

## Module System

### Web Server (.GWS)

```geneia
.GWS.serve 8080
.GWS.route '/api' handler
.GWS.static '/public'
```

### File Operations (.GNEL)

```geneia
.GNEL.read 'data.txt'
.GNEL.write 'output.txt' content
.GNEL.exists 'file.txt'
.GNEL.delete 'temp.txt'
.GNEL.mkdir 'new_folder'
```

### Rendering (.G_Render)

```geneia
.G_Render.init
.G_Render.draw shape
.G_Render.export 'output.png'
```

### Web Kit (.G_Web)

```geneia
.G_Web.html template
.G_Web.css styles
.G_Web.build 'dist'
```

---

## Installation Guide

### Windows

1. Download the latest release from [GitHub Releases](https://github.com/Arthurc1Moude/Geneia/releases)
2. Extract `geneia-win64.zip` to a folder (e.g., `C:\Program Files\Geneia`)
3. Add to PATH:
   - Open System Properties → Advanced → Environment Variables
   - Under "System variables", find `Path` and click Edit
   - Add `C:\Program Files\Geneia\bin`
   - Click OK to save
4. Open a new Command Prompt and verify:

```cmd
geneia --version
```

### macOS

Using Homebrew:

```bash
brew tap moude-ai/geneia
brew install geneia
```

Or using the install script:

```bash
curl -fsSL https://geneia.dev/install.sh | bash
```

### Linux (Ubuntu/Debian)

```bash
# Add repository
curl -fsSL https://geneia.dev/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/geneia.gpg
echo "deb [signed-by=/usr/share/keyrings/geneia.gpg] https://geneia.dev/apt stable main" | sudo tee /etc/apt/sources.list.d/geneia.list

# Install
sudo apt update
sudo apt install geneia
```

### Linux (Fedora/RHEL)

```bash
sudo dnf copr enable moude-ai/geneia
sudo dnf install geneia
```

### Linux (Arch)

```bash
yay -S geneia
```

### Build from Source

```bash
git clone https://github.com/Arthurc1Moude/Geneia.git
cd Geneia/compiler
make
sudo make install
```

---

## Editor Setup

### VS Code / Kiro

Install from command line:

```bash
code --install-extension MoudeAI.geneia-language
```

Or search "Geneia" in Extensions (Ctrl+Shift+X) and click Install.

### Sublime Text

1. Copy `Geneia.sublime-syntax` to your Packages/User/ directory:
   - Windows: `%APPDATA%\Sublime Text\Packages\User\`
   - macOS: `~/Library/Application Support/Sublime Text/Packages/User/`
   - Linux: `~/.config/sublime-text/Packages/User/`

### Vim / Neovim

```bash
mkdir -p ~/.vim/syntax ~/.vim/ftdetect
cp editors/vim/geneia.vim ~/.vim/syntax/
cp editors/vim/ftdetect/geneia.vim ~/.vim/ftdetect/
```

### Emacs

Add to your `~/.emacs` or `~/.emacs.d/init.el`:

```elisp
(load-file "/path/to/editors/emacs/geneia-mode.el")
```

### Nano

```bash
sudo cp editors/nano/geneia.nanorc /usr/share/nano/
echo 'include "/usr/share/nano/geneia.nanorc"' >> ~/.nanorc
```

### JetBrains IDEs (IntelliJ, WebStorm, PyCharm)

1. Open Settings → Editor → File Types
2. Click + to add new file type
3. Import `editors/jetbrains/Geneia.xml`

---

## Resources

- 📖 **Documentation:** https://geneia.dev/docs
- 🐛 **Issues:** https://github.com/Arthurc1Moude/Geneia/issues
- 💬 **Community:** https://discord.gg/geneia
- 📦 **VS Code Extension:** https://marketplace.visualstudio.com/items?itemName=MoudeAI.geneia-language

---

**Publisher:** MoudeAI  
**License:** MIT  
**Repository:** [github.com/Arthurc1Moude/Geneia](https://github.com/Arthurc1Moude/Geneia)

###### ❤ *Developed with care by Moude AI Inc.*
