import { useRef, useCallback, useEffect, useState } from 'react'
import { Play, Square, Sparkles, Trash2, X, Copy, Scissors, ClipboardPaste, Type } from 'lucide-react'
import { useStore } from '../store/useStore'
import { GeneiaInterpreter } from '../interpreter/GeneiaInterpreter'
import { toast } from './Toast'
import { clsx } from 'clsx'
import { FindReplace } from './FindReplace'
import { EditorTabs } from './EditorTabs'
import { ExtensionInfoPage } from './ExtensionInfoPage'
import { checkGeneiaGrammarAsync } from '../services/geneiaGrammar'
import { highlightCode, detectLanguageFromFilename } from '../services/syntaxHighlighter'
import { LocalizationService } from '../services/localization'
import { ContextMenu, type ContextMenuItem } from './ContextMenu'
import { isRunnable, getRunCommand, getLanguageName, needsCompilation, getCompileCommand } from '../services/languageRunner'

interface EditorPaneProps {
  groupId: string
  showToolbar?: boolean
}

function EditorPane({ groupId, showToolbar = false }: EditorPaneProps) {
  const { 
    code, setCode, setCursor, setSelection, fontSize, currentFile, files,
    isRunning, setRunning, addOutput, clearOutput, addRunHistory,
    editorGroups, activeGroupId, setActiveGroup, closeSplit,
    specialTabs, activeSpecialTab, setShowFindReplace
  } = useStore()
  
  const interpreterRef = useRef<GeneiaInterpreter | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  
  const [editorContextMenu, setEditorContextMenu] = useState<{ x: number; y: number } | null>(null)

  const group = editorGroups.find(g => g.id === groupId)
  const isActive = activeGroupId === groupId
  const activeFile = group?.activeFile
  const file = files.find(f => f.name === activeFile)
  const displayCode = isActive ? code : (file?.content || '')

  // Editor context menu handlers
  const handleEditorContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setEditorContextMenu({ x: e.clientX, y: e.clientY })
  }

  const getEditorContextMenuItems = (): ContextMenuItem[] => {
    const hasSelection = textareaRef.current && 
      textareaRef.current.selectionStart !== textareaRef.current.selectionEnd
    
    return [
      {
        id: 'cut',
        label: 'Cut',
        icon: <Scissors className="w-4 h-4" />,
        shortcut: 'Ctrl+X',
        disabled: !hasSelection,
        onClick: () => {
          if (textareaRef.current) {
            document.execCommand('cut')
          }
        }
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: <Copy className="w-4 h-4" />,
        shortcut: 'Ctrl+C',
        disabled: !hasSelection,
        onClick: () => {
          if (textareaRef.current) {
            document.execCommand('copy')
          }
        }
      },
      {
        id: 'paste',
        label: 'Paste',
        icon: <ClipboardPaste className="w-4 h-4" />,
        shortcut: 'Ctrl+V',
        onClick: async () => {
          if (textareaRef.current) {
            try {
              const text = await navigator.clipboard.readText()
              const start = textareaRef.current.selectionStart
              const end = textareaRef.current.selectionEnd
              const newCode = code.substring(0, start) + text + code.substring(end)
              setCode(newCode)
            } catch {
              document.execCommand('paste')
            }
          }
        }
      },
      { id: 'divider1', label: '', divider: true },
      {
        id: 'selectAll',
        label: 'Select All',
        icon: <Type className="w-4 h-4" />,
        shortcut: 'Ctrl+A',
        onClick: () => {
          if (textareaRef.current) {
            textareaRef.current.select()
          }
        }
      },
      { id: 'divider2', label: '', divider: true },
      {
        id: 'find',
        label: 'Find',
        shortcut: 'Ctrl+F',
        onClick: () => setShowFindReplace(true)
      },
      { id: 'divider3', label: '', divider: true },
      {
        id: 'format',
        label: 'Format Document',
        shortcut: 'Shift+Alt+F',
        onClick: () => {
          toast.info('Format', 'Document formatted')
        }
      }
    ]
  }

  const handleRun = useCallback(async () => {
    if (isRunning) return
    
    clearOutput()
    
    const fileExt = currentFile.split('.').pop()?.toLowerCase() || ''
    const isGeneiaFile = ['gn', 'gns', 'gne'].includes(fileExt)
    const languageName = getLanguageName(fileExt)
    const canRun = isRunnable(currentFile)
    
    // For Geneia files, check grammar first
    if (isGeneiaFile) {
      const grammarResult = await checkGeneiaGrammarAsync(code, currentFile)
      
      // Show grammar errors/warnings in output
      if (grammarResult.errors.length > 0) {
        // Show errors first
        const errors = grammarResult.errors.filter(e => e.severity === 'error')
        const warnings = grammarResult.errors.filter(e => e.severity === 'warning')
        const infos = grammarResult.errors.filter(e => e.severity === 'info')
        
        if (errors.length > 0) {
          addOutput({ type: 'error', text: `=== ${errors.length} Error(s) Found ===`, timestamp: Date.now() })
          errors.forEach(err => {
            addOutput({ 
              type: 'error', 
              text: `[${err.code}] Line ${err.line}: ${err.message}`, 
              timestamp: Date.now() 
            })
          })
        }
        
        if (warnings.length > 0) {
          addOutput({ type: 'tip', text: `=== ${warnings.length} Warning(s) ===`, timestamp: Date.now() })
          warnings.forEach(warn => {
            addOutput({ 
              type: 'tip', 
              text: `[${warn.code}] Line ${warn.line}: ${warn.message}`, 
              timestamp: Date.now() 
            })
          })
        }
        
        if (infos.length > 0) {
          infos.forEach(info => {
            addOutput({ 
              type: 'info', 
              text: `[${info.code}] Line ${info.line}: ${info.message}`, 
              timestamp: Date.now() 
            })
          })
        }
        
        // If there are errors, don't run
        if (errors.length > 0) {
          addOutput({ type: 'error', text: '', timestamp: Date.now() })
          addOutput({ type: 'error', text: `Execution aborted: Fix ${errors.length} error(s) before running`, timestamp: Date.now() })
          toast.error('Syntax Errors', `${errors.length} error(s) found. Fix them before running.`)
          return
        }
        
        // Add separator before output
        addOutput({ type: 'info', text: '', timestamp: Date.now() })
        addOutput({ type: 'info', text: '=== Running with warnings ===', timestamp: Date.now() })
        addOutput({ type: 'info', text: '', timestamp: Date.now() })
      }
    }
    
    setRunning(true)
    
    const startTime = performance.now()
    const outputLines: string[] = []
    let exitCode = 0
    let status: 'success' | 'error' = 'success'

    // For Geneia files, use the built-in interpreter
    if (isGeneiaFile) {
      interpreterRef.current = new GeneiaInterpreter((output) => {
        outputLines.push(`[${output.type.toUpperCase()}] ${output.text}`)
        addOutput({ ...output, timestamp: Date.now() })
        if (output.type === 'error') {
          status = 'error'
          exitCode = 1
        }
      })
      
      try {
        exitCode = await interpreterRef.current.execute(code)
        if (exitCode !== 0) status = 'error'
      } catch (err) {
        status = 'error'
        exitCode = 1
        toast.error('Execution Error', (err as Error).message)
      }
    } else if (canRun) {
      // For other languages, show the command
      addOutput({ type: 'info', text: `Running ${languageName} file: ${currentFile}`, timestamp: Date.now() })
      outputLines.push(`[INFO] Running ${languageName} file: ${currentFile}`)
      
      // Check if compilation is needed
      if (needsCompilation(currentFile)) {
        const compileCmd = getCompileCommand(currentFile, currentFile)
        if (compileCmd) {
          addOutput({ type: 'info', text: `Compile: ${compileCmd.command} ${compileCmd.args.join(' ')}`, timestamp: Date.now() })
          outputLines.push(`[INFO] Compile: ${compileCmd.command} ${compileCmd.args.join(' ')}`)
        }
      }
      
      const runCmd = getRunCommand(currentFile, currentFile)
      if (runCmd) {
        addOutput({ type: 'info', text: `Execute: ${runCmd.command} ${runCmd.args.join(' ')}`, timestamp: Date.now() })
        outputLines.push(`[INFO] Execute: ${runCmd.command} ${runCmd.args.join(' ')}`)
        
        addOutput({ type: 'info', text: '', timestamp: Date.now() })
        addOutput({ type: 'tip', text: '⚡ To run this file, use the terminal with the command above', timestamp: Date.now() })
        addOutput({ type: 'tip', text: '💡 Or install the language extension for integrated execution', timestamp: Date.now() })
      }
    } else {
      addOutput({ type: 'error', text: `Cannot run file: ${currentFile}`, timestamp: Date.now() })
      addOutput({ type: 'info', text: 'This file type is not executable', timestamp: Date.now() })
      outputLines.push(`[ERROR] Cannot run file: ${currentFile}`)
      status = 'error'
      exitCode = 1
    }

    const endTime = performance.now()
    const duration = (endTime - startTime) / 1000

    addRunHistory({
      id: Date.now().toString(),
      file: currentFile,
      timestamp: Date.now(),
      duration,
      status,
      exitCode,
      output: outputLines
    })

    if (status === 'success') {
      toast.success('Run Complete', `${currentFile} finished in ${duration.toFixed(2)}s`)
    } else if (isGeneiaFile || !canRun) {
      toast.error('Run Failed', `${currentFile} exited with code ${exitCode}`)
    }

    setRunning(false)
  }, [code, currentFile, isRunning, clearOutput, setRunning, addOutput, addRunHistory])

  const handleStop = useCallback(() => {
    if (interpreterRef.current) {
      interpreterRef.current.stop()
    }
    setRunning(false)
    addOutput({ type: 'info', text: 'Execution stopped', timestamp: Date.now() })
  }, [setRunning, addOutput])

  const handleFormat = useCallback(() => {
    const lines = code.split('\n')
    let indent = 0
    const formatted = lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1)
      const result = trimmed ? '    '.repeat(indent) + trimmed : ''
      if (trimmed.endsWith('{')) indent++
      return result
    })
    setCode(formatted.join('\n'))
  }, [code, setCode])

  const updateCursor = useCallback(() => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const text = textarea.value.substring(0, textarea.selectionStart)
    const lines = text.split('\n')
    setCursor(lines.length, lines[lines.length - 1].length + 1)
    
    // Track selection
    const selStart = textarea.selectionStart
    const selEnd = textarea.selectionEnd
    const selectionLength = selEnd - selStart
    
    if (selectionLength > 0) {
      const selectedText = textarea.value.substring(selStart, selEnd)
      const selectedLines = selectedText.split('\n').length
      setSelection(selectionLength, selectedLines)
    } else {
      setSelection(0, 0)
    }
  }, [setCursor, setSelection])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textareaRef.current!.selectionStart
      const end = textareaRef.current!.selectionEnd
      const newCode = displayCode.substring(0, start) + '    ' + displayCode.substring(end)
      setCode(newCode)
      setTimeout(() => {
        textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd = start + 4
      }, 0)
    }
    if (e.key === 'F5') {
      e.preventDefault()
      handleRun()
    }
  }, [displayCode, setCode, handleRun])

  const handleFocus = () => {
    if (!isActive) {
      setActiveGroup(groupId)
    }
  }

  const lineCount = displayCode.split('\n').length
  const fileLanguageOverride = activeFile ? useStore.getState().getFileLanguage(activeFile) : undefined
  const currentLanguage = fileLanguageOverride || (activeFile ? detectLanguageFromFilename(activeFile) : 'geneia')
  const highlightedCode = highlightCode(displayCode, currentLanguage)
  const canCloseSplit = editorGroups.length > 1
  
  // Calculate exact height for both layers
  const codeHeight = Math.max(lineCount * fontSize * 1.6 + 32, 200)

  return (
    <div 
      className={clsx(
        'flex-1 flex flex-col min-h-0 min-w-0',
        isActive && 'ring-1 ring-[var(--accent-primary)]/30 rounded-xl'
      )}
      onClick={handleFocus}
    >
      {/* File Tabs */}
      <EditorTabs groupId={groupId} />

      {/* Toolbar - only show on first pane */}
      {showToolbar && (() => {
        const t = LocalizationService.t.bind(LocalizationService)
        return (
        <div className="glass rounded-t-none rounded-b-lg px-3 py-2 flex items-center justify-between border-b border-theme">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              data-run-button
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                isRunning
                  ? 'bg-theme-secondary text-theme-muted cursor-not-allowed'
                  : 'gradient-btn text-white hover:shadow-lg hover:shadow-cyan-500/25'
              )}
            >
              <Play className="w-3 h-3" />
              {t('runCode')}
            </button>
            
            <button
              onClick={handleStop}
              disabled={!isRunning}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                !isRunning
                  ? 'bg-theme-editor text-theme-muted cursor-not-allowed'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              )}
            >
              <Square className="w-3 h-3" />
              {t('stopCode')}
            </button>

            <div className="w-px h-6 bg-theme border-theme mx-2" />

            <button
              onClick={handleFormat}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              {t('format')}
            </button>

            <button
              onClick={clearOutput}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              {t('clear')}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {canCloseSplit && (
              <button
                onClick={closeSplit}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-theme-muted hover:bg-white/5"
              >
                <X className="w-3 h-3" /> {t('close')}
              </button>
            )}
            <select
              value={fontSize}
              onChange={(e) => useStore.getState().setFontSize(Number(e.target.value))}
              className="px-2 py-1 text-xs bg-theme-editor border border-theme rounded text-theme-secondary"
            >
              {[12, 14, 16, 18, 20].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
        </div>
        )
      })()}

      {/* Editor */}
      <div className="flex-1 glass rounded-xl overflow-hidden min-h-0 relative">
        {showToolbar && <FindReplace />}
        
        {/* Show Special Tab (Extension Info, etc.) */}
        {activeSpecialTab && specialTabs.find(t => t.id === activeSpecialTab) ? (
          (() => {
            const tab = specialTabs.find(t => t.id === activeSpecialTab)!
            if (tab.type === 'extension') {
              return <ExtensionInfoPage tab={tab} />
            }
            return (
              <div className="flex-1 flex items-center justify-center text-theme-muted">
                <p>Unknown tab type</p>
              </div>
            )
          })()
        ) : activeFile ? (
          <div 
            ref={editorContainerRef}
            className="absolute inset-0 overflow-auto"
          >
            {/* Single scrollable container with line numbers + code */}
            <div className="flex" style={{ minHeight: '100%' }}>
              {/* Line Numbers - sticky left */}
              <div 
                ref={lineNumbersRef}
                className="py-4 px-3 bg-theme-editor border-r border-theme text-right select-none flex-shrink-0 sticky left-0 z-10"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: '1.6',
                }}
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="text-theme-muted font-mono">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code Area - Two layers perfectly aligned */}
              <div className="flex-1 min-w-0 relative">
                {/* Layer 1: Syntax highlighted code (visible text) */}
                <div
                  className="absolute inset-0 p-4 font-mono whitespace-pre pointer-events-none select-none overflow-hidden"
                  style={{ 
                    fontSize: `${fontSize}px`, 
                    lineHeight: '1.6',
                    height: `${codeHeight}px`,
                    wordBreak: 'break-all',
                    overflowWrap: 'break-word',
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightedCode + '\n' }}
                />
                
                {/* Layer 2: Textarea (invisible text, shows cursor and selection) */}
                <textarea
                  ref={textareaRef}
                  value={displayCode}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onClick={updateCursor}
                  onKeyUp={updateCursor}
                  onSelect={updateCursor}
                  onFocus={handleFocus}
                  onContextMenu={handleEditorContextMenu}
                  spellCheck={false}
                  className="editor-textarea relative w-full p-4 bg-transparent font-mono resize-none outline-none overflow-hidden whitespace-pre"
                  style={{ 
                    fontSize: `${fontSize}px`, 
                    lineHeight: '1.6',
                    height: `${codeHeight}px`,
                    wordBreak: 'break-all',
                    overflowWrap: 'break-word',
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-theme-muted h-full">
            <div className="text-center">
              <p className="text-lg mb-2">{LocalizationService.t('noFileOpen')}</p>
              <p className="text-sm">Open a file from the explorer or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Editor Context Menu */}
      {editorContextMenu && (
        <ContextMenu
          x={editorContextMenu.x}
          y={editorContextMenu.y}
          items={getEditorContextMenuItems()}
          onClose={() => setEditorContextMenu(null)}
        />
      )}
    </div>
  )
}

