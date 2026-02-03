import { useState, useEffect, useCallback } from 'react'
import { Puzzle, Download, Check, Star, Search, RefreshCw, Loader2, Trash2, Power, PowerOff, Info, Zap } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { toast } from '../Toast'
import { 
  searchExtensions, 
  getPopularExtensions, 
  getInstallCount, 
  getRating,
  getExtensionIcon,
  type VSCodeExtension 
} from '../../services/vscodeMarketplace'
import { ExtensionRuntime } from '../../services/extensionRuntime'
import { LocalizationService } from '../../services/localization'

export function ExtensionsPanel() {
  const { installedExtensions, installExtension, uninstallExtension, toggleExtension, isExtensionInstalled, openSpecialTab } = useStore()
  const [extensions, setExtensions] = useState<VSCodeExtension[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'installed'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [installingId, setInstallingId] = useState<string | null>(null)
  const [failedIcons, setFailedIcons] = useState<Set<string>>(new Set())
  const t = LocalizationService.t

  // Extension Icon component with fallback
  const ExtIcon = useCallback(({ iconUrl, extId, size = 'md' }: { iconUrl?: string; extId: string; size?: 'sm' | 'md' }) => {
    const sizeClasses = size === 'sm' ? 'w-10 h-10' : 'w-10 h-10'
    const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-5 h-5'
    
    if (iconUrl && !failedIcons.has(extId)) {
      return (
        <div className={`relative ${sizeClasses} flex-shrink-0`}>
          <img 
            src={iconUrl} 
            alt="" 
            className={`${sizeClasses} rounded-lg object-cover`}
            onError={() => setFailedIcons(prev => new Set(prev).add(extId))}
          />
        </div>
      )
    }
    
    // Fallback gradient icon
    return (
      <div className={`relative ${sizeClasses} flex-shrink-0`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-30 blur-sm" />
        <div className="relative w-full h-full rounded-lg bg-gradient-to-br from-[var(--accent-primary)]/80 to-purple-500/80 flex items-center justify-center">
          <Puzzle className={`${iconSize} text-white`} />
        </div>
      </div>
    )
  }, [failedIcons])

  // Load popular extensions on mount
  useEffect(() => {
    loadPopularExtensions()
  }, [])

  const loadPopularExtensions = async () => {
    setIsLoading(true)
    try {
      const results = await getPopularExtensions(20)
      setExtensions(results)
    } catch (error) {
      console.error('Failed to load extensions:', error)
      toast.error('Load Failed', 'Could not load extensions from marketplace')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPopularExtensions()
      return
    }
    setIsLoading(true)
    try {
      const results = await searchExtensions(searchQuery, 20)
      setExtensions(results)
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Search Failed', 'Could not search extensions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) handleSearch()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleInstall = async (ext: VSCodeExtension) => {
    const extId = `${ext.publisher.publisherName}.${ext.extensionName}`
    setInstallingId(extId)
    
    try {
      // Simulate install delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      installExtension({
        id: extId,
        name: ext.extensionName,
        displayName: ext.displayName,
        publisher: ext.publisher.displayName,
        version: ext.versions[0]?.version || '1.0.0',
        description: ext.shortDescription,
        installedAt: Date.now(),
        enabled: true,
        iconUrl: getExtensionIcon(ext)
      })
      toast.success('Installed', `${ext.displayName} has been installed`)
    } catch {
      toast.error('Install Failed', `Could not install ${ext.displayName}`)
    } finally {
      setInstallingId(null)
    }
  }

  const handleUninstall = async (id: string) => {
    const ext = installedExtensions.find(e => e.id === id)
    setInstallingId(id)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      uninstallExtension(id)
      toast.info('Uninstalled', `${ext?.displayName || 'Extension'} has been removed`)
    } catch {
      toast.error('Uninstall Failed', 'Could not uninstall extension')
    } finally {
      setInstallingId(null)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const openExtensionInfo = (ext: VSCodeExtension) => {
    const extId = `${ext.publisher.publisherName}.${ext.extensionName}`
    openSpecialTab({
      id: `ext-${extId}`,
      type: 'extension',
      title: ext.displayName,
      data: {
        id: extId,
        name: ext.extensionName,
        displayName: ext.displayName,
        publisher: ext.publisher.publisherName,
        publisherDisplayName: ext.publisher.displayName,
        version: ext.versions[0]?.version || '1.0.0',
        description: ext.shortDescription,
        shortDescription: ext.shortDescription,
        installs: getInstallCount(ext),
        rating: getRating(ext),
        ratingCount: ext.statistics?.find(s => s.statisticName === 'ratingcount')?.value || 0,
        lastUpdated: ext.lastUpdated ? new Date(ext.lastUpdated).toLocaleDateString() : 'Unknown',
        categories: ext.categories || [],
        tags: ext.tags || [],
        repository: ext.versions[0]?.properties?.find(p => p.key === 'Microsoft.VisualStudio.Services.Links.Source')?.value,
        homepage: ext.versions[0]?.properties?.find(p => p.key === 'Microsoft.VisualStudio.Services.Links.Learn')?.value,
        bugs: ext.versions[0]?.properties?.find(p => p.key === 'Microsoft.VisualStudio.Services.Links.Support')?.value,
        iconUrl: getExtensionIcon(ext)
      }
    })
  }

  const openInstalledExtensionInfo = (ext: typeof installedExtensions[0]) => {
    openSpecialTab({
      id: `ext-${ext.id}`,
      type: 'extension',
      title: ext.displayName,
      data: {
        id: ext.id,
        name: ext.name,
        displayName: ext.displayName,
        publisher: ext.publisher,
        publisherDisplayName: ext.publisher,
        version: ext.version,
        description: ext.description,
        shortDescription: ext.description,
        installs: 0,
        rating: 5,
        ratingCount: 0,
        lastUpdated: new Date(ext.installedAt).toLocaleDateString(),
        categories: [],
        tags: [],
        iconUrl: ext.iconUrl
      }
    })
  }

  const displayExtensions = filter === 'installed' 
    ? installedExtensions 
    : extensions

  return (
    <div className="w-64 glass border-r border-theme flex flex-col overflow-hidden">
      <div className="p-3 border-b border-theme">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-theme-muted" />
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">{t('extensions')}</span>
          </div>
          <button 
            onClick={loadPopularExtensions} 
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" 
            title={t('refresh')}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-theme-muted ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search') + '...'}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-theme-editor border border-theme rounded-lg text-theme-primary placeholder:text-theme-muted focus:border-[var(--accent-primary)] outline-none"
          />
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${
              filter === 'all' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'text-theme-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {t('marketplace')}
          </button>
          <button
            onClick={() => setFilter('installed')}
            className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${
              filter === 'installed' ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'text-theme-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {t('installed')} ({installedExtensions.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && filter === 'all' ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-theme-muted" />
          </div>
        ) : filter === 'installed' ? (
          installedExtensions.length > 0 ? (
            <div className="space-y-2">
              {installedExtensions.map(ext => {
                const isActive = ExtensionRuntime.isActive(ext.id)
                const hasBuiltIn = ExtensionRuntime.hasBuiltInSupport(ext.id)
                return (
                <div 
                  key={ext.id} 
                  className="p-3 rounded-xl bg-theme-editor hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => openInstalledExtensionInfo(ext)}
                >
                  <div className="flex items-start gap-3">
                    {/* Extension Icon */}
                    <ExtIcon iconUrl={ext.iconUrl} extId={ext.id} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-theme-primary truncate">{ext.displayName}</span>
                        <div className="flex items-center gap-1">
                          {hasBuiltIn && <span title="Native Support"><Zap className="w-3.5 h-3.5 text-cyan-400" /></span>}
                          {isActive && <span title="Running"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /></span>}
                          <Info className="w-3.5 h-3.5 text-[var(--accent-primary)] opacity-60 hover:opacity-100" />
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        </div>
                      </div>
                      <p className="text-xs text-theme-muted mb-1">{ext.publisher}</p>
                      <p className="text-xs text-theme-muted mb-2 line-clamp-2">{ext.description}</p>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            const wasEnabled = ext.enabled
                            toggleExtension(ext.id)
                            if (wasEnabled) {
                              toast.info('Disabled', `${ext.displayName} stopped`)
                            } else {
                              toast.success('Enabled', `${ext.displayName} started`)
                            }
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${ext.enabled ? 'bg-green-500/10 text-green-400' : 'bg-zinc-500/10 text-zinc-400'}`}
                          title={ext.enabled ? 'Disable' : 'Enable'}
                        >
                          {ext.enabled ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleUninstall(ext.id)}
                          disabled={installingId === ext.id}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Uninstall"
                        >
                          {installingId === ext.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="text-center text-theme-muted text-xs py-8">
              <Puzzle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No extensions installed
            </div>
          )
        ) : displayExtensions.length > 0 ? (
          <div className="space-y-2">
            {(displayExtensions as VSCodeExtension[]).map(ext => {
              const extId = `${ext.publisher.publisherName}.${ext.extensionName}`
              const installed = isExtensionInstalled(extId)
              const iconUrl = getExtensionIcon(ext)
              const hasBuiltIn = ExtensionRuntime.hasBuiltInSupport(extId)
              return (
                <div 
                  key={extId} 
                  className="p-3 rounded-xl bg-theme-editor hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => openExtensionInfo(ext)}
                >
                  <div className="flex items-start gap-3">
                    {/* Extension Icon */}
                    <ExtIcon iconUrl={iconUrl} extId={extId} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-theme-primary truncate">{ext.displayName}</span>
                        <div className="flex items-center gap-1">
                          {hasBuiltIn && <span title="Native Support"><Zap className="w-3.5 h-3.5 text-cyan-400" /></span>}
                          <Info className="w-3.5 h-3.5 text-[var(--accent-primary)] opacity-60 hover:opacity-100" />
                          {installed && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
                        </div>
                      </div>
                      <p className="text-xs text-theme-muted mb-1">{ext.publisher.displayName}</p>
                      <p className="text-xs text-theme-muted mb-2 line-clamp-2">{ext.shortDescription}</p>
                      <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2 text-xs text-theme-muted">
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-yellow-400" />
                            {getRating(ext).toFixed(1)}
                          </span>
                          <span><Download className="w-3 h-3 inline" /> {formatNumber(getInstallCount(ext))}</span>
                        </div>
                        <button
                          onClick={() => installed ? handleUninstall(extId) : handleInstall(ext)}
                          disabled={installingId === extId}
                          className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                            installed ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'gradient-btn text-white'
                          }`}
                        >
                          {installingId === extId ? <Loader2 className="w-3 h-3 animate-spin" /> : installed ? t('uninstall') : t('install')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-theme-muted text-xs py-8">
            <Puzzle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            {t('noResults')}
          </div>
        )}
      </div>
    </div>
  )
}
