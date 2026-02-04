# Geneia Installer - Debian/Ubuntu Package

## Installation

### For x64 systems:
```bash
sudo dpkg -i geneia-installer_1.0.0_amd64.deb
```

### For ARM64 systems:
```bash
sudo dpkg -i geneia-installer_1.0.0_arm64.deb
```

If you get dependency errors, run:
```bash
sudo apt-get install -f
```

## Running the Installer

After installation, run:
```bash
geneia-installer
```

Or find "Geneia Installer" in your applications menu.

## What This Installer Does

- ✅ Installs Geneia compiler and tools
- ✅ Adds Geneia to your system PATH
- ✅ Creates a desktop shortcut
- ✅ Sets up all necessary modules
- ✅ Checks for required dependencies (git, make, g++, node)

## System Requirements

- Ubuntu 20.04+ / Debian 11+ (or compatible)
- x64 or ARM64 processor
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

## Uninstall

```bash
sudo apt remove geneia-installer
```

## Support

- Documentation: https://geneia.dev/docs
- Issues: https://github.com/Arthurc1Moude/Geneia/issues
- Repository: https://github.com/Arthurc1Moude/Geneia

---

###### ❤ *Developed with care by Moude AI Inc.*
