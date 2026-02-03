import React from 'react'

// Custom SVG Icons with glass effect
export const GeneiaLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="50%" stopColor="#8b5cf6"/>
        <stop offset="100%" stopColor="#d946ef"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#logoGrad)"/>
    <path d="M30 35 L50 25 L70 35 L70 65 L50 75 L30 65 Z" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 25 L50 75" stroke="white" strokeWidth="2" opacity="0.6"/>
    <path d="M30 50 L70 50" stroke="white" strokeWidth="2" opacity="0.6"/>
    <circle cx="50" cy="50" r="8" fill="white"/>
  </svg>
)

export const CodeIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="8" fill="url(#codeGrad)" fillOpacity="0.2"/>
    <path d="M18 16L10 24L18 32" stroke="url(#codeGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 16L38 24L30 32" stroke="url(#codeGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 12L22 36" stroke="url(#codeGrad)" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

export const WindowIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="winGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981"/>
        <stop offset="100%" stopColor="#34d399"/>
      </linearGradient>
    </defs>
    <rect x="4" y="8" width="40" height="32" rx="4" fill="url(#winGrad)" fillOpacity="0.2" stroke="url(#winGrad)" strokeWidth="2"/>
    <rect x="4" y="8" width="40" height="8" rx="4" fill="url(#winGrad)" fillOpacity="0.4"/>
    <circle cx="10" cy="12" r="2" fill="#ef4444"/>
    <circle cx="16" cy="12" r="2" fill="#eab308"/>
    <circle cx="22" cy="12" r="2" fill="#22c55e"/>
    <rect x="8" y="20" width="16" height="4" rx="2" fill="url(#winGrad)" fillOpacity="0.6"/>
    <rect x="8" y="28" width="24" height="4" rx="2" fill="url(#winGrad)" fillOpacity="0.4"/>
  </svg>
)

export const ModuleIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="modGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#fbbf24"/>
      </linearGradient>
    </defs>
    <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" fill="url(#modGrad)" fillOpacity="0.2" stroke="url(#modGrad)" strokeWidth="2"/>
    <path d="M24 4V44" stroke="url(#modGrad)" strokeWidth="2" strokeOpacity="0.5"/>
    <path d="M6 14L42 34" stroke="url(#modGrad)" strokeWidth="2" strokeOpacity="0.5"/>
    <path d="M42 14L6 34" stroke="url(#modGrad)" strokeWidth="2" strokeOpacity="0.5"/>
    <circle cx="24" cy="24" r="6" fill="url(#modGrad)"/>
  </svg>
)

export const SpeedIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444"/>
        <stop offset="100%" stopColor="#f97316"/>
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="20" fill="url(#speedGrad)" fillOpacity="0.2" stroke="url(#speedGrad)" strokeWidth="2"/>
    <path d="M24 8V14" stroke="url(#speedGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 34V40" stroke="url(#speedGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 24H14" stroke="url(#speedGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M34 24H40" stroke="url(#speedGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 24L32 16" stroke="url(#speedGrad)" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="4" fill="url(#speedGrad)"/>
  </svg>
)

export const LearnIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="learnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4"/>
        <stop offset="100%" stopColor="#22d3ee"/>
      </linearGradient>
    </defs>
    <path d="M8 12L24 4L40 12V20L24 28L8 20V12Z" fill="url(#learnGrad)" fillOpacity="0.2" stroke="url(#learnGrad)" strokeWidth="2"/>
    <path d="M8 20V32L24 40L40 32V20" stroke="url(#learnGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 28V40" stroke="url(#learnGrad)" strokeWidth="2"/>
    <circle cx="24" cy="16" r="4" fill="url(#learnGrad)"/>
  </svg>
)

