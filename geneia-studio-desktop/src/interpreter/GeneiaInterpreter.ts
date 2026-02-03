/**
 * Geneia Language Interpreter
 * Full TypeScript implementation for Geneia Studio
 */

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && (window as any).require

// Get ipcRenderer if in Electron
const ipcRenderer = isElectron ? (window as any).require('electron').ipcRenderer : null

export interface OutputLine {
  type: 'peat' | 'tip' | 'error' | 'success' | 'info' | 'int'
  text: string
}

type OutputCallback = (output: OutputLine) => void

interface Token {
  type: string
  value: string
  line: number
  column: number
}

export class GeneiaInterpreter {
  private output: OutputCallback
  private variables: Map<string, string | number>
  private functions: Map<string, Token[]>
  private intCommands: Map<string, string>  // INT Inc. custom commands
  private shouldExit: boolean
  private exitCode: number
  private stopRequested: boolean

  constructor(outputCallback: OutputCallback) {
    this.output = outputCallback
    this.variables = new Map()
    this.functions = new Map()
    this.intCommands = new Map()
    this.shouldExit = false
    this.exitCode = 0
    this.stopRequested = false
  }

  async execute(source: string): Promise<number> {
    this.shouldExit = false
    this.stopRequested = false
    this.variables.clear()
    this.variables.set('msg', 'Geneia Programming Language')

    try {
      const tokens = this.tokenize(source)
      await this.interpret(tokens)
    } catch (error) {
      this.output({ type: 'error', text: `Error: ${(error as Error).message}` })
    }

    return this.exitCode
  }

  stop(): void {
    this.stopRequested = true
  }

  private tokenize(source: string): Token[] {
    const tokens: Token[] = []
    let pos = 0
    let line = 1
    let column = 1

    const peek = (offset = 0) => source[pos + offset] || '\0'
    const advance = () => {
      const char = source[pos++]
      if (char === '\n') { line++; column = 1 }
      else { column++ }
      return char
    }
    const skipWhitespace = () => {
      while (/\s/.test(peek())) advance()
    }

    while (pos < source.length) {
      skipWhitespace()
      if (pos >= source.length) break

      const char = peek()
      const startLine = line
      const startCol = column

      // Comment: ! ... !
      if (char === '!') {
        advance()
        let value = ''
        while (peek() !== '!' && pos < source.length) value += advance()
        if (peek() === '!') advance()
        tokens.push({ type: 'COMMENT', value: value.trim(), line: startLine, column: startCol })
      }
      // Tip: "..."
      else if (char === '"') {
        advance()
        let value = ''
        while (peek() !== '"' && pos < source.length) value += advance()
        if (peek() === '"') advance()
        tokens.push({ type: 'TIP', value, line: startLine, column: startCol })
      }
      // String: '...'
      else if (char === "'") {
        advance()
        let value = ''
        while (peek() !== "'" && pos < source.length) value += advance()
        if (peek() === "'") advance()
        tokens.push({ type: 'STRING', value, line: startLine, column: startCol })
      }
      // Variable reference: {name}
      else if (char === '{') {
        advance()
        let value = ''
        while (peek() !== '}' && pos < source.length) value += advance()
        if (peek() === '}') advance()
        tokens.push({ type: 'VAR_REF', value: value.trim(), line: startLine, column: startCol })
      }
      // Parenthesized expression: (...)
      else if (char === '(') {
        advance()
        let value = ''
        let depth = 1
        while (depth > 0 && pos < source.length) {
          const c = advance()
          if (c === '(') depth++
          else if (c === ')') depth--
          if (depth > 0) value += c
        }
        tokens.push({ type: 'PAREN_EXPR', value: value.trim(), line: startLine, column: startCol })
      }
      // Operators
      else if (char === '=') {
        advance()
        tokens.push({ type: 'ASSIGN', value: '=', line: startLine, column: startCol })
      }
      else if (char === '&') {
        advance()
        tokens.push({ type: 'AMPERSAND', value: '&', line: startLine, column: startCol })
      }
      else if (char === '.') {
        advance()
        tokens.push({ type: 'DOT', value: '.', line: startLine, column: startCol })
      }
      // Identifier or keyword
      else if (/[a-zA-Z_]/.test(char)) {
        let value = ''
        while (/[a-zA-Z0-9_]/.test(peek())) value += advance()
        
        const keywords = ['peat', 'var', 'str', 'hold', 'msg', 'turn', 'repeat', 'exit',
                         'func', 'give', 'back', 'check', 'when', 'loop', 'import',
                         'export', 'use', 'from', 'make', 'call', 'done', 't', 'int']
        
        tokens.push({
          type: keywords.includes(value) ? 'KEYWORD' : 'IDENTIFIER',
          value,
          line: startLine,
          column: startCol
        })
      }
      // Number
      else if (/[0-9]/.test(char)) {
        let value = ''
        while (/[0-9.]/.test(peek())) value += advance()
        tokens.push({ type: 'NUMBER', value, line: startLine, column: startCol })
      }
      else {
        advance()
      }
    }

    tokens.push({ type: 'EOF', value: '', line, column })
    return tokens
  }

