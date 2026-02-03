import { X, Monitor, Type, Save, Keyboard, Info, Globe, Search, RefreshCw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { SUPPORTED_LANGUAGES, LocalizationService } from '../services/localization'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

// Restart Confirmation Modal
function RestartConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel,
  newLanguage 
}: { 
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  newLanguage: string
}) {
  if (!isOpen) return null

  const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === newLanguage)

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[var(--bg-primary)] border border-theme rounded-xl shadow-2xl w-[400px] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-[var(--accent-primary)]/20">
              <RefreshCw className="w-6 h-6 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-theme-primary">Restart Required</h3>
              <p className="text-sm text-theme-muted">Language change needs a restart</p>
            </div>
          </div>
          
          <p className="text-sm text-theme-secondary mb-4">
            To apply the new display language <span className="font-medium text-[var(--accent-primary)]">{langInfo?.nativeName}</span> ({langInfo?.name}), 
            the application needs to restart. Do you want to restart now?
          </p>

          <div className="p-3 bg-[var(--bg-secondary)] rounded-lg mb-4">
            <p className="text-xs text-theme-muted">
              Your unsaved changes will be preserved after restart.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-theme bg-[var(--bg-secondary)] flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            Later
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm gradient-btn text-white rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Restart Now
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { fontSize, setFontSize, language, setLanguage } = useStore()
  const [autoSave, setAutoSave] = useState(true)
  const [wordWrap, setWordWrap] = useState(false)
  const [minimap, setMinimap] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [languageSearch, setLanguageSearch] = useState('')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null)
  const t = LocalizationService.t

  const filteredLanguages = useMemo(() => {
    if (!languageSearch) return SUPPORTED_LANGUAGES
    const search = languageSearch.toLowerCase()
    return SUPPORTED_LANGUAGES.filter(
      lang => lang.name.toLowerCase().includes(search) || 
              lang.nativeName.toLowerCase().includes(search) ||
              lang.code.toLowerCase().includes(search)
    )
  }, [languageSearch])

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0]

  const handleLanguageSelect = async (code: string) => {
    if (code !== language) {
      // Pre-translate UI strings for the new language (happens in background)
      LocalizationService.preloadTranslations()
      setPendingLanguage(code)
      setShowRestartConfirm(true)
    }
    setShowLanguageDropdown(false)
    setLanguageSearch('')
  }

  const handleRestartConfirm = () => {
    if (pendingLanguage) {
      setLanguage(pendingLanguage)
      LocalizationService.setLanguage(pendingLanguage)
      setShowRestartConfirm(false)
      setPendingLanguage(null)
      // Reload the app to apply language changes
      window.location.reload()
    }
  }

  const handleRestartCancel = () => {
    setShowRestartConfirm(false)
    setPendingLanguage(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass rounded-2xl w-[500px] max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-lg font-semibold text-theme-primary">{t('settings')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-theme-muted" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Editor Section */}
          <div>
            <h3 className="text-sm font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Type className="w-4 h-4" /> Editor
            </h3>
            
            <div className="space-y-4">
              {/* Font Size */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-theme-secondary">{t('fontSize')}</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="px-3 py-1.5 bg-theme-editor border border-theme rounded-lg text-sm text-theme-primary"
                >
                  {[10, 12, 14, 16, 18, 20, 22, 24].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>

              {/* Word Wrap */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-theme-secondary">Word Wrap</label>
                <button
                  onClick={() => setWordWrap(!wordWrap)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    wordWrap ? 'bg-[var(--accent-primary)]' : 'bg-theme-editor'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    wordWrap ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-theme-secondary">Line Numbers</label>
                <button
                  onClick={() => setLineNumbers(!lineNumbers)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    lineNumbers ? 'bg-[var(--accent-primary)]' : 'bg-theme-editor'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    lineNumbers ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Minimap */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-theme-secondary">Minimap</label>
                <button
                  onClick={() => setMinimap(!minimap)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    minimap ? 'bg-[var(--accent-primary)]' : 'bg-theme-editor'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    minimap ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Save Section */}
          <div>
            <h3 className="text-sm font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Save className="w-4 h-4" /> Files
            </h3>
            
            <div className="space-y-4">
              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-theme-secondary">Auto Save</label>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    autoSave ? 'bg-[var(--accent-primary)]' : 'bg-theme-editor'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    autoSave ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div>
            <h3 className="text-sm font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" /> {t('language')}
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-theme-editor border border-theme rounded-lg text-sm text-theme-primary hover:border-[var(--accent-primary)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{currentLanguage.nativeName}</span>
                    <span className="text-theme-muted">({currentLanguage.name})</span>
                  </span>
                  <span className="text-xs text-theme-muted">{currentLanguage.code}</span>
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-secondary)] border border-theme rounded-lg shadow-xl z-50 max-h-64 overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-theme">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                        <input
                          type="text"
                          value={languageSearch}
                          onChange={(e) => setLanguageSearch(e.target.value)}
                          placeholder={t('search') + '...'}
                          className="w-full pl-8 pr-3 py-2 bg-theme-editor border border-theme rounded-lg text-sm text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-[var(--accent-primary)]"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    {/* Language List */}
                    <div className="overflow-y-auto max-h-48">
                      {filteredLanguages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                            lang.code === language ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'text-theme-primary'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.nativeName}</span>
                            <span className="text-theme-muted text-xs">({lang.name})</span>
                          </span>
                          <span className="text-xs text-theme-muted">{lang.code}</span>
                        </button>
                      ))}
                      {filteredLanguages.length === 0 && (
                        <div className="px-3 py-4 text-center text-sm text-theme-muted">
                          {t('noResults')}
                        </div>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="p-2 border-t border-theme text-xs text-theme-muted text-center">
                      {SUPPORTED_LANGUAGES.length} languages available
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-theme-muted">
                Changes the display language of the IDE interface. Some translations may be incomplete.
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Keyboard className="w-4 h-4" /> Keyboard Shortcuts
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-theme">
                <span className="text-theme-secondary">{t('runCode')}</span>
                <kbd className="px-2 py-1 bg-theme-editor rounded text-theme-muted">F5</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-theme">
                <span className="text-theme-secondary">{t('save')}</span>
                <kbd className="px-2 py-1 bg-theme-editor rounded text-theme-muted">Ctrl+S</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-theme">
                <span className="text-theme-secondary">{t('newFile')}</span>
                <kbd className="px-2 py-1 bg-theme-editor rounded text-theme-muted">Ctrl+N</kbd>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-theme-secondary">{t('format')}</span>
                <kbd className="px-2 py-1 bg-theme-editor rounded text-theme-muted">Shift+Alt+F</kbd>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-theme-primary mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> About
            </h3>
            <div className="p-4 bg-theme-editor rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <div>
                  <div className="font-semibold text-theme-primary">Geneia Studio</div>
                  <div className="text-xs text-theme-muted">Version 1.0.0</div>
                </div>
              </div>
              <p className="text-xs text-theme-muted mt-2">
                A modern IDE for the Geneia programming language.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 gradient-btn rounded-lg text-white text-sm font-medium"
          >
            {t('close')}
          </button>
        </div>
      </div>

      {/* Restart Confirmation Modal */}
      <RestartConfirmModal
        isOpen={showRestartConfirm}
        onConfirm={handleRestartConfirm}
        onCancel={handleRestartCancel}
        newLanguage={pendingLanguage || ''}
      />
    </div>
  )
}
