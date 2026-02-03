import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Server, Cloud, GitBranch, Wifi, RefreshCw, Plus, Loader2,
  Check, AlertCircle, FolderGit2, ExternalLink, Copy, Terminal, Globe
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { notify } from '../store/notificationStore'

type ConnectionType = 'github' | 'ssh' | 'container' | 'wsl' | 'tunnel' | 'codespace' | 'devcontainer'

interface RemoteConnection {
  id: string
  type: ConnectionType
  name: string
  url?: string
  status: 'connected' | 'disconnected' | 'connecting'
  connectedAt?: number
}

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  ssh_url: string
  private: boolean
  default_branch: string
  updated_at: string
}

interface RemoteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RemoteModal({ isOpen, onClose }: RemoteModalProps) {
  const { user, authToken } = useStore()
  const [activeTab, setActiveTab] = useState<'connect' | 'repos' | 'history'>('connect')
  const [connection, setConnection] = useState<RemoteConnection | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sshHost, setSshHost] = useState('')
  const [sshUser, setSshUser] = useState('')
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [cloneUrl, setCloneUrl] = useState('')
  const [connectionHistory, setConnectionHistory] = useState<RemoteConnection[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Fetch GitHub repos when user is logged in
  useEffect(() => {
    if (isOpen && user && authToken && activeTab === 'repos') {
      fetchGitHubRepos()
    }
  }, [isOpen, user, authToken, activeTab])

  const fetchGitHubRepos = async () => {
    if (!authToken) return
    setIsLoading(true)
    setError(null)

    try {
      // Simulated GitHub API response for demo
      // In production, this would be: fetch('https://api.github.com/user/repos', { headers: { Authorization: `token ${authToken}` } })
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockRepos: GitHubRepo[] = [
        {
          id: 1,
          name: 'geneia-lang',
          full_name: `${user?.name || 'user'}/geneia-lang`,
          description: 'The Geneia programming language',
          html_url: 'https://github.com/user/geneia-lang',
          clone_url: 'https://github.com/user/geneia-lang.git',
          ssh_url: 'git@github.com:user/geneia-lang.git',
          private: false,
          default_branch: 'main',
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'geneia-studio',
          full_name: `${user?.name || 'user'}/geneia-studio`,
          description: 'IDE for Geneia language',
          html_url: 'https://github.com/user/geneia-studio',
          clone_url: 'https://github.com/user/geneia-studio.git',
          ssh_url: 'git@github.com:user/geneia-studio.git',
          private: true,
          default_branch: 'main',
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          name: 'my-project',
          full_name: `${user?.name || 'user'}/my-project`,
          description: 'A sample project',
          html_url: 'https://github.com/user/my-project',
          clone_url: 'https://github.com/user/my-project.git',
          ssh_url: 'git@github.com:user/my-project.git',
          private: false,
          default_branch: 'main',
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]
      setRepos(mockRepos)
    } catch {
      setError('Failed to fetch repositories')
    } finally {
      setIsLoading(false)
    }
  }

  const connectToGitHub = async (repo: GitHubRepo) => {
    setIsLoading(true)
    setError(null)
    setSelectedRepo(repo)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newConnection: RemoteConnection = {
        id: `github-${repo.id}`,
        type: 'github',
        name: repo.full_name,
        url: repo.html_url,
        status: 'connected',
        connectedAt: Date.now()
      }
      
      setConnection(newConnection)
      setConnectionHistory(prev => [newConnection, ...prev.filter(c => c.id !== newConnection.id)].slice(0, 10))
      notify.success('Connected', `Connected to ${repo.full_name}`)
    } catch {
      setError('Failed to connect to repository')
    } finally {
      setIsLoading(false)
    }
  }

  const connectToSSH = async () => {
    if (!sshHost || !sshUser) {
      setError('Please enter host and username')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newConnection: RemoteConnection = {
        id: `ssh-${Date.now()}`,
        type: 'ssh',
        name: `${sshUser}@${sshHost}`,
        url: `ssh://${sshUser}@${sshHost}`,
        status: 'connected',
        connectedAt: Date.now()
      }
      
      setConnection(newConnection)
      setConnectionHistory(prev => [newConnection, ...prev.filter(c => c.id !== newConnection.id)].slice(0, 10))
      notify.success('SSH Connected', `Connected to ${sshHost}`)
    } catch {
      setError('SSH connection failed')
    } finally {
      setIsLoading(false)
    }
  }

  const cloneRepository = async () => {
    if (!cloneUrl) {
      setError('Please enter a repository URL')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      notify.success('Cloned', `Repository cloned successfully`)
      setCloneUrl('')
    } catch {
      setError('Failed to clone repository')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    if (connection) {
      notify.info('Disconnected', `Disconnected from ${connection.name}`)
      setConnection(null)
      setSelectedRepo(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    notify.success('Copied', 'URL copied to clipboard')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-[700px] max-h-[80vh] bg-[var(--bg-primary)] border border-theme rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${connection ? 'bg-green-500/20' : 'bg-[var(--accent-primary)]/20'}`}>
              {connection ? <Wifi className="w-5 h-5 text-green-400" /> : <Globe className="w-5 h-5 text-[var(--accent-primary)]" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-theme-primary">Remote Window</h2>
              <p className="text-xs text-theme-muted">
                {connection ? `Connected to ${connection.name}` : 'Connect to remote hosts and repositories'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10">
            <X className="w-4 h-4 text-theme-muted" />
          </button>
        </div>

        {/* Connection Status Banner */}
        {connection && (
          <div className="px-4 py-2 bg-green-500/10 border-b border-green-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Connected to {connection.name}</span>
            </div>
            <button
              onClick={disconnect}
              className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-theme">
          {[
            { id: 'connect', label: 'Connect', icon: Server },
            { id: 'repos', label: 'GitHub Repos', icon: FolderGit2 },
            { id: 'history', label: 'History', icon: RefreshCw }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                  : 'text-theme-muted hover:text-theme-secondary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Connect Tab */}
          {activeTab === 'connect' && (
            <div className="space-y-6">
              {/* SSH Connection */}
              <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-theme">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5 text-[var(--accent-primary)]" />
                  <h3 className="text-sm font-medium text-theme-primary">SSH Remote</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={sshHost}
                    onChange={(e) => setSshHost(e.target.value)}
                    placeholder="hostname or IP"
                    className="px-3 py-2 bg-[var(--bg-editor)] border border-theme rounded-lg text-sm text-theme-primary outline-none focus:border-[var(--accent-primary)]"
                  />
                  <input
                    type="text"
                    value={sshUser}
                    onChange={(e) => setSshUser(e.target.value)}
                    placeholder="username"
                    className="px-3 py-2 bg-[var(--bg-editor)] border border-theme rounded-lg text-sm text-theme-primary outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <button
                  onClick={connectToSSH}
                  disabled={isLoading || !sshHost || !sshUser}
                  className="w-full py-2 text-sm gradient-btn text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
                  Connect via SSH
                </button>
              </div>

              {/* Clone Repository */}
              <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-theme">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch className="w-5 h-5 text-[var(--accent-primary)]" />
                  <h3 className="text-sm font-medium text-theme-primary">Clone Repository</h3>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={cloneUrl}
                    onChange={(e) => setCloneUrl(e.target.value)}
                    placeholder="https://github.com/user/repo.git"
                    className="flex-1 px-3 py-2 bg-[var(--bg-editor)] border border-theme rounded-lg text-sm text-theme-primary outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <button
                  onClick={cloneRepository}
                  disabled={isLoading || !cloneUrl}
                  className="w-full py-2 text-sm gradient-btn text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderGit2 className="w-4 h-4" />}
                  Clone Repository
                </button>
              </div>

              {/* Quick Connect Options */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'codespace', label: 'GitHub Codespace', icon: Cloud, desc: 'Cloud development' },
                  { type: 'container', label: 'Dev Container', icon: Server, desc: 'Docker container' },
                  { type: 'wsl', label: 'WSL', icon: Terminal, desc: 'Windows Subsystem' },
                  { type: 'tunnel', label: 'Remote Tunnel', icon: Globe, desc: 'Secure tunnel' }
                ].map(opt => (
                  <button
                    key={opt.type}
                    className="p-4 bg-[var(--bg-secondary)] border border-theme rounded-xl text-left hover:border-[var(--accent-primary)]/50 transition-colors group"
                  >
                    <opt.icon className="w-6 h-6 text-[var(--accent-primary)] mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium text-theme-primary">{opt.label}</p>
                    <p className="text-xs text-theme-muted">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Repos Tab */}
          {activeTab === 'repos' && (
            <div>
              {!user ? (
                <div className="text-center py-12">
                  <FolderGit2 className="w-12 h-12 mx-auto mb-4 text-theme-muted opacity-50" />
                  <p className="text-sm text-theme-secondary mb-2">Sign in to view your repositories</p>
                  <p className="text-xs text-theme-muted">Connect your GitHub account to access repos</p>
                </div>
              ) : isLoading && repos.length === 0 ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 text-[var(--accent-primary)] animate-spin" />
                  <p className="text-sm text-theme-muted">Loading repositories...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {repos.map(repo => (
                    <div
                      key={repo.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        selectedRepo?.id === repo.id
                          ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/50'
                          : 'bg-[var(--bg-secondary)] border-theme hover:border-[var(--accent-primary)]/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="w-5 h-5 text-[var(--accent-primary)]" />
                          <span className="text-sm font-medium text-theme-primary">{repo.name}</span>
                          {repo.private && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded">Private</span>
                          )}
                        </div>
                        <span className="text-xs text-theme-muted">{formatDate(repo.updated_at)}</span>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-theme-muted mb-3">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => connectToGitHub(repo)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs gradient-btn text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
                        >
                          {isLoading && selectedRepo?.id === repo.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Wifi className="w-3 h-3" />
                          )}
                          Connect
                        </button>
                        <button
                          onClick={() => copyToClipboard(repo.clone_url)}
                          className="px-3 py-1.5 text-xs bg-theme-editor border border-theme rounded-lg text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Clone URL
                        </button>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs bg-theme-editor border border-theme rounded-lg text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              {connectionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 text-theme-muted opacity-50" />
                  <p className="text-sm text-theme-secondary">No connection history</p>
                  <p className="text-xs text-theme-muted">Your recent connections will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connectionHistory.map(conn => (
                    <div
                      key={conn.id}
                      className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-theme flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {conn.type === 'github' ? (
                          <FolderGit2 className="w-5 h-5 text-[var(--accent-primary)]" />
                        ) : conn.type === 'ssh' ? (
                          <Terminal className="w-5 h-5 text-[var(--accent-primary)]" />
                        ) : (
                          <Server className="w-5 h-5 text-[var(--accent-primary)]" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-theme-primary">{conn.name}</p>
                          <p className="text-xs text-theme-muted capitalize">{conn.type}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-xs gradient-btn text-white rounded-lg flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Reconnect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-theme bg-[var(--bg-secondary)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-theme-muted">
            <Plus className="w-3.5 h-3.5" />
            <span>Install additional remote extensions</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm bg-theme-editor border border-theme rounded-lg text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
