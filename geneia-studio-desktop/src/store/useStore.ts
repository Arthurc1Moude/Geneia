import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GeneiaFile {
  name: string
  content: string
  isModified: boolean
}

export interface OutputLine {
  type: 'peat' | 'tip' | 'error' | 'success' | 'info' | 'int'
  text: string
  timestamp: number
}

export interface RunHistoryItem {
  id: string
  file: string
  timestamp: number
  duration: number
  status: 'success' | 'error'
  exitCode: number
  output: string[]
}

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string
  provider: 'github' | 'google' | 'moude'
}

export interface InstalledExtension {
  id: string
  name: string
  displayName: string
  publisher: string
  version: string
  description: string
  installedAt: number
  enabled: boolean
  iconUrl?: string
}

// Editor Group for split view
export interface EditorGroup {
  id: string
  openFiles: string[]
  activeFile: string | null
}

// Special tab for extension info, welcome page, etc.
export interface SpecialTab {
  id: string
  type: 'extension' | 'welcome' | 'settings' | 'keybindings'
  title: string
  data?: Record<string, unknown>
}

// Detached window - now supports multiple tabs
export interface DetachedWindow {
  id: string
  openFiles: string[]      // Multiple files can be open
  activeFile: string       // Currently active file in this window
  x: number
  y: number
  width: number
  height: number
}

export type ThemeType = 'dark' | 'light' | 'midnight' | 'forest' | 'sunset' | 'aurora' | 'rose' | 'cyber' | 'ocean' | 'lavender' | 'mocha' | 'nord'

export type BottomPanelTab = 'problems' | 'output' | 'debug' | 'terminal' | 'ports'

export type SplitDirection = 'horizontal' | 'vertical' | null

export type LanguageCode = string

interface StoreState {
  // Files
  files: GeneiaFile[]
  currentFile: string
  openFiles: string[]
  
  // Special Tabs (extension info, welcome, etc.)
  specialTabs: SpecialTab[]
  activeSpecialTab: string | null
  
  // Editor Groups (split view)
  editorGroups: EditorGroup[]
  activeGroupId: string
  splitDirection: SplitDirection
  
  // Detached Windows
  detachedWindows: DetachedWindow[]
  
  // Editor
  code: string
  cursorLine: number
  cursorCol: number
  selectionLength: number
  selectedLines: number
  
  // Output
  output: OutputLine[]
  isRunning: boolean
  
  // Run History
  runHistory: RunHistoryItem[]
  
  // Auth
  user: AuthUser | null
  authToken: string | null
  
  // Extensions
  installedExtensions: InstalledExtension[]
  
  // UI
  theme: ThemeType
  fontSize: number
  language: LanguageCode
  fileLanguageOverrides: Record<string, string>  // Map of filename -> language override
  bottomPanelTab: BottomPanelTab
  bottomPanelOpen: boolean
  showFindReplace: boolean
  showKeyboardShortcuts: boolean
  showCommandPalette: boolean
  showQuickOpen: boolean
  sidebarOpen: boolean
  activePanel: string
  
  // File Actions
  setCode: (code: string) => void
  setCursor: (line: number, col: number) => void
  setSelection: (length: number, lines: number) => void
  createFile: (name: string) => void
  switchFile: (name: string) => void
  saveCurrentFile: () => void
  saveFileAs: (newName: string) => void
  deleteFile: (name: string) => void
  openFile: (name: string) => void
  closeFile: (name: string) => void
  closeAllFiles: () => void
  closeOtherFiles: (name: string) => void
  duplicateFile: (name: string) => void
  renameFile: (oldName: string, newName: string) => void
  
  // Special Tab Actions
  openSpecialTab: (tab: SpecialTab) => void
  closeSpecialTab: (id: string) => void
  setActiveSpecialTab: (id: string | null) => void
  
  // Split View Actions
  splitEditor: (direction: SplitDirection) => void
  closeSplit: () => void
  setActiveGroup: (groupId: string) => void
  moveFileToGroup: (fileName: string, groupId: string) => void
  
  // Detached Window Actions
  detachFile: (fileName: string) => void
  attachFile: (windowId: string) => void
  closeDetachedWindow: (windowId: string) => void
  closeFileInDetachedWindow: (windowId: string, fileName: string) => void
  setActiveFileInDetachedWindow: (windowId: string, fileName: string) => void
  updateDetachedWindow: (windowId: string, updates: Partial<DetachedWindow>) => void
  
