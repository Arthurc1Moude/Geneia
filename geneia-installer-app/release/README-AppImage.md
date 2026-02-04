# Geneia Installer - AppImage (Universal Linux)

## Installation

1. Make the AppImage executable:
```bash
chmod +x Geneia\ Installer-1.0.0.AppImage
```

2. Run the installer:
```bash
./Geneia\ Installer-1.0.0.AppImage
```

3. Follow the on-screen instructions

## What This Installer Does

- ✅ Installs Geneia compiler and tools
- ✅ Adds Geneia to your system PATH
- ✅ Creates a desktop shortcut
- ✅ Sets up all necessary modules
- ✅ Checks for required dependencies (git, make, g++, node)

## System Requirements

- Linux (any distribution)
- 64-bit x86 processor
- 500 MB free disk space
- Internet connection (for downloading dependencies)

## After Installation

Verify installation:
```bash
geneia --version
```

Run your first program:
```bash
echo "out 'Hello, Geneia!'" > hello.gn
geneia hello.gn
```

## Support

- Documentation: https://geneia.dev/docs
- Issues: https://github.com/Arthurc1Moude/Geneia/issues
- Repository: https://github.com/Arthurc1Moude/Geneia

---

###### ❤ *Developed with care by Moude AI Inc.*
