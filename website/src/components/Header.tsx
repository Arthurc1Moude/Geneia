import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GeneiaLogo, GitHubIcon } from './Icons'
import './Header.css'

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/docs', label: 'Documentation' },
    { path: '/extensions', label: 'Extensions' },
    { path: '/playground', label: 'Playground' },
    { path: '/download', label: 'Download' },
  ]

  return (
    <header className="header glass-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <GeneiaLogo size={36} />
          <span className="logo-text">Geneia</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a href="https://github.com/moude-ai/geneia" className="btn btn-secondary glass-btn" target="_blank" rel="noopener">
            <GitHubIcon size={18} />
            <span>GitHub</span>
          </a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
