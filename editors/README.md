# Geneia Editor Support

Syntax highlighting and language support for various editors/IDEs.

## VS Code / Kiro

Files in root directory:
- `geneia.tmLanguage.json` - TextMate grammar
- `language-configuration.json` - Language configuration

Already configured in `package.json`.

## Sublime Text

Copy `sublime/Geneia.sublime-syntax` to:
- **macOS**: `~/Library/Application Support/Sublime Text/Packages/User/`
- **Linux**: `~/.config/sublime-text/Packages/User/`
- **Windows**: `%APPDATA%\Sublime Text\Packages\User\`

## Vim / Neovim

Copy files to your vim config:
```bash
mkdir -p ~/.vim/syntax ~/.vim/ftdetect
cp vim/geneia.vim ~/.vim/syntax/
cp vim/ftdetect/geneia.vim ~/.vim/ftdetect/
```

For Neovim:
```bash
mkdir -p ~/.config/nvim/syntax ~/.config/nvim/ftdetect
cp vim/geneia.vim ~/.config/nvim/syntax/
cp vim/ftdetect/geneia.vim ~/.config/nvim/ftdetect/
```

## Emacs

Add to your Emacs config:
```elisp
(add-to-list 'load-path "/path/to/editors/emacs")
(require 'geneia-mode)
```

Or with use-package:
```elisp
(use-package geneia-mode
  :load-path "/path/to/editors/emacs"
  :mode "\\.gn\\'")
```

## Nano

Add to `~/.nanorc`:
```
include "/path/to/editors/nano/geneia.nanorc"
```

## JetBrains IDEs (IntelliJ, WebStorm, PyCharm, etc.)

1. Go to **Settings** → **Editor** → **File Types**
2. Click **+** to add new file type
3. Import `jetbrains/Geneia.xml`

Or manually copy to:
- **macOS**: `~/Library/Application Support/JetBrains/<IDE>/filetypes/`
- **Linux**: `~/.config/JetBrains/<IDE>/filetypes/`
- **Windows**: `%APPDATA%\JetBrains\<IDE>\filetypes\`

## Highlighted Elements

| Element | Example |
|---------|---------|
| Comments | `! comment !` |
| Tips | `"tip message"` |
| Strings | `'string'` |
| Variables | `{varname}` |
| Numbers | `(123)`, `3.14` |
| Control | `peat`, `repeat`, `turn`, `exit`, `func` |
| Storage | `str`, `hold`, `var`, `msg` |
| Imports | `import`, `use`, `from`, `export` |
| Builtins | `gmath`, `time`, `sys` |
| Math | `sqrt`, `abs`, `sin`, `cos`, `floor`, `ceil` |
| String | `upper`, `lower`, `trim`, `rev` |
| Time | `now`, `unix`, `year`, `month`, `day`, `hour` |
| System | `os`, `arch`, `sleep` |
| Modules | `.String.upper`, `.Time.now`, `.Math.sqrt` |
| Flags | `-u`, `--upper`, `-C`, `--convert` |
| Time units | `t.s`, `t.ms`, `t.min` |