  // Output Actions
  addOutput: (line: OutputLine) => void
  clearOutput: () => void
  setRunning: (running: boolean) => void
  
  // Run History Actions
  addRunHistory: (item: RunHistoryItem) => void
  clearRunHistory: () => void
  
  // Auth Actions
  setUser: (user: AuthUser | null) => void
  setAuthToken: (token: string | null) => void
  logout: () => void
  
  // Extension Actions
  installExtension: (ext: InstalledExtension) => void
  uninstallExtension: (id: string) => void
  toggleExtension: (id: string) => void
  isExtensionInstalled: (id: string) => boolean
  
  // UI Actions
  setTheme: (theme: ThemeType) => void
  setFontSize: (size: number) => void
  setLanguage: (lang: LanguageCode) => void
  setFileLanguage: (filename: string, lang: string) => void
  getFileLanguage: (filename: string) => string | undefined
  setBottomPanelTab: (tab: BottomPanelTab) => void
  setBottomPanelOpen: (open: boolean) => void
  openProblemsPanel: () => void
  setShowFindReplace: (show: boolean) => void
  setShowKeyboardShortcuts: (show: boolean) => void
  setShowCommandPalette: (show: boolean) => void
  setShowQuickOpen: (show: boolean) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  toggleBottomPanel: () => void
  setActivePanel: (panel: string) => void
  saveAllFiles: () => void
  hasUnsavedChanges: () => boolean
}

