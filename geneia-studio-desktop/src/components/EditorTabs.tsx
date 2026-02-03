import { useState, useRef } from 'react'
import { X, Circle, SplitSquareHorizontal, SplitSquareVertical, ExternalLink, MoreHorizontal, Puzzle, Home, Settings, Keyboard } from 'lucide-react'
import { useStore } from '../store/useStore'
import { clsx } from 'clsx'
import { FileIcon } from '../services/fileIcons'
import { LocalizationService } from '../services/localization'

interface EditorTabsProps {
  groupId: string
}

export function EditorTabs({ groupId }: EditorTabsProps) {
  const { 
    files, 
    editorGroups, 
    activeGroupId,
    specialTabs,
    activeSpecialTab,
    openFile,
    closeFile, 
    closeAllFiles,
    closeOtherFiles,
    splitEditor,
    detachFile,
    setActiveGroup,
    closeSpecialTab,
    setActiveSpecialTab
  } = useStore()
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileName: string } | null>(null)
  const [draggedFile, setDraggedFile] = useState<string | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const t = LocalizationService.t

  const group = editorGroups.find(g => g.id === groupId)
  if (!group) return null

  const handleTabClick = (fileName: string) => {
    setActiveGroup(groupId)
    setActiveSpecialTab(null)
    openFile(fileName)
  }

  const handleSpecialTabClick = (tabId: string) => {
    setActiveGroup(groupId)
    setActiveSpecialTab(tabId)
  }

  const getSpecialTabIcon = (type: string) => {
    switch (type) {
      case 'extension': return Puzzle
      case 'welcome': return Home
      case 'settings': return Settings
      case 'keybindings': return Keyboard
      default: return Puzzle
    }
  }

  const handleCloseTab = (e: React.MouseEvent, fileName: string) => {
    e.stopPropagation()
    closeFile(fileName)
  }

  const handleContextMenu = (e: React.MouseEvent, fileName: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, fileName })
  }

  const handleDragStart = (e: React.DragEvent, fileName: string) => {
    setDraggedFile(fileName)
    e.dataTransfer.setData('text/plain', fileName)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const fileName = e.dataTransfer.getData('text/plain')
    if (fileName && draggedFile) {
      useStore.getState().moveFileToGroup(fileName, groupId)
    }
    setDraggedFile(null)
  }

  const isActive = activeGroupId === groupId

  return (
    <>
      <div 
        ref={tabsRef}
        className={clsx(
          'flex items-center gap-0.5 px-1 py-1 bg-theme-secondary/50 border-b overflow-x-auto scrollbar-thin',
          isActive ? 'border-[var(--accent-primary)]/30' : 'border-theme'
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => setActiveGroup(groupId)}
      >
        {group.openFiles.map(fileName => {
          const file = files.find(f => f.name === fileName)
          // File tab is only active if it's the active file AND no special tab is active
          const isActiveTab = group.activeFile === fileName && !activeSpecialTab
          
          return (
            <div
              key={fileName}
              draggable
              onDragStart={(e) => handleDragStart(e, fileName)}
              onClick={() => handleTabClick(fileName)}
              onContextMenu={(e) => handleContextMenu(e, fileName)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs cursor-pointer group transition-colors min-w-0',
                isActiveTab 
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
                onClick={(e) => handleCloseTab(e, fileName)}
                className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )
        })}
        
        {group.openFiles.length === 0 && specialTabs.length === 0 && (
          <div className="px-3 py-1.5 text-xs text-theme-muted italic">{t('noFileOpen')}</div>
        )}

        {/* Special Tabs (Extension Info, Welcome, etc.) */}
        {specialTabs.map(tab => {
          const Icon = getSpecialTabIcon(tab.type)
          const isActiveTab = activeSpecialTab === tab.id
          
          return (
            <div
              key={tab.id}
              onClick={() => handleSpecialTabClick(tab.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs cursor-pointer group transition-colors min-w-0',
                isActiveTab 
                  ? 'bg-theme-editor text-theme-primary border-t-2 border-t-[var(--accent-primary)]' 
                  : 'text-theme-muted hover:bg-theme-editor/50 hover:text-theme-secondary'
              )}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[120px]">{tab.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); closeSpecialTab(tab.id) }}
                className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )
        })}

        {/* Split buttons */}
        <div className="ml-auto flex items-center gap-1 px-2">
          <button
            onClick={() => splitEditor('vertical')}
            className="p-1 rounded hover:bg-white/10 text-theme-muted hover:text-theme-secondary"
            title="Split Right"
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => splitEditor('horizontal')}
            className="p-1 rounded hover:bg-white/10 text-theme-muted hover:text-theme-secondary"
            title="Split Down"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-[99990]" 
            onClick={() => setContextMenu(null)}
          />
          <div 
            className="fixed z-[99991] bg-theme-primary border border-theme rounded-lg shadow-xl py-1 min-w-[180px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => { closeFile(contextMenu.fileName); setContextMenu(null) }}
              className="w-full px-3 py-1.5 text-left text-sm text-theme-secondary hover:bg-white/5 flex items-center gap-2"
            >
              <X className="w-4 h-4" /> {t('close')}
            </button>
            <button
              onClick={() => { closeOtherFiles(contextMenu.fileName); setContextMenu(null) }}
              className="w-full px-3 py-1.5 text-left text-sm text-theme-secondary hover:bg-white/5 flex items-center gap-2"
            >
              <MoreHorizontal className="w-4 h-4" /> Close Others
            </button>
            <button
              onClick={() => { closeAllFiles(); setContextMenu(null) }}
              className="w-full px-3 py-1.5 text-left text-sm text-theme-secondary hover:bg-white/5 flex items-center gap-2"
            >
              <X className="w-4 h-4" /> {t('closeAll')}
            </button>
            <div className="border-t border-theme my-1" />
            <button
              onClick={() => { splitEditor('vertical'); setContextMenu(null) }}
              className="w-full px-3 py-1.5 text-left text-sm text-theme-secondary hover:bg-white/5 flex items-center gap-2"
            >
              <SplitSquareHorizontal className="w-4 h-4" /> Split Right
            </button>
            <button
              onClick={() => { splitEditor('horizontal'); setContextMenu(null) }}
              className="w-full px-3 py-1.5 text-left text-sm text-theme-secondary hover:bg-white/5 flex items-center gap-2"
            >
              <SplitSquareVertical className="w-4 h-4" /> Split Down
            </button>
            <div className="border-t border-theme my-1" />
            <button
              onClick={() => { detachFile(contextMenu.fileName); setContextMenu(null) }}
              className="w-full px-3 py-1.5 text-left text-sm text-theme-secondary hover:bg-white/5 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Open in New Window
            </button>
          </div>
        </>
      )}
    </>
  )
}
