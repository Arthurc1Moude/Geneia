# Geneia Programming Language

A modern, unique programming language with clean syntax, powerful features, and full GUI support.

**Created by Moude AI Inc.**

## Quick Start

```geneia
! Hello World !

peat 'Hello, World!'

exit (0)
```

## Installation

### NPM (Recommended)
```bash
npm install -g geneia
```

### Build from Source
```bash
cd compiler
make
./geneia examples/hello.gn
```

## Features

- 🎯 Clean, unique syntax
- 📦 Built-in modules (String, Time, Math, Sys)
- 🔧 Flag-based functions
- 🔄 Unit conversions
- 🖥️ Cross-platform
- 🎨 GUI support

## Syntax

### Variables
```geneia
str {name} = 'Geneia'
hold {count} = (10)
```

### Output
```geneia
peat 'Hello!'
peat {name}
```

### String Operations
```geneia
str -u 'hello'        ! HELLO !
str -l 'HELLO'        ! hello !
str -t '  hi  '       ! hi !
str -r 'abc'          ! cba !
```

### Time Operations
```geneia
time -n               ! Current datetime !
time -u               ! Unix timestamp !
time -y               ! Year !
```

### System Operations
```geneia
sys -o                ! OS !
sys -a                ! Architecture !
sys -w (1000)         ! Sleep 1s !
```

### Math Operations
```geneia
gmath (5) + (3)       ! 8 !
gmath -s (16)         ! 4 (sqrt) !
gmath -C (100) 'cm' 'in'  ! Convert !
```

### Loops
```geneia
turn (5) {
    peat 'Loop!'
}
```

### Functions
```geneia
func greet {
    peat 'Hello!'
}
greet
```

## Editor Support

- **VS Code / Kiro**: Install "Geneia Language" extension
- **Sublime Text**: See `editors/sublime/`
- **Vim / Neovim**: See `editors/vim/`
- **Emacs**: See `editors/emacs/`
- **JetBrains**: See `editors/jetbrains/`
- **Nano**: See `editors/nano/`

## Project Structure

```
Geneia/
├── compiler/          # Geneia compiler (C++)
├── examples/          # Example .gn files
├── modules/           # Geneia modules
├── editors/           # Editor syntax files
├── packages/          # Publishable packages
│   ├── vscode-geneia/ # VS Code extension
│   └── geneia-cli/    # npm package
├── ui/                # GUI components
├── website/           # geneia.dev source
└── opengsl/           # OpenGSL library
```

## Documentation

- [Website](https://geneia.dev)
- [Docs](https://geneia.dev/docs)
- [Playground](https://geneia.dev/playground)

## License

MIT © Moude AI Inc.
