import { useState } from 'react'
import {
  Plus,
  ChevronRight,
  Book,
  Zap,
  Trash2,
  FolderOpen,
  AlertTriangle,
  Edit3,
  Copy,
  FileText,
  ExternalLink
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { clsx } from 'clsx'
import { InputModal } from './InputModal'
import { notify } from '../store/notificationStore'
import { FileIcon, isBinaryFile, getFileIcon } from '../services/fileIcons'
import { LocalizationService } from '../services/localization'
import { ContextMenu, type ContextMenuItem } from './ContextMenu'

interface SidebarProps {
  onClose: () => void
}

const examples = [
  { name: 'Hello World', code: `! Hello World !\n\n"Welcome to Geneia!"\n\npeat 'Hello, World!'\n\nexit (0)\n` },
  { name: 'Variables', code: `! Variables Demo !\n\nvar {name} = 'Alice'\nhold (age) = (25)\n\npeat 'Name: '\npeat {name}\n\nexit (0)\n` },
  { name: 'Loops', code: `! Loops Demo !\n\npeat 'Counting:'\nturn (5) {\n    peat '  * tick'\n}\n\npeat 'Done!'\nexit (0)\n` },
  { name: 'Timed Repeat', code: `! Timed Repeat !\n\npeat 'Starting...'\nrepeat 'Loading...' & t.s = (3)\npeat 'Complete!'\n\nexit (0)\n` },
]

const quickRef = [
  { syntax: 'peat', desc: 'Print output' },
  { syntax: 'var {x}', desc: 'String variable' },
  { syntax: 'hold (x)', desc: 'Number variable' },
  { syntax: 'turn (n)', desc: 'Loop n times' },
  { syntax: 'repeat', desc: 'Timed repeat' },
  { syntax: '! ... !', desc: 'Comment' },
  { syntax: '"..."', desc: 'Tip message' },
  { syntax: 'exit (0)', desc: 'Exit program' },
]

export function Sidebar({ onClose: _onClose }: SidebarProps) {
  const { files, currentFile, openFile, createFile, deleteFile, setCode, renameFile, duplicateFile } = useStore()
  const [showNewFileModal, setShowNewFileModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState<{ show: boolean; filename: string }>({ show: false, filename: '' })
  const [binaryWarning, setBinaryWarning] = useState<{ show: boolean; filename: string }>({ show: false, filename: '' })
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; filename: string } | null>(null)
  const t = LocalizationService.t

  const handleCreateFile = (name: string) => {
    // Only add .gn if user didn't provide any extension
    const hasExtension = name.includes('.')
    const finalName = hasExtension ? name : `${name}.gn`
    createFile(finalName)
    notify.success('File Created', `Created ${finalName}`, 'system')
    setShowNewFileModal(false)
  }

  const handleRenameFile = (newName: string) => {
    if (showRenameModal.filename && newName) {
      renameFile(showRenameModal.filename, newName)
      notify.success('File Renamed', `Renamed to ${newName}`, 'system')
    }
    setShowRenameModal({ show: false, filename: '' })
  }

  const handleOpenFile = (filename: string) => {
    if (isBinaryFile(filename)) {
      setBinaryWarning({ show: true, filename })
    } else {
      openFile(filename)
    }
  }

  const handleFileContextMenu = (e: React.MouseEvent, filename: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, filename })
  }

  const getFileContextMenuItems = (filename: string): ContextMenuItem[] => [
    {
      id: 'open',
      label: t('open') || 'Open',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => handleOpenFile(filename)
    },
    {
      id: 'open-side',
      label: 'Open to the Side',
      icon: <ExternalLink className="w-4 h-4" />,
      onClick: () => {
        handleOpenFile(filename)
        useStore.getState().splitEditor('vertical')
      }
    },
    { id: 'divider1', label: '', divider: true },
    {
      id: 'rename',
      label: t('rename') || 'Rename',
      icon: <Edit3 className="w-4 h-4" />,
      shortcut: 'F2',
      onClick: () => setShowRenameModal({ show: true, filename })
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy className="w-4 h-4" />,
      onClick: () => {
        duplicateFile(filename)
        notify.success('File Duplicated', `Duplicated ${filename}`, 'system')
      }
    },
    { id: 'divider2', label: '', divider: true },
    {
      id: 'delete',
      label: t('delete') || 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      disabled: files.length <= 1,
      onClick: () => {
        deleteFile(filename)
        notify.info('File Deleted', `Deleted ${filename}`, 'system')
      }
    }
  ]

  const forceOpenBinary = () => {
    openFile(binaryWarning.filename)
    setBinaryWarning({ show: false, filename: '' })
    notify.warning('Binary File', 'Opening binary file may show corrupted content', 'system')
  }

  const loadExample = (code: string) => {
    setCode(code)
  }

  return (
    <div className="w-64 glass border-r border-theme flex flex-col overflow-hidden">
      {/* Files Section */}
      <div className="p-3 border-b border-theme">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-theme-muted" />
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
              {t('explorer')}
            </span>
          </div>
          <button
            onClick={() => setShowNewFileModal(true)}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title={t('newFile')}
          >
            <Plus className="w-4 h-4 text-theme-secondary" />
          </button>
        </div>

        <div className="space-y-1">
          {files.map((file) => {
            const iconConfig = getFileIcon(file.name)
            const isBinary = isBinaryFile(file.name)
            return (
            <div
              key={file.name}
              onContextMenu={(e) => handleFileContextMenu(e, file.name)}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all group',
                file.name === currentFile
                  ? 'bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)]'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-theme-secondary'
              )}
            >
              <button
                onClick={() => handleOpenFile(file.name)}
                className="flex items-center gap-2 flex-1 text-left"
                title={`${iconConfig.label}${isBinary ? ' (Binary)' : ''}`}
              >
                <FileIcon filename={file.name} />
                <span className="truncate">{file.name}</span>
                {file.isModified && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                )}
                {isBinary && (
                  <span title="Binary file">
                    <AlertTriangle className="w-3 h-3 text-yellow-400" />
                  </span>
                )}
              </button>
              {files.length > 1 && (
                <button
                  onClick={() => deleteFile(file.name)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-theme-muted hover:text-red-400 transition-all"
                  title={t('delete')}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )})}
        </div>
      </div>

      {/* Examples Section */}
      <div className="p-3 border-b border-theme">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-theme-muted" />
          <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
            Examples
          </span>
        </div>
        <div className="space-y-1">
          {examples.map((example) => (
            <button
              key={example.name}
              onClick={() => loadExample(example.code)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-left text-xs text-theme-muted hover:text-theme-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
              {example.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Book className="w-4 h-4 text-theme-muted" />
          <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
            Quick Reference
          </span>
        </div>
        <div className="space-y-2">
          {quickRef.map((item) => (
            <div key={item.syntax} className="flex items-center gap-2 text-xs">
              <code className="px-1.5 py-0.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded font-mono">
                {item.syntax}
              </code>
              <span className="text-theme-muted">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New File Modal */}
      <InputModal
        isOpen={showNewFileModal}
        title={t('newFile')}
        placeholder="Enter file name (e.g., myfile.gn)"
        onConfirm={handleCreateFile}
        onCancel={() => setShowNewFileModal(false)}
      />

      {/* Binary File Warning Modal */}
      {binaryWarning.show && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-primary)] border border-theme rounded-2xl shadow-2xl p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-theme-primary">Binary File</h3>
                <p className="text-sm text-theme-muted">Cannot open this file</p>
              </div>
            </div>
            <p className="text-sm text-theme-secondary mb-4">
              <strong>{binaryWarning.filename}</strong> appears to be a binary file. 
              Opening it may display corrupted or unreadable content.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setBinaryWarning({ show: false, filename: '' })}
                className="px-4 py-2 rounded-lg text-sm text-theme-secondary hover:bg-white/5"
              >
                {t('cancel')}
              </button>
              <button
                onClick={forceOpenBinary}
                className="px-4 py-2 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              >
                Open Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getFileContextMenuItems(contextMenu.filename)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Rename File Modal */}
      <InputModal
        isOpen={showRenameModal.show}
        title={t('rename') || 'Rename File'}
        placeholder="Enter new file name (including extension)"
        defaultValue={showRenameModal.filename}
        onConfirm={handleRenameFile}
        onCancel={() => setShowRenameModal({ show: false, filename: '' })}
      />
    </div>
  )
}
