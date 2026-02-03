/**
 * Multi-language Syntax Highlighter
 * Supports Geneia and common programming languages
 */

// Language keywords definitions
const LANGUAGE_KEYWORDS: Record<string, string[]> = {
  geneia: [
    'hold', 'as', 'be', 'when', 'loop', 'give', 'make', 'call', 'done',
    'take', 'send', 'get', 'repeat', 'exit', 'var', 'str', 'func', 'back',
    'check', 'math', 'join', 'split', 'size', 'push', 'pop', 'peat', 'turn',
    'msg', 'import', 'from', 'use', 'export',
    'add', 'sub', 'mul', 'div', 'mod', 'rand',
    'len', 'wait', 'stop', 'skip', 'each', 'list', 'set', 'del', 'has',
    'gmath', 'time', 'sys', 'upper', 'lower', 'trim', 'rev',
    'now', 'unix', 'year', 'month', 'day', 'hour', 'sleep', 'os', 'arch',
    'sqrt', 'abs', 'sin', 'cos', 'tan', 'floor', 'ceil', 'round', 'pi', 'e'
  ],
  int: [
    'int', 'load', 'pack', 'run', 'cmd', 'exec', 'list'
  ],
  javascript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'default', 'try', 'catch', 'finally', 'throw',
    'class', 'extends', 'new', 'this', 'super', 'static', 'get', 'set',
    'import', 'export', 'from', 'as', 'default', 'async', 'await', 'yield',
    'typeof', 'instanceof', 'in', 'of', 'delete', 'void', 'null', 'undefined',
    'true', 'false', 'NaN', 'Infinity'
  ],
  typescript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'default', 'try', 'catch', 'finally', 'throw',
    'class', 'extends', 'new', 'this', 'super', 'static', 'get', 'set',
    'import', 'export', 'from', 'as', 'default', 'async', 'await', 'yield',
    'typeof', 'instanceof', 'in', 'of', 'delete', 'void', 'null', 'undefined',
    'true', 'false', 'NaN', 'Infinity',
    'type', 'interface', 'enum', 'namespace', 'module', 'declare', 'abstract',
    'implements', 'private', 'protected', 'public', 'readonly', 'keyof', 'infer',
    'never', 'unknown', 'any', 'string', 'number', 'boolean', 'symbol', 'bigint', 'object'
  ],
  python: [
    'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue',
    'try', 'except', 'finally', 'raise', 'with', 'as', 'import', 'from', 'pass',
    'lambda', 'yield', 'global', 'nonlocal', 'assert', 'del', 'in', 'is', 'not', 'and', 'or',
    'True', 'False', 'None', 'async', 'await', 'self', 'cls'
  ],
  java: [
    'public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface',
    'extends', 'implements', 'new', 'this', 'super', 'return', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'break', 'continue', 'default', 'try', 'catch', 'finally', 'throw',
    'throws', 'import', 'package', 'void', 'int', 'long', 'short', 'byte', 'float', 'double',
    'char', 'boolean', 'true', 'false', 'null', 'instanceof', 'synchronized', 'volatile',
    'transient', 'native', 'strictfp', 'enum', 'assert'
  ],
  cpp: [
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else',
    'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long', 'register', 'return',
    'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned',
    'void', 'volatile', 'while', 'class', 'public', 'private', 'protected', 'virtual', 'friend',
    'inline', 'namespace', 'new', 'delete', 'this', 'template', 'typename', 'using', 'try',
    'catch', 'throw', 'true', 'false', 'nullptr', 'constexpr', 'override', 'final'
  ],
  rust: [
    'fn', 'let', 'mut', 'const', 'static', 'if', 'else', 'match', 'loop', 'while', 'for',
    'in', 'break', 'continue', 'return', 'struct', 'enum', 'impl', 'trait', 'type', 'where',
    'pub', 'mod', 'use', 'as', 'self', 'super', 'crate', 'extern', 'ref', 'move', 'async',
    'await', 'dyn', 'unsafe', 'true', 'false', 'Some', 'None', 'Ok', 'Err'
  ],
  go: [
    'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else', 'fallthrough',
    'for', 'func', 'go', 'goto', 'if', 'import', 'interface', 'map', 'package', 'range',
    'return', 'select', 'struct', 'switch', 'type', 'var', 'true', 'false', 'nil', 'iota',
    'append', 'cap', 'close', 'complex', 'copy', 'delete', 'imag', 'len', 'make', 'new',
    'panic', 'print', 'println', 'real', 'recover'
  ],
  html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'script', 'style', 'link', 'meta', 'title'],
  css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom', 'flex', 'grid', 'font', 'text', 'transform', 'transition', 'animation'],
  sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN'],
}

