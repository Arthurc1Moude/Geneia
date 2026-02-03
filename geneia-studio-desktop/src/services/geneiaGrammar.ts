/**
 * Geneia Grammar Checker
 * Connects to the real Geneia compiler for syntax validation
 * Falls back to basic checks if compiler is unavailable
 */

// Access Electron IPC in renderer process
let ipcRenderer: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ipcRenderer = require('electron').ipcRenderer
} catch {
  // Not in Electron environment
}

export interface GrammarError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning' | 'info'
  code: string
}

export interface GrammarResult {
  valid: boolean
  errors: GrammarError[]
  compilerNotFound?: boolean
}

/**
 * Check grammar using the real Geneia compiler
 * The compiler is called with --check flag for syntax-only validation
 */
export async function checkGeneiaGrammarAsync(code: string, filename?: string): Promise<GrammarResult> {
  // Try to use the real compiler via Electron IPC
  if (ipcRenderer) {
    try {
      const result = await ipcRenderer.invoke('check-syntax', code, filename)
      if (!result.compilerNotFound) {
        // Compiler found and returned result
        // Merge with basic checks for additional warnings
        const basicResult = checkGeneiaGrammar(code, filename)
        return {
          valid: result.valid && basicResult.valid,
          errors: [...result.errors, ...basicResult.errors.filter((e: GrammarError) => e.severity !== 'error')]
        }
      }
    } catch (err) {
      console.warn('Compiler check failed, using fallback:', err)
    }
  }
  
  // Fallback to basic synchronous check
  return checkGeneiaGrammar(code, filename)
}

/**
 * Synchronous grammar check (fallback when compiler unavailable)
 * This provides basic validation without the full compiler
 */
