import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, FileCode, Check } from 'lucide-react'
import { useStore } from '../store/useStore'

// All supported programming languages with file extensions
export const LANGUAGES = [
  { id: 'geneia', name: 'Geneia', extensions: ['.gn', '.gns', '.gne'] },
  { id: 'int', name: 'INT (Geneia Internal)', extensions: ['.intcnf', '.intpkf'] },
  { id: 'javascript', name: 'JavaScript', extensions: ['.js', '.mjs', '.cjs'] },
  { id: 'typescript', name: 'TypeScript', extensions: ['.ts', '.mts', '.cts'] },
  { id: 'javascriptreact', name: 'JavaScript React', extensions: ['.jsx'] },
  { id: 'typescriptreact', name: 'TypeScript React', extensions: ['.tsx'] },
  { id: 'python', name: 'Python', extensions: ['.py', '.pyw', '.pyi'] },
  { id: 'java', name: 'Java', extensions: ['.java'] },
  { id: 'c', name: 'C', extensions: ['.c', '.h'] },
  { id: 'cpp', name: 'C++', extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh'] },
  { id: 'csharp', name: 'C#', extensions: ['.cs'] },
  { id: 'go', name: 'Go', extensions: ['.go'] },
  { id: 'rust', name: 'Rust', extensions: ['.rs'] },
  { id: 'swift', name: 'Swift', extensions: ['.swift'] },
  { id: 'kotlin', name: 'Kotlin', extensions: ['.kt', '.kts'] },
  { id: 'ruby', name: 'Ruby', extensions: ['.rb', '.erb'] },
  { id: 'php', name: 'PHP', extensions: ['.php'] },
  { id: 'html', name: 'HTML', extensions: ['.html', '.htm'] },
  { id: 'css', name: 'CSS', extensions: ['.css'] },
  { id: 'scss', name: 'SCSS', extensions: ['.scss'] },
  { id: 'less', name: 'Less', extensions: ['.less'] },
  { id: 'json', name: 'JSON', extensions: ['.json'] },
  { id: 'yaml', name: 'YAML', extensions: ['.yaml', '.yml'] },
  { id: 'xml', name: 'XML', extensions: ['.xml'] },
  { id: 'markdown', name: 'Markdown', extensions: ['.md', '.markdown'] },
  { id: 'sql', name: 'SQL', extensions: ['.sql'] },
  { id: 'shell', name: 'Shell Script', extensions: ['.sh', '.bash', '.zsh'] },
  { id: 'powershell', name: 'PowerShell', extensions: ['.ps1', '.psm1'] },
  { id: 'dockerfile', name: 'Dockerfile', extensions: ['Dockerfile'] },
  { id: 'lua', name: 'Lua', extensions: ['.lua'] },
  { id: 'perl', name: 'Perl', extensions: ['.pl', '.pm'] },
  { id: 'r', name: 'R', extensions: ['.r', '.R'] },
  { id: 'scala', name: 'Scala', extensions: ['.scala'] },
  { id: 'haskell', name: 'Haskell', extensions: ['.hs'] },
  { id: 'elixir', name: 'Elixir', extensions: ['.ex', '.exs'] },
  { id: 'clojure', name: 'Clojure', extensions: ['.clj', '.cljs'] },
  { id: 'dart', name: 'Dart', extensions: ['.dart'] },
  { id: 'vue', name: 'Vue', extensions: ['.vue'] },
  { id: 'svelte', name: 'Svelte', extensions: ['.svelte'] },
  { id: 'graphql', name: 'GraphQL', extensions: ['.graphql', '.gql'] },
  { id: 'toml', name: 'TOML', extensions: ['.toml'] },
  { id: 'ini', name: 'INI', extensions: ['.ini', '.cfg'] },
  { id: 'plaintext', name: 'Plain Text', extensions: ['.txt'] },
]

// Detect language from filename
export function detectLanguageFromFile(filename: string): string {
  const ext = '.' + filename.split('.').pop()?.toLowerCase()
  const lang = LANGUAGES.find(l => l.extensions.some(e => 
    e.toLowerCase() === ext.toLowerCase() || filename.toLowerCase() === e.toLowerCase()
  ))
  return lang?.id || 'plaintext'
}

interface LanguageSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LanguageSelectorModal({ isOpen, onClose }: LanguageSelectorModalProps) {
  const { currentFile } = useStore()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Get current file's language (check override first, then detect from file)
  const fileLanguageOverride = currentFile ? useStore.getState().getFileLanguage(currentFile) : undefined
  const currentLang = fileLanguageOverride || (currentFile ? detectLanguageFromFile(currentFile) : 'geneia')
  
  // Filter languages based on search
  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.id.toLowerCase().includes(search.toLowerCase()) ||
    lang.extensions.some(ext => ext.toLowerCase().includes(search.toLowerCase()))
  )

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filteredLanguages.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredLanguages[selectedIndex]) {
          handleSelectLanguage(filteredLanguages[selectedIndex].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredLanguages, selectedIndex])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleSelectLanguage = (langId: string) => {
    if (!currentFile) {
      onClose()
      return
    }

    const store = useStore.getState()
    const selectedLang = LANGUAGES.find(l => l.id === langId)
    
    if (selectedLang) {
      // Get the new extension (use first/primary extension)
      const newExt = selectedLang.extensions[0]
      
      // Get current file name without extension
      const lastDotIndex = currentFile.lastIndexOf('.')
      const baseName = lastDotIndex > 0 ? currentFile.substring(0, lastDotIndex) : currentFile
      const currentExt = lastDotIndex > 0 ? currentFile.substring(lastDotIndex) : ''
      
      // Check if extension needs to change
      const needsRename = !selectedLang.extensions.some(ext => 
        ext.toLowerCase() === currentExt.toLowerCase()
      )
      
      if (needsRename && newExt) {
        // Rename file with new extension
        const newFileName = baseName + newExt
        store.renameFile(currentFile, newFileName)
      }
      
      // Also set the language override (in case extension doesn't fully determine language)
      store.setFileLanguage(needsRename ? baseName + newExt : currentFile, langId)
    }
    
    onClose()
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-[600px] max-h-[60vh] bg-[var(--bg-primary)] border border-theme rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="p-3 border-b border-theme">
          <div className="flex items-center gap-3 px-3 py-2 bg-[var(--bg-editor)] rounded-lg">
            <Search className="w-4 h-4 text-theme-muted flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0) }}
              placeholder="Select Language Mode (type to filter)"
              className="flex-1 bg-transparent text-theme-primary text-sm outline-none placeholder:text-theme-muted"
            />
            {currentFile && (
              <span className="text-xs text-theme-muted">
                {currentFile}
              </span>
            )}
          </div>
        </div>

        {/* Language List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((lang, index) => (
              <button
                key={lang.id}
                onClick={() => handleSelectLanguage(lang.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                    : 'hover:bg-white/5 text-theme-secondary'
                }`}
              >
                <FileCode className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{lang.name}</span>
                    {lang.id === currentLang && (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    )}
                  </div>
                  <span className="text-xs text-theme-muted">
                    {lang.extensions.join(', ')}
                  </span>
                </div>
                {lang.id === currentLang && (
                  <span className="text-xs text-theme-muted">(current)</span>
                )}
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-theme-muted">
              <p className="text-sm">No languages found matching "{search}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-theme bg-[var(--bg-secondary)] flex items-center justify-between text-xs text-theme-muted">
          <span>
            {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-4">
            <span><kbd className="px-1.5 py-0.5 rounded bg-theme-editor">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-theme-editor">Enter</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-theme-editor">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Use portal to render at document body level (centered on screen, not in parent container)
  return createPortal(modalContent, document.body)
}
