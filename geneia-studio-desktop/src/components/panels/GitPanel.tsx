import { useState, useEffect } from 'react'
import { 
  GitBranch, GitCommit, Plus, Minus, RotateCcw, Check, Upload, Download, 
  RefreshCw, ExternalLink, AlertCircle, Loader2 
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { LocalizationService } from '../../services/localization'

interface Change {
  file: string
  status: 'modified' | 'added' | 'deleted'
  staged: boolean
}

interface Commit {
  sha: string
  message: string
  author: string
  date: string
}

export function GitPanel() {
  const { files, user, authToken } = useStore()
  const [commitMessage, setCommitMessage] = useState('')
  const [currentBranch] = useState('main')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentCommits, setRecentCommits] = useState<Commit[]>([])
  const t = LocalizationService.t
  
  const [changes, setChanges] = useState<Change[]>(
    files.filter(f => f.isModified).map(f => ({
      file: f.name,
      status: 'modified' as const,
      staged: false
    }))
  )

  useEffect(() => {
    setChanges(
      files.filter(f => f.isModified).map(f => ({
        file: f.name,
        status: 'modified' as const,
        staged: false
      }))
    )
  }, [files])

  const stagedChanges = changes.filter(c => c.staged)
  const unstagedChanges = changes.filter(c => !c.staged)

  const stageFile = (file: string) => {
    setChanges(changes.map(c => c.file === file ? { ...c, staged: true } : c))
  }

  const unstageFile = (file: string) => {
    setChanges(changes.map(c => c.file === file ? { ...c, staged: false } : c))
  }

  const stageAll = () => {
    setChanges(changes.map(c => ({ ...c, staged: true })))
  }

  const unstageAll = () => {
    setChanges(changes.map(c => ({ ...c, staged: false })))
  }

  const commit = async () => {
    if (!commitMessage.trim() || stagedChanges.length === 0) return
    if (!user || !authToken) {
      setError('Please sign in to commit')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const newCommit: Commit = {
        sha: Math.random().toString(36).slice(2, 9),
        message: commitMessage,
        author: user.name,
        date: new Date().toISOString()
      }
      setRecentCommits([newCommit, ...recentCommits].slice(0, 10))
      setChanges(changes.filter(c => !c.staged))
      setCommitMessage('')
    } catch {
      setError('Failed to commit changes')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'modified': return <span className="text-yellow-400 text-xs font-mono">M</span>
      case 'added': return <span className="text-green-400 text-xs font-mono">A</span>
      case 'deleted': return <span className="text-red-400 text-xs font-mono">D</span>
      default: return null
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!user) {
    return (
      <div className="w-64 glass border-r border-theme flex flex-col overflow-hidden">
        <div className="p-3 border-b border-theme">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-theme-muted" />
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
              {t('git')}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <GitBranch className="w-12 h-12 text-theme-muted mb-4 opacity-50" />
          <p className="text-sm text-theme-secondary mb-2">Sign In Required</p>
          <p className="text-xs text-theme-muted mb-4">
            Sign in to use source control features
          </p>
          <a href="#" className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1">
            Go to {t('account')} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 glass border-r border-theme flex flex-col overflow-hidden">
      <div className="p-3 border-b border-theme">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-theme-muted" />
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
              {t('git')}
            </span>
          </div>
          <button 
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" 
            title={t('refresh')}
            onClick={() => setChanges(files.filter(f => f.isModified).map(f => ({
              file: f.name, status: 'modified' as const, staged: false
            })))}
          >
            <RefreshCw className="w-4 h-4 text-theme-muted" />
          </button>
        </div>

        <div className="flex items-center gap-2 p-2 bg-theme-editor rounded-lg mb-3">
          <GitBranch className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-sm text-theme-primary">{currentBranch}</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg mb-3 text-xs text-red-400">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Commit message..."
          className="w-full p-2 text-sm bg-theme-editor border border-theme rounded-lg text-theme-primary placeholder:text-theme-muted resize-none h-16 focus:border-[var(--accent-primary)] outline-none"
        />

        <button
          onClick={commit}
          disabled={!commitMessage.trim() || stagedChanges.length === 0 || isLoading}
          className="w-full mt-2 py-2 text-sm gradient-btn rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Commit ({stagedChanges.length})
        </button>

        <div className="flex gap-2 mt-2">
          <button className="flex-1 py-1.5 text-xs bg-theme-editor border border-theme rounded-lg text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-1">
            <Download className="w-3 h-3" /> Pull
          </button>
          <button className="flex-1 py-1.5 text-xs bg-theme-editor border border-theme rounded-lg text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center gap-1">
            <Upload className="w-3 h-3" /> Push
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {stagedChanges.length > 0 && (
          <div className="p-2 border-b border-theme">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-theme-secondary">Staged ({stagedChanges.length})</span>
              <button onClick={unstageAll} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Unstage All">
                <Minus className="w-3 h-3 text-theme-muted" />
              </button>
            </div>
            {stagedChanges.map(change => (
              <div key={change.file} className="flex items-center justify-between p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 group">
                <div className="flex items-center gap-2 text-xs">
                  {getStatusIcon(change.status)}
                  <span className="text-theme-primary font-mono">{change.file}</span>
                </div>
                <button onClick={() => unstageFile(change.file)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10">
                  <Minus className="w-3 h-3 text-theme-muted" />
                </button>
              </div>
            ))}
          </div>
        )}

        {unstagedChanges.length > 0 && (
          <div className="p-2 border-b border-theme">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-theme-secondary">Changes ({unstagedChanges.length})</span>
              <button onClick={stageAll} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Stage All">
                <Plus className="w-3 h-3 text-theme-muted" />
              </button>
            </div>
            {unstagedChanges.map(change => (
              <div key={change.file} className="flex items-center justify-between p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 group">
                <div className="flex items-center gap-2 text-xs">
                  {getStatusIcon(change.status)}
                  <span className="text-theme-primary font-mono">{change.file}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button onClick={() => stageFile(change.file)} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10">
                    <Plus className="w-3 h-3 text-theme-muted" />
                  </button>
                  <button className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10">
                    <RotateCcw className="w-3 h-3 text-theme-muted" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {recentCommits.length > 0 && (
          <div className="p-2">
            <span className="text-xs font-semibold text-theme-secondary mb-2 block">Recent Commits</span>
            {recentCommits.map(commit => (
              <div key={commit.sha} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 mb-1">
                <div className="flex items-center gap-2 mb-1">
                  <GitCommit className="w-3 h-3 text-theme-muted" />
                  <span className="text-xs text-theme-muted font-mono">{commit.sha}</span>
                </div>
                <p className="text-xs text-theme-primary truncate">{commit.message}</p>
                <p className="text-xs text-theme-muted">{formatDate(commit.date)}</p>
              </div>
            ))}
          </div>
        )}

        {changes.length === 0 && recentCommits.length === 0 && (
          <div className="text-center text-theme-muted text-xs py-8">
            <GitCommit className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No changes detected
          </div>
        )}
      </div>
    </div>
  )
}
