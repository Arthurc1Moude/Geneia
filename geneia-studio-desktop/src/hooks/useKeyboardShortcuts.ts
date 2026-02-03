/**
 * Hook to register and manage keyboard shortcuts
 */

import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { keyboardShortcuts, DEFAULT_SHORTCUTS } from '../services/keyboardShortcuts'
import { toast } from '../components/Toast'

export function useKeyboardShortcuts() {
  const store = useStore()

  useEffect(() => {
    // Register all shortcuts with their actions
    const actions: Record<string, () => void> = {
      // File operations
      'file.new': () => {
        const name = `untitled-${Date.now()}.gn`
        store.createFile(name)
        store.switchFile(name)
        toast.success('New File', `Created ${name}`)
      },
      'file.save': () => {
        store.saveCurrentFile()
        toast.success('Saved', `${store.currentFile} saved`)
      },
      'file.saveAll': () => {
        store.saveCurrentFile()
        toast.success('Saved All', 'All files saved')
      },
      'file.close': () => {
        if (store.currentFile) {
          store.closeFile(store.currentFile)
        }
      },
      'file.closeAll': () => {
        store.closeAllFiles()
      },

      // Edit operations
      'edit.undo': () => document.execCommand('undo'),
      'edit.redo': () => document.execCommand('redo'),
      'edit.cut': () => document.execCommand('cut'),
      'edit.copy': () => document.execCommand('copy'),
      'edit.paste': () => document.execCommand('paste'),
      'edit.selectAll': () => document.execCommand('selectAll'),
      'edit.find': () => store.setShowFindReplace(true),
      'edit.replace': () => store.setShowFindReplace(true),
      'edit.findInFiles': () => {
        store.setActivePanel('search')
        toast.info('Search', 'Search in files')
      },
      'edit.duplicate': () => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement
        if (textarea) {
          const start = textarea.selectionStart
          const lines = textarea.value.split('\n')
          const lineIndex = textarea.value.substring(0, start).split('\n').length - 1
          const line = lines[lineIndex]
          lines.splice(lineIndex + 1, 0, line)
          store.setCode(lines.join('\n'))
        }
      },
      'edit.deleteLine': () => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement
        if (textarea) {
          const start = textarea.selectionStart
          const lines = textarea.value.split('\n')
          const lineIndex = textarea.value.substring(0, start).split('\n').length - 1
          lines.splice(lineIndex, 1)
          store.setCode(lines.join('\n'))
        }
      },
      'edit.comment': () => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement
        if (textarea) {
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const lines = textarea.value.split('\n')
          const startLine = textarea.value.substring(0, start).split('\n').length - 1
          const endLine = textarea.value.substring(0, end).split('\n').length - 1
          
          for (let i = startLine; i <= endLine; i++) {
            if (lines[i].trimStart().startsWith('//')) {
              lines[i] = lines[i].replace(/^(\s*)\/\/\s?/, '$1')
            } else {
              lines[i] = lines[i].replace(/^(\s*)/, '$1// ')
            }
          }
          store.setCode(lines.join('\n'))
        }
      },
      'edit.format': () => {
        const lines = store.code.split('\n')
        let indent = 0
        const formatted = lines.map(line => {
          const trimmed = line.trim()
          if (trimmed.startsWith('}') || trimmed.startsWith(']')) indent = Math.max(0, indent - 1)
          const result = trimmed ? '    '.repeat(indent) + trimmed : ''
          if (trimmed.endsWith('{') || trimmed.endsWith('[')) indent++
          return result
        })
        store.setCode(formatted.join('\n'))
        toast.success('Formatted', 'Document formatted')
      },

      // View operations
      'view.commandPalette': () => store.setShowCommandPalette(true),
      'view.quickOpen': () => store.setShowQuickOpen(true),
      'view.toggleSidebar': () => store.toggleSidebar(),
      'view.togglePanel': () => store.toggleBottomPanel(),
      'view.toggleTerminal': () => {
        store.setBottomPanelTab('terminal')
        if (!store.bottomPanelOpen) store.toggleBottomPanel()
      },
      'view.zoomIn': () => store.setFontSize(Math.min(store.fontSize + 2, 32)),
      'view.zoomOut': () => store.setFontSize(Math.max(store.fontSize - 2, 8)),
      'view.resetZoom': () => store.setFontSize(14),
      'view.splitRight': () => store.splitEditor('vertical'),
      'view.splitDown': () => store.splitEditor('horizontal'),
      'view.focusExplorer': () => store.setActivePanel('explorer'),
      'view.focusSearch': () => store.setActivePanel('search'),
      'view.focusGit': () => store.setActivePanel('git'),
      'view.focusExtensions': () => store.setActivePanel('extensions'),

      // Run operations
      'run.start': () => {
        const runButton = document.querySelector('[data-run-button]') as HTMLButtonElement
        if (runButton && !runButton.disabled) runButton.click()
      },
      'run.startWithoutDebug': () => {
        const runButton = document.querySelector('[data-run-button]') as HTMLButtonElement
        if (runButton && !runButton.disabled) runButton.click()
      },
      'run.stop': () => {
        if (store.isRunning) {
          store.setRunning(false)
          store.addOutput({ type: 'info', text: 'Execution stopped', timestamp: Date.now() })
        }
      },
      'run.restart': () => {
        store.setRunning(false)
        setTimeout(() => {
          const runButton = document.querySelector('[data-run-button]') as HTMLButtonElement
          if (runButton) runButton.click()
        }, 100)
      },

      // Debug operations
      'debug.toggleBreakpoint': () => toast.info('Debug', 'Breakpoint toggled'),
      'debug.stepOver': () => toast.info('Debug', 'Step over'),
      'debug.stepInto': () => toast.info('Debug', 'Step into'),
      'debug.stepOut': () => toast.info('Debug', 'Step out'),
      'debug.continue': () => toast.info('Debug', 'Continue'),

      // Navigation
      'nav.goToLine': () => {
        const line = prompt('Go to line:')
        if (line) {
          const lineNum = parseInt(line, 10)
          if (!isNaN(lineNum)) {
            const textarea = document.querySelector('textarea') as HTMLTextAreaElement
            if (textarea) {
              const lines = textarea.value.split('\n')
              let pos = 0
              for (let i = 0; i < Math.min(lineNum - 1, lines.length); i++) {
                pos += lines[i].length + 1
              }
              textarea.focus()
              textarea.setSelectionRange(pos, pos)
            }
          }
        }
      },
      'nav.goToSymbol': () => toast.info('Navigation', 'Go to symbol'),
      'nav.goToDefinition': () => toast.info('Navigation', 'Go to definition'),
      'nav.peekDefinition': () => toast.info('Navigation', 'Peek definition'),
      'nav.goBack': () => window.history.back(),
      'nav.goForward': () => window.history.forward(),
      'nav.nextTab': () => {
        const group = store.editorGroups.find(g => g.id === store.activeGroupId)
        if (group && group.openFiles && group.openFiles.length > 1) {
          const currentIndex = group.openFiles.indexOf(group.activeFile || '')
          const nextIndex = (currentIndex + 1) % group.openFiles.length
          store.switchFile(group.openFiles[nextIndex])
        }
      },
      'nav.prevTab': () => {
        const group = store.editorGroups.find(g => g.id === store.activeGroupId)
        if (group && group.openFiles && group.openFiles.length > 1) {
          const currentIndex = group.openFiles.indexOf(group.activeFile || '')
          const prevIndex = (currentIndex - 1 + group.openFiles.length) % group.openFiles.length
          store.switchFile(group.openFiles[prevIndex])
        }
      },
      'nav.focusEditor': () => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement
        if (textarea) textarea.focus()
      },

      // Terminal
      'terminal.new': () => {
        store.setBottomPanelTab('terminal')
        if (!store.bottomPanelOpen) store.toggleBottomPanel()
        toast.info('Terminal', 'New terminal')
      },
      'terminal.clear': () => store.clearOutput(),
      'terminal.kill': () => toast.info('Terminal', 'Terminal killed'),

      // General
      'general.settings': () => store.setActivePanel('account'),
      'general.shortcuts': () => store.setShowKeyboardShortcuts(true),
      'general.fullscreen': () => {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
      },
    }

    // Register all shortcuts
    DEFAULT_SHORTCUTS.forEach(shortcut => {
      const action = actions[shortcut.id]
      if (action !== undefined) {
        keyboardShortcuts.register({
          ...shortcut,
          action
        })
      }
    })

    return () => {
      // Cleanup if needed
    }
  }, [store])
}