export function Editor() {
  const { editorGroups, splitDirection } = useStore()

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        useStore.getState().setShowFindReplace(true)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Single editor
  if (editorGroups.length === 1) {
    return (
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <EditorPane groupId={editorGroups[0].id} showToolbar />
      </div>
    )
  }

  // Split view
  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      {/* Toolbar for first group */}
      <div className="glass rounded-xl px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const state = useStore.getState()
              if (!state.isRunning) {
                state.clearOutput()
                state.setRunning(true)
                // Run logic here
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium gradient-btn text-white"
          >
            <Play className="w-3 h-3" /> Run
          </button>
          <button
            onClick={() => useStore.getState().closeSplit()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-theme-muted hover:bg-white/5"
          >
            <X className="w-4 h-4" /> Close Split
          </button>
        </div>
        <select
          value={useStore.getState().fontSize}
          onChange={(e) => useStore.getState().setFontSize(Number(e.target.value))}
          className="px-2 py-1 text-xs bg-theme-editor border border-theme rounded text-theme-secondary"
        >
          {[12, 14, 16, 18, 20].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>

      {/* Split Panes */}
      <div className={clsx(
        'flex-1 flex gap-2 min-h-0',
        splitDirection === 'horizontal' ? 'flex-col' : 'flex-row'
      )}>
        {editorGroups.map((group) => (
          <EditorPane key={group.id} groupId={group.id} showToolbar={false} />
        ))}
      </div>
    </div>
  )
}
