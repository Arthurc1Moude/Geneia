import { useState, useRef, useEffect } from 'react'
import { X, Minus, Square, Maximize2, ArrowLeftToLine, Circle } from 'lucide-react'
import { useStore, DetachedWindow as DetachedWindowType } from '../store/useStore'
import { clsx } from 'clsx'
import { FileIcon } from '../services/fileIcons'
import { highlightCode, detectLanguageFromFilename } from '../services/syntaxHighlighter'

interface DetachedWindowProps {
  window: DetachedWindowType
}

export function DetachedWindow({ window }: DetachedWindowProps) {
  const { 
    files, 
    attachFile, 
    closeDetachedWindow,
    closeFileInDetachedWindow,
    setActiveFileInDetachedWindow,
    updateDetachedWindow, 
    theme 
  } = useStore()
  
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [localCodes, setLocalCodes] = useState<Record<string, string>>({})
  const windowRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Get current active file
  const activeFile = files.find(f => f.name === window.activeFile)
  const currentCode = localCodes[window.activeFile] ?? activeFile?.content ?? ''

  // Initialize local codes for all open files
  useEffect(() => {
    const codes: Record<string, string> = {}
    window.openFiles.forEach(fileName => {
      const file = files.find(f => f.name === fileName)
      if (file && !localCodes[fileName]) {
        codes[fileName] = file.content
      }
    })
    if (Object.keys(codes).length > 0) {
      setLocalCodes(prev => ({ ...prev, ...codes }))
    }
  }, [window.openFiles, files])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return
    if ((e.target as HTMLElement).closest('.tab-bar')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - window.x,
      y: e.clientY - window.y
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      updateDetachedWindow(window.id, {
        x: Math.max(0, e.clientX - dragOffset.x),
        y: Math.max(0, e.clientY - dragOffset.y)
      })
    }
    if (isResizing && !isMaximized) {
      updateDetachedWindow(window.id, {
        width: Math.max(400, e.clientX - window.x),
        height: Math.max(300, e.clientY - window.y)
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragOffset])

  const handleCodeChange = (newCode: string) => {
    setLocalCodes(prev => ({ ...prev, [window.activeFile]: newCode }))
    // Update the file in store
    useStore.setState(state => ({
      files: state.files.map(f => 
        f.name === window.activeFile 
          ? { ...f, content: newCode, isModified: true }
          : f
      )
    }))
  }

  const handleTabClick = (fileName: string) => {
    setActiveFileInDetachedWindow(window.id, fileName)
  }

  const handleTabClose = (e: React.MouseEvent, fileName: string) => {
    e.stopPropagation()
    closeFileInDetachedWindow(window.id, fileName)
  }

  const handleCloseWindow = () => {
    // Close the window - files are closed too (not reopened in main)
    closeDetachedWindow(window.id)
  }

  if (isMinimized) {
    return (
      <div 
        className={clsx('fixed bottom-12 glass rounded-lg shadow-2xl border border-theme overflow-hidden', theme)}
        style={{ left: window.x, width: 200 }}
      >
        <div 
          className="px-3 py-2 bg-theme-secondary/80 flex items-center justify-between cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <span className="text-xs text-theme-primary truncate">
            {window.openFiles.length} file{window.openFiles.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1 window-controls">
            <button onClick={() => setIsMinimized(false)} className="p-1 rounded hover:bg-white/10">
              <Maximize2 className="w-3 h-3 text-theme-muted" />
            </button>
            <button onClick={handleCloseWindow} className="p-1 rounded hover:bg-red-500/20">
              <X className="w-3 h-3 text-theme-muted" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const windowStyle = isMaximized 
    ? { left: 0, top: 0, width: '100vw', height: '100vh' }
    : { left: window.x, top: window.y, width: window.width, height: window.height }

  const language = window.activeFile ? detectLanguageFromFilename(window.activeFile) : 'geneia'
  const highlightedCode = highlightCode(currentCode, language)

  return (
    <div 
      ref={windowRef}
      className={clsx(
        'fixed glass rounded-xl shadow-2xl border border-theme overflow-hidden flex flex-col z-[9000]',
        theme,
        isDragging && 'cursor-grabbing'
      )}
      style={windowStyle}
    >
      {/* Title Bar */}
      <div 
        className="px-3 py-2 bg-theme-secondary/80 flex items-center justify-between cursor-grab border-b border-theme"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-theme-primary font-medium">
            Geneia Editor
          </span>
          <span className="text-xs text-theme-muted">
            ({window.openFiles.length} file{window.openFiles.length !== 1 ? 's' : ''})
          </span>
        </div>
        <div className="flex items-center gap-1 window-controls">
          <button 
            onClick={() => attachFile(window.id)} 
            className="p-1.5 rounded hover:bg-white/10"
            title="Attach all files to main window"
          >
            <ArrowLeftToLine className="w-3.5 h-3.5 text-theme-muted" />
          </button>
          <button 
            onClick={() => setIsMinimized(true)} 
            className="p-1.5 rounded hover:bg-white/10"
          >
            <Minus className="w-3.5 h-3.5 text-theme-muted" />
          </button>
          <button 
            onClick={() => setIsMaximized(!isMaximized)} 
            className="p-1.5 rounded hover:bg-white/10"
          >
            {isMaximized ? <Square className="w-3 h-3 text-theme-muted" /> : <Maximize2 className="w-3.5 h-3.5 text-theme-muted" />}
          </button>
          <button 
            onClick={handleCloseWindow} 
            className="p-1.5 rounded hover:bg-red-500/20"
            title="Close window (files will be closed)"
          >
            <X className="w-3.5 h-3.5 text-theme-muted" />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar flex items-center gap-0.5 px-1 py-1 bg-theme-secondary/30 border-b border-theme overflow-x-auto">
        {window.openFiles.map(fileName => {
          const file = files.find(f => f.name === fileName)
          const isActive = window.activeFile === fileName
          
          return (
            <div
              key={fileName}
              onClick={() => handleTabClick(fileName)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs cursor-pointer group transition-colors min-w-0',
                isActive 
                  ? 'bg-theme-editor text-theme-primary border-t-2 border-t-[var(--accent-primary)]' 
                  : 'text-theme-muted hover:bg-theme-editor/50 hover:text-theme-secondary'
              )}
            >
              <FileIcon filename={fileName} className="w-3.5 h-3.5 flex-shrink-0" />
              {file?.isModified && (
                <Circle className="w-2 h-2 fill-[var(--accent-primary)] text-[var(--accent-primary)] flex-shrink-0" />
              )}
              <span className="truncate max-w-[120px]">{fileName}</span>
              <button
                onClick={(e) => handleTabClose(e, fileName)}
                className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Editor Content */}
      <div 
        ref={editorRef}
        className="flex-1 overflow-auto relative bg-theme-editor"
      >
        {window.openFiles.length > 0 ? (
          <div className="flex" style={{ minHeight: '100%' }}>
            {/* Line Numbers */}
            <div className="py-3 px-2 bg-theme-editor border-r border-theme text-right select-none text-xs flex-shrink-0 sticky left-0 z-10">
              {currentCode.split('\n').map((_, i) => (
                <div key={i} className="text-theme-muted font-mono leading-6">{i + 1}</div>
              ))}
            </div>

            {/* Code Area */}
            <div className="flex-1 relative min-w-0">
              <div
                className="absolute inset-0 p-3 font-mono text-sm whitespace-pre pointer-events-none select-none overflow-hidden leading-6"
                style={{ 
                  height: `${Math.max(currentCode.split('\n').length * 24 + 24, 100)}px`,
                  wordBreak: 'break-all',
                  overflowWrap: 'break-word',
                }}
                dangerouslySetInnerHTML={{ __html: highlightedCode + '\n' }}
              />
              
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
                className="editor-textarea relative w-full p-3 bg-transparent font-mono text-sm resize-none outline-none leading-6 overflow-hidden whitespace-pre"
                style={{ 
                  height: `${Math.max(currentCode.split('\n').length * 24 + 24, 100)}px`,
                  minHeight: '100%',
                  wordBreak: 'break-all',
                  overflowWrap: 'break-word',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-theme-muted">
            <p>No files open</p>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1 bg-theme-secondary/50 border-t border-theme flex items-center justify-between text-xs text-theme-muted">
        <span>{window.activeFile || 'No file'}</span>
        <span className="capitalize">{language}</span>
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => { e.stopPropagation(); setIsResizing(true) }}
        >
          <svg className="w-4 h-4 text-theme-muted" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22 22H20V20H22V22M22 18H20V16H22V18M18 22H16V20H18V22M18 18H16V16H18V18M14 22H12V20H14V22M22 14H20V12H22V14Z" />
          </svg>
        </div>
      )}
    </div>
  )
}
