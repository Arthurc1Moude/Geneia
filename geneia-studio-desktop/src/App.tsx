import { useState, useEffect } from 'react'
import { TitleBar } from './components/TitleBar'
import { ActivityBar } from './components/ActivityBar'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { OutputPanel } from './components/OutputPanel'
import { StatusBar } from './components/StatusBar'
import { ThemeModal } from './components/ThemeModal'
import { SettingsModal } from './components/SettingsModal'
import { SearchPanel, GitPanel, RunPanel, ExtensionsPanel, AccountPanel } from './components/panels'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastContainer } from './components/Toast'
import { DetachedWindow } from './components/DetachedWindow'
import { KeyboardShortcutsModal } from './components/KeyboardShortcuts'
import { useGlobalErrorHandler } from './hooks/useGlobalErrorHandler'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useStore } from './store/useStore'
import { useExtensions } from './hooks/useExtensions'
import { LocalizationService } from './services/localization'

export default function App() {
  const [activePanel, setActivePanel] = useState('explorer')
  const [themeModalOpen, setThemeModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const { theme, language, detachedWindows, showKeyboardShortcuts, setShowKeyboardShortcuts, setActivePanel: setStorePanelActive } = useStore()

  // Global error handler
  useGlobalErrorHandler()

  // Keyboard shortcuts
  useKeyboardShortcuts()

  // Extension management - activates/deactivates extensions
  useExtensions()

  // Sync activePanel with store
  useEffect(() => {
    setStorePanelActive(activePanel)
  }, [activePanel, setStorePanelActive])

  // Apply theme to document body for global CSS variables
  useEffect(() => {
    document.body.className = theme
    document.documentElement.className = theme
  }, [theme])

  // Initialize language on startup
  useEffect(() => {
    if (language) {
      LocalizationService.setLanguage(language)
    }
  }, [language])

  // Render the appropriate panel based on activePanel
  const renderPanel = () => {
    switch (activePanel) {
      case 'explorer':
        return <Sidebar onClose={() => setActivePanel('')} />
      case 'search':
        return <SearchPanel />
      case 'git':
        return <GitPanel />
      case 'run':
        return <RunPanel />
      case 'extensions':
        return <ExtensionsPanel />
      case 'account':
        return <AccountPanel />
      default:
        return null
    }
  }

  return (
    <ErrorBoundary>
      <div className={`h-screen flex flex-col ${theme}`}>
        <TitleBar />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Activity Bar */}
          <ActivityBar 
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenThemes={() => setThemeModalOpen(true)}
          />

          {/* Side Panel */}
          <ErrorBoundary fallback={<div className="w-64 glass border-r border-theme p-4 text-center text-red-400 text-sm">Panel error</div>}>
            {renderPanel()}
          </ErrorBoundary>
          
          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
            <ErrorBoundary>
              <Editor />
            </ErrorBoundary>
            <ErrorBoundary>
              <OutputPanel />
            </ErrorBoundary>
          </div>
        </div>
        
        <StatusBar onToggleSidebar={() => setActivePanel(activePanel ? '' : 'explorer')} />

        {/* Modals */}
        <ThemeModal 
          isOpen={themeModalOpen} 
          onClose={() => setThemeModalOpen(false)} 
        />
        <SettingsModal 
          isOpen={settingsModalOpen} 
          onClose={() => setSettingsModalOpen(false)} 
        />
        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />
        
        {/* Toast Notifications */}
        <ToastContainer />

        {/* Detached Windows */}
        {detachedWindows.map(window => (
          <DetachedWindow key={window.id} window={window} />
        ))}
      </div>
    </ErrorBoundary>
  )
}
