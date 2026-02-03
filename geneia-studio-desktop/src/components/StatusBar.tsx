import { useState, useRef, useEffect } from 'react'
import { 
  PanelLeft, Bell, CheckCircle, AlertCircle, AlertTriangle, Info, X, Trash2, Code,
  Radio, GitBranch, ExternalLink, Puzzle
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { useNotificationStore, type NotificationType } from '../store/notificationStore'
import { checkGeneiaGrammar, getErrorCounts } from '../services/geneiaGrammar'
import { ExtensionRuntime } from '../services/extensionRuntime'
import { LanguageSelectorModal, detectLanguageFromFile } from './LanguageSelectorModal'
import { RemoteModal } from './RemoteModal'
import { LocalizationService } from '../services/localization'

interface StatusBarProps {
  onToggleSidebar: () => void
}

const icons: Record<NotificationType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  syntax: Code
}

const colors: Record<NotificationType, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
  syntax: 'text-orange-400'
}

export function StatusBar({ onToggleSidebar }: StatusBarProps) {
  const { code, cursorLine, cursorCol, selectionLength, selectedLines, currentFile, user, openProblemsPanel } = useStore()
  const { notifications, markAllAsRead, removeNotification, clearAll } = useNotificationStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showRemoteModal, setShowRemoteModal] = useState(false)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [isConnected] = useState(false)
  const [connectionType] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const t = LocalizationService.t

  // Check grammar for status display
  const [errorCounts, setErrorCounts] = useState({ errors: 0, warnings: 0, info: 0 })
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = checkGeneiaGrammar(code, currentFile)
      setErrorCounts(getErrorCounts(result.errors))
    }, 500)
    return () => clearTimeout(timer)
  }, [code, currentFile])

  // Get current language and active extensions (check override first, then detect from file)
  const fileLanguageOverride = currentFile ? useStore.getState().getFileLanguage(currentFile) : undefined
  const currentLanguage = fileLanguageOverride || (currentFile ? detectLanguageFromFile(currentFile) : 'geneia')
  const activeExtCount = ExtensionRuntime.getActiveCount()

  const unreadCount = notifications.filter(n => !n.read).length

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="glass px-2 py-1 border-t border-theme flex items-center justify-between text-xs text-theme-muted relative">
      {/* Left Section */}
      <div className="flex items-center gap-1">
        {/* Remote Window Button - Opens Modal */}
        <button
          onClick={() => setShowRemoteModal(true)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-l-lg transition-colors ${
            isConnected 
              ? 'bg-[var(--accent-primary)] text-white' 
              : 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/30'
          }`}
          title="Open Remote Window"
        >
          <Radio className="w-3.5 h-3.5" />
          {isConnected && connectionType && (
            <span className="text-[10px] font-medium">{connectionType}</span>
          )}
        </button>

        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-3.5 h-3.5" />
        </button>

        {/* Git Branch */}
        {user && (
          <button className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10">
            <GitBranch className="w-3.5 h-3.5" />
            <span>main</span>
          </button>
        )}
        
        {/* Error/Warning counts - Click to open Problems panel */}
        <button 
          onClick={openProblemsPanel}
          className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title={t('problems')}
        >
          <span className={`flex items-center gap-1 ${errorCounts.errors > 0 ? 'text-red-400' : ''}`}>
            <AlertCircle className="w-3.5 h-3.5" />
            {errorCounts.errors}
          </span>
          <span className={`flex items-center gap-1 ${errorCounts.warnings > 0 ? 'text-yellow-400' : ''}`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {errorCounts.warnings}
          </span>
        </button>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Cursor Position & Selection */}
        <button className="px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10">
          {t('line')} {cursorLine}, {t('column')} {cursorCol}
          {selectionLength > 0 && (
            <span className="ml-2 text-[var(--accent-primary)]">
              ({selectionLength} selected{selectedLines > 1 ? `, ${selectedLines} lines` : ''})
            </span>
          )}
        </button>
        
        {/* Spaces/Tabs */}
        <button className="px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10">
          Spaces: 4
        </button>
        
        {/* Encoding */}
        <button className="px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10">
          UTF-8
        </button>
        
        {/* Line Ending */}
        <button className="px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10">
          LF
        </button>
        
        {/* Language - Click to open selector */}
        <button 
          onClick={() => setShowLanguageSelector(true)}
          className="px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 capitalize"
          title="Select Language Mode"
        >
          {currentLanguage}
        </button>

        {/* Active Extensions */}
        {activeExtCount > 0 && (
          <button className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Active Extensions">
            <Puzzle className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeExtCount}</span>
          </button>
        )}
        
        {/* Feedback */}
        <button className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Send Feedback">
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              if (!showNotifications) markAllAsRead()
            }}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <div className="absolute bottom-full right-0 mb-2 w-80 max-h-96 rounded-xl bg-[var(--bg-primary)] border border-theme shadow-2xl overflow-hidden z-[9500]">
              <div className="p-3 border-b border-theme flex items-center justify-between bg-[var(--bg-secondary)]">
                <span className="text-sm font-medium text-theme-primary">Notifications</span>
                <div className="flex items-center gap-1">
                  {notifications.length > 0 && (
                    <button onClick={clearAll} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Clear all">
                      <Trash2 className="w-3.5 h-3.5 text-theme-muted" />
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10">
                    <X className="w-3.5 h-3.5 text-theme-muted" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => {
                    const Icon = icons[notif.type]
                    return (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-theme hover:bg-black/5 dark:hover:bg-white/5 transition-colors group ${
                          !notif.read ? 'bg-[var(--accent-primary)]/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors[notif.type]}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-theme-primary font-medium">{notif.title}</p>
                            {notif.message && <p className="text-xs text-theme-muted mt-0.5">{notif.message}</p>}
                            <p className="text-[10px] text-theme-muted mt-1">{formatTime(notif.timestamp)}</p>
                          </div>
                          <button
                            onClick={() => removeNotification(notif.id)}
                            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3 text-theme-muted" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-theme-muted opacity-50" />
                    <p className="text-sm text-theme-muted">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language Selector Modal */}
      <LanguageSelectorModal 
        isOpen={showLanguageSelector} 
        onClose={() => setShowLanguageSelector(false)} 
      />

      {/* Remote Window Modal */}
      <RemoteModal
        isOpen={showRemoteModal}
        onClose={() => setShowRemoteModal(false)}
      />
    </div>
  )
}
