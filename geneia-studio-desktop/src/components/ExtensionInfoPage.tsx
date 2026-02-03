import { useState } from 'react'
import { 
  Puzzle, 
  Download, 
  Star, 
  Check, 
  ExternalLink, 
  Calendar, 
  Tag, 
  User, 
  FileCode,
  Book,
  MessageSquare,
  Loader2,
  Power,
  PowerOff,
  Trash2,
  Zap,
  Code,
  FileText,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import { useStore, SpecialTab } from '../store/useStore'
import { toast } from './Toast'
import { clsx } from 'clsx'
import { ExtensionRuntime } from '../services/extensionRuntime'

interface ExtensionData {
  id: string
  name: string
  displayName: string
  publisher: string
  publisherDisplayName: string
  version: string
  description: string
  shortDescription: string
  installs: number
  rating: number
  ratingCount: number
  lastUpdated: string
  categories: string[]
  tags: string[]
  repository?: string
  homepage?: string
  bugs?: string
  readme?: string
  iconUrl?: string
}

interface ExtensionInfoPageProps {
  tab: SpecialTab
}

export function ExtensionInfoPage({ tab }: ExtensionInfoPageProps) {
  const { installedExtensions, installExtension, uninstallExtension, toggleExtension, isExtensionInstalled } = useStore()
  const [activeSection, setActiveSection] = useState<'details' | 'features' | 'changelog' | 'dependencies'>('details')
  const [isInstalling, setIsInstalling] = useState(false)
  const [iconFailed, setIconFailed] = useState(false)

  const extData = tab.data as ExtensionData | undefined
  if (!extData) {
    return (
      <div className="flex-1 flex items-center justify-center text-theme-muted">
        <p>Extension data not available</p>
      </div>
    )
  }

  const installed = isExtensionInstalled(extData.id)
  const installedExt = installedExtensions.find(e => e.id === extData.id)
  const hasBuiltIn = ExtensionRuntime.hasBuiltInSupport(extData.id)
  const isActive = ExtensionRuntime.isActive(extData.id)
  const contribution = ExtensionRuntime.getContribution(extData.id)

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      installExtension({
        id: extData.id,
        name: extData.name,
        displayName: extData.displayName,
        publisher: extData.publisherDisplayName,
        version: extData.version,
        description: extData.shortDescription,
        installedAt: Date.now(),
        enabled: true,
        iconUrl: extData.iconUrl
      })
      toast.success('Installed', `${extData.displayName} has been installed`)
    } catch {
      toast.error('Install Failed', `Could not install ${extData.displayName}`)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleUninstall = async () => {
    setIsInstalling(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      uninstallExtension(extData.id)
      toast.info('Uninstalled', `${extData.displayName} has been removed`)
    } catch {
      toast.error('Uninstall Failed', 'Could not uninstall extension')
    } finally {
      setIsInstalling(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-theme-editor">
      {/* Header */}
      <div className="p-6 border-b border-theme bg-theme-secondary/30">
        <div className="flex items-start gap-6">
          {/* Extension Icon */}
          <div className="relative w-20 h-20 flex-shrink-0 group">
            {extData.iconUrl && !iconFailed ? (
              <img 
                src={extData.iconUrl} 
                alt={extData.displayName}
                className="w-20 h-20 rounded-2xl object-cover shadow-xl"
                onError={() => setIconFailed(true)}
              />
            ) : (
              <>
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-50 blur-md group-hover:opacity-75 transition-opacity" />
                {/* Main icon */}
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                  {/* Inner highlight */}
                  <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                  <Puzzle className="w-10 h-10 text-white drop-shadow-lg relative z-10" />
                  {/* Sparkle */}
                  <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full opacity-80 animate-pulse" />
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-theme-primary">{extData.displayName}</h1>
              {installed && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Installed
                </span>
              )}
              {hasBuiltIn && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Native Support
                </span>
              )}
              {isActive && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400 flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3" /> Running
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-theme-muted mb-3">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {extData.publisherDisplayName}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                v{extData.version}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {formatNumber(extData.installs)} installs
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {extData.rating.toFixed(1)} ({extData.ratingCount} ratings)
              </span>
            </div>

            <p className="text-theme-secondary mb-4">{extData.shortDescription}</p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {installed ? (
                <>
                  <button
                    onClick={() => {
                      const wasEnabled = installedExt?.enabled
                      toggleExtension(extData.id)
                      if (wasEnabled) {
                        toast.info('Disabled', `${extData.displayName} has been disabled and stopped`)
                      } else {
                        toast.success('Enabled', `${extData.displayName} has been enabled and started`)
                      }
                    }}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      installedExt?.enabled 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30'
                    )}
                  >
                    {installedExt?.enabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                    {installedExt?.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={handleUninstall}
                    disabled={isInstalling}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    {isInstalling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Uninstall
                  </button>
                </>
              ) : (
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium gradient-btn text-white"
                >
                  {isInstalling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Install
                </button>
              )}
              
              {extData.repository && (
                <a
                  href={extData.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-theme-secondary hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Repository
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-theme bg-theme-secondary/20">
        {(['details', 'features', 'changelog', 'dependencies'] as const).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm capitalize transition-colors',
              activeSection === section
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                : 'text-theme-muted hover:text-theme-secondary hover:bg-white/5'
            )}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === 'details' && (
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-theme-primary mb-4">Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-theme-secondary leading-relaxed">{extData.description || extData.shortDescription}</p>
            </div>

            {extData.categories && extData.categories.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-theme-primary mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {extData.categories.map(cat => (
                    <span key={cat} className="px-3 py-1 rounded-full text-xs bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {extData.tags && extData.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-theme-primary mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {extData.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs bg-theme-secondary text-theme-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-theme-secondary/30">
                <div className="flex items-center gap-2 text-theme-muted mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Last Updated</span>
                </div>
                <p className="text-sm text-theme-primary">{extData.lastUpdated || 'Unknown'}</p>
              </div>
              <div className="p-4 rounded-xl bg-theme-secondary/30">
                <div className="flex items-center gap-2 text-theme-muted mb-1">
                  <FileCode className="w-4 h-4" />
                  <span className="text-xs">Extension ID</span>
                </div>
                <p className="text-sm text-theme-primary font-mono">{extData.id}</p>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 flex items-center gap-4">
              {extData.homepage && (
                <a href={extData.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:underline">
                  <Book className="w-4 h-4" /> Documentation
                </a>
              )}
              {extData.bugs && (
                <a href={extData.bugs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:underline">
                  <MessageSquare className="w-4 h-4" /> Report Issue
                </a>
              )}
              {extData.repository && (
                <a href={extData.repository} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:underline">
                  <ExternalLink className="w-4 h-4" /> Source Code
                </a>
              )}
            </div>
          </div>
        )}

        {activeSection === 'features' && (
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-theme-primary mb-4">Features</h2>
            
            {/* Runtime Status */}
            {hasBuiltIn && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium text-cyan-400">Native Runtime Support</span>
                </div>
                <p className="text-sm text-theme-secondary mb-3">
                  This extension has built-in support in Geneia Studio and provides real functionality.
                </p>
                
                {contribution?.capabilities && (
                  <div className="flex flex-wrap gap-2">
                    {contribution.capabilities.languages && contribution.capabilities.languages.length > 0 && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-400 flex items-center gap-1">
                        <Code className="w-3 h-3" /> {contribution.capabilities.languages.join(', ')}
                      </span>
                    )}
                    {contribution.capabilities.syntaxHighlight && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-green-500/20 text-green-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Syntax Highlighting
                      </span>
                    )}
                    {contribution.capabilities.formatting && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-purple-500/20 text-purple-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Formatting
                      </span>
                    )}
                    {contribution.capabilities.linting && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Linting
                      </span>
                    )}
                    {contribution.capabilities.snippets && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-pink-500/20 text-pink-400 flex items-center gap-1">
                        <Code className="w-3 h-3" /> Snippets
                      </span>
                    )}
                    {contribution.capabilities.intellisense && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-cyan-500/20 text-cyan-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> IntelliSense
                      </span>
                    )}
                    {contribution.capabilities.themes && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-orange-500/20 text-orange-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Themes
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {!hasBuiltIn && (
              <div className="mb-6 p-4 rounded-xl bg-zinc-500/10 border border-zinc-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Puzzle className="w-5 h-5 text-zinc-400" />
                  <span className="font-medium text-zinc-400">Generic Extension</span>
                </div>
                <p className="text-sm text-theme-muted">
                  This extension is installed but does not have native runtime support yet. 
                  It may provide limited functionality.
                </p>
              </div>
            )}

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-theme-secondary">Syntax highlighting for supported languages</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-theme-secondary">IntelliSense and code completion</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-theme-secondary">Code formatting and linting</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-theme-secondary">Debugging support</span>
              </li>
            </ul>
          </div>
        )}

        {activeSection === 'changelog' && (
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-theme-primary mb-4">Changelog</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-theme-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-theme-primary">v{extData.version}</span>
                  <span className="text-xs text-theme-muted">{extData.lastUpdated || 'Recent'}</span>
                </div>
                <ul className="text-sm text-theme-secondary space-y-1">
                  <li>• Bug fixes and performance improvements</li>
                  <li>• Updated dependencies</li>
                  <li>• New features and enhancements</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'dependencies' && (
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-theme-primary mb-4">Dependencies</h2>
            <p className="text-theme-muted text-sm">This extension has no additional dependencies.</p>
          </div>
        )}
      </div>
    </div>
  )
}
