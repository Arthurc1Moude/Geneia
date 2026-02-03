import React from 'react'
import { WindowsIcon, LinuxIcon, MacIcon, DownloadIcon } from '../components/Icons'
import './Download.css'

const Download: React.FC = () => {
  return (
    <div className="download-page">
      <div className="container">
        <div className="download-header">
          <h1 className="section-title">Download Geneia</h1>
          <p className="section-subtitle">
            Get started with Geneia on your platform
          </p>
        </div>

        <div className="download-grid">
          <div className="card download-card glass-card featured">
            <div className="platform-icon">
              <WindowsIcon size={64} />
            </div>
            <h3>Windows</h3>
            <p className="platform-desc">Windows 10/11 (64-bit)</p>
            <div className="download-info">
              <span className="version">v1.0.0</span>
              <span className="size">15.2 MB</span>
            </div>
            <button className="btn btn-primary glass-btn">
              <DownloadIcon size={18} />
              Download .exe
            </button>
            <p className="alt-download">
              or <a href="#">download .zip</a>
            </p>
          </div>

          <div className="card download-card glass-card">
            <div className="platform-icon">
              <LinuxIcon size={64} />
            </div>
            <h3>Linux</h3>
            <p className="platform-desc">Ubuntu, Debian, Fedora</p>
            <div className="download-info">
              <span className="version">v1.0.0</span>
              <span className="size">12.8 MB</span>
            </div>
            <button className="btn btn-primary glass-btn">
              <DownloadIcon size={18} />
              Download .tar.gz
            </button>
            <p className="alt-download">
              or <a href="#">install via apt</a>
            </p>
          </div>

          <div className="card download-card glass-card">
            <div className="platform-icon">
              <MacIcon size={64} />
            </div>
            <h3>macOS</h3>
            <p className="platform-desc">macOS 11+ (Intel & Apple Silicon)</p>
            <div className="download-info">
              <span className="version">v1.0.0</span>
              <span className="size">14.1 MB</span>
            </div>
            <button className="btn btn-primary glass-btn">
              <DownloadIcon size={18} />
              Download .dmg
            </button>
            <p className="alt-download">
              or <a href="#">install via brew</a>
            </p>
          </div>
        </div>

        <div className="source-section">
          <h2>Build from Source</h2>
          <pre className="code-block">
{`# Clone the repository
git clone https://github.com/geneia/geneia.git
cd geneia

# Build the compiler
cd compiler
make

# Build the IDE (optional)
cd ../ui
dotnet build

# Test installation
./compiler/geneia examples/hello.gn`}
          </pre>
        </div>

        <div className="requirements-section">
          <h2>System Requirements</h2>
          <div className="requirements-grid">
            <div className="card requirement-card">
              <h4>Compiler</h4>
              <ul>
                <li>Any modern OS (Windows/Linux/macOS)</li>
                <li>C++17 compatible compiler</li>
                <li>Make (for building)</li>
                <li>~50 MB disk space</li>
              </ul>
            </div>
            <div className="card requirement-card">
              <h4>IDE (Optional)</h4>
              <ul>
                <li>.NET 8.0 Runtime</li>
                <li>Windows Forms (Windows)</li>
                <li>GTK 3.24+ (Linux)</li>
                <li>~100 MB disk space</li>
              </ul>
            </div>
            <div className="card requirement-card">
              <h4>VS Code Extension</h4>
              <ul>
                <li>VS Code 1.80+</li>
                <li>Syntax highlighting</li>
                <li>Auto-completion</li>
                <li>~5 MB disk space</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="changelog-section">
          <h2>Changelog</h2>
          <div className="changelog">
            <div className="changelog-item">
              <div className="changelog-version">v1.0.0</div>
              <div className="changelog-date">December 2024</div>
              <ul>
                <li>Initial release</li>
                <li>Complete compiler with lexer, parser, interpreter</li>
                <li>Module system with import/export</li>
                <li>GUI support (Windows Forms, GTK, Terminal)</li>
                <li>5 built-in modules (UI, Math, Graphics, Network, File)</li>
                <li>Extension system (.gne/.gns)</li>
                <li>Professional IDE</li>
                <li>VS Code syntax highlighting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Download