export function checkGeneiaGrammar(code: string, _filename?: string): GrammarResult {
  const errors: GrammarError[] = []
  const lines = code.split('\n')
  
  let braceDepth = 0
  const declaredVars = new Set<string>()
  const declaredFuncs = new Set<string>()
  let hasExit = false

  // First pass: collect all declarations
  lines.forEach((line) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('!')) return
    
    // var/str {name} = value
    const varMatch = trimmed.match(/^(var|str)\s+\{(\w+)\}\s*=/)
    if (varMatch) declaredVars.add(varMatch[2])
    
    // hold (name) = value
    const holdMatch = trimmed.match(/^hold\s+\((\w+)\)\s*=/)
    if (holdMatch) declaredVars.add(holdMatch[1])
    
    // func name
    const funcMatch = trimmed.match(/^func\s+(\w+)/)
    if (funcMatch) declaredFuncs.add(funcMatch[1])
  })

  // Second pass: validate
  lines.forEach((line, lineIndex) => {
    const lineNum = lineIndex + 1
    const trimmed = line.trim()
    
    if (!trimmed) return

    // Comments ! ... !
    if (trimmed.startsWith('!')) {
      if (trimmed.length > 1 && !trimmed.endsWith('!')) {
        if (trimmed.indexOf('!', 1) === -1) {
          errors.push({
            line: lineNum, column: 1,
            message: 'Unclosed comment. Use: ! comment !',
            severity: 'error', code: 'E001'
          })
        }
      }
      return
    }

    // Tip strings "..."
    if (trimmed.startsWith('"')) {
      if (!trimmed.endsWith('"') || trimmed.length === 1) {
        errors.push({
          line: lineNum, column: 1,
          message: 'Unclosed tip string',
          severity: 'error', code: 'E002'
        })
      }
      return
    }

    // peat statement
    if (trimmed.startsWith('peat ')) {
      if (!trimmed.slice(5).trim()) {
        errors.push({
          line: lineNum, column: 6,
          message: 'peat requires an argument',
          severity: 'error', code: 'E003'
        })
      }
      return
    }

    // var/str declaration - supports str(U+XXXX) unicode syntax
    if (trimmed.startsWith('var ') || trimmed.startsWith('str ')) {
      const keyword = trimmed.startsWith('var ') ? 'var' : 'str'
      // Match: var/str {name} = 'value' OR str(U+XXXX)
      const match = trimmed.match(/^(var|str)\s+(\{(\w+)\}\s*=\s*.*|(\(U\+[0-9A-Fa-f]+\)))$/)
      if (!match) {
        errors.push({
          line: lineNum, column: 1,
          message: `Invalid ${keyword} syntax. Use: ${keyword} {name} = 'value' or str(U+XXXX)`,
          severity: 'error', code: 'E004'
        })
      }
      return
    }

    // exit statement
    if (trimmed.startsWith('exit')) {
      hasExit = true
      if (trimmed !== 'exit' && !trimmed.match(/^exit\s*\(\s*-?\d+\s*\)$/)) {
        errors.push({
          line: lineNum, column: 1,
          message: 'Invalid exit syntax. Use: exit or exit (code)',
          severity: 'error', code: 'E006'
        })
      }
      return
    }

    // func declaration
    if (trimmed.startsWith('func ')) {
      if (!trimmed.match(/^func\s+(\w+)\s*\{?/)) {
        errors.push({
          line: lineNum, column: 1,
          message: 'Invalid func syntax. Use: func name { ... }',
          severity: 'error', code: 'E007'
        })
      }
      if (trimmed.includes('{')) braceDepth++
      return
    }

    // call statement
    if (trimmed.startsWith('call ')) {
      const match = trimmed.match(/^call\s+(\w+)/)
      if (match && !declaredFuncs.has(match[1])) {
        errors.push({
          line: lineNum, column: 6,
          message: `Function '${match[1]}' is not defined`,
          severity: 'warning', code: 'W001'
        })
      }
      return
    }

    // turn block
    if (trimmed.startsWith('turn ')) {
      if (!trimmed.match(/^turn\s+\((\d+)\)\s*\{?/)) {
        errors.push({
          line: lineNum, column: 1,
          message: 'Invalid turn syntax. Use: turn (count) { ... }',
          severity: 'error', code: 'E008'
        })
      }
      if (trimmed.includes('{')) braceDepth++
      return
    }

    // import/use statement
    if (trimmed.startsWith('import ') || trimmed.startsWith('use ')) {
      if (!trimmed.match(/^(import|use)\s+(\w+)/)) {
        errors.push({
          line: lineNum, column: 1,
          message: 'Invalid import syntax. Use: import ModuleName',
          severity: 'error', code: 'E010'
        })
      }
      return
    }

    // Module call .Module.function
    if (trimmed.startsWith('.')) {
      if (!trimmed.match(/^\.(\w+)\.(\w+)/)) {
        errors.push({
          line: lineNum, column: 1,
          message: 'Invalid module call. Use: .Module.function',
          severity: 'error', code: 'E011'
        })
      }
      return
    }

    // check (conditional)
    if (trimmed.startsWith('check ')) {
      if (!trimmed.match(/^check\s+\(.+\)\s*\{?/)) {
        errors.push({
          line: lineNum, column: 1,
          message: 'Invalid check syntax. Use: check (condition) { ... }',
          severity: 'error', code: 'E012'
        })
      }
      if (trimmed.includes('{')) braceDepth++
      return
    }

    // Track braces
    const lineWithoutStrings = trimmed.replace(/'[^']*'/g, '').replace(/"[^"]*"/g, '')
    if (lineWithoutStrings === '{') braceDepth++
    if (lineWithoutStrings === '}') braceDepth--
  })

  // Unclosed braces
  if (braceDepth > 0) {
    errors.push({
      line: lines.length, column: 1,
      message: `${braceDepth} unclosed brace(s)`,
      severity: 'error', code: 'E013'
    })
  } else if (braceDepth < 0) {
    errors.push({
      line: lines.length, column: 1,
      message: `${Math.abs(braceDepth)} extra closing brace(s)`,
      severity: 'error', code: 'E014'
    })
  }

  // Info: No exit statement
  if (!hasExit && code.trim().length > 0) {
    errors.push({
      line: lines.length, column: 1,
      message: 'No exit statement. Consider adding: exit (0)',
      severity: 'info', code: 'I001'
    })
  }

  return {
    valid: errors.filter(e => e.severity === 'error').length === 0,
    errors: errors.sort((a, b) => a.line - b.line)
  }
}

export function getErrorCounts(errors: GrammarError[]) {
  return {
    errors: errors.filter(e => e.severity === 'error').length,
    warnings: errors.filter(e => e.severity === 'warning').length,
    info: errors.filter(e => e.severity === 'info').length
  }
}
