import { useState } from 'react'
import { Play, Square, Bug, Terminal, Clock, CheckCircle, XCircle, Trash2, ChevronDown, ChevronRight, Settings, Zap } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { GeneiaInterpreter } from '../../interpreter/GeneiaInterpreter'
import { LocalizationService } from '../../services/localization'
import { isRunnable, getRunCommand, getLanguageName, needsCompilation, getCompileCommand, getSupportedLanguages } from '../../services/languageRunner'

export function RunPanel() {
  const { 
    currentFile, code, isRunning, setRunning, 
    runHistory, addRunHistory, clearRunHistory,
    addOutput, clearOutput 
  } = useStore()
  
  const [showDebug, setShowDebug] = useState(false)
  const [breakOnError, setBreakOnError] = useState(false)
  const [verboseOutput, setVerboseOutput] = useState(false)
  const [expandedRun, setExpandedRun] = useState<string | null>(null)
  const [showLanguages, setShowLanguages] = useState(false)
  const t = LocalizationService.t

  // Get current file extension and language
  const fileExt = currentFile.split('.').pop()?.toLowerCase() || ''
  const languageName = getLanguageName(fileExt)
  const canRun = isRunnable(currentFile)
  const isGeneiaFile = ['gn', 'gns', 'gne'].includes(fileExt)

  const handleRun = async () => {
    if (isRunning) return
    
    clearOutput()
    setRunning(true)
    
    const startTime = performance.now()
    const outputLines: string[] = []
    let exitCode = 0
    let status: 'success' | 'error' = 'success'

    // For Geneia files, use the built-in interpreter
    if (isGeneiaFile) {
      const interpreter = new GeneiaInterpreter((output) => {
        outputLines.push(`[${output.type.toUpperCase()}] ${output.text}`)
        addOutput({ ...output, timestamp: Date.now() })
        
        if (output.type === 'error') {
          status = 'error'
          exitCode = 1
        }
      })

      try {
        exitCode = await interpreter.execute(code)
        if (exitCode !== 0) status = 'error'
      } catch (err) {
        status = 'error'
        exitCode = 1
        outputLines.push(`[ERROR] ${(err as Error).message}`)
        addOutput({ type: 'error', text: (err as Error).message, timestamp: Date.now() })
      }
    } else if (canRun) {
      // For other languages, show the command that would be run
      addOutput({ type: 'info', text: `Running ${languageName} file: ${currentFile}`, timestamp: Date.now() })
      outputLines.push(`[INFO] Running ${languageName} file: ${currentFile}`)
      
      // Check if compilation is needed
      if (needsCompilation(currentFile)) {
        const compileCmd = getCompileCommand(currentFile, currentFile)
        if (compileCmd) {
          addOutput({ type: 'info', text: `Compile: ${compileCmd.command} ${compileCmd.args.join(' ')}`, timestamp: Date.now() })
          outputLines.push(`[INFO] Compile: ${compileCmd.command} ${compileCmd.args.join(' ')}`)
        }
      }
      
      const runCmd = getRunCommand(currentFile, currentFile)
      if (runCmd) {
        addOutput({ type: 'info', text: `Execute: ${runCmd.command} ${runCmd.args.join(' ')}`, timestamp: Date.now() })
        outputLines.push(`[INFO] Execute: ${runCmd.command} ${runCmd.args.join(' ')}`)
        
        // Simulate execution (in real app, this would call the actual runtime)
        addOutput({ type: 'info', text: '', timestamp: Date.now() })
        addOutput({ type: 'tip', text: '⚡ To run this file, use the terminal with the command above', timestamp: Date.now() })
        addOutput({ type: 'tip', text: '💡 Or install the language extension for integrated execution', timestamp: Date.now() })
        outputLines.push('[TIP] Use terminal or install language extension for execution')
      }
    } else {
      addOutput({ type: 'error', text: `Cannot run file: ${currentFile}`, timestamp: Date.now() })
      addOutput({ type: 'info', text: 'This file type is not executable', timestamp: Date.now() })
      outputLines.push(`[ERROR] Cannot run file: ${currentFile}`)
      status = 'error'
      exitCode = 1
    }

    const endTime = performance.now()
    const duration = (endTime - startTime) / 1000

    // Add to history
    addRunHistory({
      id: Date.now().toString(),
      file: currentFile,
      timestamp: Date.now(),
      duration,
      status,
      exitCode,
      output: outputLines
    })

    setRunning(false)
  }

  const handleStop = () => {
    setRunning(false)
    addOutput({ type: 'info', text: 'Execution stopped by user', timestamp: Date.now() })
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return date.toLocaleDateString()
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`
    return `${seconds.toFixed(2)}s`
  }

  // Group history by date
  const groupedHistory = runHistory.reduce((acc, run) => {
    const dateKey = formatDate(run.timestamp)
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(run)
    return acc
  }, {} as Record<string, typeof runHistory>)

  return (
    <div className="w-64 glass border-r border-theme flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-theme">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-theme-muted" />
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
              {t('run')} & {t('debug')}
            </span>
          </div>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`p-1 rounded ${showDebug ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'hover:bg-black/10 dark:hover:bg-white/10 text-theme-muted'}`}
            title={t('debug')}
          >
            <Bug className="w-4 h-4" />
          </button>
        </div>

        {/* Current File */}
        <div className="p-2 bg-theme-editor rounded-lg mb-3">
          <div className="text-xs text-theme-muted mb-1">Current File</div>
          <div className="text-sm text-theme-primary font-mono truncate">{currentFile}</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-theme-muted">{languageName}</span>
            {canRun ? (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Runnable
              </span>
            ) : (
              <span className="text-xs text-theme-muted">Not executable</span>
            )}
          </div>
        </div>

        {/* Run/Stop Button */}
        {isRunning ? (
          <button
            onClick={handleStop}
            className="w-full py-2.5 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center justify-center gap-2"
          >
            <Square className="w-4 h-4" />
            {t('stopCode')}
          </button>
        ) : (
          <button
            onClick={handleRun}
            className="w-full py-2.5 text-sm gradient-btn rounded-lg text-white flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {t('runCode')} {showDebug ? '(Debug)' : ''}
          </button>
        )}

        {/* Debug Options */}
        {showDebug && (
          <div className="mt-3 p-2 bg-theme-editor rounded-lg">
            <div className="text-xs text-theme-muted mb-2">Debug Options</div>
            <label className="flex items-center gap-2 text-xs text-theme-secondary mb-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={breakOnError}
                onChange={(e) => setBreakOnError(e.target.checked)}
                className="accent-[var(--accent-primary)] w-3.5 h-3.5" 
              />
              Break on error
            </label>
            <label className="flex items-center gap-2 text-xs text-theme-secondary cursor-pointer">
              <input 
                type="checkbox" 
                checked={verboseOutput}
                onChange={(e) => setVerboseOutput(e.target.checked)}
                className="accent-[var(--accent-primary)] w-3.5 h-3.5" 
              />
              Verbose output
            </label>
          </div>
        )}

        {/* Supported Languages */}
        <button
          onClick={() => setShowLanguages(!showLanguages)}
          className="w-full mt-3 p-2 bg-theme-editor rounded-lg text-left hover:bg-black/5 dark:hover:bg-white/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-theme-muted flex items-center gap-1">
              <Settings className="w-3 h-3" /> Supported Languages
            </span>
            {showLanguages ? (
              <ChevronDown className="w-3 h-3 text-theme-muted" />
            ) : (
              <ChevronRight className="w-3 h-3 text-theme-muted" />
            )}
          </div>
        </button>
        
        {showLanguages && (
          <div className="mt-2 p-2 bg-theme-editor rounded-lg max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1">
              {getSupportedLanguages().map(lang => (
                <div 
                  key={lang.ext}
                  className="text-xs p-1.5 rounded bg-black/5 dark:bg-white/5 flex items-center justify-between"
                >
                  <span className="text-theme-primary">.{lang.ext}</span>
                  <span className="text-theme-muted text-[10px]">{lang.command}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Run History */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-theme-secondary flex items-center gap-1">
              <Clock className="w-3 h-3" /> Run History
            </span>
            {runHistory.length > 0 && (
              <button
                onClick={clearRunHistory}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                title={t('clear')}
              >
                <Trash2 className="w-3 h-3 text-theme-muted" />
              </button>
            )}
          </div>

          {runHistory.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(groupedHistory).map(([date, runs]) => (
                <div key={date}>
                  <div className="text-xs text-theme-muted mb-1 px-1">{date}</div>
                  <div className="space-y-1">
                    {runs.map(run => (
                      <div key={run.id}>
                        <button
                          onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                          className="w-full p-2 rounded-lg bg-theme-editor hover:bg-black/5 dark:hover:bg-white/5 text-left"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {expandedRun === run.id ? (
                                <ChevronDown className="w-3 h-3 text-theme-muted" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-theme-muted" />
                              )}
                              <span className="text-xs text-theme-primary font-mono truncate max-w-[120px]">
                                {run.file}
                              </span>
                            </div>
                            {run.status === 'success' ? (
                              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-theme-muted pl-5">
                            <span>{formatTime(run.timestamp)}</span>
                            <span>{formatDuration(run.duration)}</span>
                          </div>
                        </button>
                        
                        {/* Expanded Output */}
                        {expandedRun === run.id && run.output.length > 0 && (
                          <div className="mt-1 p-2 bg-black/20 rounded-lg max-h-32 overflow-y-auto">
                            {run.output.map((line, i) => (
                              <div key={i} className="text-xs font-mono text-theme-muted truncate">
                                {line}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-theme-muted text-xs py-8">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No run history
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