export const ToolsIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="toolsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6"/>
        <stop offset="100%" stopColor="#a78bfa"/>
      </linearGradient>
    </defs>
    <path d="M18 8L8 18L18 28L28 18L18 8Z" fill="url(#toolsGrad)" fillOpacity="0.2" stroke="url(#toolsGrad)" strokeWidth="2"/>
    <path d="M28 18L40 30L36 40L24 28" stroke="url(#toolsGrad)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="18" r="4" fill="url(#toolsGrad)"/>
    <path d="M32 8L40 16" stroke="url(#toolsGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 8L40 12" stroke="url(#toolsGrad)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const DownloadIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

export const PlayIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

export const GitHubIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

export const ExtensionIcon: React.FC<{ type: 'gne' | 'gns', size?: number }> = ({ type, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id={`ext${type}Grad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={type === 'gne' ? '#6366f1' : '#10b981'}/>
        <stop offset="100%" stopColor={type === 'gne' ? '#8b5cf6' : '#34d399'}/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="28" height="28" rx="6" fill={`url(#ext${type}Grad)`} fillOpacity="0.2" stroke={`url(#ext${type}Grad)`} strokeWidth="2"/>
    <text x="16" y="20" textAnchor="middle" fill={`url(#ext${type}Grad)`} fontSize="8" fontWeight="bold" fontFamily="monospace">
      .{type}
    </text>
  </svg>
)

export const WindowsIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M6 12L20 10V22H6V12Z" fill="#00adef"/>
    <path d="M22 9.6L42 6V22H22V9.6Z" fill="#00adef"/>
    <path d="M6 24H20V36L6 34V24Z" fill="#00adef"/>
    <path d="M22 24H42V42L22 38.4V24Z" fill="#00adef"/>
  </svg>
)

export const LinuxIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <ellipse cx="24" cy="36" rx="14" ry="6" fill="#fbbf24"/>
    <path d="M14 36C14 28 18 16 24 16C30 16 34 28 34 36" fill="#1a1a1a"/>
    <circle cx="20" cy="24" r="3" fill="white"/>
    <circle cx="28" cy="24" r="3" fill="white"/>
    <circle cx="20" cy="24" r="1.5" fill="#1a1a1a"/>
    <circle cx="28" cy="24" r="1.5" fill="#1a1a1a"/>
    <path d="M21 30Q24 33 27 30" stroke="#fbbf24" strokeWidth="2" fill="none"/>
  </svg>
)

export const MacIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M34 24C34 18 30 14 24 14C18 14 14 18 14 24C14 30 18 38 24 38C30 38 34 30 34 24Z" fill="#a1a1aa"/>
    <path d="M24 6C24 6 26 10 26 14" stroke="#22c55e" strokeWidth="2"/>
    <path d="M28 8L26 14" stroke="#22c55e" strokeWidth="2"/>
  </svg>
)


// Additional polished icons
export const SearchIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
)

export const StarIcon: React.FC<{ size?: number; filled?: boolean }> = ({ size = 20, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
)

export const BookIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    <path d="M8 6H20C22 6 24 8 24 10V42C24 40 22 38 20 38H8V6Z" fill="url(#bookGrad)" fillOpacity="0.2" stroke="url(#bookGrad)" strokeWidth="2"/>
    <path d="M40 6H28C26 6 24 8 24 10V42C24 40 26 38 28 38H40V6Z" fill="url(#bookGrad)" fillOpacity="0.2" stroke="url(#bookGrad)" strokeWidth="2"/>
    <path d="M12 14H20" stroke="url(#bookGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 20H18" stroke="url(#bookGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 14H36" stroke="url(#bookGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 20H34" stroke="url(#bookGrad)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const RocketIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#d946ef"/>
      </linearGradient>
    </defs>
    <path d="M4.5 16.5C3 18 3 21 3 21s3 0 4.5-1.5c.88-.88 1.5-2.5 1.5-2.5s-1.62.62-2.5 1.5z" fill="url(#rocketGrad)" fillOpacity="0.3"/>
    <path d="M12 2C12 2 8 6 8 12c0 2 1 4 2 5l4 4c1-1 3-2 5-2 6 0 10-4 10-4s-4-10-10-10c-2 0-4 1-5 2l-2-5z" fill="url(#rocketGrad)" fillOpacity="0.2" stroke="url(#rocketGrad)" strokeWidth="1.5"/>
    <circle cx="15" cy="9" r="2" fill="url(#rocketGrad)"/>
  </svg>
)

export const TerminalIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="termGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e"/>
        <stop offset="100%" stopColor="#10b981"/>
      </linearGradient>
    </defs>
    <rect x="4" y="8" width="40" height="32" rx="4" fill="url(#termGrad)" fillOpacity="0.2" stroke="url(#termGrad)" strokeWidth="2"/>
    <path d="M12 20L18 26L12 32" stroke="url(#termGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 32H36" stroke="url(#termGrad)" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

