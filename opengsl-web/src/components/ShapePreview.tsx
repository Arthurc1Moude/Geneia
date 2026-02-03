interface ShapePreviewProps {
  type: string;
  color?: string;
  size?: number;
}

export default function ShapePreview({ type, color = '#FF6B6B', size = 120 }: ShapePreviewProps) {
  const renderShape = () => {
    switch (type) {
      case 'apple':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <radialGradient id="appleGrad" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FF8888" />
                <stop offset="100%" stopColor="#CC0000" />
              </radialGradient>
            </defs>
            {/* Apple body */}
            <ellipse cx="50" cy="58" rx="35" ry="38" fill="url(#appleGrad)" />
            {/* Indent */}
            <ellipse cx="50" cy="25" rx="12" ry="6" fill="#AA0000" opacity="0.5" />
            {/* Stem */}
            <rect x="47" y="10" width="6" height="18" rx="2" fill="#8B4513" />
            {/* Leaf */}
            <ellipse cx="62" cy="15" rx="12" ry="6" fill="#228B22" transform="rotate(30 62 15)" />
            {/* Highlight */}
            <ellipse cx="35" cy="45" rx="8" ry="12" fill="white" opacity="0.3" />
          </svg>
        );
      
      case 'pizza':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <radialGradient id="cheeseGrad" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="100%" stopColor="#FFB347" />
              </radialGradient>
            </defs>
            {/* Crust */}
            <circle cx="50" cy="50" r="45" fill="#D4A574" />
            {/* Sauce */}
            <circle cx="50" cy="50" r="40" fill="#CC2200" />
            {/* Cheese */}
            <circle cx="50" cy="50" r="37" fill="url(#cheeseGrad)" />
            {/* Pepperoni */}
            <circle cx="35" cy="35" r="8" fill="#8B0000" />
            <circle cx="65" cy="40" r="8" fill="#8B0000" />
            <circle cx="45" cy="60" r="8" fill="#8B0000" />
            <circle cx="60" cy="65" r="7" fill="#8B0000" />
            {/* Green peppers */}
            <circle cx="50" cy="45" r="4" fill="#228B22" />
            <circle cx="70" cy="55" r="4" fill="#228B22" />
            {/* Olives */}
            <circle cx="30" cy="55" r="3" fill="#1a1a1a" />
            <circle cx="55" cy="70" r="3" fill="#1a1a1a" />
          </svg>
        );
      
      case 'strawberry':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <radialGradient id="berryGrad" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FF6666" />
                <stop offset="100%" stopColor="#DC143C" />
              </radialGradient>
            </defs>
            {/* Berry body */}
            <ellipse cx="50" cy="60" rx="30" ry="35" fill="url(#berryGrad)" />
            {/* Top */}
            <ellipse cx="50" cy="32" rx="18" ry="12" fill="url(#berryGrad)" />
            {/* Leaves */}
            <ellipse cx="35" cy="22" rx="10" ry="5" fill="#228B22" transform="rotate(-20 35 22)" />
            <ellipse cx="50" cy="18" rx="10" ry="5" fill="#228B22" />
            <ellipse cx="65" cy="22" rx="10" ry="5" fill="#228B22" transform="rotate(20 65 22)" />
            {/* Seeds */}
            <ellipse cx="40" cy="50" rx="2" ry="3" fill="#FFD700" />
            <ellipse cx="60" cy="50" rx="2" ry="3" fill="#FFD700" />
            <ellipse cx="45" cy="65" rx="2" ry="3" fill="#FFD700" />
            <ellipse cx="55" cy="65" rx="2" ry="3" fill="#FFD700" />
            <ellipse cx="50" cy="78" rx="2" ry="3" fill="#FFD700" />
          </svg>
        );
      
      case 'house':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#DEB887" />
              </linearGradient>
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A0522D" />
                <stop offset="100%" stopColor="#8B4513" />
              </linearGradient>
            </defs>
            {/* Wall */}
            <rect x="20" y="45" width="60" height="50" fill="url(#wallGrad)" />
            {/* Roof */}
            <polygon points="50,10 10,45 90,45" fill="url(#roofGrad)" />
            {/* Door */}
            <rect x="42" y="65" width="16" height="30" rx="2" fill="#654321" />
            <circle cx="54" cy="82" r="2" fill="#FFD700" />
            {/* Windows */}
            <rect x="25" y="55" width="12" height="12" fill="#87CEEB" stroke="#654321" strokeWidth="2" />
            <rect x="63" y="55" width="12" height="12" fill="#87CEEB" stroke="#654321" strokeWidth="2" />
            {/* Chimney */}
            <rect x="65" y="15" width="10" height="20" fill="#8B4513" />
          </svg>
        );
      
      case 'tree':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <radialGradient id="leafGrad" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#32CD32" />
                <stop offset="100%" stopColor="#228B22" />
              </radialGradient>
            </defs>
            {/* Trunk */}
            <rect x="42" y="60" width="16" height="38" fill="#8B4513" />
            {/* Leaves */}
            <circle cx="50" cy="35" r="30" fill="url(#leafGrad)" />
            <circle cx="30" cy="45" r="20" fill="#2E8B2E" />
            <circle cx="70" cy="45" r="20" fill="#2E8B2E" />
            <circle cx="50" cy="20" r="18" fill="#32CD32" />
          </svg>
        );
      
      case 'car':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="carGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF6666" />
                <stop offset="100%" stopColor="#CC0000" />
              </linearGradient>
            </defs>
            {/* Body */}
            <rect x="10" y="45" width="80" height="25" rx="5" fill="url(#carGrad)" />
            {/* Top */}
            <rect x="25" y="30" width="45" height="20" rx="5" fill="url(#carGrad)" />
            {/* Windows */}
            <rect x="30" y="33" width="15" height="14" rx="2" fill="#87CEEB" />
            <rect x="50" y="33" width="15" height="14" rx="2" fill="#87CEEB" />
            {/* Wheels */}
            <circle cx="28" cy="70" r="12" fill="#333" />
            <circle cx="28" cy="70" r="6" fill="#666" />
            <circle cx="72" cy="70" r="12" fill="#333" />
            <circle cx="72" cy="70" r="6" fill="#666" />
            {/* Headlights */}
            <rect x="85" y="50" width="5" height="8" rx="1" fill="#FFD700" />
            <rect x="10" y="50" width="5" height="8" rx="1" fill="#FF4444" />
          </svg>
        );
      
      case 'snowman':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <radialGradient id="snowGrad" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E0E0E0" />
              </radialGradient>
            </defs>
            {/* Bottom */}
            <circle cx="50" cy="78" r="20" fill="url(#snowGrad)" />
            {/* Middle */}
            <circle cx="50" cy="52" r="15" fill="url(#snowGrad)" />
            {/* Head */}
            <circle cx="50" cy="30" r="12" fill="url(#snowGrad)" />
            {/* Hat */}
            <rect x="40" y="10" width="20" height="15" fill="#333" />
            <rect x="35" y="22" width="30" height="5" fill="#333" />
            {/* Eyes */}
            <circle cx="45" cy="27" r="2" fill="#000" />
            <circle cx="55" cy="27" r="2" fill="#000" />
            {/* Nose */}
            <polygon points="50,32 50,36 58,34" fill="#FF6600" />
            {/* Buttons */}
            <circle cx="50" cy="48" r="2" fill="#333" />
            <circle cx="50" cy="56" r="2" fill="#333" />
            {/* Arms */}
            <line x1="35" y1="52" x2="15" y2="45" stroke="#8B4513" strokeWidth="3" />
            <line x1="65" y1="52" x2="85" y2="45" stroke="#8B4513" strokeWidth="3" />
          </svg>
        );
      
      case 'rocket':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E0E0E0" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#C0C0C0" />
              </linearGradient>
            </defs>
            {/* Body */}
            <rect x="40" y="25" width="20" height="50" rx="3" fill="url(#rocketGrad)" />
            {/* Nose */}
            <ellipse cx="50" cy="20" rx="10" ry="15" fill="#FF4444" />
            {/* Fins */}
            <polygon points="40,70 25,85 40,75" fill="#FF4444" />
            <polygon points="60,70 75,85 60,75" fill="#FF4444" />
            {/* Window */}
            <circle cx="50" cy="40" r="6" fill="#87CEEB" stroke="#333" strokeWidth="2" />
            {/* Flame */}
            <ellipse cx="50" cy="85" rx="8" ry="12" fill="#FF6600" />
            <ellipse cx="50" cy="88" rx="5" ry="8" fill="#FFD700" />
          </svg>
        );
      
      default:
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <radialGradient id="defaultGrad" cx="30%" cy="30%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#defaultGrad)" />
          </svg>
        );
    }
  };

  return <div className="shape-preview-svg">{renderShape()}</div>;
}
