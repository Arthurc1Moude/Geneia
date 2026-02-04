'use client';

interface TitleBarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function TitleBar({ darkMode, onToggleTheme }: TitleBarProps) {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div className="h-12 bg-slate-800 dark:bg-slate-950 flex items-center justify-between px-4 drag border-b border-slate-700 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <svg className="w-7 h-7" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="topFacet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#d0f0ff' }} />
              <stop offset="100%" style={{ stopColor: '#8cc8f0' }} />
            </linearGradient>
            <linearGradient id="leftFacet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#5090d0' }} />
              <stop offset="100%" style={{ stopColor: '#80b8e8' }} />
            </linearGradient>
            <linearGradient id="rightFacet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#6098d8' }} />
              <stop offset="100%" style={{ stopColor: '#4070b0' }} />
            </linearGradient>
            <linearGradient id="bottomFacet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#5080c0' }} />
              <stop offset="100%" style={{ stopColor: '#3060a0' }} />
            </linearGradient>
            <radialGradient id="highlight" cx="40%" cy="35%" r="40%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <polygon points="64,6 122,64 64,64" fill="url(#topFacet)"/>
          <polygon points="64,6 6,64 64,64" fill="url(#topFacet)" opacity="0.9"/>
          <polygon points="6,64 64,64 64,122" fill="url(#leftFacet)" opacity="0.85"/>
          <polygon points="122,64 64,64 64,122" fill="url(#rightFacet)"/>
          <polygon points="64,64 6,64 64,122" fill="url(#bottomFacet)" opacity="0.7"/>
          <polygon points="64,64 122,64 64,122" fill="url(#bottomFacet)" opacity="0.8"/>
          <line x1="64" y1="20" x2="64" y2="108" stroke="#a0d8ff" strokeWidth="1.5" opacity="0.5"/>
          <line x1="20" y1="64" x2="108" y2="64" stroke="#a0d8ff" strokeWidth="1.5" opacity="0.5"/>
          <line x1="35" y1="35" x2="93" y2="93" stroke="#b0e0ff" strokeWidth="1" opacity="0.4"/>
          <line x1="93" y1="35" x2="35" y2="93" stroke="#b0e0ff" strokeWidth="1" opacity="0.4"/>
          <ellipse cx="54" cy="50" rx="25" ry="20" fill="url(#highlight)"/>
          <g fill="white" opacity="0.95">
            <path d="M 64 38 C 49 38 37 50 37 65 C 37 80 49 92 64 92 C 71 92 77 89 82 85 L 82 75 L 64 75 L 64 68 L 90 68 L 90 88 C 83 94 74 98 64 98 C 45 98 30 83 30 65 C 30 47 45 32 64 32 C 75 32 84 37 90 45 L 83 50 C 78 44 71 38 64 38 Z" />
          </g>
        </svg>
        <h1 className="text-white font-semibold text-sm">Geneia IDE Installer</h1>
      </div>
      
      <div className="flex gap-1 no-drag items-center">
        <button
          onClick={onToggleTheme}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
            darkMode ? 'bg-purple-600' : 'bg-orange-400'
          }`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
              darkMode ? 'translate-x-7' : 'translate-x-0'
            }`}
          >
            {darkMode ? (
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>
        <button
          onClick={handleMinimize}
          className="w-9 h-9 hover:bg-slate-700 dark:hover:bg-slate-800 rounded transition-colors flex items-center justify-center text-slate-300 hover:text-white text-xl"
        >
          −
        </button>
        <button
          onClick={handleMaximize}
          className="w-9 h-9 hover:bg-slate-700 dark:hover:bg-slate-800 rounded transition-colors flex items-center justify-center text-slate-300 hover:text-white text-lg"
        >
          □
        </button>
        <button
          onClick={handleClose}
          className="w-9 h-9 hover:bg-red-600 rounded transition-colors flex items-center justify-center text-slate-300 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
