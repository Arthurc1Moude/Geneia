import { useState, useEffect, useRef } from 'react'
import {
  Terminal,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Bug,
  FileWarning,
  Globe,
  X,
  Maximize2,
  Minimize2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Plus,
  FileCode,
  ChevronRight,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import {
  checkAllFilesAsync,
  type GlobalProblemsResult,
} from '../services/globalProblems'
import { clsx } from 'clsx'
import { LocalizationService } from '../services/localization'

type TabType = 'problems' | 'output' | 'debug' | 'terminal' | 'ports'

interface TerminalInstance {
  id: number
  name: string
  history: string[]
  cwd: string
}

// Extended command list for autocomplete
const COMMANDS = [
  'help', 'clear', 'echo', 'date', 'whoami', 'pwd', 'ls', 'cd', 'cat', 'mkdir', 'touch', 'rm',
  'geneia', 'version', 'history', 'env', 'export', 'alias', 'unalias', 'which', 'man',
  'grep', 'find', 'head', 'tail', 'wc', 'sort', 'uniq', 'diff', 'chmod', 'chown',
  'cp', 'mv', 'ln', 'df', 'du', 'free', 'top', 'ps', 'kill', 'ping', 'curl', 'wget',
  'git', 'npm', 'node', 'python', 'pip', 'cargo', 'rustc', 'go', 'java', 'javac',
  'exit', 'logout', 'reboot', 'shutdown', 'uptime', 'hostname', 'uname', 'arch',
  'neofetch', 'cowsay', 'fortune', 'sl', 'cmatrix', 'figlet', 'lolcat', 'tree',
  'int'  // INT Inc. command system
]

// Debug Console Component
interface DebugLog {
  id: number
  type: 'log' | 'warn' | 'error' | 'info' | 'debug'
  message: string
  timestamp: number
  source?: string
}

function DebugConsole() {
  const [logs, setLogs] = useState<DebugLog[]>([
    { id: 1, type: 'info', message: 'Debug console initialized', timestamp: Date.now(), source: 'system' },
    { id: 2, type: 'log', message: 'Ready to debug Geneia scripts', timestamp: Date.now(), source: 'debugger' }
  ])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'log' | 'warn' | 'error' | 'info'>('all')
  const consoleRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = LocalizationService.t

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [logs])

  const executeExpression = (expr: string) => {
    const newLog: DebugLog = { id: Date.now(), type: 'log', message: `> ${expr}`, timestamp: Date.now(), source: 'input' }
    
    try {
      // Simple expression evaluator for demo
      let result: string
      if (expr.startsWith('console.')) {
        result = 'undefined'
      } else if (expr.match(/^\d+[\+\-\*\/]\d+$/)) {
        result = String(eval(expr))
      } else if (expr === 'Date.now()') {
        result = String(Date.now())
      } else if (expr === 'Math.random()') {
        result = String(Math.random())
      } else if (expr.startsWith('"') || expr.startsWith("'")) {
        result = expr.slice(1, -1)
      } else {
        result = `"${expr}"`
      }
      
      setLogs(prev => [...prev, newLog, { id: Date.now() + 1, type: 'log', message: result, timestamp: Date.now(), source: 'result' }])
    } catch {
      setLogs(prev => [...prev, newLog, { id: Date.now() + 1, type: 'error', message: 'Expression error', timestamp: Date.now(), source: 'error' }])
    }
    setInput('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      executeExpression(input.trim())
    }
  }

  const clearLogs = () => setLogs([])

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.type === filter)

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400'
      case 'warn': return 'text-yellow-400'
      case 'info': return 'text-blue-400'
      case 'debug': return 'text-purple-400'
      default: return 'text-theme-secondary'
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-3 h-3 text-red-400" />
      case 'warn': return <AlertTriangle className="w-3 h-3 text-yellow-400" />
      case 'info': return <Info className="w-3 h-3 text-blue-400" />
      default: return <ChevronRight className="w-3 h-3 text-theme-muted" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-[var(--bg-editor)]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-theme">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-2 py-1 text-xs bg-theme-editor border border-theme rounded text-theme-secondary"
        >
          <option value="all">All levels</option>
          <option value="log">Log</option>
          <option value="warn">{t('warnings')}</option>
          <option value="error">{t('errors')}</option>
          <option value="info">Info</option>
        </select>
        <button onClick={clearLogs} className="px-2 py-1 text-xs text-theme-muted hover:text-theme-secondary">
          {t('clear')}
        </button>
        <span className="ml-auto text-xs text-theme-muted">{filteredLogs.length} messages</span>
      </div>

      {/* Logs */}
      <div ref={consoleRef} className="flex-1 overflow-y-auto p-2 font-mono text-sm" onClick={() => inputRef.current?.focus()}>
        {filteredLogs.map(log => (
          <div key={log.id} className={clsx('flex items-start gap-2 py-0.5', getLogColor(log.type))}>
            {getLogIcon(log.type)}
            <span className="flex-1">{log.message}</span>
            <span className="text-[10px] text-theme-muted">{new Date(log.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-theme">
        <ChevronRight className="w-4 h-4 text-[var(--accent-primary)]" />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Evaluate expression..."
          className="flex-1 bg-transparent text-theme-primary text-sm outline-none"
        />
      </form>
    </div>
  )
}

// Ports Panel Component
interface ForwardedPort {
  id: number
  localPort: number
  remotePort: number
  protocol: 'http' | 'https' | 'tcp'
  status: 'active' | 'inactive'
  label?: string
  visibility: 'private' | 'public'
}

function PortsPanel() {
  const [ports, setPorts] = useState<ForwardedPort[]>([])
  const [showAddPort, setShowAddPort] = useState(false)
  const [newPort, setNewPort] = useState({ local: '', remote: '', label: '' })
  const t = LocalizationService.t

  const addPort = () => {
    if (!newPort.local) return
    const port: ForwardedPort = {
      id: Date.now(),
      localPort: parseInt(newPort.local),
      remotePort: parseInt(newPort.remote) || parseInt(newPort.local),
      protocol: 'http',
      status: 'active',
      label: newPort.label || `Port ${newPort.local}`,
      visibility: 'private'
    }
    setPorts(prev => [...prev, port])
    setNewPort({ local: '', remote: '', label: '' })
    setShowAddPort(false)
  }

  const removePort = (id: number) => {
    setPorts(prev => prev.filter(p => p.id !== id))
  }

  const toggleVisibility = (id: number) => {
    setPorts(prev => prev.map(p => 
      p.id === id ? { ...p, visibility: p.visibility === 'private' ? 'public' : 'private' } : p
    ))
  }

  const openInBrowser = (port: ForwardedPort) => {
    window.open(`http://localhost:${port.localPort}`, '_blank')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-theme">
        <button
          onClick={() => setShowAddPort(!showAddPort)}
          className="flex items-center gap-1 px-2 py-1 text-xs gradient-btn text-white rounded"
        >
          <Plus className="w-3 h-3" />
          Forward Port
        </button>
        <span className="ml-auto text-xs text-theme-muted">{ports.length} forwarded</span>
      </div>

      {/* Add Port Form */}
      {showAddPort && (
        <div className="p-3 border-b border-theme bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newPort.local}
              onChange={(e) => setNewPort(prev => ({ ...prev, local: e.target.value }))}
              placeholder="Local port"
              className="w-24 px-2 py-1 text-xs bg-theme-editor border border-theme rounded text-theme-primary"
            />
            <span className="text-theme-muted">:</span>
            <input
              type="number"
              value={newPort.remote}
              onChange={(e) => setNewPort(prev => ({ ...prev, remote: e.target.value }))}
              placeholder="Remote (optional)"
              className="w-24 px-2 py-1 text-xs bg-theme-editor border border-theme rounded text-theme-primary"
            />
            <input
              type="text"
              value={newPort.label}
              onChange={(e) => setNewPort(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Label"
              className="flex-1 px-2 py-1 text-xs bg-theme-editor border border-theme rounded text-theme-primary"
            />
            <button onClick={addPort} className="px-3 py-1 text-xs gradient-btn text-white rounded">
              Add
            </button>
            <button onClick={() => setShowAddPort(false)} className="px-2 py-1 text-xs text-theme-muted hover:text-theme-secondary">
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Ports List */}
      <div className="flex-1 overflow-y-auto">
        {ports.length > 0 ? (
          <table className="w-full text-xs">
            <thead className="bg-[var(--bg-secondary)] sticky top-0">
              <tr className="text-left text-theme-muted">
                <th className="px-3 py-2">Port</th>
                <th className="px-3 py-2">Label</th>
                <th className="px-3 py-2">Visibility</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ports.map(port => (
                <tr key={port.id} className="border-b border-theme hover:bg-white/5">
                  <td className="px-3 py-2">
                    <span className="font-mono text-[var(--accent-primary)]">{port.localPort}</span>
                    {port.remotePort !== port.localPort && (
                      <span className="text-theme-muted"> → {port.remotePort}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-theme-secondary">{port.label}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => toggleVisibility(port.id)}
                      className={clsx(
                        'px-2 py-0.5 rounded text-[10px]',
                        port.visibility === 'public' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      )}
                    >
                      {port.visibility}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openInBrowser(port)}
                        className="p-1 rounded hover:bg-white/10"
                        title="Open in Browser"
                      >
                        <Globe className="w-3.5 h-3.5 text-theme-muted" />
                      </button>
                      <button
                        onClick={() => removePort(port.id)}
                        className="p-1 rounded hover:bg-red-500/20"
                        title="Stop Forwarding"
                      >
                        <X className="w-3.5 h-3.5 text-theme-muted hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-theme-muted">
            <Globe className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No forwarded ports</p>
            <p className="text-xs mt-1">Click "Forward Port" to add one</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function OutputPanel() {
  const {
    output,
    isRunning,
    files,
    currentFile,
    bottomPanelTab,
    bottomPanelOpen,
    setBottomPanelTab,
    setBottomPanelOpen,
    openFile,
  } = useStore()

  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [globalProblems, setGlobalProblems] = useState<GlobalProblemsResult>({ files: [], totalErrors: 0, totalWarnings: 0, totalInfo: 0 })
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set())
  const [terminalInput, setTerminalInput] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [terminals, setTerminals] = useState<TerminalInstance[]>([
    { id: 1, name: 'bash', history: ['Welcome to Geneia Terminal v1.0', 'Type "help" for commands, press Tab to autocomplete'], cwd: '/home/geneia-user/workspace' }
  ])
  const [activeTerminalId, setActiveTerminalId] = useState(1)
  const [nextId, setNextId] = useState(2)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const activeTerminal = terminals.find(t => t.id === activeTerminalId)

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [activeTerminal?.history])

  // REAL-TIME Global Error Checking - checks ALL files using real compiler
  useEffect(() => {
    // Immediate check on mount using async compiler
    checkAllFilesAsync(files).then(result => {
      setGlobalProblems(result)
      // Auto-expand files with errors
      const filesWithErrors = new Set(result.files.map(f => f.filename))
      setExpandedFiles(filesWithErrors)
    })
  }, []) // Initial check

  // Real-time checking with debounce - triggers on ANY file content change
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAllFilesAsync(files).then(result => {
        setGlobalProblems(result)
        // Auto-expand new files with errors
        setExpandedFiles(prev => {
          const next = new Set(prev)
          result.files.forEach(f => next.add(f.filename))
          return next
        })
      })
    }, 300) // Fast 300ms debounce for real-time feel
    return () => clearTimeout(timer)
  }, [files]) // Re-check when ANY file in the array changes

  // Tab autocomplete logic
  useEffect(() => {
    if (terminalInput.length > 0) {
      const input = terminalInput.toLowerCase()
      const matches = COMMANDS.filter(c => c.startsWith(input) && c !== input)
      setSuggestion(matches.length > 0 ? matches[0] : '')
    } else {
      setSuggestion('')
    }
  }, [terminalInput])

  const totalProblems = globalProblems.totalErrors + globalProblems.totalWarnings + globalProblems.totalInfo
  const hasOutputErrors = output.some(o => o.type === 'error')

  const toggleFileExpand = (filename: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev)
      if (next.has(filename)) {
        next.delete(filename)
      } else {
        next.add(filename)
      }
      return next
    })
  }

  const handleProblemClick = (filename: string, _line: number) => {
    openFile(filename)
    // TODO: Jump to line in editor
  }

  const runCommand = (cmd: string): string[] => {
    const parts = cmd.trim().split(/\s+/)
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)
    const argsStr = args.join(' ')

    switch (command) {
      case 'help':
        return [
          'Available commands:',
          '  help          - Show this help message',
          '  clear         - Clear terminal',
          '  echo <text>   - Print text',
          '  date          - Show current date/time',
          '  whoami        - Show current user',
          '  pwd           - Print working directory',
          '  ls [dir]      - List directory contents',
          '  cd <dir>      - Change directory',
          '  cat <file>    - Show file contents',
          '  mkdir <dir>   - Create directory',
          '  touch <file>  - Create empty file',
          '  rm <file>     - Remove file',
          '  history       - Show command history',
          '',
          'Geneia CLI:',
          '  geneia dev run <file> [-d]  - Run Geneia script (--debug for verbose)',
          '  geneia dev build            - Build the compiler',
          '  geneia dev clean            - Clean build artifacts',
          '  geneia --help               - Show full CLI help',
          '',
          'Other:',
          '  int <cmd>     - INT Inc. command system',
          '  version       - Show version info',
          '  neofetch      - System info',
          '  cowsay <msg>  - Cow says message',
          '  tree          - Show directory tree',
          '',
          'Tip: Press Tab to autocomplete, Up/Down for history'
        ]
      case 'int': {
        // INT Inc. Command System
        const intCmd = args[0]?.toLowerCase()
        const intArgs = args.slice(1).join(' ')
        
        if (!intCmd || intCmd === 'help') {
          return [
            '[INT] INT Inc. Command System v1.0',
            '',
            'Usage: int <command> [args]',
            '',
            'Commands:',
            '  int help              - Show this help',
            '  int list              - List defined commands',
            '  int cmd <name>        - Define a command',
            '  int exec <name>       - Execute a command',
            '  int shell <command>   - Run shell command',
            '  int load <file>       - Load .intcnf config',
            '  int pack <file>       - Pack to .intpkf',
            '  int run <file>        - Run .intpkf package',
            '',
            'File formats:',
            '  .intcnf  - INT Config (define commands)',
            '  .intpkf  - INT Package (compiled commands)'
          ]
        }
        
        if (intCmd === 'list') {
          return [
            '[INT] Available commands:',
            '  hello    - Say hello',
            '  greet    - Greeting message',
            '  sysinfo  - System information',
            '  (Define more with: int cmd <name>)'
          ]
        }
        
        if (intCmd === 'exec') {
          if (!intArgs) return ['[INT] Usage: int exec <command_name>']
          return [
            `[INT] Executing: ${intArgs}`,
            `Hello from INT command "${intArgs}"!`,
            '[INT] Command completed'
          ]
        }
        
        if (intCmd === 'shell') {
          if (!intArgs) return ['[INT] Usage: int shell <shell_command>']
          return [
            `[INT] Running shell: ${intArgs}`,
            '(Shell output would appear here)',
            '[INT] Shell command completed'
          ]
        }
        
        if (intCmd === 'cmd') {
          if (!intArgs) return ['[INT] Usage: int cmd <name>']
          return [`[INT] Defined command: ${intArgs}`, '(Use int exec to run it)']
        }
        
        if (intCmd === 'load') {
          if (!intArgs) return ['[INT] Usage: int load <file.intcnf>']
          return [
            `[INT] Loading config: ${intArgs}`,
            '[INT] Loaded 5 commands:',
            '  - hello',
            '  - greet', 
            '  - build',
            '  - test',
            '  - deploy'
          ]
        }
        
        if (intCmd === 'pack') {
          if (!intArgs) return ['[INT] Usage: int pack <file.intcnf>']
          const outFile = intArgs.replace('.intcnf', '.intpkf')
          return [
            `[INT] Packing: ${intArgs}`,
            `[INT] Created package: ${outFile}`,
            '[INT] Package ready to run'
          ]
        }
        
        if (intCmd === 'run') {
          if (!intArgs) return ['[INT] Usage: int run <file.intpkf>']
          return [
            `[INT] Running package: ${intArgs}`,
            '[INT] Executing commands...',
            '  > hello: Hello from INT!',
            '  > greet: Welcome to Geneia!',
            `[INT] Package ${intArgs} completed`
          ]
        }
        
        return [`[INT] Unknown command: ${intCmd}`, 'Type "int help" for usage']
      }
      case 'clear':
        return ['__CLEAR__']
      case 'echo':
        return [argsStr || '']
      case 'date':
        return [new Date().toString()]
      case 'whoami':
        return ['geneia-user']
      case 'pwd':
        return [activeTerminal?.cwd || '/home/geneia-user/workspace']
      case 'ls':
        return ['main.gn    README.md    examples/    src/    package.json    node_modules/']
      case 'cd':
        if (!argsStr || argsStr === '~') return ['Changed to /home/geneia-user']
        if (argsStr === '..') return ['Changed to parent directory']
        return [`Changed to ${argsStr}`]
      case 'cat':
        if (!argsStr) return ['Usage: cat <filename>']
        if (argsStr.endsWith('.gn')) return ['// Geneia source file', 'print "Hello from Geneia!"', 'let x = 42']
        return [`Contents of ${argsStr}...`]
      case 'mkdir':
        return argsStr ? [`Created directory: ${argsStr}`] : ['Usage: mkdir <dirname>']
      case 'touch':
        return argsStr ? [`Created file: ${argsStr}`] : ['Usage: touch <filename>']
      case 'rm':
        return argsStr ? [`Removed: ${argsStr}`] : ['Usage: rm <filename>']
      case 'history':
        return commandHistory.length > 0 
          ? commandHistory.map((c, i) => `  ${i + 1}  ${c}`)
          : ['No command history']
      case 'geneia': {
        // Geneia CLI with dev run command - uses real files from workspace
        const geneiaCmd = args[0]?.toLowerCase()
        const geneiaArgs = args.slice(1)
        
        if (!geneiaCmd) {
          return [
            'Geneia CLI v1.0.0',
            '',
            'Usage:',
            '  geneia dev run <file.gn> [options]    Run a Geneia file',
            '  geneia dev build                      Build the compiler',
            '  geneia dev clean                      Clean build artifacts',
            '  geneia --version                      Show version',
            '  geneia --help                         Show this help',
            '',
            'Run Options:',
            '  -d, --debug     Enable debug mode (verbose output)',
            '  -q, --quiet     Quiet mode (minimal output)',
            '  -t, --time      Show execution time',
            '',
            'Examples:',
            '  geneia dev run hello.gn',
            '  geneia dev run hello.gn --debug',
            '  geneia dev run myfile.gn -d',
            '',
            'Available files:',
            ...files.filter(f => f.name.endsWith('.gn')).map(f => `  ${f.name}`)
          ]
        }
        
        if (geneiaCmd === '--help' || geneiaCmd === '-h') {
          return [
            'Geneia CLI v1.0.0',
            '',
            'Usage:',
            '  geneia dev run <file.gn> [options]    Run a Geneia file',
            '  geneia dev build                      Build the compiler',
            '  geneia dev clean                      Clean build artifacts',
            '  geneia --version                      Show version',
            '  geneia --help                         Show this help',
            '',
            'Run Options:',
            '  -d, --debug     Enable debug mode (verbose output)',
            '  -q, --quiet     Quiet mode (minimal output)',
            '  -t, --time      Show execution time'
          ]
        }
        
        if (geneiaCmd === '--version' || geneiaCmd === '-v') {
          return ['Geneia CLI v1.0.0']
        }
        
        if (geneiaCmd === 'dev') {
          const devCmd = geneiaArgs[0]?.toLowerCase()
          const devArgs = geneiaArgs.slice(1)
          
          if (!devCmd) {
            return ['Error: Missing dev subcommand', 'Available: run, build, clean']
          }
          
          if (devCmd === 'run') {
            // Get file path - remove quotes if present
            let filePath = devArgs[0]
            if (!filePath) {
              return [
                'Error: No file specified',
                'Usage: geneia dev run <file.gn> [--debug|-d]',
                '',
                'Available files:',
                ...files.filter(f => f.name.endsWith('.gn')).map(f => `  ${f.name}`)
              ]
            }
            
            // Remove surrounding quotes
            filePath = filePath.replace(/^['"]|['"]$/g, '')
            
            // Find the file in workspace
            const targetFile = files.find(f => 
              f.name === filePath || 
              f.name === filePath.replace(/^.*\//, '') ||
              filePath.endsWith(f.name)
            )
            
            if (!targetFile) {
              return [
                `Error: File not found: ${filePath}`,
                '',
                'Available .gn files:',
                ...files.filter(f => f.name.endsWith('.gn')).map(f => `  ${f.name}`),
                '',
                'Tip: Use the exact filename from the list above'
              ]
            }
            
            const hasDebug = devArgs.includes('--debug') || devArgs.includes('-d')
            const hasTime = devArgs.includes('--time') || devArgs.includes('-t')
            const hasQuiet = devArgs.includes('--quiet') || devArgs.includes('-q')
            
            // Get actual file content
            const fileContent = targetFile.content
            const codeLines = fileContent.split('\n').slice(0, 15)
            
            // Simple interpreter simulation - extract output from the code
            const outputLines: string[] = []
            fileContent.split('\n').forEach(line => {
              const trimmed = line.trim()
              // Handle tip comments
              if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                outputLines.push(`[TIP] ${trimmed.slice(1, -1)}`)
              }
              // Handle peat (print) statements
              if (trimmed.startsWith('peat ')) {
                const match = trimmed.match(/peat\s+['"](.*)['"]/) || trimmed.match(/peat\s+'(.*)'/)
                if (match) {
                  outputLines.push(match[1])
                }
              }
              // Handle print statements
              if (trimmed.startsWith('print ') || trimmed.startsWith('print(')) {
                const match = trimmed.match(/print\s*\(?\s*['"](.*)['"]/) 
                if (match) {
                  outputLines.push(match[1])
                }
              }
            })
            
            if (hasDebug) {
              return [
                '╔════════════════════════════════════════╗',
                '║       GENEIA DEBUG MODE ENABLED        ║',
                '╚════════════════════════════════════════╝',
                '',
                `[DEBUG] File: ${targetFile.name}`,
                '[DEBUG] Compiler: geneia v1.0.0',
                `[DEBUG] Working directory: ${activeTerminal?.cwd || '/workspace'}`,
                `[DEBUG] Timestamp: ${new Date().toISOString()}`,
                `[DEBUG] File size: ${fileContent.length} bytes`,
                `[DEBUG] Lines: ${fileContent.split('\n').length}`,
                '',
                '─── Source Code ───',
                ...codeLines,
                codeLines.length < fileContent.split('\n').length ? `... (${fileContent.split('\n').length - codeLines.length} more lines)` : '',
                '───────────────────',
                '',
                '─── Output ───',
                ...(outputLines.length > 0 ? outputLines : ['(No output)']),
                '',
                '[TIME] Execution time: 2ms',
                '',
                '[DEBUG] Exit code: 0',
                '[DEBUG] Execution completed successfully'
              ].filter(l => l !== '')
            }
            
            if (hasQuiet) {
              return outputLines.length > 0 ? outputLines : ['(No output)']
            }
            
            const result = [
              `▶ Running: ${targetFile.name}`,
              '',
              ...(outputLines.length > 0 ? outputLines : ['(No output)'])
            ]
            
            if (hasTime) {
              result.push('', '[TIME] Execution time: 2ms')
            }
            
            return result
          }
          
          if (devCmd === 'build') {
            return [
              'Building Geneia compiler...',
              'g++ -std=c++17 -Wall -O2 -c main.cpp -o main.o',
              'g++ -std=c++17 -Wall -O2 -c lexer.cpp -o lexer.o',
              'g++ -std=c++17 -Wall -O2 -c parser.cpp -o parser.o',
              'g++ -std=c++17 -Wall -O2 -c interpreter.cpp -o interpreter.o',
              'g++ -std=c++17 -Wall -O2 -o geneia main.o lexer.o parser.o interpreter.o',
              '',
              'Build successful!'
            ]
          }
          
          if (devCmd === 'clean') {
            return [
              'Cleaning build artifacts...',
              'rm -f main.o lexer.o parser.o interpreter.o geneia',
              'Clean complete!'
            ]
          }
          
          return [`Error: Unknown dev command '${devCmd}'`, 'Available: run, build, clean']
        }
        
        // Legacy: direct file run (shortcut)
        if (geneiaCmd.endsWith('.gn')) {
          const targetFile = files.find(f => f.name === geneiaCmd || f.name.endsWith(geneiaCmd))
          if (targetFile) {
            return [`▶ Running: ${targetFile.name}`, '', '(Use "geneia dev run <file>" for full output)']
          }
          return [`Error: File not found: ${geneiaCmd}`]
        }
        
        return [`Error: Unknown command '${geneiaCmd}'`, 'Use \'geneia --help\' for usage information']
      }
      case 'version':
        return ['Geneia Studio v1.0.0', 'Geneia Interpreter v1.0.0', 'Terminal v1.0.0', `Node.js ${typeof process !== 'undefined' ? process.version : 'v18.0.0'}`]
      case 'uname':
        return ['Geneia OS 1.0.0 x86_64']
      case 'hostname':
        return ['geneia-studio']
      case 'uptime':
        return ['up 1 day, 2 hours, 30 minutes']
      case 'env':
        return ['PATH=/usr/local/bin:/usr/bin:/bin', 'HOME=/home/geneia-user', 'USER=geneia-user', 'SHELL=/bin/bash', 'TERM=xterm-256color']
      case 'neofetch':
        return [
          '       ▄▄▄▄▄▄▄       geneia-user@geneia-studio',
          '      ███████████    -------------------------',
          '     █████████████   OS: Geneia OS 1.0.0',
          '    ███████████████  Host: Geneia Studio',
          '   █████████████████ Kernel: 5.15.0-geneia',
          '   █████████████████ Uptime: 1 day, 2 hours',
          '   █████████████████ Shell: bash 5.1.0',
          '    ███████████████  Terminal: Geneia Terminal',
          '     █████████████   CPU: Geneia Core @ 3.5GHz',
          '      ███████████    Memory: 512MB / 16GB',
          '       ▀▀▀▀▀▀▀       '
        ]
      case 'cowsay': {
        const msg = argsStr || 'Moo!'
        return [
          ' ' + '_'.repeat(msg.length + 2),
          `< ${msg} >`,
          ' ' + '-'.repeat(msg.length + 2),
          '        \\   ^__^',
          '         \\  (oo)\\_______',
          '            (__)\\       )\\/\\',
          '                ||----w |',
          '                ||     ||'
        ]
      }
      case 'tree':
        return [
          '.',
          '├── main.gn',
          '├── README.md',
          '├── package.json',
          '├── src/',
          '│   ├── index.ts',
          '│   ├── utils.ts',
          '│   └── components/',
          '│       ├── App.tsx',
          '│       └── Editor.tsx',
          '└── examples/',
          '    ├── hello.gn',
          '    └── advanced.gn',
          '',
          '4 directories, 8 files'
        ]
      case 'git':
        if (args[0] === 'status') return ['On branch main', 'Your branch is up to date.', '', 'nothing to commit, working tree clean']
        if (args[0] === 'log') return ['commit abc123 (HEAD -> main)', 'Author: geneia-user', 'Date: today', '', '    Initial commit']
        return ['git: command requires arguments. Try: git status, git log']
      case 'npm':
        if (args[0] === 'list') return ['geneia-studio@1.0.0', '├── react@18.2.0', '├── typescript@5.0.0', '└── vite@5.0.0']
        return ['npm: try npm list']
      case 'node':
        return ['Node.js v18.0.0']
      case 'python':
        return ['Python 3.11.0']
      case 'exit':
      case 'logout':
        return ['Goodbye!', '__CLEAR__']
      default:
        if (command) return [`Command not found: ${command}`, 'Type "help" for available commands']
        return ['']
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const cmd = terminalInput.trim()
    setCommandHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)
    
    const result = runCommand(cmd)
    
    if (result.includes('__CLEAR__')) {
      setTerminals(prev => prev.map(t => 
        t.id === activeTerminalId ? { ...t, history: ['Terminal cleared'] } : t
      ))
    } else {
      const promptLine = `$ ${cmd}`
      setTerminals(prev => prev.map(t => 
        t.id === activeTerminalId 
          ? { ...t, history: [...t.history, promptLine, ...result] } 
          : t
      ))
    }
    setTerminalInput('')
    setSuggestion('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab autocomplete
    if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestion) {
        setTerminalInput(suggestion)
        setSuggestion('')
      } else if (terminalInput.length > 0) {
        // Show all matching commands
        const matches = COMMANDS.filter(c => c.startsWith(terminalInput.toLowerCase()))
        if (matches.length > 1) {
          setTerminals(prev => prev.map(t => 
            t.id === activeTerminalId 
              ? { ...t, history: [...t.history, `$ ${terminalInput}`, matches.join('  ')] } 
              : t
          ))
        } else if (matches.length === 1) {
          setTerminalInput(matches[0])
        }
      }
    }
    // Up arrow - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    }
    // Down arrow - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setTerminalInput('')
      }
    }
  }

  const addTerminal = () => {
    const newTerm: TerminalInstance = { 
      id: nextId, 
      name: 'bash', 
      history: ['New terminal session started'], 
      cwd: '/home/geneia-user/workspace' 
    }
    setTerminals(prev => [...prev, newTerm])
    setActiveTerminalId(nextId)
    setNextId(prev => prev + 1)
  }

  const closeTerminal = (id: number) => {
    if (terminals.length <= 1) return
    const remaining = terminals.filter(t => t.id !== id)
    setTerminals(remaining)
    if (activeTerminalId === id) setActiveTerminalId(remaining[0].id)
  }

  const getLineClass = (line: string): string => {
    if (line.startsWith('$')) return 'text-[var(--accent-primary)] font-semibold'
    if (line.startsWith('Error') || line.startsWith('Command not found')) return 'text-red-400'
    if (line.startsWith('Created') || line.startsWith('Changed') || line.startsWith('Removed')) return 'text-green-400'
    return 'text-theme-secondary'
  }

  const getIcon = (type: string) => {
    if (type === 'error') return <AlertCircle className="w-3 h-3 text-red-400" />
    if (type === 'success') return <CheckCircle className="w-3 h-3 text-green-400" />
    if (type === 'tip') return <Lightbulb className="w-3 h-3 text-yellow-400" />
    if (type === 'info') return <Info className="w-3 h-3 text-blue-400" />
    return null
  }

  if (!bottomPanelOpen) return null

  const height = isMinimized ? 'h-9' : isMaximized ? 'h-[60vh]' : 'h-48'
  const t = LocalizationService.t.bind(LocalizationService)

  const tabs = [
    { id: 'problems' as TabType, label: t('problems'), icon: FileWarning, badge: totalProblems },
    { id: 'output' as TabType, label: t('output'), icon: Terminal, badge: hasOutputErrors ? 1 : 0 },
    { id: 'debug' as TabType, label: t('debug'), icon: Bug, badge: 0 },
    { id: 'terminal' as TabType, label: t('terminal'), icon: Terminal, badge: 0 },
    { id: 'ports' as TabType, label: t('ports'), icon: Globe, badge: 0 },
  ]


  return (
    <div className={clsx('glass rounded-xl flex flex-col overflow-hidden transition-all duration-200', height)}>
      {/* Header */}
      <div className="px-2 py-1 border-b border-theme flex items-center justify-between bg-theme-editor/50 flex-shrink-0">
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setBottomPanelTab(tab.id); if (isMinimized) setIsMinimized(false) }}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors',
                bottomPanelTab === tab.id ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'text-theme-muted hover:text-theme-secondary'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.badge > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400">{tab.badge}</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {isRunning && <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 animate-pulse">Running...</span>}
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 rounded hover:bg-white/10">
            {isMinimized ? <ChevronUp className="w-4 h-4 text-theme-muted" /> : <ChevronDown className="w-4 h-4 text-theme-muted" />}
          </button>
          <button 
            onClick={() => !isMinimized && setIsMaximized(!isMaximized)} 
            disabled={isMinimized} 
            className={clsx('p-1 rounded', isMinimized ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10')}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4 text-theme-muted" /> : <Maximize2 className="w-4 h-4 text-theme-muted" />}
          </button>
          <button onClick={() => { setBottomPanelOpen(false); setIsMaximized(false); setIsMinimized(false) }} className="p-1 rounded hover:bg-red-500/20">
            <X className="w-4 h-4 text-theme-muted" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden">
          {/* Problems Tab - Global Error Checking */}
          {bottomPanelTab === 'problems' && (
            <div className="h-full overflow-y-auto p-2">
              {globalProblems.files.length > 0 ? (
                <div className="space-y-1">
                  {/* Summary */}
                  <div className="flex items-center gap-4 px-2 py-1 text-xs text-theme-muted border-b border-theme mb-2">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      {globalProblems.totalErrors} {t('errors').toLowerCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-yellow-400" />
                      {globalProblems.totalWarnings} {t('warnings').toLowerCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Info className="w-3 h-3 text-blue-400" />
                      {globalProblems.totalInfo} info
                    </span>
                    <span className="ml-auto">{globalProblems.files.length} files</span>
                  </div>
                  
                  {/* Files with problems */}
                  {globalProblems.files.map((fileProblems) => (
                    <div key={fileProblems.filename} className="rounded overflow-hidden">
                      {/* File header */}
                      <button
                        onClick={() => toggleFileExpand(fileProblems.filename)}
                        className={clsx(
                          'w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-white/5 transition-colors',
                          currentFile === fileProblems.filename && 'bg-[var(--accent-primary)]/10'
                        )}
                      >
                        <ChevronRight 
                          className={clsx(
                            'w-3.5 h-3.5 text-theme-muted transition-transform',
                            expandedFiles.has(fileProblems.filename) && 'rotate-90'
                          )} 
                        />
                        <FileCode className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="text-sm text-theme-primary flex-1 truncate">{fileProblems.filename}</span>
                        <span className="flex items-center gap-2 text-xs">
                          {fileProblems.counts.errors > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{fileProblems.counts.errors}</span>
                          )}
                          {fileProblems.counts.warnings > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">{fileProblems.counts.warnings}</span>
                          )}
                          {fileProblems.counts.info > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{fileProblems.counts.info}</span>
                          )}
                        </span>
                      </button>
                      
                      {/* Errors list */}
                      {expandedFiles.has(fileProblems.filename) && (
                        <div className="pl-6 border-l-2 border-theme ml-3">
                          {fileProblems.errors.map((err, i) => (
                            <button
                              key={i}
                              onClick={() => handleProblemClick(fileProblems.filename, err.line)}
                              className="w-full flex items-start gap-2 p-2 rounded hover:bg-white/5 text-left"
                            >
                              {err.severity === 'error' && <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                              {err.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />}
                              {err.severity === 'info' && <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-theme-primary truncate">{err.message}</p>
                                <p className="text-xs text-theme-muted">{t('line')} {err.line}, {t('column')} {err.column}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-theme-muted">
                  <CheckCircle className="w-8 h-8 mb-2 text-green-400/50" />
                  <p className="text-sm">{t('noResults')}</p>
                  <p className="text-xs mt-1">All {files.filter(f => f.name.endsWith('.gn')).length} Geneia files are clean</p>
                </div>
              )}
            </div>
          )}

          {/* Output Tab */}
          {bottomPanelTab === 'output' && (
            <div className="h-full p-3 overflow-y-auto font-mono text-sm">
              {output.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-theme-muted">
                  <Terminal className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">{t('runCode')} (F5)</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {output.map((line, i) => (
                    <div key={i} className={clsx('flex items-start gap-2',
                      line.type === 'error' && 'text-red-400',
                      line.type === 'success' && 'text-green-400',
                      line.type === 'tip' && 'text-yellow-400',
                      line.type === 'info' && 'text-blue-400',
                      line.type === 'peat' && 'text-theme-primary',
                      line.type === 'int' && 'text-purple-400'
                    )}>
                      {getIcon(line.type)}
                      <span className="whitespace-pre-wrap break-words">{line.text || '\u00A0'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Debug Tab */}
          {bottomPanelTab === 'debug' && (
            <DebugConsole />
          )}

          {/* Terminal Tab */}
          {bottomPanelTab === 'terminal' && (
            <div className="h-full flex">
              {/* Terminal Content */}
              <div className="flex-1 flex flex-col bg-[var(--bg-editor)]" onClick={() => inputRef.current?.focus()}>
                <div ref={terminalRef} className="flex-1 p-3 overflow-y-auto font-mono text-sm">
                  {activeTerminal?.history.map((line, i) => (
                    <div key={i} className={getLineClass(line)}>{line}</div>
                  ))}
                  <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
                    <span className="text-[var(--accent-primary)] font-bold">$</span>
                    <div className="flex-1 relative">
                      {suggestion && (
                        <span className="absolute left-0 text-theme-muted/40 pointer-events-none select-none">
                          {terminalInput}<span className="text-[var(--accent-primary)]/40">{suggestion.slice(terminalInput.length)}</span>
                        </span>
                      )}
                      <input
                        ref={inputRef}
                        value={terminalInput}
                        onChange={e => setTerminalInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent text-theme-primary outline-none caret-[var(--accent-primary)] relative z-10"
                        placeholder="Type command... (Tab to autocomplete)"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                      />
                    </div>
                  </form>
                </div>
              </div>

              {/* Terminal Tabs - Right Side */}
              <div className="w-36 border-l border-theme bg-[var(--bg-secondary)] flex flex-col">
                <div className="p-2 border-b border-theme flex items-center justify-between">
                  <span className="text-xs text-theme-muted font-medium">Terminals</span>
                  <button onClick={addTerminal} className="p-1 rounded hover:bg-white/10" title="New Terminal">
                    <Plus className="w-3.5 h-3.5 text-theme-muted" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-1">
                  {terminals.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setActiveTerminalId(t.id)}
                      className={clsx(
                        'flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer group mb-1',
                        activeTerminalId === t.id 
                          ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' 
                          : 'text-theme-muted hover:bg-white/5'
                      )}
                    >
                      <Terminal className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="flex-1 truncate">{t.name} {t.id}</span>
                      {terminals.length > 1 && (
                        <button 
                          onClick={e => { e.stopPropagation(); closeTerminal(t.id) }} 
                          className="opacity-0 group-hover:opacity-100 hover:text-red-400 flex-shrink-0"
                          title="Close Terminal"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ports Tab */}
          {bottomPanelTab === 'ports' && (
            <PortsPanel />
          )}
        </div>
      )}
    </div>
  )
}
