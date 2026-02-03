# Geneia

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

1. Download the latest release from [GitHub Releases](https://github.com/moude-ai/geneia/releases)
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
git clone https://github.com/moude-ai/geneia.git
cd geneia/compiler
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

## Directory Structure

After installation, Geneia files are organized as follows:

### Linux / macOS

```
/usr/local/
├── bin/
│   └── geneia                  # Main executable
├── lib/geneia/
│   └── modules/                # Standard library
│       ├── GWS.gn              # Web server module
│       ├── GNEL.gn             # File operations module
│       ├── G_Render.gn         # Rendering module
│       └── G_Web.gn            # Web toolkit module
└── share/geneia/
    └── examples/               # Sample programs
```

### Windows

```
C:\Program Files\Geneia\
├── bin\
│   └── geneia.exe              # Main executable
├── modules\                    # Standard library
│   ├── GWS.gn
│   ├── GNEL.gn
│   ├── G_Render.gn
│   └── G_Web.gn
└── examples\                   # Sample programs
```

---

## Configuration

Geneia looks for configuration in these locations (in order of priority):

1. `.geneiarc` in current directory
2. `.geneiarc` in home directory
3. Environment variable `GENEIA_CONFIG`

Example `.geneiarc`:

```
modules_path = /custom/modules
output_color = true
strict_mode = false
debug = false
```

---

## Updating Geneia

### npm

```bash
npm update -g geneia
```

### Homebrew

```bash
brew upgrade geneia
```

### apt (Ubuntu/Debian)

```bash
sudo apt update
sudo apt upgrade geneia
```

### From Source

```bash
cd geneia
git pull
cd compiler
make clean
make
sudo make install
```

---

## Uninstalling

### npm

```bash
npm uninstall -g geneia
```

### Homebrew

```bash
brew uninstall geneia
```

### apt (Ubuntu/Debian)

```bash
sudo apt remove geneia
```

### Manual (from source)

```bash
sudo rm /usr/local/bin/geneia
sudo rm -rf /usr/local/lib/geneia
sudo rm -rf /usr/local/share/geneia
```

---

## Troubleshooting

### "geneia: command not found"

Make sure the installation directory is in your PATH:

```bash
# Check if geneia is in PATH
which geneia

# Add to PATH (Linux/macOS)
export PATH="$PATH:/usr/local/bin"

# Add to PATH permanently
echo 'export PATH="$PATH:/usr/local/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Permission denied

```bash
# Linux/macOS
sudo chmod +x /usr/local/bin/geneia
```

### Module not found

Set the modules path environment variable:

```bash
export GENEIA_MODULES=/path/to/geneia/modules
```

---

## Resources

- 📖 **Documentation:** https://geneia.dev/docs
- 🐛 **Issues:** https://github.com/moude-ai/geneia/issues
- 💬 **Community:** https://discord.gg/geneia
- 📦 **VS Code Extension:** https://marketplace.visualstudio.com/items?itemName=MoudeAI.geneia-language

---

**Publisher:** MoudeAI  
**License:** MIT  
**Repository:** [github.com/moude-ai/geneia](https://github.com/moude-ai/geneia)

❤ Developed with care by Moude AI Inc.
