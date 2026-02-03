# Geneia

A modern, unique programming language with clean syntax, powerful features, and full GUI support.

![Geneia](https://geneia.dev/images/banner.png)

## Installation

```bash
npm install -g geneia
```

Or with yarn:
```bash
yarn global add geneia
```

## Quick Start

Create a file `hello.gn`:

```geneia
! Hello World !

peat 'Hello, World!'

exit (0)
```

Run it:
```bash
geneia hello.gn
```

## Features

- 🎯 Clean, unique syntax
- 📦 Built-in modules (String, Time, Math, Sys)
- 🔧 Flag-based functions (`str -u`, `time -n`, `gmath -s`)
- 🔄 Unit conversions (`gmath -C (100) 'cm' 'in'`)
- 🖥️ Cross-platform (Windows, macOS, Linux)
- 🎨 GUI support with GeneiaUI

## Syntax Overview

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
time -y               ! Current year !
```

### System Operations
```geneia
sys -o                ! Operating system !
sys -a                ! Architecture !
sys -w (1000)         ! Sleep 1 second !
```

### Math Operations
```geneia
gmath (5) + (3)       ! 8 !
gmath -s (16)         ! 4 (sqrt) !
gmath -p              ! 3.14159 (pi) !
gmath -C (100) 'cm' 'in'  ! 39.37 !
```

### Loops
```geneia
turn (5) {
    peat 'Loop!'
}

repeat 'Hello' & t.s = (3)
```

### Functions
```geneia
func greet {
    peat 'Hello!'
}

greet
```

### Module Syntax
```geneia
.String.upper 'hello'
.Time.now
.Math.sqrt (16)
.Sys.os
```

## Unit Conversions

Convert between units with `gmath -C`:

```geneia
! Length !
gmath -C (100) 'cm' 'in'
gmath -C (1) 'km' 'mi'

! Temperature !
gmath -C (0) 'c' 'f'
gmath -C (100) 'c' 'k'

! Weight !
gmath -C (1) 'kg' 'lb'

! Time !
gmath -C (1) 'hour' 'min'

! Data !
gmath -C (1) 'gb' 'mb'
```

Supported units: length, weight, temperature, time, data, speed, area, volume, angle, pressure, energy, power, frequency.

## Documentation

Full documentation at [geneia.dev/docs](https://geneia.dev/docs)

## Links

- [Website](https://geneia.dev)
- [Documentation](https://geneia.dev/docs)
- [Playground](https://geneia.dev/playground)
- [GitHub](https://github.com/moude-ai/geneia)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=moude-ai.geneia-language)

## License

MIT © Moude AI Inc.