  private async interpret(tokens: Token[]): Promise<void> {
    let i = 0

    while (i < tokens.length && !this.shouldExit && !this.stopRequested) {
      const token = tokens[i]
      if (token.type === 'EOF') break

      // Skip comments
      if (token.type === 'COMMENT') { i++; continue }

      // Tip message
      if (token.type === 'TIP') {
        this.output({ type: 'tip', text: token.value })
        i++; continue
      }

      // peat - print
      if (token.type === 'KEYWORD' && token.value === 'peat') {
        i++
        if (tokens[i]) {
          const value = this.evaluateValue(tokens[i])
          this.output({ type: 'peat', text: String(value) })
          i++
        }
        continue
      }

      // var/str - string variable
      if (token.type === 'KEYWORD' && (token.value === 'var' || token.value === 'str')) {
        i++
        if (tokens[i]?.type === 'VAR_REF') {
          const varName = tokens[i].value
          i++
          if (tokens[i]?.type === 'ASSIGN') {
            i++
            if (tokens[i]) {
              this.variables.set(varName, this.evaluateValue(tokens[i]))
              i++
            }
          }
        }
        continue
      }

      // hold - number variable
      if (token.type === 'KEYWORD' && token.value === 'hold') {
        i++
        if (tokens[i]?.type === 'PAREN_EXPR') {
          const varName = tokens[i].value
          i++
          if (tokens[i]?.type === 'ASSIGN') {
            i++
            if (tokens[i]?.type === 'PAREN_EXPR') {
              this.variables.set(varName, this.evaluateNumber(tokens[i].value))
              i++
            }
          }
        }
        continue
      }

      // turn - loop block
      if (token.type === 'KEYWORD' && token.value === 'turn') {
        i++
        let count = 1
        if (tokens[i]?.type === 'PAREN_EXPR') {
          count = this.evaluateNumber(tokens[i].value)
          i++
        }

        // Find block content
        const blockTokens: Token[] = []
        let braceDepth = 0
        let inBlock = false

        while (i < tokens.length) {
          if (tokens[i].type === 'VAR_REF' && !inBlock) {
            // This is actually a block start {
            inBlock = true
            braceDepth = 1
            i++
            continue
          }
          
          if (inBlock) {
            // Check for nested braces in VAR_REF tokens
            if (tokens[i].type === 'VAR_REF') {
              blockTokens.push(tokens[i])
            } else if (tokens[i].type === 'EOF' || 
                      (tokens[i].type === 'KEYWORD' && 
                       ['turn', 'peat', 'var', 'str', 'hold', 'exit', 'func', 'repeat'].includes(tokens[i].value) &&
                       braceDepth === 0)) {
              break
            } else {
              blockTokens.push(tokens[i])
            }
          }
          i++
          
          // Simple heuristic: after collecting some tokens, check if we should stop
          if (inBlock && blockTokens.length > 0 && 
              tokens[i]?.type === 'KEYWORD' && 
              ['turn', 'peat', 'var', 'exit', 'func'].includes(tokens[i]?.value)) {
            // Check if this looks like a new statement
            const prevToken = tokens[i - 1]
            if (prevToken?.type !== 'AMPERSAND') {
              break
            }
          }
        }

        // Execute block
        for (let j = 0; j < count && !this.stopRequested; j++) {
          await this.interpret([...blockTokens, { type: 'EOF', value: '', line: 0, column: 0 }])
          await this.delay(10)
        }
        continue
      }

      // repeat - timed repeat
      if (token.type === 'KEYWORD' && token.value === 'repeat') {
        i++
        let message = ''
        let duration = 1
        let unit = 's'

        if (tokens[i]) {
          message = String(this.evaluateValue(tokens[i]))
          i++
        }

        // Parse & t.unit = (duration)
        while (i < tokens.length && tokens[i].type !== 'EOF') {
          if (tokens[i].type === 'AMPERSAND') { i++; continue }
          if (tokens[i].type === 'KEYWORD' && tokens[i].value === 't') {
            i++
            if (tokens[i]?.type === 'DOT') {
              i++
              if (tokens[i]?.type === 'IDENTIFIER') {
                unit = tokens[i].value
                i++
              }
            }
            continue
          }
          if (tokens[i].type === 'ASSIGN') { i++; continue }
          if (tokens[i].type === 'PAREN_EXPR') {
            duration = this.evaluateNumber(tokens[i].value)
            i++
            break
          }
          i++
        }

        const delayMs = this.getDelayMs(unit)
        for (let j = 0; j < duration && !this.stopRequested; j++) {
          this.output({ type: 'peat', text: message })
          await this.delay(delayMs)
        }
        continue
      }

      // exit
      if (token.type === 'KEYWORD' && token.value === 'exit') {
        i++
        if (tokens[i]?.type === 'PAREN_EXPR') {
          this.exitCode = this.evaluateNumber(tokens[i].value)
          i++
        }
        this.shouldExit = true
        this.output({ type: 'success', text: '' })
        this.output({ type: 'success', text: `Program exited with code ${this.exitCode}` })
        break
      }

      // import
      if (token.type === 'KEYWORD' && token.value === 'import') {
        i++
        if (tokens[i]?.type === 'IDENTIFIER') {
          this.output({ type: 'info', text: `Module '${tokens[i].value}' imported` })
          i++
        }
        continue
      }

      // int - INT Inc. command system
      if (token.type === 'KEYWORD' && token.value === 'int') {
        i++
        let subCmd = ''
        if (tokens[i]?.type === 'IDENTIFIER') {
          subCmd = tokens[i].value
          i++
        }

        if (subCmd === 'cmd') {
          // int cmd 'name' { body }
          let cmdName = ''
          if (tokens[i]?.type === 'STRING') {
            cmdName = tokens[i].value
            i++
          }
          
          // Collect command body (shell commands as string)
          let cmdBody = ''
          // Look for block or string content
          while (i < tokens.length && tokens[i].type !== 'EOF') {
            if (tokens[i].type === 'VAR_REF') {
              // This is a block { ... }
              cmdBody = tokens[i].value
              i++
              break
            } else if (tokens[i].type === 'STRING') {
              cmdBody = tokens[i].value
              i++
              break
            } else if (tokens[i].type === 'KEYWORD') {
              break
            }
            i++
          }
          
          this.intCommands.set(cmdName, cmdBody)
          this.output({ type: 'int', text: `[INT] Defined command: ${cmdName}` })
        }
        else if (subCmd === 'exec') {
          // int exec 'name' - Execute a command
          let cmdName = ''
          if (tokens[i]?.type === 'STRING') {
            cmdName = tokens[i].value
            i++
          }
          
          const cmdBody = this.intCommands.get(cmdName)
          if (cmdBody) {
            this.output({ type: 'int', text: `[INT] Executing: ${cmdName}` })
            await this.executeShellCommand(cmdBody)
          } else {
            this.output({ type: 'error', text: `[INT] Command not found: ${cmdName}` })
          }
        }
        else if (subCmd === 'list') {
          // int list - List available commands
          this.output({ type: 'int', text: '[INT] Available commands:' })
          if (this.intCommands.size === 0) {
            this.output({ type: 'int', text: '  (none defined)' })
          } else {
            for (const [name] of this.intCommands) {
              this.output({ type: 'int', text: `  - ${name}` })
            }
          }
        }
        else if (subCmd === 'load') {
          // int load 'file.intcnf' - Load config file
          let filePath = ''
          if (tokens[i]?.type === 'STRING') {
            filePath = tokens[i].value
            i++
          }
          
          if (ipcRenderer) {
            const result = await ipcRenderer.invoke('int-load-config', filePath)
            if (result.success) {
              for (const [name, body] of Object.entries(result.commands)) {
                this.intCommands.set(name, body as string)
              }
              this.output({ type: 'int', text: `[INT] Loaded config: ${filePath}` })
            } else {
              this.output({ type: 'error', text: `[INT] Failed to load: ${result.error}` })
            }
          } else {
            this.output({ type: 'error', text: '[INT] File operations require desktop app' })
          }
        }
        else if (subCmd === 'pack') {
          // int pack 'file.intcnf' - Package to .intpkf
          let configPath = ''
          if (tokens[i]?.type === 'STRING') {
            configPath = tokens[i].value
            i++
          }
          
          const outputPath = configPath.replace('.intcnf', '.intpkf')
          
          if (ipcRenderer) {
            const result = await ipcRenderer.invoke('int-pack', { configPath, outputPath })
            if (result.success) {
              this.output({ type: 'int', text: `[INT] Packaged: ${configPath} -> ${outputPath}` })
            } else {
              this.output({ type: 'error', text: `[INT] Failed to pack: ${result.error}` })
            }
          } else {
            this.output({ type: 'error', text: '[INT] File operations require desktop app' })
          }
        }
        else if (subCmd === 'run') {
          // int run 'file.intpkf' - Run packaged commands
          let filePath = ''
          if (tokens[i]?.type === 'STRING') {
            filePath = tokens[i].value
            i++
          }
          
          if (ipcRenderer) {
            const result = await ipcRenderer.invoke('int-run-package', filePath)
            if (result.success) {
              for (const { name, output } of result.results) {
                this.output({ type: 'int', text: `[INT] Running: ${name}` })
                if (output) {
                  this.output({ type: 'peat', text: output })
                }
              }
              this.output({ type: 'int', text: `[INT] Package executed: ${filePath}` })
            } else {
              this.output({ type: 'error', text: `[INT] Failed to run: ${result.error}` })
            }
          } else {
            this.output({ type: 'error', text: '[INT] File operations require desktop app' })
          }
        }
        else if (subCmd === 'shell') {
          // int shell 'command' - Execute shell command directly
          let command = ''
          if (tokens[i]?.type === 'STRING') {
            command = tokens[i].value
            i++
          }
          
          await this.executeShellCommand(command)
        }
        else {
          this.output({ type: 'int', text: '[INT] Usage: int cmd/exec/list/load/pack/run/shell' })
        }
        continue
      }

      // func definition
      if (token.type === 'KEYWORD' && token.value === 'func') {
        i++
        if (tokens[i]?.type === 'IDENTIFIER') {
          const funcName = tokens[i].value
          i++
          const blockTokens: Token[] = []
          // Skip to end of function (simplified)
          while (i < tokens.length && tokens[i].type !== 'EOF') {
            if (tokens[i].type === 'KEYWORD' && 
                ['func', 'exit'].includes(tokens[i].value)) break
            blockTokens.push(tokens[i])
            i++
          }
          this.functions.set(funcName, blockTokens)
        }
        continue
      }

      // call function
      if (token.type === 'KEYWORD' && token.value === 'call') {
        i++
        if (tokens[i]?.type === 'IDENTIFIER') {
          const funcName = tokens[i].value
          const funcTokens = this.functions.get(funcName)
          if (funcTokens) {
            await this.interpret([...funcTokens, { type: 'EOF', value: '', line: 0, column: 0 }])
          }
          i++
        }
        continue
      }

      // msg built-in
      if (token.type === 'KEYWORD' && token.value === 'msg') {
        this.output({ type: 'peat', text: String(this.variables.get('msg')) })
        i++
        continue
      }

      i++
    }
  }

