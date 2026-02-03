import { useState, useRef, useEffect } from 'react'
import {
  Settings,
  Moon,
  Sun,
  Maximize2,
  Minus,
  X,
  FolderOpen,
  Save,
  FilePlus,
  FileX,
  Copy,
  Clipboard,
  Scissors,
  Undo2,
  Redo2,
  Search,
  Replace,
  Terminal,
  Play,
  Bug,
  Square,
  Layout,
  PanelBottom,
  AlertCircle,
  HelpCircle,
  Info,
  Book,
  MessageSquare,
  Command,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LucideIcon,
  FolderPlus,
  Folder,
  ExternalLink,
  SplitSquareHorizontal,
  FileOutput,
  Files,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { notify } from '../store/notificationStore'
import { InputModal } from './InputModal'
import { LocalizationService } from '../services/localization'

const isElectron =
  typeof window !== 'undefined' && window.process?.type === 'renderer'
const ipcRenderer = isElectron ? window.require?.('electron')?.ipcRenderer : null

interface MenuItem {
  label: string
  shortcut?: string
  icon?: LucideIcon
  action?: () => void
  divider?: boolean
  disabled?: boolean
}

interface Menu {
  label: string
  items: MenuItem[]
}

export function TitleBar() {
  const {
    currentFile,
    files,
    theme,
    setTheme,
    createFile,
    saveCurrentFile,
    saveFileAs,
    deleteFile,
    duplicateFile,
    detachFile,
    splitEditor,
    setBottomPanelOpen,
    setBottomPanelTab,
    fontSize,
    setFontSize,
    setShowFindReplace,
    saveAllFiles,
    hasUnsavedChanges,
  } = useStore()
  const currentFileData = files.find((f) => f.name === currentFile)
  const isModified = currentFileData?.isModified

  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showNewFileModal, setShowNewFileModal] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [showSaveAsModal, setShowSaveAsModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Auto-save on window close/unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Auto-save all files before closing
      if (hasUnsavedChanges()) {
        saveAllFiles()
        notify.success('Auto-saved', 'All files saved before closing', 'system')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [saveAllFiles, hasUnsavedChanges])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      
      if (ctrl && e.key === 's') {
        e.preventDefault()
        handleSave()
      } else if (ctrl && e.key === 'n') {
        e.preventDefault()
        handleNewFile()
      } else if (ctrl && e.key === 'p') {
        e.preventDefault()
        notify.info('Command Palette', 'Press Ctrl+Shift+P for commands', 'system')
      } else if (ctrl && e.key === '`') {
        e.preventDefault()
        setBottomPanelTab('terminal')
        setBottomPanelOpen(true)
      } else if (ctrl && e.key === '+' || ctrl && e.key === '=') {
        e.preventDefault()
        handleZoomIn()
      } else if (ctrl && e.key === '-') {
        e.preventDefault()
        handleZoomOut()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNewFile = () => {
    setShowNewFileModal(true)
    setActiveMenu(null)
  }

  const handleCreateFile = (name: string) => {
    createFile(name)
    notify.success('File Created', `Created ${name}.gn`, 'system')
    setShowNewFileModal(false)
  }

  const handleOpenFolder = async () => {
    setActiveMenu(null)
    if (ipcRenderer) {
      // Electron: use native dialog
      ipcRenderer.send('open-folder-dialog')
    } else {
      // Web: use File System Access API if available
      try {
        if ('showDirectoryPicker' in window) {
          const dirHandle = await (window as Window & { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker()
          notify.success('Folder Opened', `Opened ${dirHandle.name}`, 'system')
        } else {
          notify.info('Open Folder', 'Use the Explorer panel to manage files', 'system')
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          notify.error('Error', 'Could not open folder', 'system')
        }
      }
    }
  }

  const handleNewFolder = () => {
    setShowNewFolderModal(true)
    setActiveMenu(null)
  }

  const handleCreateFolder = (name: string) => {
    notify.success('Folder Created', `Created folder: ${name}`, 'system')
    setShowNewFolderModal(false)
  }

  const handleSave = () => {
    saveCurrentFile()
    notify.success('File Saved', `Saved ${currentFile}`, 'system')
    setActiveMenu(null)
  }

  const handleSaveAs = () => {
    setShowSaveAsModal(true)
    setActiveMenu(null)
  }

  const handleSaveAsConfirm = (newName: string) => {
    saveFileAs(newName)
    notify.success('File Saved As', `Saved as ${newName}.gn`, 'system')
    setShowSaveAsModal(false)
  }

  const handleDuplicateFile = () => {
    duplicateFile(currentFile)
    notify.success('File Duplicated', `Duplicated ${currentFile}`, 'system')
    setActiveMenu(null)
  }

  const handlePopOutWindow = () => {
    detachFile(currentFile)
    notify.info('Pop Out', `${currentFile} opened in new window`, 'system')
    setActiveMenu(null)
  }

  const handleSplitRight = () => {
    splitEditor('vertical')
    setActiveMenu(null)
  }

  const handleSplitDown = () => {
    splitEditor('horizontal')
    setActiveMenu(null)
  }

  const handleCloseFile = () => {
    if (files.length > 1) {
      deleteFile(currentFile)
      notify.info('File Closed', `Closed ${currentFile}`, 'system')
    }
    setActiveMenu(null)
  }

  const handleUndo = () => {
    document.execCommand('undo')
    setActiveMenu(null)
  }

  const handleRedo = () => {
    document.execCommand('redo')
    setActiveMenu(null)
  }

  const handleCut = () => {
    document.execCommand('cut')
    setActiveMenu(null)
  }

  const handleCopy = () => {
    document.execCommand('copy')
    setActiveMenu(null)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      document.execCommand('insertText', false, text)
    } catch {
      document.execCommand('paste')
    }
    setActiveMenu(null)
  }

  const handleZoomIn = () => {
    setFontSize(Math.min(fontSize + 2, 32))
    setActiveMenu(null)
  }

  const handleZoomOut = () => {
    setFontSize(Math.max(fontSize - 2, 10))
    setActiveMenu(null)
  }

  const handleResetZoom = () => {
    setFontSize(14)
    setActiveMenu(null)
  }

  const handleRun = () => {
    const runBtn = document.querySelector('[data-run-button]') as HTMLButtonElement
    if (runBtn) runBtn.click()
    setActiveMenu(null)
  }

  const toggleTheme = () => {
    const themes: Array<typeof theme> = ['dark', 'light', 'midnight', 'forest', 'sunset', 'aurora', 'rose', 'cyber', 'ocean', 'lavender', 'mocha', 'nord']
    const currentIndex = themes.indexOf(theme)
    setTheme(themes[(currentIndex + 1) % themes.length])
  }

  const handleMinimize = () => ipcRenderer?.send('window-minimize')
  const handleMaximize = () => ipcRenderer?.send('window-maximize')
  const handleClose = () => {
    // Auto-save all files before closing
    if (hasUnsavedChanges()) {
      saveAllFiles()
    }
    if (ipcRenderer) {
      ipcRenderer.send('window-close')
    } else {
      window.close()
    }
  }

  const t = LocalizationService.t

  const menus: Menu[] = [
    {
      label: t('menu.file'),
      items: [
        { label: t('file.newFile'), shortcut: 'Ctrl+N', icon: FilePlus, action: handleNewFile },
        { label: t('file.newFolder'), icon: FolderPlus, action: handleNewFolder },
        { label: 'divider', divider: true },
        { label: t('file.openFile') + '...', shortcut: 'Ctrl+O', icon: FolderOpen, action: handleOpenFolder },
        { label: t('file.openFolder') + '...', icon: Folder, action: handleOpenFolder },
        { label: 'divider', divider: true },
        { label: t('file.save'), shortcut: 'Ctrl+S', icon: Save, action: handleSave },
        { label: t('file.saveAs') + '...', shortcut: 'Ctrl+Shift+S', icon: FileOutput, action: handleSaveAs },
        { label: t('file.saveAll'), icon: Files, action: () => { saveAllFiles(); notify.success(t('file.saveAll'), 'All files saved', 'system'); setActiveMenu(null) } },
        { label: 'divider', divider: true },
        { label: t('file.duplicate'), icon: Copy, action: handleDuplicateFile },
        { label: 'divider', divider: true },
        { label: t('file.popOut'), icon: ExternalLink, action: handlePopOutWindow, disabled: !currentFile },
        { label: t('file.splitRight'), icon: SplitSquareHorizontal, action: handleSplitRight },
        { label: t('file.splitDown'), icon: Layout, action: handleSplitDown },
        { label: 'divider', divider: true },
        { label: t('file.close'), shortcut: 'Ctrl+W', icon: FileX, action: handleCloseFile, disabled: files.length <= 1 },
        { label: 'divider', divider: true },
        { label: t('file.exit'), shortcut: 'Alt+F4', icon: X, action: handleClose }
      ]
    },
    {
      label: t('menu.edit'),
      items: [
        { label: t('edit.undo'), shortcut: 'Ctrl+Z', icon: Undo2, action: handleUndo },
        { label: t('edit.redo'), shortcut: 'Ctrl+Y', icon: Redo2, action: handleRedo },
        { label: 'divider', divider: true },
        { label: t('edit.cut'), shortcut: 'Ctrl+X', icon: Scissors, action: handleCut },
        { label: t('edit.copy'), shortcut: 'Ctrl+C', icon: Copy, action: handleCopy },
        { label: t('edit.paste'), shortcut: 'Ctrl+V', icon: Clipboard, action: handlePaste },
        { label: 'divider', divider: true },
        { label: t('edit.find'), shortcut: 'Ctrl+F', icon: Search, action: () => { setShowFindReplace(true); setActiveMenu(null) } },
        { label: t('edit.replace'), shortcut: 'Ctrl+H', icon: Replace, action: () => { setShowFindReplace(true); setActiveMenu(null) } },
        { label: 'divider', divider: true },
        { label: t('edit.selectAll'), shortcut: 'Ctrl+A', icon: Copy, action: () => { document.execCommand('selectAll'); setActiveMenu(null) } }
      ]
    },
    {
      label: t('menu.view'),
      items: [
        { label: t('view.commandPalette'), shortcut: 'Ctrl+Shift+P', icon: Command, action: () => { notify.info(t('view.commandPalette'), 'Feature coming soon', 'system'); setActiveMenu(null) } },
        { label: 'divider', divider: true },
        { label: t('view.problems'), shortcut: 'Ctrl+Shift+M', icon: AlertCircle, action: () => { setBottomPanelTab('problems'); setBottomPanelOpen(true); setActiveMenu(null) } },
        { label: t('view.output'), shortcut: 'Ctrl+Shift+U', icon: PanelBottom, action: () => { setBottomPanelTab('output'); setBottomPanelOpen(true); setActiveMenu(null) } },
        { label: t('view.debug'), shortcut: 'Ctrl+Shift+Y', icon: Bug, action: () => { setBottomPanelTab('debug'); setBottomPanelOpen(true); setActiveMenu(null) } },
        { label: t('view.terminal'), shortcut: 'Ctrl+`', icon: Terminal, action: () => { setBottomPanelTab('terminal'); setBottomPanelOpen(true); setActiveMenu(null) } },
        { label: 'divider', divider: true },
        { label: t('view.zoomIn'), shortcut: 'Ctrl++', icon: ZoomIn, action: handleZoomIn },
        { label: t('view.zoomOut'), shortcut: 'Ctrl+-', icon: ZoomOut, action: handleZoomOut },
        { label: t('view.resetZoom'), shortcut: 'Ctrl+0', icon: RotateCcw, action: handleResetZoom }
      ]
    },
    {
      label: t('menu.run'),
      items: [
        { label: t('run.runCode'), shortcut: 'F5', icon: Play, action: handleRun },
        { label: t('run.runWithoutDebugging'), shortcut: 'Ctrl+F5', icon: Play, action: handleRun },
        { label: 'divider', divider: true },
        { label: t('run.startDebugging'), shortcut: 'F5', icon: Bug, action: () => { notify.info('Debug', 'Debugging feature coming soon', 'system'); setActiveMenu(null) } },
        { label: t('run.stopCode'), shortcut: 'Shift+F5', icon: Square, action: () => { notify.info('Stop', 'No process running', 'system'); setActiveMenu(null) } }
      ]
    },
    {
      label: t('menu.terminal'),
      items: [
        { label: t('terminal.newTerminal'), shortcut: 'Ctrl+Shift+`', icon: Terminal, action: () => { setBottomPanelTab('terminal'); setBottomPanelOpen(true); setActiveMenu(null) } },
        { label: t('terminal.splitTerminal'), icon: Layout, action: () => { notify.info('Split', 'Feature coming soon', 'system'); setActiveMenu(null) } },
        { label: 'divider', divider: true },
        { label: t('terminal.runTask') + '...', icon: Play, action: () => { notify.info('Tasks', 'Feature coming soon', 'system'); setActiveMenu(null) } }
      ]
    },
    {
      label: t('menu.help'),
      items: [
        { label: t('help.welcome'), icon: Info, action: () => { notify.info(t('help.welcome'), 'Welcome to Geneia Studio!', 'system'); setActiveMenu(null) } },
        { label: t('help.documentation'), icon: Book, action: () => { window.open('https://github.com/geneia/docs', '_blank'); setActiveMenu(null) } },
        { label: 'divider', divider: true },
        { label: t('help.reportIssue'), icon: MessageSquare, action: () => { window.open('https://github.com/geneia/issues', '_blank'); setActiveMenu(null) } },
        { label: 'divider', divider: true },
        { label: t('help.about') + ' Geneia Studio', icon: HelpCircle, action: () => { notify.info(t('help.about'), 'Geneia Studio v1.0.0 - A modern IDE for Geneia language', 'system'); setActiveMenu(null) } }
      ]
    }
  ]

  return (
    <div 
      className="glass flex items-center justify-between px-2 py-1.5 border-b border-theme select-none title-bar-drag relative z-[100]"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left - Logo + Menu Bar */}
      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} ref={menuRef}>
        {/* Beautiful Animated Logo */}
        <div className="relative w-7 h-7 mr-1 group cursor-pointer" title="Geneia Studio">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-75 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-300" />
          {/* Main icon container */}
          <div className="relative w-full h-full rounded-lg bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            {/* Inner highlight */}
            <div className="absolute inset-0.5 rounded-md bg-gradient-to-br from-white/20 to-transparent" />
            {/* G letter with style */}
            <span className="relative text-white font-black text-sm drop-shadow-lg" style={{ fontFamily: 'system-ui' }}>G</span>
            {/* Sparkle effect */}
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" />
          </div>
        </div>

        {/* Menu Bar */}
        {menus.map(menu => (
          <div key={menu.label} className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                activeMenu === menu.label 
                  ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' 
                  : 'text-theme-secondary hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {menu.label}
            </button>

            {/* Dropdown */}
            {activeMenu === menu.label && (
              <div className="absolute top-full left-0 mt-1 min-w-[220px] rounded-lg bg-[var(--bg-primary)] border border-theme shadow-2xl overflow-hidden z-[9999]">
                {menu.items.map((item, idx) => 
                  item.divider ? (
                    <div key={idx} className="h-px bg-[var(--border-color)] my-1" />
                  ) : (
                    <button
                      key={item.label}
                      onClick={item.action}
                      disabled={item.disabled}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors ${
                        item.disabled 
                          ? 'text-theme-muted cursor-not-allowed' 
                          : 'text-theme-secondary hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]'
                      }`}
                    >
                      {item.icon && <item.icon className="w-3.5 h-3.5" />}
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] text-theme-muted">{item.shortcut}</span>
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Center - File name (draggable) */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        <span className="text-xs text-theme-secondary">{currentFile}</span>
        {isModified && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
        )}
      </div>

      {/* Right - Controls (not draggable) */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title={`Theme: ${theme}`}
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-theme-secondary" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-theme-secondary" />
          )}
        </button>
        <button
          className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5 text-theme-secondary" />
        </button>
        
        {/* Window controls */}
        <div className="flex items-center ml-3 gap-0.5">
          <button 
            onClick={handleMinimize}
            className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Minimize"
          >
            <Minus className="w-3 h-3 text-theme-muted" />
          </button>
          <button 
            onClick={handleMaximize}
            className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Maximize"
          >
            <Maximize2 className="w-3 h-3 text-theme-muted" />
          </button>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded hover:bg-red-500/20 transition-colors group"
            title="Close"
          >
            <X className="w-3 h-3 text-theme-muted group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <InputModal
        isOpen={showNewFileModal}
        title={t('file.newFile')}
        placeholder="Enter file name (e.g., myfile.gn)"
        onConfirm={handleCreateFile}
        onCancel={() => setShowNewFileModal(false)}
      />
      <InputModal
        isOpen={showNewFolderModal}
        title={t('file.newFolder')}
        placeholder="Enter folder name"
        onConfirm={handleCreateFolder}
        onCancel={() => setShowNewFolderModal(false)}
      />
      <InputModal
        isOpen={showSaveAsModal}
        title={t('file.saveAs')}
        placeholder="Enter new file name (e.g., newfile.gn)"
        defaultValue={currentFile.replace('.gn', '_copy')}
        onConfirm={handleSaveAsConfirm}
        onCancel={() => setShowSaveAsModal(false)}
      />
    </div>
  )
}
