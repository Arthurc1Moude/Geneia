/**
 * Language Runner Service
 * Provides run/execute support for all programming languages
 */

export interface RunConfig {
  command: string
  args: string[]
  fileArg: 'append' | 'replace' | 'none'  // How to pass the filename
  needsCompile?: boolean
  compileCommand?: string
  compileArgs?: string[]
  outputExt?: string  // For compiled languages
}

export interface RunResult {
  success: boolean
  output: string
  error?: string
  exitCode?: number
  duration?: number
}

// Language run configurations
const languageRunners: Record<string, RunConfig> = {
  // Geneia
  'gn': {
    command: 'geneia',
    args: ['run'],
    fileArg: 'append'
  },
  'gns': {
    command: 'geneia',
    args: ['run'],
    fileArg: 'append'
  },
  
  // JavaScript/TypeScript
  'js': {
    command: 'node',
    args: [],
    fileArg: 'append'
  },
  'mjs': {
    command: 'node',
    args: [],
    fileArg: 'append'
  },
  'ts': {
    command: 'npx',
    args: ['ts-node'],
    fileArg: 'append'
  },
  'tsx': {
    command: 'npx',
    args: ['ts-node'],
    fileArg: 'append'
  },

  // Python
  'py': {
    command: 'python3',
    args: [],
    fileArg: 'append'
  },
  'pyw': {
    command: 'python3',
    args: [],
    fileArg: 'append'
  },
  
  // Go
  'go': {
    command: 'go',
    args: ['run'],
    fileArg: 'append'
  },
  
  // Rust
  'rs': {
    command: 'rustc',
    args: [],
    fileArg: 'append',
    needsCompile: true,
    compileCommand: 'rustc',
    compileArgs: ['-o', 'output'],
    outputExt: ''
  },
  
  // C
  'c': {
    command: 'gcc',
    args: [],
    fileArg: 'append',
    needsCompile: true,
    compileCommand: 'gcc',
    compileArgs: ['-o', 'output'],
    outputExt: ''
  },
  
  // C++
  'cpp': {
    command: 'g++',
    args: [],
    fileArg: 'append',
    needsCompile: true,
    compileCommand: 'g++',
    compileArgs: ['-o', 'output'],
    outputExt: ''
  },
  'cc': {
    command: 'g++',
    args: [],
    fileArg: 'append',
    needsCompile: true,
    compileCommand: 'g++',
    compileArgs: ['-o', 'output'],
    outputExt: ''
  },
  
  // Java
  'java': {
    command: 'java',
    args: [],
    fileArg: 'append',
    needsCompile: true,
    compileCommand: 'javac',
    compileArgs: [],
    outputExt: '.class'
  },
  
  // Kotlin
  'kt': {
    command: 'kotlin',
    args: [],
    fileArg: 'append'
  },
  
  // Ruby
  'rb': {
    command: 'ruby',
    args: [],
    fileArg: 'append'
  },
  
  // PHP
  'php': {
    command: 'php',
    args: [],
    fileArg: 'append'
  },
  
  // Swift
  'swift': {
    command: 'swift',
    args: [],
    fileArg: 'append'
  },
  
  // Dart
  'dart': {
    command: 'dart',
    args: ['run'],
    fileArg: 'append'
  },
  
  // Shell
  'sh': {
    command: 'bash',
    args: [],
    fileArg: 'append'
  },
  'bash': {
    command: 'bash',
    args: [],
    fileArg: 'append'
  },
  
  // Lua
  'lua': {
    command: 'lua',
    args: [],
    fileArg: 'append'
  },
  
  // Perl
  'pl': {
    command: 'perl',
    args: [],
    fileArg: 'append'
  },
  
  // R
  'r': {
    command: 'Rscript',
    args: [],
    fileArg: 'append'
  },
  
  // Julia
  'jl': {
    command: 'julia',
    args: [],
    fileArg: 'append'
  },
  
  // Haskell
  'hs': {
    command: 'runhaskell',
    args: [],
    fileArg: 'append'
  },
  
  // Scala
  'scala': {
    command: 'scala',
    args: [],
    fileArg: 'append'
  },
  
  // Groovy
  'groovy': {
    command: 'groovy',
    args: [],
    fileArg: 'append'
  },
  
  // Elixir
  'ex': {
    command: 'elixir',
    args: [],
    fileArg: 'append'
  },
  'exs': {
    command: 'elixir',
    args: [],
    fileArg: 'append'
  },
  
  // Clojure
  'clj': {
    command: 'clojure',
    args: [],
    fileArg: 'append'
  },
  
  // F#
  'fs': {
    command: 'dotnet',
    args: ['fsi'],
    fileArg: 'append'
  },
  
  // PowerShell
  'ps1': {
    command: 'pwsh',
    args: ['-File'],
    fileArg: 'append'
  },
}


// Get run configuration for a file extension
export function getRunConfig(extension: string): RunConfig | null {
  const ext = extension.toLowerCase().replace(/^\./, '')
  return languageRunners[ext] || null
}

// Check if a language is runnable
export function isRunnable(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return !!languageRunners[ext]
}

// Get the run command for a file
export function getRunCommand(filename: string, filePath: string): { command: string; args: string[] } | null {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const config = languageRunners[ext]
  
  if (!config) return null
  
  const args = [...config.args]
  
  if (config.fileArg === 'append') {
    args.push(filePath)
  }
  
  return {
    command: config.command,
    args
  }
}

// Get compile command for compiled languages
export function getCompileCommand(filename: string, filePath: string): { command: string; args: string[] } | null {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const config = languageRunners[ext]
  
  if (!config || !config.needsCompile || !config.compileCommand) return null
  
  const outputName = filePath.replace(/\.[^.]+$/, config.outputExt || '')
  const args = [...(config.compileArgs || [])]
  
  // Replace 'output' placeholder with actual output name
  const outputIndex = args.indexOf('output')
  if (outputIndex !== -1) {
    args[outputIndex] = outputName
  }
  
  args.push(filePath)
  
  return {
    command: config.compileCommand,
    args
  }
}

// Check if language needs compilation
export function needsCompilation(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const config = languageRunners[ext]
  return config?.needsCompile || false
}

// Get language display name
export function getLanguageName(extension: string): string {
  const ext = extension.toLowerCase().replace(/^\./, '')
  const names: Record<string, string> = {
    'gn': 'Geneia',
    'gns': 'Geneia Script',
    'js': 'JavaScript',
    'mjs': 'JavaScript (ES Module)',
    'ts': 'TypeScript',
    'tsx': 'TypeScript React',
    'py': 'Python',
    'pyw': 'Python',
    'go': 'Go',
    'rs': 'Rust',
    'c': 'C',
    'cpp': 'C++',
    'cc': 'C++',
    'java': 'Java',
    'kt': 'Kotlin',
    'rb': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'dart': 'Dart',
    'sh': 'Shell',
    'bash': 'Bash',
    'lua': 'Lua',
    'pl': 'Perl',
    'r': 'R',
    'jl': 'Julia',
    'hs': 'Haskell',
    'scala': 'Scala',
    'groovy': 'Groovy',
    'ex': 'Elixir',
    'exs': 'Elixir Script',
    'clj': 'Clojure',
    'fs': 'F#',
    'ps1': 'PowerShell',
  }
  return names[ext] || ext.toUpperCase()
}

// Get all supported languages
export function getSupportedLanguages(): { ext: string; name: string; command: string }[] {
  return Object.entries(languageRunners).map(([ext, config]) => ({
    ext,
    name: getLanguageName(ext),
    command: config.command
  }))
}