const defaultCode = `! Hello World in Geneia !

"Welcome to Geneia Studio IDE!"

peat 'Hello, World!'
peat ''

var {name} = 'Geneia'
peat 'Language: '
peat {name}

exit (0)
`

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      files: [{ name: 'main.gn', content: defaultCode, isModified: false }],
      currentFile: 'main.gn',
      openFiles: ['main.gn'],
      specialTabs: [],
      activeSpecialTab: null,
      editorGroups: [{ id: 'group-1', openFiles: ['main.gn'], activeFile: 'main.gn' }],
      activeGroupId: 'group-1',
      splitDirection: null,
      detachedWindows: [],
      code: defaultCode,
      cursorLine: 1,
      cursorCol: 1,
      selectionLength: 0,
      selectedLines: 0,
      output: [],
      isRunning: false,
      runHistory: [],
      user: null,
      authToken: null,
      installedExtensions: [],
      theme: 'dark',
      fontSize: 14,
      language: 'en',
      fileLanguageOverrides: {},
      bottomPanelTab: 'output',
      bottomPanelOpen: true,
      showFindReplace: false,
      showKeyboardShortcuts: false,
      showCommandPalette: false,
      showQuickOpen: false,
      sidebarOpen: true,
      activePanel: 'explorer',

      // File Actions
      setCode: (code) => set((state) => ({
        code,
        files: state.files.map(f => 
          f.name === state.currentFile 
            ? { ...f, content: code, isModified: true }
            : f
        )
      })),

      setCursor: (line, col) => set({ cursorLine: line, cursorCol: col }),

      setSelection: (length, lines) => set({ selectionLength: length, selectedLines: lines }),

      createFile: (name) => {
        // Use the name as-is (extension handling done in Sidebar)
        const fileName = name
        const isGeneiaFile = fileName.endsWith('.gn') || fileName.endsWith('.gns') || fileName.endsWith('.gne')
        const defaultContent = isGeneiaFile 
          ? `! ${fileName} !\n\n"New Geneia file"\n\npeat 'Hello!'\n\nexit (0)\n`
          : `// ${fileName}\n`
        const newFile: GeneiaFile = {
          name: fileName,
          content: defaultContent,
          isModified: false
        }
        set((state) => {
          return {
            files: [...state.files, newFile],
            currentFile: fileName,
            code: newFile.content,
            openFiles: [...state.openFiles, fileName],
            editorGroups: state.editorGroups.map(g => 
              g.id === state.activeGroupId 
                ? { ...g, openFiles: [...g.openFiles, fileName], activeFile: fileName }
                : g
            )
          }
        })
      },

      switchFile: (name) => {
        const state = get()
        const file = state.files.find(f => f.name === name)
        if (file) {
          set({
            currentFile: name,
            code: file.content,
            editorGroups: state.editorGroups.map(g => 
              g.id === state.activeGroupId 
                ? { ...g, activeFile: name }
                : g
            )
          })
        }
      },

      openFile: (name) => {
        const state = get()
        const file = state.files.find(f => f.name === name)
        if (file) {
          const isOpen = state.openFiles.includes(name)
          set({
            currentFile: name,
            code: file.content,
            openFiles: isOpen ? state.openFiles : [...state.openFiles, name],
            editorGroups: state.editorGroups.map(g => 
              g.id === state.activeGroupId 
                ? { 
                    ...g, 
                    openFiles: g.openFiles.includes(name) ? g.openFiles : [...g.openFiles, name],
                    activeFile: name 
                  }
                : g
            )
          })
        }
      },

      closeFile: (name) => {
        const state = get()
        const newOpenFiles = state.openFiles.filter(f => f !== name)
        const activeGroup = state.editorGroups.find(g => g.id === state.activeGroupId)
        const groupOpenFiles = activeGroup?.openFiles.filter(f => f !== name) || []
        
        let newCurrentFile = state.currentFile
        let newCode = state.code
        
        if (state.currentFile === name) {
          const idx = state.openFiles.indexOf(name)
          newCurrentFile = newOpenFiles[Math.max(0, idx - 1)] || newOpenFiles[0] || ''
          const file = state.files.find(f => f.name === newCurrentFile)
          newCode = file?.content || ''
        }
        
        set({
          openFiles: newOpenFiles,
          currentFile: newCurrentFile,
          code: newCode,
          editorGroups: state.editorGroups.map(g => 
            g.id === state.activeGroupId 
              ? { ...g, openFiles: groupOpenFiles, activeFile: groupOpenFiles.includes(newCurrentFile) ? newCurrentFile : groupOpenFiles[0] || null }
              : g
          )
        })
      },

      closeAllFiles: () => {
        set((state) => ({
          openFiles: [],
          currentFile: '',
          code: '',
          editorGroups: state.editorGroups.map(g => 
            g.id === state.activeGroupId 
              ? { ...g, openFiles: [], activeFile: null }
              : g
          )
        }))
      },

      closeOtherFiles: (name) => {
        const state = get()
        const file = state.files.find(f => f.name === name)
        set({
          openFiles: [name],
          currentFile: name,
          code: file?.content || '',
          editorGroups: state.editorGroups.map(g => 
            g.id === state.activeGroupId 
              ? { ...g, openFiles: [name], activeFile: name }
              : g
          )
        })
      },

      saveCurrentFile: () => set((state) => ({
        files: state.files.map(f =>
          f.name === state.currentFile
            ? { ...f, isModified: false }
            : f
        )
      })),

      saveFileAs: (newName) => {
        const state = get()
        const fileName = newName.endsWith('.gn') ? newName : `${newName}.gn`
        const currentContent = state.code
        
        // Check if file already exists
        if (state.files.some(f => f.name === fileName)) {
          return // File exists, don't overwrite
        }
        
        const newFile: GeneiaFile = {
          name: fileName,
          content: currentContent,
          isModified: false
        }
        
        set({
          files: [...state.files, newFile],
          currentFile: fileName,
          openFiles: [...state.openFiles.filter(f => f !== state.currentFile), fileName],
          editorGroups: state.editorGroups.map(g => ({
            ...g,
            openFiles: g.openFiles.map(f => f === state.currentFile ? fileName : f),
            activeFile: g.activeFile === state.currentFile ? fileName : g.activeFile
          }))
        })
      },

      duplicateFile: (name) => {
        const state = get()
        const file = state.files.find(f => f.name === name)
        if (!file) return
        
        // Generate new name
        const baseName = name.replace('.gn', '')
        let newName = `${baseName}_copy.gn`
        let counter = 1
        while (state.files.some(f => f.name === newName)) {
          newName = `${baseName}_copy${counter}.gn`
          counter++
        }
        
        const newFile: GeneiaFile = {
          name: newName,
          content: file.content,
          isModified: false
        }
        
        set({
          files: [...state.files, newFile],
          currentFile: newName,
          code: newFile.content,
          openFiles: [...state.openFiles, newName],
          editorGroups: state.editorGroups.map(g => 
            g.id === state.activeGroupId 
              ? { ...g, openFiles: [...g.openFiles, newName], activeFile: newName }
              : g
          )
        })
      },

      renameFile: (oldName, newName) => {
        const state = get()
        // Use the new name as-is (don't force .gn extension)
        const fileName = newName
        
        // Check if new name already exists
        if (state.files.some(f => f.name === fileName && f.name !== oldName)) {
          return
        }
        
        // Also update fileLanguageOverrides if the old file had one
        const newOverrides = { ...state.fileLanguageOverrides }
        if (newOverrides[oldName]) {
          newOverrides[fileName] = newOverrides[oldName]
          delete newOverrides[oldName]
        }
        
        set({
          files: state.files.map(f => 
            f.name === oldName ? { ...f, name: fileName } : f
          ),
          currentFile: state.currentFile === oldName ? fileName : state.currentFile,
          openFiles: state.openFiles.map(f => f === oldName ? fileName : f),
          editorGroups: state.editorGroups.map(g => ({
            ...g,
            openFiles: g.openFiles.map(f => f === oldName ? fileName : f),
            activeFile: g.activeFile === oldName ? fileName : g.activeFile
          })),
          detachedWindows: state.detachedWindows.map(w => ({
            ...w,
            openFiles: w.openFiles.map(f => f === oldName ? fileName : f),
            activeFile: w.activeFile === oldName ? fileName : w.activeFile
          })),
          fileLanguageOverrides: newOverrides
        })
      },

      // Special Tab Actions
      openSpecialTab: (tab) => {
        const state = get()
        // Check if tab already exists
        const existing = state.specialTabs.find(t => t.id === tab.id)
        if (existing) {
          set({ activeSpecialTab: tab.id, currentFile: '' })
        } else {
          set({
            specialTabs: [...state.specialTabs, tab],
            activeSpecialTab: tab.id,
            currentFile: ''
          })
        }
      },

      closeSpecialTab: (id) => {
        const state = get()
        const newTabs = state.specialTabs.filter(t => t.id !== id)
        let newActiveSpecial = state.activeSpecialTab
        
        if (state.activeSpecialTab === id) {
          // Switch to another tab or file
          if (newTabs.length > 0) {
            newActiveSpecial = newTabs[0].id
          } else {
            newActiveSpecial = null
            // Switch back to a file if available
            if (state.openFiles.length > 0) {
              const file = state.files.find(f => f.name === state.openFiles[0])
              set({
                specialTabs: newTabs,
                activeSpecialTab: null,
                currentFile: state.openFiles[0],
                code: file?.content || ''
              })
              return
            }
          }
        }
        
        set({
          specialTabs: newTabs,
          activeSpecialTab: newActiveSpecial
        })
      },

      setActiveSpecialTab: (id) => {
        if (id) {
          set({ activeSpecialTab: id, currentFile: '' })
        } else {
          set({ activeSpecialTab: null })
        }
      },

      deleteFile: (name) => set((state) => {
        const newFiles = state.files.filter(f => f.name !== name)
        const newOpenFiles = state.openFiles.filter(f => f !== name)
        if (newFiles.length === 0) {
          newFiles.push({ name: 'main.gn', content: defaultCode, isModified: false })
        }
        const newCurrent = state.currentFile === name ? (newOpenFiles[0] || newFiles[0].name) : state.currentFile
        return {
          files: newFiles,
          openFiles: newOpenFiles.length > 0 ? newOpenFiles : [newFiles[0].name],
          currentFile: newCurrent,
          code: newFiles.find(f => f.name === newCurrent)?.content || '',
          editorGroups: state.editorGroups.map(g => ({
            ...g,
            openFiles: g.openFiles.filter(f => f !== name),
            activeFile: g.activeFile === name ? null : g.activeFile
          }))
        }
      }),

      // Split View Actions
      splitEditor: (direction) => {
        const state = get()
        if (state.editorGroups.length >= 3) return // Max 3 groups
        
        const newGroupId = `group-${Date.now()}`
        const currentGroup = state.editorGroups.find(g => g.id === state.activeGroupId)
        
        set({
          splitDirection: direction,
          editorGroups: [
            ...state.editorGroups,
            { 
              id: newGroupId, 
              openFiles: currentGroup?.activeFile ? [currentGroup.activeFile] : [], 
              activeFile: currentGroup?.activeFile || null 
            }
          ]
        })
      },

      closeSplit: () => {
        const state = get()
        if (state.editorGroups.length <= 1) return
        
        // Merge all files into first group
        const allOpenFiles = [...new Set(state.editorGroups.flatMap(g => g.openFiles))]
        
        set({
          splitDirection: null,
          editorGroups: [{ id: 'group-1', openFiles: allOpenFiles, activeFile: state.currentFile }],
          activeGroupId: 'group-1'
        })
      },

      setActiveGroup: (groupId) => {
        const state = get()
        const group = state.editorGroups.find(g => g.id === groupId)
        if (group && group.activeFile) {
          const file = state.files.find(f => f.name === group.activeFile)
          set({
            activeGroupId: groupId,
            currentFile: group.activeFile,
            code: file?.content || ''
          })
        } else {
          set({ activeGroupId: groupId })
        }
      },

      moveFileToGroup: (fileName, groupId) => {
        set((state) => ({
          editorGroups: state.editorGroups.map(g => {
            if (g.id === groupId) {
              return {
                ...g,
                openFiles: g.openFiles.includes(fileName) ? g.openFiles : [...g.openFiles, fileName],
                activeFile: fileName
              }
            }
            return {
              ...g,
              openFiles: g.openFiles.filter(f => f !== fileName),
              activeFile: g.activeFile === fileName ? (g.openFiles[0] || null) : g.activeFile
            }
          })
        }))
      },

      // Detached Window Actions
      detachFile: (fileName) => {
        const state = get()
        
        // Check if there's already a detached window - add file to it
        if (state.detachedWindows.length > 0) {
          const existingWindow = state.detachedWindows[0]
          if (!existingWindow.openFiles.includes(fileName)) {
            set({
              detachedWindows: state.detachedWindows.map(w => 
                w.id === existingWindow.id 
                  ? { ...w, openFiles: [...w.openFiles, fileName], activeFile: fileName }
                  : w
              ),
              openFiles: state.openFiles.filter(f => f !== fileName),
              editorGroups: state.editorGroups.map(g => ({
                ...g,
                openFiles: g.openFiles.filter(f => f !== fileName),
                activeFile: g.activeFile === fileName ? (g.openFiles.filter(f => f !== fileName)[0] || null) : g.activeFile
              }))
            })
          }
          return
        }
        
        // Create new detached window
        const newWindow: DetachedWindow = {
          id: `window-${Date.now()}`,
          openFiles: [fileName],
          activeFile: fileName,
          x: 100 + state.detachedWindows.length * 30,
          y: 100 + state.detachedWindows.length * 30,
          width: 800,
          height: 600
        }
        set({
          detachedWindows: [...state.detachedWindows, newWindow],
          openFiles: state.openFiles.filter(f => f !== fileName),
          editorGroups: state.editorGroups.map(g => ({
            ...g,
            openFiles: g.openFiles.filter(f => f !== fileName),
            activeFile: g.activeFile === fileName ? (g.openFiles.filter(f => f !== fileName)[0] || null) : g.activeFile
          }))
        })
      },

      attachFile: (windowId) => {
        const state = get()
        const window = state.detachedWindows.find(w => w.id === windowId)
        if (window) {
          // Attach all files from the window back to main editor
          set({
            detachedWindows: state.detachedWindows.filter(w => w.id !== windowId),
            openFiles: [...state.openFiles, ...window.openFiles],
            currentFile: window.activeFile,
            code: state.files.find(f => f.name === window.activeFile)?.content || '',
            editorGroups: state.editorGroups.map(g => 
              g.id === state.activeGroupId 
                ? { ...g, openFiles: [...g.openFiles, ...window.openFiles], activeFile: window.activeFile }
                : g
            )
          })
        }
      },

      updateDetachedWindow: (windowId, updates) => {
        set((state) => ({
          detachedWindows: state.detachedWindows.map(w => 
            w.id === windowId ? { ...w, ...updates } : w
          )
        }))
      },

      closeDetachedWindow: (windowId) => {
        // Close the window - files are NOT reopened in main editor
        set((state) => ({
          detachedWindows: state.detachedWindows.filter(w => w.id !== windowId)
        }))
      },

      closeFileInDetachedWindow: (windowId, fileName) => {
        const state = get()
        const window = state.detachedWindows.find(w => w.id === windowId)
        if (!window) return
        
        const newOpenFiles = window.openFiles.filter(f => f !== fileName)
        
        // If no more files, close the window
        if (newOpenFiles.length === 0) {
          set({
            detachedWindows: state.detachedWindows.filter(w => w.id !== windowId)
          })
          return
        }
        
        // Update the window with remaining files
        const newActiveFile = window.activeFile === fileName 
          ? newOpenFiles[0] 
          : window.activeFile
        
        set({
          detachedWindows: state.detachedWindows.map(w => 
            w.id === windowId 
              ? { ...w, openFiles: newOpenFiles, activeFile: newActiveFile }
              : w
          )
        })
      },

      setActiveFileInDetachedWindow: (windowId, fileName) => {
        set((state) => ({
          detachedWindows: state.detachedWindows.map(w => 
            w.id === windowId ? { ...w, activeFile: fileName } : w
          )
        }))
      },

      // Output Actions
      addOutput: (line) => set((state) => ({
        output: [...state.output, line]
      })),

      clearOutput: () => set({ output: [] }),

      setRunning: (running) => set({ isRunning: running }),

      // Run History Actions
      addRunHistory: (item) => set((state) => ({
        runHistory: [item, ...state.runHistory].slice(0, 50)
      })),

      clearRunHistory: () => set({ runHistory: [] }),

      // Auth Actions
      setUser: (user) => set({ user }),
      
      setAuthToken: (token) => set({ authToken: token }),
      
      logout: () => set({ user: null, authToken: null }),

      // Extension Actions
      installExtension: (ext) => set((state) => ({
        installedExtensions: [...state.installedExtensions, { ...ext, installedAt: Date.now(), enabled: true }]
      })),

      uninstallExtension: (id) => {
        // Import dynamically to avoid circular dependency
        import('../services/extensionRuntime').then(({ ExtensionRuntime }) => {
          ExtensionRuntime.deactivateExtension(id)
        })
        set((state) => ({
          installedExtensions: state.installedExtensions.filter(e => e.id !== id)
        }))
      },

      toggleExtension: (id) => {
        const state = get()
        const ext = state.installedExtensions.find(e => e.id === id)
        if (ext) {
          // Import dynamically to avoid circular dependency
          import('../services/extensionRuntime').then(({ ExtensionRuntime }) => {
            if (ext.enabled) {
              // Currently enabled, will be disabled - deactivate immediately
              ExtensionRuntime.deactivateExtension(id)
              console.log(`[Extension] Deactivated: ${ext.displayName}`)
            } else {
              // Currently disabled, will be enabled - activate immediately
              ExtensionRuntime.activateExtension({ ...ext, enabled: true })
              console.log(`[Extension] Activated: ${ext.displayName}`)
            }
          })
        }
        set((state) => ({
          installedExtensions: state.installedExtensions.map(e =>
            e.id === id ? { ...e, enabled: !e.enabled } : e
          )
        }))
      },

      isExtensionInstalled: (id) => {
        return get().installedExtensions.some(e => e.id === id)
      },

      // UI Actions
      setTheme: (theme) => set({ theme }),
      
      setFontSize: (size) => set({ fontSize: size }),
      
      setLanguage: (lang) => {
        // Import localization service and set language
        import('../services/localization').then(({ LocalizationService }) => {
          LocalizationService.setLanguage(lang)
        })
        set({ language: lang })
      },
      
      setFileLanguage: (filename, lang) => {
        set((state) => ({
          fileLanguageOverrides: {
            ...state.fileLanguageOverrides,
            [filename]: lang
          }
        }))
      },
      
      getFileLanguage: (filename) => {
        return get().fileLanguageOverrides[filename]
      },
      
      setBottomPanelTab: (tab) => set({ bottomPanelTab: tab }),
      
      setBottomPanelOpen: (open) => set({ bottomPanelOpen: open }),
      
      openProblemsPanel: () => set({ bottomPanelTab: 'problems', bottomPanelOpen: true }),
      
      setShowFindReplace: (show) => set({ showFindReplace: show }),
      setShowKeyboardShortcuts: (show) => set({ showKeyboardShortcuts: show }),
      setShowCommandPalette: (show) => set({ showCommandPalette: show }),
      setShowQuickOpen: (show) => set({ showQuickOpen: show }),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),
      setActivePanel: (panel) => set({ activePanel: panel }),
      
      saveAllFiles: () => set((state) => ({
        files: state.files.map(f => ({ ...f, isModified: false }))
      })),
      
      hasUnsavedChanges: () => {
        return get().files.some(f => f.isModified)
      }
    }),
    {
      name: 'geneia-studio-storage',
      partialize: (state) => ({
        files: state.files,
        currentFile: state.currentFile,
        openFiles: state.openFiles,
        theme: state.theme,
        fontSize: state.fontSize,
        language: state.language,
        runHistory: state.runHistory,
        user: state.user,
        authToken: state.authToken,
        installedExtensions: state.installedExtensions
      })
    }
  )
)
