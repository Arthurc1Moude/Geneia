/**
 * Keyboard Shortcuts Modal - Glass UI Design
 */

import { useState, useEffect } from 'react'
import { X, Search, RotateCcw, Keyboard, Edit2, Check, AlertCircle, Command, Sparkles } from 'lucide-react'
import { 
  keyboardShortcuts, 
  CATEGORY_LABELS, 
  formatShortcutCrossPlatform,
  type KeyboardShortcut 
} from '../services/keyboardShortcuts'
import { clsx } from 'clsx'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [recordedKeys, setRecordedKeys] = useState<string[]>([])
  const [conflict, setConflict] = useState<string | null>(null)

  const shortcuts = keyboardShortcuts.getAll()
  
  const filteredShortcuts = shortcuts.filter(s => {
    const matchesSearch = search === '' || 
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.keys.join(' ').toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || s.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedShortcuts = filteredShortcuts.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  useEffect(() => {
    if (!editingId) return

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const keys: string[] = []
      if (e.ctrlKey || e.metaKey) keys.push('Ctrl')
      if (e.altKey) keys.push('Alt')
      if (e.shiftKey) keys.push('Shift')
      
      const key = e.key
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
        keys.push(key.length === 1 ? key.toUpperCase() : key)
      }

      if (keys.length > 0) {
        setRecordedKeys(keys)
        const conflictId = keyboardShortcuts.isKeyUsed(keys, editingId)
        setConflict(conflictId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingId])


  const startEditing = (id: string, currentKeys: string[]) => {
    setEditingId(id)
    setRecordedKeys(currentKeys)
    setConflict(null)
    keyboardShortcuts.setEnabled(false)
  }

  const saveEdit = () => {
    if (editingId && recordedKeys.length > 0 && !conflict) {
      keyboardShortcuts.updateKeys(editingId, recordedKeys)
    }
    cancelEdit()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setRecordedKeys([])
    setConflict(null)
    keyboardShortcuts.setEnabled(true)
  }

  const resetShortcut = (id: string) => {
    keyboardShortcuts.resetToDefault(id)
  }

  const resetAll = () => {
    if (confirm('Reset all keyboard shortcuts to defaults?')) {
      keyboardShortcuts.resetAllToDefault()
    }
  }

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !editingId) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose, editingId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-[900px] max-h-[85vh] glass rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[var(--accent-primary)]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[var(--accent-secondary)]/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="relative p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/25">
                <Keyboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-theme-primary">Keyboard Shortcuts</h2>
                <p className="text-xs text-theme-muted">Customize your workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="px-3 py-1.5 text-xs text-theme-muted hover:text-theme-primary glass hover:bg-white/10 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg glass hover:bg-white/10 text-theme-muted hover:text-theme-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="relative p-4 border-b border-white/10">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted z-10" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search shortcuts..."
                className="w-full pl-10 pr-4 py-2.5 glass border border-white/10 rounded-xl text-sm text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
              />
            </div>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2.5 glass border border-white/10 rounded-xl text-sm text-theme-primary focus:outline-none focus:border-[var(--accent-primary)]/50 cursor-pointer"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>


        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedShortcuts).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                <h3 className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  {CATEGORY_LABELS[category] || category}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              
              <div className="grid gap-2">
                {items.map(shortcut => (
                  <div
                    key={shortcut.id}
                    className={clsx(
                      'group flex items-center justify-between p-3 rounded-xl transition-all',
                      editingId === shortcut.id 
                        ? 'glass border-2 border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/10' 
                        : 'glass border border-transparent hover:border-white/10 hover:bg-white/5'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-theme-primary font-medium">{shortcut.description}</div>
                      <div className="text-xs text-theme-muted font-mono truncate">{shortcut.id}</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {editingId === shortcut.id ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className={clsx(
                              'px-4 py-2 rounded-lg text-sm font-mono min-w-[140px] text-center transition-all',
                              conflict 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                : 'glass border border-[var(--accent-primary)]/30 text-[var(--accent-primary)]'
                            )}>
                              {recordedKeys.length > 0 ? formatShortcutCrossPlatform(recordedKeys) : (
                                <span className="text-theme-muted animate-pulse">Press keys...</span>
                              )}
                            </div>
                            {conflict && (
                              <div className="flex items-center gap-1 text-xs text-red-400">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Conflict</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={saveEdit}
                              disabled={recordedKeys.length === 0 || !!conflict}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <kbd className="px-3 py-1.5 glass border border-white/10 rounded-lg text-xs font-mono text-theme-secondary shadow-sm">
                            {formatShortcutCrossPlatform(shortcut.keys)}
                          </kbd>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(shortcut.id, shortcut.keys)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-theme-muted hover:text-[var(--accent-primary)] transition-all"
                              title="Edit shortcut"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => resetShortcut(shortcut.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-theme-muted hover:text-theme-primary transition-all"
                              title="Reset to default"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {filteredShortcuts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass border border-white/10 flex items-center justify-center">
                <Keyboard className="w-8 h-8 text-theme-muted" />
              </div>
              <p className="text-theme-muted">No shortcuts found</p>
              <p className="text-xs text-theme-muted mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative p-4 border-t border-white/10 glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-theme-muted">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Click edit to customize shortcuts</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-theme-muted">
              <span>{shortcuts.length} shortcuts</span>
              <span className="flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>Press Esc to close</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}