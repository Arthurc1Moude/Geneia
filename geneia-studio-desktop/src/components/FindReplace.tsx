import { useState, useEffect, useRef } from 'react'
import { X, ChevronDown, ChevronUp, Replace, ReplaceAll, CaseSensitive, Regex } from 'lucide-react'
import { useStore } from '../store/useStore'
import { LocalizationService } from '../services/localization'

export function FindReplace() {
  const { code, setCode, showFindReplace, setShowFindReplace } = useStore()
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [showReplace, setShowReplace] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [currentMatch, setCurrentMatch] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = LocalizationService.t

  useEffect(() => {
    if (showFindReplace && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showFindReplace])

  useEffect(() => {
    if (!findText) {
      setTotalMatches(0)
      setCurrentMatch(0)
      return
    }

    try {
      const flags = caseSensitive ? 'g' : 'gi'
      const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const pattern = useRegex ? findText : escaped
      const regex = new RegExp(pattern, flags)
      const matches = code.match(regex)
      setTotalMatches(matches?.length || 0)
      if (matches && matches.length > 0) {
        setCurrentMatch(1)
      } else {
        setCurrentMatch(0)
      }
    } catch {
      setTotalMatches(0)
      setCurrentMatch(0)
    }
  }, [findText, code, caseSensitive, useRegex])

  const handleReplace = () => {
    if (!findText || totalMatches === 0) return
    
    try {
      const flags = caseSensitive ? '' : 'i'
      const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const pattern = useRegex ? findText : escaped
      const regex = new RegExp(pattern, flags)
      setCode(code.replace(regex, replaceText))
    } catch {
      // Invalid regex
    }
  }

  const handleReplaceAll = () => {
    if (!findText || totalMatches === 0) return
    
    try {
      const flags = caseSensitive ? 'g' : 'gi'
      const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const pattern = useRegex ? findText : escaped
      const regex = new RegExp(pattern, flags)
      setCode(code.replace(regex, replaceText))
    } catch {
      // Invalid regex
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowFindReplace(false)
    } else if (e.key === 'Enter' && e.shiftKey) {
      handleReplace()
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleReplaceAll()
    }
  }

  if (!showFindReplace) return null

  return (
    <div className="absolute top-2 right-4 z-[9000] glass rounded-lg border border-theme shadow-xl p-2 min-w-[320px]">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowReplace(!showReplace)}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
        >
          {showReplace ? (
            <ChevronUp className="w-4 h-4 text-theme-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-theme-muted" />
          )}
        </button>

        <div className="flex-1 flex items-center gap-1 bg-[var(--bg-editor)] rounded border border-theme px-2">
          <input
            ref={inputRef}
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('find')}
            className="flex-1 bg-transparent py-1.5 text-sm text-theme-primary outline-none"
          />
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={`p-1 rounded ${caseSensitive ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'text-theme-muted hover:bg-black/10 dark:hover:bg-white/10'}`}
            title="Match Case"
          >
            <CaseSensitive className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setUseRegex(!useRegex)}
            className={`p-1 rounded ${useRegex ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'text-theme-muted hover:bg-black/10 dark:hover:bg-white/10'}`}
            title="Use Regular Expression"
          >
            <Regex className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-xs text-theme-muted min-w-[60px] text-center">
          {totalMatches > 0 ? `${currentMatch} of ${totalMatches}` : t('noResults')}
        </span>

        <button
          onClick={() => setShowFindReplace(false)}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="w-4 h-4 text-theme-muted" />
        </button>
      </div>

      {showReplace && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6" />
          
          <div className="flex-1 bg-[var(--bg-editor)] rounded border border-theme px-2">
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('replace')}
              className="w-full bg-transparent py-1.5 text-sm text-theme-primary outline-none"
            />
          </div>

          <button
            onClick={handleReplace}
            disabled={totalMatches === 0}
            className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50"
            title="Replace (Shift+Enter)"
          >
            <Replace className="w-4 h-4 text-theme-secondary" />
          </button>
          <button
            onClick={handleReplaceAll}
            disabled={totalMatches === 0}
            className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50"
            title="Replace All (Ctrl+Enter)"
          >
            <ReplaceAll className="w-4 h-4 text-theme-secondary" />
          </button>
        </div>
      )}
    </div>
  )
}
