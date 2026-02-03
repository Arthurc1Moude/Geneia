import { Link } from 'react-router-dom';
import { LogoIcon, GridIcon, BookIcon, CodeIcon, GithubIcon, UploadIcon } from './Icons';
import './Header.css';

export default function Header() {
  return (
    <header className="opengsl-header glass-header">
      <Link to="/" className="logo">
        <LogoIcon />
        <span className="logo-text">OpenGSL</span>
      </Link>
      
      <nav className="nav-links">
        <Link to="/" className="nav-link">
          <GridIcon />
          <span>Community</span>
        </Link>
        <Link to="/docs" className="nav-link">
          <BookIcon />
          <span>Docs</span>
        </Link>
        <Link to="/playground" className="nav-link">
          <CodeIcon />
          <span>Playground</span>
        </Link>
        <a href="https://github.com/geneia/opengsl" target="_blank" rel="noreferrer" className="nav-link">
          <GithubIcon />
          <span>GitHub</span>
        </a>
      </nav>
      
      <div className="header-actions">
        <button className="sign-in-btn">Sign In</button>
        <button className="upload-shape-btn">
          <UploadIcon />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
}
