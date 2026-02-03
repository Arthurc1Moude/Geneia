import React from 'react'
import { Link } from 'react-router-dom'
import { GeneiaLogo, HeartIcon, GitHubIcon, DiscordIcon, TwitterIcon } from './Icons'
import './Footer.css'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <GeneiaLogo size={32} />
              <span className="logo-text">Geneia</span>
            </div>
            <p className="footer-desc">
              A modern, unique programming language with clean syntax, 
              powerful features, and full GUI support.
            </p>
          </div>

          <div className="footer-links">
            <h4>Resources</h4>
            <Link to="/docs">Documentation</Link>
            <Link to="/extensions">Extensions</Link>
            <Link to="/playground">Playground</Link>
            <Link to="/download">Download</Link>
          </div>

          <div className="footer-links">
            <h4>Community</h4>
            <a href="https://github.com/geneia/geneia" target="_blank" rel="noopener"><GitHubIcon size={16} /> GitHub</a>
            <a href="https://discord.gg/geneia" target="_blank" rel="noopener"><DiscordIcon size={16} /> Discord</a>
            <a href="https://twitter.com/geneialang" target="_blank" rel="noopener"><TwitterIcon size={16} /> Twitter</a>
          </div>

          <div className="footer-links">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">License (MIT)</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Geneia Programming Language. All rights reserved.</p>
          <p className="made-with">Made with <HeartIcon size={14} /> for developers</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