// Comment patterns for different languages
const COMMENT_PATTERNS: Record<string, { line?: RegExp; block?: { start: string; end: string } }> = {
  geneia: { line: /!([^!]*)!/g },
  int: { line: /#.*$/gm },
  javascript: { line: /\/\/.*$/gm, block: { start: '/*', end: '*/' } },
  typescript: { line: /\/\/.*$/gm, block: { start: '/*', end: '*/' } },
  python: { line: /#.*$/gm, block: { start: '"""', end: '"""' } },
  java: { line: /\/\/.*$/gm, block: { start: '/*', end: '*/' } },
  cpp: { line: /\/\/.*$/gm, block: { start: '/*', end: '*/' } },
  rust: { line: /\/\/.*$/gm, block: { start: '/*', end: '*/' } },
  go: { line: /\/\/.*$/gm, block: { start: '/*', end: '*/' } },
  html: { block: { start: '<!--', end: '-->' } },
  css: { block: { start: '/*', end: '*/' } },
  sql: { line: /--.*$/gm, block: { start: '/*', end: '*/' } },
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function isInsideToken(pos: number, tokens: { start: number; end: number }[]): boolean {
  return tokens.some(t => pos >= t.start && pos < t.end)
}

export function highlightCode(code: string, language: string): string {
  if (!code) return '&nbsp;'
  
  // Normalize language
  const lang = language.toLowerCase()
  
  // Use Geneia highlighting for .gn files
  if (lang === 'geneia' || lang === 'gn') {
    return highlightGeneia(code)
  }
  
  // Use INT highlighting for .intcnf/.intpkf files
  if (lang === 'int' || lang === 'intcnf' || lang === 'intpkf') {
    return highlightInt(code)
  }
  
  // Generic highlighting for other languages
  return highlightGeneric(code, lang)
}

function highlightGeneia(code: string): string {
  const lines = code.split('\n')
  const highlightedLines = lines.map(line => {
    if (!line) return ''
    
    // Check if entire line is a comment
    const commentMatch = line.match(/^(\s*)(!.*!)(\s*)$/)
    if (commentMatch) {
      return escapeHtml(commentMatch[1]) + 
             `<span class="text-zinc-500 italic">${escapeHtml(commentMatch[2])}</span>` +
             escapeHtml(commentMatch[3])
    }
    
    // Check if entire line is a tip string
    const tipMatch = line.match(/^(\s*)(".*")(\s*)$/)
    if (tipMatch) {
      return escapeHtml(tipMatch[1]) + 
             `<span class="text-yellow-300">${escapeHtml(tipMatch[2])}</span>` +
             escapeHtml(tipMatch[3])
    }
    
    return highlightGeneiaLine(line)
  })
  
  return highlightedLines.join('\n') || '&nbsp;'
}

function highlightGeneiaLine(line: string): string {
  const tokens: { type: string; value: string; start: number; end: number }[] = []
  
  let match
  const commentRegex = /!([^!]*)!/g
  while ((match = commentRegex.exec(line)) !== null) {
    tokens.push({ type: 'comment', value: match[0], start: match.index, end: match.index + match[0].length })
  }
  
  const dquoteRegex = /"([^"]*)"/g
  while ((match = dquoteRegex.exec(line)) !== null) {
    if (!isInsideToken(match.index, tokens)) {
      tokens.push({ type: 'dstring', value: match[0], start: match.index, end: match.index + match[0].length })
    }
  }
  
  const squoteRegex = /'([^']*)'/g
  while ((match = squoteRegex.exec(line)) !== null) {
    if (!isInsideToken(match.index, tokens)) {
      tokens.push({ type: 'sstring', value: match[0], start: match.index, end: match.index + match[0].length })
    }
  }
  
  tokens.sort((a, b) => a.start - b.start)
  
  let result = ''
  let pos = 0
  
  for (const token of tokens) {
    if (token.start > pos) {
      result += highlightGeneiaKeywords(line.substring(pos, token.start))
    }
    
    const escaped = escapeHtml(token.value)
    switch (token.type) {
      case 'comment':
        result += `<span class="text-zinc-500 italic">${escaped}</span>`
        break
      case 'dstring':
        result += `<span class="text-yellow-300">${escaped}</span>`
        break
      case 'sstring':
        result += `<span class="text-green-400">${escaped}</span>`
        break
    }
    pos = token.end
  }
  
  if (pos < line.length) {
    result += highlightGeneiaKeywords(line.substring(pos))
  }
  
  return result
}

function highlightGeneiaKeywords(text: string): string {
  let html = escapeHtml(text)
  
  const keywords = LANGUAGE_KEYWORDS.geneia || []
  for (const kw of keywords) {
    html = html.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="text-pink-400">$1</span>')
  }
  
  html = html.replace(/\{([^}]+)\}/g, '<span class="text-purple-400">{$1}</span>')
  html = html.replace(/\((\s*-?\d+\.?\d*\s*)\)/g, '<span class="text-orange-300">($1)</span>')
  html = html.replace(/\bt\.(s|sec|ms|min|m|h|hour|d|day)\b/g, '<span class="text-cyan-400">t.$1</span>')
  html = html.replace(/\.(UI|GeneiaUI|OpenGSL|GWeb|GWS|GRender|GNEL|Math|File|Network|Graphics)\./gi, 
    '<span class="text-cyan-400">.$1.</span>')
  
  return html
}

