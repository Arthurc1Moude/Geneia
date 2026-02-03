import React from 'react'
import { Link } from 'react-router-dom'
import { CodeIcon, WindowIcon, ModuleIcon, SpeedIcon, LearnIcon, ToolsIcon, DownloadIcon, PlayIcon, GeneiaLogo } from '../components/Icons'
import './Home.css'

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <GeneiaLogo size={20} />
              <span>Version 1.0 Released</span>
            </div>
            <h1 className="hero-title">
              The Modern Programming Language
              <span className="gradient-text"> You'll Love</span>
            </h1>
            <p className="hero-subtitle">
              Geneia is a unique programming language with clean syntax, 
              powerful features, real GUI support, and an extensible module system.
            </p>
            <div className="hero-actions">
              <Link to="/download" className="btn btn-primary glass-btn">
                <DownloadIcon size={20} />
                Download Now
              </Link>
              <Link to="/playground" className="btn btn-secondary glass-btn">
                <PlayIcon size={20} />
                Try Online
              </Link>
            </div>
          </div>

          <div className="hero-code">
            <div className="code-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="filename">hello.gn</span>
            </div>
            <pre className="code-block">
<span className="comment">! Welcome to Geneia !</span>

<span className="keyword">import</span> G_Render

<span className="tip">"Universal rendering demo"</span>

<span className="module">.GR.target</span> <span className="string">'web'</span>
<span className="module">.GR.title</span> <span className="string">'My App'</span>
<span className="module">.GR.theme</span> <span className="string">'dark'</span>

<span className="module">.GR.view</span> <span className="string">'main'</span>
<span className="module">.GR.nav</span> <span className="string">'Home'</span> <span className="string">'About'</span>
<span className="module">.GR.hero</span> <span className="string">'Welcome!'</span>
<span className="module">.GR.render</span>

