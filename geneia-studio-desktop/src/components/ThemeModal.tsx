import { useState, useEffect } from 'react'
import { X, Check, Sparkles, Puzzle } from 'lucide-react'
import { useStore, ThemeType } from '../store/useStore'
import { clsx } from 'clsx'
import { ExternalThemeService, ExternalTheme } from '../services/externalThemes'

interface ThemeModalProps {
  isOpen: boolean
  onClose: () => void
}

const themes: Array<{
  id: ThemeType
  name: string
  desc: string
  colors: string[]
}> = [
  { 
    id: 'dark', 
    name: 'Dark', 
    desc: 'Classic dark theme',
    colors: ['#0a0a0f', '#00d4ff', '#7c3aed'],
  },
  { 
    id: 'light', 
    name: 'Light', 
    desc: 'Clean and bright',
    colors: ['#f8fafc', '#0891b2', '#7c3aed'],
  },
  { 
    id: 'midnight', 
    name: 'Midnight Blue', 
    desc: 'Deep ocean vibes',
    colors: ['#0f172a', '#38bdf8', '#818cf8'],
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    desc: 'Nature inspired',
    colors: ['#052e16', '#4ade80', '#22d3ee'],
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    desc: 'Warm orange glow',
    colors: ['#1c1917', '#f97316', '#fbbf24'],
  },
  { 
    id: 'aurora', 
    name: 'Aurora', 
    desc: 'Northern lights',
    colors: ['#0c0a1d', '#a855f7', '#22d3ee'],
  },
  { 
    id: 'rose', 
    name: 'Rose', 
    desc: 'Soft pink tones',
    colors: ['#1a0a10', '#f472b6', '#fb7185'],
  },
  { 
    id: 'cyber', 
    name: 'Cyberpunk', 
    desc: 'Neon future',
    colors: ['#0a0a0a', '#00ff88', '#ff0080'],
  },
  { 
    id: 'ocean', 
    name: 'Ocean', 
    desc: 'Deep sea calm',
    colors: ['#0a1628', '#06b6d4', '#0ea5e9'],
  },
  { 
    id: 'lavender', 
    name: 'Lavender', 
    desc: 'Soft purple dream',
    colors: ['#1a1625', '#c084fc', '#e879f9'],
  },
  { 
    id: 'mocha', 
    name: 'Mocha', 
    desc: 'Coffee vibes',
    colors: ['#1e1b18', '#d97706', '#a3a3a3'],
  },
  { 
    id: 'nord', 
    name: 'Nord', 
    desc: 'Arctic frost',
    colors: ['#2e3440', '#88c0d0', '#81a1c1'],
  },
]

export function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
  const { theme, setTheme, installedExtensions } = useStore()
  const [activeTab, setActiveTab] = useState<'builtin' | 'extensions'>('builtin')
  const [externalThemes, setExternalThemes] = useState<ExternalTheme[]>([])
  const [activeExternalTheme, setActiveExternalTheme] = useState<string | null>(null)

  // Load external themes from installed extensions
  useEffect(() => {
    const themes = ExternalThemeService.getAvailableThemes(installedExtensions)
    setExternalThemes(themes)
  }, [installedExtensions])

  const handleBuiltinTheme = (themeId: ThemeType) => {
    // Reset external theme CSS variables first
    ExternalThemeService.resetTheme()
    setTheme(themeId)
    setActiveExternalTheme(null)
  }

  const handleExternalTheme = (extTheme: ExternalTheme) => {
    ExternalThemeService.applyTheme(extTheme)
    setActiveExternalTheme(extTheme.id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass rounded-2xl w-[600px] max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-lg font-semibold text-theme-primary">Choose Theme</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-theme-muted" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          <button
            onClick={() => setActiveTab('builtin')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm transition-colors',
              activeTab === 'builtin'
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                : 'text-theme-muted hover:bg-white/5'
            )}
          >
            Built-in Themes
          </button>
          <button
            onClick={() => setActiveTab('extensions')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
              activeTab === 'extensions'
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                : 'text-theme-muted hover:bg-white/5'
            )}
          >
            <Puzzle className="w-4 h-4" />
            Extension Themes
            {externalThemes.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-400">
                {externalThemes.length}
              </span>
            )}
          </button>
        </div>

        {/* Theme Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'builtin' ? (
            <div className="grid grid-cols-3 gap-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleBuiltinTheme(t.id)}
                  className={clsx(
                    'relative p-4 rounded-xl border-2 transition-all text-left group',
                    theme === t.id && !activeExternalTheme
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                      : 'border-theme hover:border-[var(--accent-primary)]/50 hover:bg-black/5 dark:hover:bg-white/5'
                  )}
                >
                  {/* Color Preview */}
                  <div className="flex gap-1 mb-3">
                    {t.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full shadow-inner border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Theme Info */}
                  <div className="mb-1">
                    <span className="font-medium text-theme-primary">{t.name}</span>
                  </div>
                  <p className="text-xs text-theme-muted">{t.desc}</p>

                  {/* Selected Check */}
                  {theme === t.id && !activeExternalTheme && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div>
              {externalThemes.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {externalThemes.map((extTheme) => (
                    <button
                      key={extTheme.id}
                      onClick={() => handleExternalTheme(extTheme)}
                      className={clsx(
                        'relative p-4 rounded-xl border-2 transition-all text-left group',
                        activeExternalTheme === extTheme.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                          : 'border-theme hover:border-[var(--accent-primary)]/50 hover:bg-black/5 dark:hover:bg-white/5'
                      )}
                    >
                      {/* Color Preview */}
                      <div className="flex gap-1 mb-3">
                        <div className="w-6 h-6 rounded-full shadow-inner border border-white/10" style={{ backgroundColor: extTheme.colors.bgPrimary }} />
                        <div className="w-6 h-6 rounded-full shadow-inner border border-white/10" style={{ backgroundColor: extTheme.colors.accentPrimary }} />
                        <div className="w-6 h-6 rounded-full shadow-inner border border-white/10" style={{ backgroundColor: extTheme.colors.accentSecondary }} />
                      </div>

                      {/* Theme Info */}
                      <div className="mb-1">
                        <span className="font-medium text-theme-primary">{extTheme.name}</span>
                        <span className={clsx(
                          'ml-2 px-1.5 py-0.5 rounded text-[10px]',
                          extTheme.type === 'dark' ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                        )}>
                          {extTheme.type}
                        </span>
                      </div>
                      <p className="text-xs text-theme-muted flex items-center gap-1">
                        <Puzzle className="w-3 h-3" />
                        {extTheme.extensionName}
                      </p>

                      {/* Selected Check */}
                      {activeExternalTheme === extTheme.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Puzzle className="w-12 h-12 mx-auto mb-4 text-theme-muted opacity-50" />
                  <p className="text-theme-muted mb-2">No extension themes available</p>
                  <p className="text-xs text-theme-muted">
                    Install theme extensions like Dracula, GitHub Theme, or One Dark Pro to see them here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme flex items-center justify-between">
          <span className="text-xs text-theme-muted">
            Current: <span className="text-[var(--accent-primary)]">
              {activeExternalTheme 
                ? externalThemes.find(t => t.id === activeExternalTheme)?.name 
                : themes.find(t => t.id === theme)?.name || 'Dark'}
            </span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 gradient-btn rounded-lg text-white text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