// INT file format highlighting (.intcnf, .intpkf)
function highlightInt(code: string): string {
  const lines = code.split('\n')
  let inCommandBlock = false
  
  const highlightedLines = lines.map((line, index) => {
    if (!line) return ''
    
    const trimmed = line.trim()
    
    // INTPKF header (first line of .intpkf files)
    if (index === 0 && trimmed === 'INTPKF') {
      return `<span class="text-pink-400 font-bold">${escapeHtml(line)}</span>`
    }
    
    // Version number (second line, like "1.0")
    if (index === 1 && /^\d+\.\d+$/.test(trimmed)) {
      return `<span class="text-purple-400">${escapeHtml(line)}</span>`
    }
    
    // Command count (third line in .intpkf, just a number)
    if (index === 2 && /^\d+$/.test(trimmed)) {
      return `<span class="text-orange-300">${escapeHtml(line)}</span>`
    }
    
    // Comments (lines starting with #)
    if (trimmed.startsWith('#')) {
      return `<span class="text-zinc-500 italic">${escapeHtml(line)}</span>`
    }
    
    // Command block start [command_name]
    if (/^\[([^\]\/]+)\]$/.test(trimmed)) {
      inCommandBlock = true
      const match = trimmed.match(/^\[([^\]\/]+)\]$/)
      const indent = line.match(/^(\s*)/)?.[1] || ''
      return `${escapeHtml(indent)}<span class="text-cyan-400 font-bold">[</span><span class="text-yellow-300 font-bold">${escapeHtml(match![1])}</span><span class="text-cyan-400 font-bold">]</span>`
    }
    
    // Command block end [/]
    if (trimmed === '[/]') {
      inCommandBlock = false
      const indent = line.match(/^(\s*)/)?.[1] || ''
      return `${escapeHtml(indent)}<span class="text-cyan-400">[/]</span>`
    }
    
    // Shell commands inside blocks
    if (inCommandBlock || !trimmed.startsWith('[')) {
      return highlightShellCommand(line)
    }
    
    return escapeHtml(line)
  })
  
  return highlightedLines.join('\n') || '&nbsp;'
}