<span className="keyword">exit</span> <span className="number">(0)</span>
            </pre>
          </div>
        </div>
      </section>

      {/* Open Products Section */}
      <section className="section open-products">
        <div className="container">
          <h2 className="section-title">Geneia Open Products</h2>
          <p className="section-subtitle">
            Powerful modules built on Geneia - all part of Moude AI Inc.
          </p>

          <div className="products-grid">
            <div className="card product-card glass-card">
              <div className="product-badge">Open</div>
              <h3>OpenGSL</h3>
              <p className="product-desc">Open Public Geneia Styling Library</p>
              <p>2D/3D graphics rendering with shapes, colors, and canvas support.</p>
              <code className="product-code">.OpenGSL.cube (0) (0) (0) (100)</code>
            </div>

            <div className="card product-card glass-card">
              <div className="product-badge">Open</div>
              <h3>OpenGWS</h3>
              <p className="product-desc">Open Public Geneia Web Server Services Kit</p>
              <p>Package manager + web server like npm + node for Geneia.</p>
              <code className="product-code">.GWS.serve (8080)</code>
            </div>

            <div className="card product-card glass-card">
              <div className="product-badge">Open</div>
              <h3>OpenW2G</h3>
              <p className="product-desc">Open Published Web to Geneia Kit</p>
              <p>Convert HTML/Web to Geneia code for UI viewing.</p>
              <code className="product-code">.W2G.parse 'index.html'</code>
            </div>

            <div className="card product-card glass-card">
              <div className="product-badge">Open</div>
              <h3>OpenGNEL</h3>
              <p className="product-desc">Open Geneia Element LanScript</p>
              <p>Command line scripting in Geneia syntax.</p>
              <code className="product-code">.GNEL.run 'ls -la'</code>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features">
        <div className="container">
          <h2 className="section-title">Why Geneia?</h2>
          <p className="section-subtitle">
            Built from scratch with unique syntax and modern features
          </p>

          <div className="features-grid">
            <div className="card feature-card glass-card">
              <div className="feature-icon">
                <CodeIcon size={56} />
              </div>
              <h3>Unique Syntax</h3>
              <p>Custom 2-4 letter keywords, multiple quote types, and time units. Not copied from any other language.</p>
            </div>

            <div className="card feature-card glass-card">
              <div className="feature-icon">
                <WindowIcon size={56} />
              </div>
              <h3>Real GUI Support</h3>
              <p>Create actual graphical windows with buttons, labels, textboxes, and more. Works on Windows, Linux, and macOS.</p>
            </div>

            <div className="card feature-card glass-card">
              <div className="feature-icon">
                <ModuleIcon size={56} />
              </div>
              <h3>Module System</h3>
              <p>Import built-in modules or create your own .gne/.gns extensions. Extensible and powerful.</p>
            </div>

            <div className="card feature-card glass-card">
              <div className="feature-icon">
                <SpeedIcon size={56} />
              </div>
              <h3>Fast & Lightweight</h3>
              <p>Compiled C++ interpreter with optimized execution. Small binary size, quick startup.</p>
            </div>

            <div className="card feature-card glass-card">
              <div className="feature-icon">
                <LearnIcon size={56} />
              </div>
              <h3>Easy to Learn</h3>
              <p>Clean, readable syntax with comprehensive documentation. Perfect for beginners and experts alike.</p>
            </div>

            <div className="card feature-card glass-card">
              <div className="feature-icon">
                <ToolsIcon size={56} />
              </div>
              <h3>Professional IDE</h3>
              <p>Full-featured development environment with syntax highlighting, module management, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section className="section modules">
        <div className="container">
          <h2 className="section-title">Core Modules</h2>
          <p className="section-subtitle">
            Built-in modules for every need
          </p>

          <div className="modules-grid">
            <div className="module-item">
              <span className="module-name">G_Web.Kit</span>
              <span className="module-desc">Website generation</span>
            </div>
            <div className="module-item">
              <span className="module-name">G_Render</span>
              <span className="module-desc">Universal rendering</span>
            </div>
            <div className="module-item">
              <span className="module-name">GeneiaUI</span>
              <span className="module-desc">Desktop GUI</span>
            </div>
            <div className="module-item">
              <span className="module-name">Math</span>
              <span className="module-desc">Math functions</span>
            </div>
            <div className="module-item">
              <span className="module-name">File</span>
              <span className="module-desc">File I/O</span>
            </div>
            <div className="module-item">
              <span className="module-name">Network</span>
              <span className="module-desc">HTTP & sockets</span>
            </div>
          </div>
        </div>
      </section>

      {/* Syntax Section */}
      <section className="section syntax">
        <div className="container">
          <h2 className="section-title">Beautiful Syntax</h2>
          <p className="section-subtitle">
            Five quote types, each with a specific purpose
          </p>

          <div className="syntax-grid">
            <div className="syntax-item">
              <code className="syntax-code variable">{'{'}...{'}'}</code>
              <span className="syntax-label">Variable Names</span>
            </div>
            <div className="syntax-item">
              <code className="syntax-code string">'...'</code>
              <span className="syntax-label">Echo Messages</span>
            </div>
            <div className="syntax-item">
              <code className="syntax-code tip">"..."</code>
              <span className="syntax-label">Running Tips</span>
            </div>
            <div className="syntax-item">
              <code className="syntax-code comment">!...!</code>
              <span className="syntax-label">Comments</span>
            </div>
            <div className="syntax-item">
              <code className="syntax-code number">(...)</code>
              <span className="syntax-label">Numbers</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start?</h2>
            <p>Download Geneia and start building amazing applications today.</p>
            <div className="cta-actions">
              <Link to="/download" className="btn btn-primary">
                Download Geneia
              </Link>
              <Link to="/docs" className="btn btn-secondary">
                Read the Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <GeneiaLogo size={32} />
              <span>Geneia</span>
            </div>
            <p className="footer-text">
              © 2024 Moude AI Inc. (Moude LLC.) All rights reserved.
            </p>
            <p className="footer-tagline">
              Geneia and all Open* products are part of the Moude AI ecosystem.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
