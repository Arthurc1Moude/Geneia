import { useState } from 'react'
import { Search, FileCode, Replace, CaseSensitive, WholeWord } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { LocalizationService } from '../../services/localization'

export function SearchPanel() {
  const { files, code, switchFile, setCode } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [showReplace, setShowReplace] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [results, setResults] = useState<Array<{ file: string; line: number; text: string; index: number }>>([])
  const t = LocalizationService.t

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const newResults: typeof results = []
    
    files.forEach(file => {
      const lines = file.content.split('\n')
      lines.forEach((line, lineIndex) => {
        const searchIn = caseSensitive ? line : line.toLowerCase()
        const searchFor = caseSensitive ? searchQuery : searchQuery.toLowerCase()
        
        if (wholeWord) {
          const regex = new RegExp(`\\b${searchFor}\\b`, caseSensitive ? 'g' : 'gi')
          if (regex.test(line)) {
            newResults.push({
              file: file.name,
              line: lineIndex + 1,
              text: line.trim(),
              index: line.indexOf(searchQuery)
            })
          }
        } else if (searchIn.includes(searchFor)) {
          newResults.push({
            file: file.name,
            line: lineIndex + 1,
            text: line.trim(),
            index: searchIn.indexOf(searchFor)
          })
        }
      })
    })

    setResults(newResults)
  }

  const handleReplace = () => {
    if (!searchQuery || !replaceQuery) return
    const newCode = code.split(searchQuery).join(replaceQuery)
    setCode(newCode)
    handleSearch()
  }

  const handleReplaceAll = () => {
    if (!searchQuery || !replaceQuery) return
    files.forEach(file => {
      if (file.content.includes(searchQuery)) {
        switchFile(file.name)
        const newContent = file.content.split(searchQuery).join(replaceQuery)
        setCode(newContent)
      }
    })
    handleSearch()
  }

  return (
    <div className="w-64 glass border-r border-theme flex flex-col overflow-hidden">
      <div className="p-3 border-b border-theme">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-theme-muted" />
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
              {t('search')}
            </span>
          </div>
          <button
            onClick={() => setShowReplace(!showReplace)}
            className={`p-1 rounded ${showReplace ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-black/10 dark:hover:bg-white/10 text-theme-muted'}`}
            title={t('replace')}
          >
            <Replace className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('search') + '...'}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-theme-editor border border-theme rounded-lg text-theme-primary placeholder:text-theme-muted focus:border-[var(--accent-primary)] outline-none"
          />
        </div>

        {/* Replace Input */}
        {showReplace && (
          <div className="relative mb-2">
            <Replace className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder={t('replace') + '...'}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-theme-editor border border-theme rounded-lg text-theme-primary placeholder:text-theme-muted focus:border-[var(--accent-primary)] outline-none"
            />
          </div>
        )}

        {/* Options */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={`p-1.5 rounded ${caseSensitive ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'text-theme-muted hover:bg-black/5 dark:hover:bg-white/5'}`}
            title="Case Sensitive"
          >
            <CaseSensitive className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWholeWord(!wholeWord)}
            className={`p-1.5 rounded ${wholeWord ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'text-theme-muted hover:bg-black/5 dark:hover:bg-white/5'}`}
            title="Whole Word"
          >
            <WholeWord className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="flex-1 py-1.5 text-xs gradient-btn rounded-lg text-white"
          >
            {t('search')}
          </button>
          {showReplace && (
            <>
              <button
                onClick={handleReplace}
                className="px-3 py-1.5 text-xs bg-theme-editor border border-theme rounded-lg text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t('replace')}
              </button>
              <button
                onClick={handleReplaceAll}
                className="px-3 py-1.5 text-xs bg-theme-editor border border-theme rounded-lg text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5"
              >
                All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-2">
        {results.length > 0 ? (
          <div className="space-y-1">
            <div className="text-xs text-theme-muted px-2 py-1">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            {results.map((result, i) => (
              <button
                key={i}
                onClick={() => switchFile(result.file)}
                className="w-full text-left p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs text-theme-secondary mb-1">
                  <FileCode className="w-3 h-3" />
                  <span className="font-mono">{result.file}</span>
                  <span className="text-theme-muted">:{result.line}</span>
                </div>
                <div className="text-xs text-theme-primary font-mono truncate">
                  {result.text}
                </div>
              </button>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center text-theme-muted text-xs py-8">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            {t('noResults')}
          </div>
        ) : (
          <div className="text-center text-theme-muted text-xs py-8">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Enter a search term
          </div>
        )}
      </div>
    </div>
  )
}