  private evaluateValue(token: Token): string | number {
    if (token.type === 'STRING') return token.value
    if (token.type === 'VAR_REF') return this.variables.get(token.value) ?? ''
    if (token.type === 'PAREN_EXPR') return this.evaluateNumber(token.value)
    if (token.type === 'KEYWORD' && token.value === 'msg') return this.variables.get('msg') ?? ''
    if (token.type === 'NUMBER') return parseFloat(token.value)
    return token.value || ''
  }

  private evaluateNumber(expr: string): number {
    let evaluated = expr
    const varMatches = expr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g)
    if (varMatches) {
      for (const varName of varMatches) {
        if (this.variables.has(varName)) {
          evaluated = evaluated.replace(varName, String(this.variables.get(varName)))
        }
      }
    }
    try {
      return Function('"use strict"; return (' + evaluated + ')')()
    } catch {
      return parseFloat(evaluated) || 0
    }
  }

  private getDelayMs(unit: string): number {
    switch (unit) {
      case 'ms': return 100
      case 's': return 1000
      case 'm': return 60000
      case 'h': return 3600000
      default: return 1000
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // INT Terminal - Execute shell command
  private async executeShellCommand(command: string): Promise<void> {
    if (!command) return
    
    if (ipcRenderer) {
      try {
        const result = await ipcRenderer.invoke('int-exec', command)
        if (result.success) {
          if (result.output) {
            this.output({ type: 'peat', text: result.output })
          }
        } else {
          this.output({ type: 'error', text: result.output || 'Command failed' })
        }
      } catch (error) {
        this.output({ type: 'error', text: `Shell error: ${(error as Error).message}` })
      }
    } else {
      // Browser fallback - just show the command
      this.output({ type: 'int', text: `[INT] Would execute: ${command}` })
      this.output({ type: 'info', text: '(Shell execution requires desktop app)' })
    }
  }
}
