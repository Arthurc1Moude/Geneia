/**
 * Keyboard Shortcuts Service
 * Real keyboard shortcut handling for the IDE
 */

export interface KeyboardShortcut {
  id: string
  keys: string[]  // e.g., ['Ctrl', 'S'] or ['Ctrl', 'Shift', 'P']
  description: string
  category: 'file' | 'edit' | 'view' | 'run' | 'navigation' | 'terminal' | 'debug' | 'general'
  action: () => void
  enabled?: boolean
  when?: string  // Context condition
}

export interface ShortcutConfig {
  id: string
  keys: string[]
  enabled: boolean
}

// Format keys for display
export function formatShortcut(keys: string[]): string {
  return keys.map(key => {
    switch (key.toLowerCase()) {
      case 'ctrl': return '⌃'
      case 'cmd': 
      case 'meta': return '⌘'
      case 'alt': return '⌥'
      case 'shift': return '⇧'
      case 'enter': return '↵'
      case 'escape': 
      case 'esc': return 'Esc'
      case 'backspace': return '⌫'
      case 'delete': return '⌦'
      case 'tab': return '⇥'
      case 'arrowup': return '↑'
      case 'arrowdown': return '↓'
      case 'arrowleft': return '←'
      case 'arrowright': return '→'
      default: return key.toUpperCase()
    }
  }).join(' + ')
}

// Format for display (cross-platform)
export function formatShortcutCrossPlatform(keys: string[]): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  return keys.map(key => {
    const k = key.toLowerCase()
    if (k === 'ctrl' || k === 'cmd' || k === 'meta') {
      return isMac ? '⌘' : 'Ctrl'
    }
    if (k === 'alt') return isMac ? '⌥' : 'Alt'
    if (k === 'shift') return isMac ? '⇧' : 'Shift'
    return key.toUpperCase()
  }).join(isMac ? '' : '+')
}


// Check if a keyboard event matches a shortcut
export function matchesShortcut(event: KeyboardEvent, keys: string[]): boolean {
  const pressedKeys = new Set<string>()
  
  if (event.ctrlKey || event.metaKey) pressedKeys.add('ctrl')
  if (event.altKey) pressedKeys.add('alt')
  if (event.shiftKey) pressedKeys.add('shift')
  
  // Add the main key
  const mainKey = event.key.toLowerCase()
  if (mainKey !== 'control' && mainKey !== 'alt' && mainKey !== 'shift' && mainKey !== 'meta') {
    pressedKeys.add(mainKey)
  }
  
  // Normalize shortcut keys
  const shortcutKeys = new Set(keys.map(k => {
    const lower = k.toLowerCase()
    if (lower === 'cmd' || lower === 'meta') return 'ctrl'
    return lower
  }))
  
  // Check if sets match
  if (pressedKeys.size !== shortcutKeys.size) return false
  for (const key of pressedKeys) {
    if (!shortcutKeys.has(key)) return false
  }
  return true
}

