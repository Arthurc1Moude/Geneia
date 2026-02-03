import { 
  FileCode, 
  Search, 
  GitBranch, 
  Puzzle, 
  Settings, 
  User, 
  Palette,
  Play,
  Keyboard
} from 'lucide-react'
import { clsx } from 'clsx'
import { LocalizationService } from '../services/localization'
import { useStore } from '../store/useStore'

interface ActivityBarProps {
  activePanel: string
  onPanelChange: (panel: string) => void
  onOpenSettings: () => void
  onOpenThemes: () => void
}

export function ActivityBar({ activePanel, onPanelChange, onOpenSettings, onOpenThemes }: ActivityBarProps) {
  // Subscribe to language changes to trigger re-render
  const { setShowKeyboardShortcuts } = useStore()
  const t = LocalizationService.t.bind(LocalizationService)

  const topItems = [
    { id: 'explorer', icon: FileCode, label: t('explorer') },
    { id: 'search', icon: Search, label: t('search') },
    { id: 'git', icon: GitBranch, label: t('git') },
    { id: 'run', icon: Play, label: t('run') },
    { id: 'extensions', icon: Puzzle, label: t('extensions') },
  ]

  const bottomItems = [
    { id: 'account', icon: User, label: t('account') },
    { id: 'shortcuts', icon: Keyboard, label: 'Keyboard Shortcuts' },
    { id: 'themes', icon: Palette, label: t('theme') },
    { id: 'settings', icon: Settings, label: t('settings') },
  ]

  const handleClick = (id: string) => {
    if (id === 'settings') {
      onOpenSettings()
    } else if (id === 'themes') {
      onOpenThemes()
    } else if (id === 'shortcuts') {
      setShowKeyboardShortcuts(true)
    } else {
      onPanelChange(activePanel === id ? '' : id)
    }
  }

  return (
    <div className="w-12 glass border-r border-theme flex flex-col items-center py-2 justify-between">
      {/* Top Icons */}
      <div className="flex flex-col items-center gap-1">
        {topItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={clsx(
              'w-10 h-10 flex items-center justify-center rounded-lg transition-all relative group',
              activePanel === item.id
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                : 'text-theme-muted hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5'
            )}
            title={item.label}
          >
            {activePanel === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--accent-primary)] rounded-r" />
            )}
            <item.icon className="w-5 h-5" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-theme-secondary text-theme-primary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg">
              {item.label}
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={clsx(
              'w-10 h-10 flex items-center justify-center rounded-lg transition-all relative group',
              activePanel === item.id
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                : 'text-theme-muted hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5'
            )}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-theme-secondary text-theme-primary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg">
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