// Highlight shell commands within INT files
function highlightShellCommand(line: string): string {
  let html = escapeHtml(line)
  
  // Shell built-in commands
  const shellCommands = [
    'echo', 'cd', 'ls', 'rm', 'cp', 'mv', 'mkdir', 'rmdir', 'cat', 'grep', 'find',
    'chmod', 'chown', 'touch', 'head', 'tail', 'sort', 'uniq', 'wc', 'diff',
    'tar', 'gzip', 'gunzip', 'zip', 'unzip', 'curl', 'wget', 'ssh', 'scp',
    'make', 'gcc', 'g++', 'python', 'python3', 'node', 'npm', 'yarn', 'pip',
    'git', 'docker', 'kubectl', 'apt', 'yum', 'brew', 'cargo', 'rustc',
    'date', 'time', 'sleep', 'kill', 'ps', 'top', 'htop', 'df', 'du', 'free',
    'uname', 'hostname', 'whoami', 'id', 'env', 'export', 'source', 'alias',
    'if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'case', 'esac',
    'exit', 'return', 'break', 'continue', 'test', 'true', 'false'
  ]
  
  // Highlight shell commands at start of line
  for (const cmd of shellCommands) {
    html = html.replace(new RegExp(`^(\\s*)(${cmd})\\b`, 'g'), '$1<span class="text-pink-400">$2</span>')
  }
  
  // Highlight paths starting with ./ or /
  html = html.replace(/(\.\/[^\s]+|\/[^\s]+)/g, '<span class="text-blue-300">$1</span>')
  
  // Highlight flags (-x, --flag)
  html = html.replace(/(\s)(--?[a-zA-Z][a-zA-Z0-9-]*)/g, '$1<span class="text-purple-400">$2</span>')
  
  // Highlight strings
  html = html.replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
  html = html.replace(/'([^']*)'/g, '<span class="text-green-400">\'$1\'</span>')
  
  // Highlight variables $VAR or ${VAR}
  html = html.replace(/(\$\{[^}]+\}|\$[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="text-orange-400">$1</span>')
  
  // Highlight wildcards
  html = html.replace(/(\*)/g, '<span class="text-yellow-400">$1</span>')
  
  // Highlight pipes and redirects
  html = html.replace(/(\||&gt;|&lt;|&amp;&amp;|&gt;&gt;)/g, '<span class="text-cyan-400">$1</span>')
  
  return html
}

function highlightGeneric(code: string, language: string): string {
  const lines = code.split('\n')
  const highlightedLines = lines.map(line => {
    if (!line) return ''
    return highlightGenericLine(line, language)
  })
  
  return highlightedLines.join('\n') || '&nbsp;'
}

function highlightGenericLine(line: string, language: string): string {
  const tokens: { type: string; value: string; start: number; end: number }[] = []
  
  // Find line comments
  const commentPattern = COMMENT_PATTERNS[language]
  if (commentPattern?.line) {
    let match
    const regex = new RegExp(commentPattern.line.source, 'g')
    while ((match = regex.exec(line)) !== null) {
      tokens.push({ type: 'comment', value: match[0], start: match.index, end: match.index + match[0].length })
    }
  }
  
  // Find strings
  let match
  const dquoteRegex = /"(?:[^"\\]|\\.)*"/g
  while ((match = dquoteRegex.exec(line)) !== null) {
    if (!isInsideToken(match.index, tokens)) {
      tokens.push({ type: 'string', value: match[0], start: match.index, end: match.index + match[0].length })
    }
  }
  
  const squoteRegex = /'(?:[^'\\]|\\.)*'/g
  while ((match = squoteRegex.exec(line)) !== null) {
    if (!isInsideToken(match.index, tokens)) {
      tokens.push({ type: 'string', value: match[0], start: match.index, end: match.index + match[0].length })
    }
  }
  
  // Find template literals for JS/TS
  if (language === 'javascript' || language === 'typescript' || language === 'javascriptreact' || language === 'typescriptreact') {
    const templateRegex = /`(?:[^`\\]|\\.)*`/g
    while ((match = templateRegex.exec(line)) !== null) {
      if (!isInsideToken(match.index, tokens)) {
        tokens.push({ type: 'template', value: match[0], start: match.index, end: match.index + match[0].length })
      }
    }
  }
  
  tokens.sort((a, b) => a.start - b.start)
  
  let result = ''
  let pos = 0
  
  for (const token of tokens) {
    if (token.start > pos) {
      result += highlightGenericKeywords(line.substring(pos, token.start), language)
    }
    
    const escaped = escapeHtml(token.value)
    switch (token.type) {
      case 'comment':
        result += `<span class="text-zinc-500 italic">${escaped}</span>`
        break
      case 'string':
        result += `<span class="text-green-400">${escaped}</span>`
        break
      case 'template':
        result += `<span class="text-green-300">${escaped}</span>`
        break
    }
    pos = token.end
  }
  
  if (pos < line.length) {
    result += highlightGenericKeywords(line.substring(pos), language)
  }
  
  return result
}

function highlightGenericKeywords(text: string, language: string): string {
  let html = escapeHtml(text)
  
  // Get keywords for this language
  const keywords = LANGUAGE_KEYWORDS[language] || LANGUAGE_KEYWORDS.javascript || []
  
  // Highlight keywords
  for (const kw of keywords) {
    const regex = new RegExp(`\\b(${kw})\\b`, language === 'sql' ? 'gi' : 'g')
    html = html.replace(regex, '<span class="text-pink-400">$1</span>')
  }
  
  // Highlight numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-300">$1</span>')
  
  // Highlight function calls (word followed by parenthesis)
  html = html.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="text-yellow-300">$1</span>(')
  
  // Highlight types/classes (PascalCase)
  html = html.replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="text-cyan-400">$1</span>')
  
  return html
}

// Detect language from filename
export function detectLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  
  const extMap: Record<string, string> = {
    'gn': 'geneia', 'gns': 'geneia', 'gne': 'geneia',
    'intcnf': 'int', 'intpkf': 'int',
    'js': 'javascript', 'mjs': 'javascript', 'cjs': 'javascript',
    'ts': 'typescript', 'mts': 'typescript', 'cts': 'typescript',
    'jsx': 'javascriptreact', 'tsx': 'typescriptreact',
    'py': 'python', 'pyw': 'python',
    'java': 'java',
    'c': 'c', 'h': 'c',
    'cpp': 'cpp', 'cc': 'cpp', 'cxx': 'cpp', 'hpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'rb': 'ruby',
    'php': 'php',
    'html': 'html', 'htm': 'html',
    'css': 'css', 'scss': 'scss', 'less': 'less',
    'json': 'json',
    'yaml': 'yaml', 'yml': 'yaml',
    'xml': 'xml',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'shell', 'bash': 'shell',
    'lua': 'lua',
    'swift': 'swift',
    'kt': 'kotlin',
    'dart': 'dart',
    'vue': 'vue',
    'svelte': 'svelte',
  }
  
  return extMap[ext] || 'plaintext'
}
