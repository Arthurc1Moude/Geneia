# Geneia Installer - RPM Package (Fedora/RHEL)

## Installation

```bash
sudo rpm -i geneia-installer-1.0.0.x86_64.rpm
```

Or using dnf:
```bash
sudo dnf install geneia-installer-1.0.0.x86_64.rpm
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

- Fedora 36+ / RHEL 8+ / CentOS Stream 8+ (or compatible)
- x86_64 processor
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
sudo rpm -e geneia-installer
```

Or:
```bash
sudo dnf remove geneia-installer
```

## Support

- Documentation: https://geneia.dev/docs
- Issues: https://github.com/Arthurc1Moude/Geneia/issues
- Repository: https://github.com/Arthurc1Moude/Geneia

---

###### ❤ *Developed with care by Moude AI Inc.*
