# Publishing Geneia Packages

## VS Code Extension

### Prerequisites
```bash
npm install -g @vscode/vsce
```

### Build & Package
```bash
cd packages/vscode-geneia
npm install
npm run compile
vsce package
```

This creates `geneia-language-1.0.0.vsix`

### Publish to VS Code Marketplace

1. Create publisher account at https://marketplace.visualstudio.com/manage
2. Get Personal Access Token from Azure DevOps
3. Login:
```bash
vsce login moude-ai
```
4. Publish:
```bash
vsce publish
```

### Publish to Open VSX (for Kiro, VSCodium, etc.)
```bash
npm install -g ovsx
ovsx publish geneia-language-1.0.0.vsix -p <token>
```

---

## NPM Package (geneia-cli)

### Prerequisites
- npm account at https://www.npmjs.com
- Compiled Geneia binaries for each platform

### Build Binaries
```bash
# Linux x64
cd compiler && make clean && make
mkdir -p ../packages/geneia-cli/bin/linux/x64
cp geneia ../packages/geneia-cli/bin/linux/x64/

# macOS (on Mac)
cd compiler && make clean && make
mkdir -p ../packages/geneia-cli/bin/darwin/x64
cp geneia ../packages/geneia-cli/bin/darwin/x64/

# Windows (cross-compile or on Windows)
# Use MinGW or Visual Studio
mkdir -p ../packages/geneia-cli/bin/win32/x64
cp geneia.exe ../packages/geneia-cli/bin/win32/x64/
```

### Publish
```bash
cd packages/geneia-cli
npm login
npm publish
```

---

## Sublime Text Package

### Package Control
1. Fork https://github.com/wbond/package_control_channel
2. Add entry to `repository/g.json`:
```json
{
    "name": "Geneia",
    "details": "https://github.com/moude-ai/geneia",
    "releases": [
        {
            "sublime_text": "*",
            "tags": true
        }
    ]
}
```
3. Submit PR

### Manual Distribution
Create `Geneia.sublime-package` (zip file):
```bash
cd editors/sublime
zip -r Geneia.sublime-package *
```

---

## Vim Plugin

### vim-plug
Add to plugin registry or users can install directly:
```vim
Plug 'moude-ai/geneia', { 'rtp': 'editors/vim' }
```

### Vundle
```vim
Plugin 'moude-ai/geneia'
```

---

## Emacs Package (MELPA)

1. Fork https://github.com/melpa/melpa
2. Add recipe `recipes/geneia-mode`:
```elisp
(geneia-mode :fetcher github
             :repo "moude-ai/geneia"
             :files ("editors/emacs/*.el"))
```
3. Submit PR

---

## JetBrains Plugin

### Build Plugin
1. Create IntelliJ plugin project
2. Include `Geneia.xml` file type
3. Build with Gradle

### Publish
1. Create account at https://plugins.jetbrains.com
2. Upload plugin zip

---

## GitHub Releases

### Create Release
```bash
# Tag version
git tag v1.0.0
git push origin v1.0.0

# Create release on GitHub with:
# - geneia-linux-x64.tar.gz
# - geneia-darwin-x64.tar.gz
# - geneia-win32-x64.zip
# - geneia-language-1.0.0.vsix
```

---

## Homebrew (macOS)

Create formula `geneia.rb`:
```ruby
class Geneia < Formula
  desc "Geneia Programming Language"
  homepage "https://geneia.dev"
  url "https://github.com/moude-ai/geneia/archive/v1.0.0.tar.gz"
  sha256 "..."
  license "MIT"

  depends_on "make" => :build

  def install
    cd "compiler" do
      system "make"
      bin.install "geneia"
    end
  end

  test do
    (testpath/"hello.gn").write("peat 'Hello'\nexit (0)")
    assert_match "Hello", shell_output("#{bin}/geneia hello.gn")
  end
end
```

Submit to homebrew-core or create tap `moude-ai/homebrew-geneia`.

---

## APT/DEB Package (Debian/Ubuntu)

Create `.deb` package with proper structure and submit to PPA or distribute directly.

---

## Checklist

- [ ] VS Code Marketplace
- [ ] Open VSX Registry
- [ ] npm (geneia-cli)
- [ ] GitHub Releases
- [ ] Homebrew tap
- [ ] Sublime Package Control
- [ ] MELPA (Emacs)
- [ ] JetBrains Marketplace
- [ ] AUR (Arch Linux)
- [ ] Chocolatey (Windows)
