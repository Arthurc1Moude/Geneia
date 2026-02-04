'use client';

interface WelcomeScreenProps {
  systemInfo: any;
  darkMode: boolean;
  onNext: () => void;
}

export default function WelcomeScreen({ systemInfo, darkMode, onNext }: WelcomeScreenProps) {
  const formatPlatform = (platform: string) => {
    const map: Record<string, string> = {
      'win32': 'Windows',
      'darwin': 'macOS',
      'linux': 'Linux'
    };
    return map[platform] || platform;
  };

  return (
    <div className="h-full flex p-8">
      <div className="flex-1 flex flex-col justify-center px-12">
        <div className="mb-6">
          <svg className="w-32 h-32 mb-6" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="topFacetWelcome" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#d0f0ff' }} />
                <stop offset="100%" style={{ stopColor: '#8cc8f0' }} />
              </linearGradient>
              <linearGradient id="leftFacetWelcome" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#5090d0' }} />
                <stop offset="100%" style={{ stopColor: '#80b8e8' }} />
              </linearGradient>
              <linearGradient id="rightFacetWelcome" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#6098d8' }} />
                <stop offset="100%" style={{ stopColor: '#4070b0' }} />
              </linearGradient>
              <linearGradient id="bottomFacetWelcome" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#5080c0' }} />
                <stop offset="100%" style={{ stopColor: '#3060a0' }} />
              </linearGradient>
              <radialGradient id="highlightWelcome" cx="40%" cy="35%" r="40%">
                <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
              </radialGradient>
            </defs>
            <polygon points="64,6 122,64 64,64" fill="url(#topFacetWelcome)"/>
            <polygon points="64,6 6,64 64,64" fill="url(#topFacetWelcome)" opacity="0.9"/>
            <polygon points="6,64 64,64 64,122" fill="url(#leftFacetWelcome)" opacity="0.85"/>
            <polygon points="122,64 64,64 64,122" fill="url(#rightFacetWelcome)"/>
            <polygon points="64,64 6,64 64,122" fill="url(#bottomFacetWelcome)" opacity="0.7"/>
            <polygon points="64,64 122,64 64,122" fill="url(#bottomFacetWelcome)" opacity="0.8"/>
            <line x1="64" y1="20" x2="64" y2="108" stroke="#a0d8ff" strokeWidth="1.5" opacity="0.5"/>
            <line x1="20" y1="64" x2="108" y2="64" stroke="#a0d8ff" strokeWidth="1.5" opacity="0.5"/>
            <line x1="35" y1="35" x2="93" y2="93" stroke="#b0e0ff" strokeWidth="1" opacity="0.4"/>
            <line x1="93" y1="35" x2="35" y2="93" stroke="#b0e0ff" strokeWidth="1" opacity="0.4"/>
            <ellipse cx="54" cy="50" rx="25" ry="20" fill="url(#highlightWelcome)"/>
            <g fill="white" opacity="0.95">
              <path d="M 64 38 C 49 38 37 50 37 65 C 37 80 49 92 64 92 C 71 92 77 89 82 85 L 82 75 L 64 75 L 64 68 L 90 68 L 90 88 C 83 94 74 98 64 98 C 45 98 30 83 30 65 C 30 47 45 32 64 32 C 75 32 84 37 90 45 L 83 50 C 78 44 71 38 64 38 Z" />
            </g>
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Welcome to Geneia IDE
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl">
          A modern programming language with clean syntax and powerful features. 
          This installer will guide you through the setup process.
        </p>

        <div className="space-y-4 mb-10 max-w-xl">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Cross-Platform Support</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Works on Windows, macOS, and Linux</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Built-in Modules</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">String, Time, Math, System operations included</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">GUI Framework</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Native desktop applications with GeneiaUI</p>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors w-fit"
        >
          Continue
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">System Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 text-sm">Operating System</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {systemInfo ? formatPlatform(systemInfo.platform) : 'Detecting...'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 text-sm">Architecture</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {systemInfo?.arch || 'Detecting...'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 text-sm">CPU Cores</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {systemInfo?.cpus || '...'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400 text-sm">Total Memory</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {systemInfo?.memory ? `${systemInfo.memory} GB` : '...'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600 dark:text-slate-400 text-sm">User</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {systemInfo?.username || '...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