export const PuzzleIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="puzzleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#fbbf24"/>
      </linearGradient>
    </defs>
    <path d="M20 8H28V12C28 14 30 16 32 16C34 16 36 14 36 12V8H40V20H36C34 20 32 22 32 24C32 26 34 28 36 28H40V40H28V36C28 34 26 32 24 32C22 32 20 34 20 36V40H8V28H12C14 28 16 26 16 24C16 22 14 20 12 20H8V8H20Z" fill="url(#puzzleGrad)" fillOpacity="0.2" stroke="url(#puzzleGrad)" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

export const CheckCircleIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981"/>
        <stop offset="100%" stopColor="#34d399"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#checkGrad)" fillOpacity="0.2" stroke="url(#checkGrad)" strokeWidth="2"/>
    <path d="M8 12L11 15L16 9" stroke="url(#checkGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const CopyIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)

export const MenuIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

export const CloseIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)


// Icons to replace all emojis
export const UserIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="4" fill="url(#userGrad)" fillOpacity="0.3" stroke="url(#userGrad)" strokeWidth="2"/>
    <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="url(#userGrad)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const PackageIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="pkgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#fbbf24"/>
      </linearGradient>
    </defs>
    <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" fill="url(#pkgGrad)" fillOpacity="0.2" stroke="url(#pkgGrad)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12L21 7" stroke="url(#pkgGrad)" strokeWidth="2"/>
    <path d="M12 12L3 7" stroke="url(#pkgGrad)" strokeWidth="2"/>
    <path d="M12 12V22" stroke="url(#pkgGrad)" strokeWidth="2"/>
  </svg>
)

export const EditIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="editGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
    <path d="M12 20H21" stroke="url(#editGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.5 3.5L20.5 7.5L7 21H3V17L16.5 3.5Z" fill="url(#editGrad)" fillOpacity="0.2" stroke="url(#editGrad)" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

export const ChartIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981"/>
        <stop offset="100%" stopColor="#34d399"/>
      </linearGradient>
    </defs>
    <rect x="3" y="12" width="4" height="9" rx="1" fill="url(#chartGrad)" fillOpacity="0.6"/>
    <rect x="10" y="8" width="4" height="13" rx="1" fill="url(#chartGrad)" fillOpacity="0.8"/>
    <rect x="17" y="3" width="4" height="18" rx="1" fill="url(#chartGrad)"/>
  </svg>
)

export const HeartIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444"/>
        <stop offset="100%" stopColor="#f97316"/>
      </linearGradient>
    </defs>
    <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.5 3 23 5.5 23 8.5C23 14 14 21 14 21H12Z" fill="url(#heartGrad)"/>
  </svg>
)

export const LoadingIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
    <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const DiscordIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

export const TwitterIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)


// Small inline icons for playground output
export const TipIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" stroke="#22d3ee" strokeWidth="2" fill="rgba(34, 211, 238, 0.2)"/>
    <path d="M12 8V12" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill="#22d3ee"/>
  </svg>
)

export const WrenchIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="#a78bfa" strokeWidth="2" fill="rgba(167, 139, 250, 0.2)"/>
  </svg>
)

export const PencilIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="#60a5fa" strokeWidth="2" fill="rgba(96, 165, 250, 0.2)"/>
  </svg>
)

export const ChatIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="#fbbf24" strokeWidth="2" fill="rgba(251, 191, 36, 0.2)"/>
  </svg>
)

export const RefreshIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M23 4v6h-6M1 20v-6h6" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const LoopIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M17 1l4 4-4 4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 13v2a4 4 0 01-4 4H3" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const FunctionIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#c084fc" strokeWidth="2" fill="rgba(192, 132, 252, 0.2)"/>
    <path d="M9 9h6M9 15h6M9 12h3" stroke="#c084fc" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const PhoneIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="#f472b6" strokeWidth="2" fill="rgba(244, 114, 182, 0.2)"/>
  </svg>
)

export const TextIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M4 7V4h16v3M9 20h6M12 4v16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const HashIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ClockIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2" fill="rgba(148, 163, 184, 0.2)"/>
    <path d="M12 6v6l4 2" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const CheckIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="2" fill="rgba(74, 222, 128, 0.2)"/>
    <path d="M8 12l3 3 5-6" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ErrorIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="rgba(239, 68, 68, 0.2)"/>
    <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const ArrowRightIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