// Default shortcuts configuration
export const DEFAULT_SHORTCUTS: Omit<KeyboardShortcut, 'action'>[] = [
  // File operations
  { id: 'file.new', keys: ['Ctrl', 'N'], description: 'New File', category: 'file' },
  { id: 'file.open', keys: ['Ctrl', 'O'], description: 'Open File', category: 'file' },
  { id: 'file.save', keys: ['Ctrl', 'S'], description: 'Save File', category: 'file' },
  { id: 'file.saveAs', keys: ['Ctrl', 'Shift', 'S'], description: 'Save As', category: 'file' },
  { id: 'file.saveAll', keys: ['Ctrl', 'Alt', 'S'], description: 'Save All', category: 'file' },
  { id: 'file.close', keys: ['Ctrl', 'W'], description: 'Close File', category: 'file' },
  { id: 'file.closeAll', keys: ['Ctrl', 'Shift', 'W'], description: 'Close All Files', category: 'file' },
  
  // Edit operations
  { id: 'edit.undo', keys: ['Ctrl', 'Z'], description: 'Undo', category: 'edit' },
  { id: 'edit.redo', keys: ['Ctrl', 'Y'], description: 'Redo', category: 'edit' },
  { id: 'edit.redoAlt', keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo (Alt)', category: 'edit' },
  { id: 'edit.cut', keys: ['Ctrl', 'X'], description: 'Cut', category: 'edit' },
  { id: 'edit.copy', keys: ['Ctrl', 'C'], description: 'Copy', category: 'edit' },
  { id: 'edit.paste', keys: ['Ctrl', 'V'], description: 'Paste', category: 'edit' },
  { id: 'edit.selectAll', keys: ['Ctrl', 'A'], description: 'Select All', category: 'edit' },
  { id: 'edit.find', keys: ['Ctrl', 'F'], description: 'Find', category: 'edit' },
  { id: 'edit.replace', keys: ['Ctrl', 'H'], description: 'Find and Replace', category: 'edit' },
  { id: 'edit.findInFiles', keys: ['Ctrl', 'Shift', 'F'], description: 'Find in Files', category: 'edit' },
  { id: 'edit.duplicate', keys: ['Ctrl', 'D'], description: 'Duplicate Line', category: 'edit' },
  { id: 'edit.deleteLine', keys: ['Ctrl', 'Shift', 'K'], description: 'Delete Line', category: 'edit' },
  { id: 'edit.moveLineUp', keys: ['Alt', 'ArrowUp'], description: 'Move Line Up', category: 'edit' },
  { id: 'edit.moveLineDown', keys: ['Alt', 'ArrowDown'], description: 'Move Line Down', category: 'edit' },
  { id: 'edit.copyLineUp', keys: ['Shift', 'Alt', 'ArrowUp'], description: 'Copy Line Up', category: 'edit' },
  { id: 'edit.copyLineDown', keys: ['Shift', 'Alt', 'ArrowDown'], description: 'Copy Line Down', category: 'edit' },
  { id: 'edit.comment', keys: ['Ctrl', '/'], description: 'Toggle Comment', category: 'edit' },
  { id: 'edit.blockComment', keys: ['Ctrl', 'Shift', '/'], description: 'Toggle Block Comment', category: 'edit' },
  { id: 'edit.indent', keys: ['Tab'], description: 'Indent', category: 'edit' },
  { id: 'edit.outdent', keys: ['Shift', 'Tab'], description: 'Outdent', category: 'edit' },
  { id: 'edit.format', keys: ['Shift', 'Alt', 'F'], description: 'Format Document', category: 'edit' },
  
  // View operations
  { id: 'view.commandPalette', keys: ['Ctrl', 'Shift', 'P'], description: 'Command Palette', category: 'view' },
  { id: 'view.quickOpen', keys: ['Ctrl', 'P'], description: 'Quick Open File', category: 'view' },
  { id: 'view.toggleSidebar', keys: ['Ctrl', 'B'], description: 'Toggle Sidebar', category: 'view' },
  { id: 'view.togglePanel', keys: ['Ctrl', 'J'], description: 'Toggle Panel', category: 'view' },
  { id: 'view.toggleTerminal', keys: ['Ctrl', '`'], description: 'Toggle Terminal', category: 'view' },
  { id: 'view.zoomIn', keys: ['Ctrl', '='], description: 'Zoom In', category: 'view' },
  { id: 'view.zoomOut', keys: ['Ctrl', '-'], description: 'Zoom Out', category: 'view' },
  { id: 'view.resetZoom', keys: ['Ctrl', '0'], description: 'Reset Zoom', category: 'view' },
  { id: 'view.splitRight', keys: ['Ctrl', '\\'], description: 'Split Editor Right', category: 'view' },
  { id: 'view.splitDown', keys: ['Ctrl', 'Shift', '\\'], description: 'Split Editor Down', category: 'view' },
  { id: 'view.focusExplorer', keys: ['Ctrl', 'Shift', 'E'], description: 'Focus Explorer', category: 'view' },
  { id: 'view.focusSearch', keys: ['Ctrl', 'Shift', 'F'], description: 'Focus Search', category: 'view' },
  { id: 'view.focusGit', keys: ['Ctrl', 'Shift', 'G'], description: 'Focus Git', category: 'view' },
  { id: 'view.focusExtensions', keys: ['Ctrl', 'Shift', 'X'], description: 'Focus Extensions', category: 'view' },
  
  // Run operations
  { id: 'run.start', keys: ['F5'], description: 'Run Code', category: 'run' },
  { id: 'run.startWithoutDebug', keys: ['Ctrl', 'F5'], description: 'Run Without Debugging', category: 'run' },
  { id: 'run.stop', keys: ['Shift', 'F5'], description: 'Stop Running', category: 'run' },
  { id: 'run.restart', keys: ['Ctrl', 'Shift', 'F5'], description: 'Restart', category: 'run' },
  
  // Debug operations
  { id: 'debug.toggleBreakpoint', keys: ['F9'], description: 'Toggle Breakpoint', category: 'debug' },
  { id: 'debug.stepOver', keys: ['F10'], description: 'Step Over', category: 'debug' },
  { id: 'debug.stepInto', keys: ['F11'], description: 'Step Into', category: 'debug' },
  { id: 'debug.stepOut', keys: ['Shift', 'F11'], description: 'Step Out', category: 'debug' },
  { id: 'debug.continue', keys: ['F5'], description: 'Continue', category: 'debug', when: 'debugging' },
  
  // Navigation
  { id: 'nav.goToLine', keys: ['Ctrl', 'G'], description: 'Go to Line', category: 'navigation' },
  { id: 'nav.goToSymbol', keys: ['Ctrl', 'Shift', 'O'], description: 'Go to Symbol', category: 'navigation' },
  { id: 'nav.goToDefinition', keys: ['F12'], description: 'Go to Definition', category: 'navigation' },
  { id: 'nav.peekDefinition', keys: ['Alt', 'F12'], description: 'Peek Definition', category: 'navigation' },
  { id: 'nav.goBack', keys: ['Alt', 'ArrowLeft'], description: 'Go Back', category: 'navigation' },
  { id: 'nav.goForward', keys: ['Alt', 'ArrowRight'], description: 'Go Forward', category: 'navigation' },
  { id: 'nav.nextTab', keys: ['Ctrl', 'Tab'], description: 'Next Tab', category: 'navigation' },
  { id: 'nav.prevTab', keys: ['Ctrl', 'Shift', 'Tab'], description: 'Previous Tab', category: 'navigation' },
  { id: 'nav.focusEditor', keys: ['Escape'], description: 'Focus Editor', category: 'navigation' },
  
  // Terminal
  { id: 'terminal.new', keys: ['Ctrl', 'Shift', '`'], description: 'New Terminal', category: 'terminal' },
  { id: 'terminal.clear', keys: ['Ctrl', 'L'], description: 'Clear Terminal', category: 'terminal', when: 'terminalFocus' },
  { id: 'terminal.kill', keys: ['Ctrl', 'Shift', 'Delete'], description: 'Kill Terminal', category: 'terminal' },
  
  // General
  { id: 'general.settings', keys: ['Ctrl', ','], description: 'Open Settings', category: 'general' },
  { id: 'general.shortcuts', keys: ['Ctrl', 'K', 'Ctrl', 'S'], description: 'Keyboard Shortcuts', category: 'general' },
  { id: 'general.fullscreen', keys: ['F11'], description: 'Toggle Fullscreen', category: 'general' },
]

// Category labels
export const CATEGORY_LABELS: Record<string, string> = {
  file: 'File',
  edit: 'Edit',
  view: 'View',
  run: 'Run',
  navigation: 'Navigation',
  terminal: 'Terminal',
  debug: 'Debug',
  general: 'General'
}


// Keyboard shortcuts manager class
class KeyboardShortcutsManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map()
  private customBindings: Map<string, string[]> = new Map()
  private enabled: boolean = true

  constructor() {
    this.loadCustomBindings()
    this.setupGlobalListener()
  }

  // Load custom bindings from localStorage
  private loadCustomBindings() {
    try {
      const saved = localStorage.getItem('geneia-keyboard-shortcuts')
      if (saved) {
        const bindings = JSON.parse(saved) as ShortcutConfig[]
        bindings.forEach(b => {
          if (b.enabled !== false) {
            this.customBindings.set(b.id, b.keys)
          }
        })
      }
    } catch (e) {
      console.error('Failed to load keyboard shortcuts:', e)
    }
  }

  // Save custom bindings to localStorage
  saveCustomBindings() {
    try {
      const bindings: ShortcutConfig[] = []
      this.shortcuts.forEach((shortcut, id) => {
        const customKeys = this.customBindings.get(id)
        if (customKeys) {
          bindings.push({ id, keys: customKeys, enabled: shortcut.enabled !== false })
        }
      })
      localStorage.setItem('geneia-keyboard-shortcuts', JSON.stringify(bindings))
    } catch (e) {
      console.error('Failed to save keyboard shortcuts:', e)
    }
  }

  // Setup global keyboard listener
  private setupGlobalListener() {
    window.addEventListener('keydown', (event) => {
      if (!this.enabled) return
      
      // Don't handle shortcuts when typing in inputs (except for specific shortcuts)
      const target = event.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      // Check each registered shortcut
      for (const [id, shortcut] of this.shortcuts) {
        if (shortcut.enabled === false) continue
        
        const keys = this.customBindings.get(id) || shortcut.keys
        
        if (matchesShortcut(event, keys)) {
          // Some shortcuts should work even in inputs
          const allowInInput = ['edit.save', 'file.save', 'edit.undo', 'edit.redo', 'edit.cut', 'edit.copy', 'edit.paste', 'edit.selectAll'].includes(id)
          
          if (!isInput || allowInInput || id.startsWith('view.') || id.startsWith('run.') || id.startsWith('file.')) {
            event.preventDefault()
            event.stopPropagation()
            shortcut.action()
            return
          }
        }
      }
    })
  }

  // Register a shortcut
  register(shortcut: KeyboardShortcut) {
    this.shortcuts.set(shortcut.id, shortcut)
  }

  // Unregister a shortcut
  unregister(id: string) {
    this.shortcuts.delete(id)
  }

  // Update shortcut keys
  updateKeys(id: string, keys: string[]) {
    this.customBindings.set(id, keys)
    this.saveCustomBindings()
  }

  // Reset shortcut to default
  resetToDefault(id: string) {
    this.customBindings.delete(id)
    this.saveCustomBindings()
  }

  // Reset all shortcuts to default
  resetAllToDefault() {
    this.customBindings.clear()
    localStorage.removeItem('geneia-keyboard-shortcuts')
  }

  // Get all shortcuts
  getAll(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values()).map(s => ({
      ...s,
      keys: this.customBindings.get(s.id) || s.keys
    }))
  }

  // Get shortcuts by category
  getByCategory(category: string): KeyboardShortcut[] {
    return this.getAll().filter(s => s.category === category)
  }

  // Get shortcut by ID
  get(id: string): KeyboardShortcut | undefined {
    const shortcut = this.shortcuts.get(id)
    if (shortcut) {
      return {
        ...shortcut,
        keys: this.customBindings.get(id) || shortcut.keys
      }
    }
    return undefined
  }

  // Enable/disable all shortcuts
  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  // Check if a key combination is already used
  isKeyUsed(keys: string[], excludeId?: string): string | null {
    for (const [id, shortcut] of this.shortcuts) {
      if (id === excludeId) continue
      const currentKeys = this.customBindings.get(id) || shortcut.keys
      if (keys.length === currentKeys.length && keys.every((k, i) => k.toLowerCase() === currentKeys[i].toLowerCase())) {
        return id
      }
    }
    return null
  }
}

// Singleton instance
export const keyboardShortcuts = new KeyboardShortcutsManager()