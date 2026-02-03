/**
 * Extension Runtime System
 * Provides real functionality for installed extensions
 */

import { InstalledExtension } from '../store/useStore'

// Extension capabilities
export interface ExtensionCapabilities {
  languages?: string[]
  syntaxHighlight?: boolean
  formatting?: boolean
  linting?: boolean
  snippets?: boolean
  intellisense?: boolean
  debugging?: boolean
  themes?: boolean
}

// Extension contribution
export interface ExtensionContribution {
  id: string
  displayName: string
  capabilities: ExtensionCapabilities
  activate: () => void
  deactivate: () => void
  // Language features
  getSyntaxRules?: () => SyntaxRule[]
  getSnippets?: () => Snippet[]
  formatCode?: (code: string, language: string) => string
  lintCode?: (code: string, language: string) => LintResult[]
  getCompletions?: (code: string, position: number, language: string) => Completion[]
}

export interface SyntaxRule {
  pattern: RegExp
  className: string
  priority?: number
}

export interface Snippet {
  prefix: string
  body: string
  description: string
}

export interface LintResult {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning' | 'info'
  rule?: string
}

export interface Completion {
  label: string
  kind: 'keyword' | 'function' | 'variable' | 'snippet' | 'class' | 'property'
  detail?: string
  insertText: string
}

// Registry of extension implementations
const extensionRegistry = new Map<string, ExtensionContribution>()

// Active extensions
const activeExtensions = new Set<string>()

// Built-in extension implementations
const builtInExtensions: Record<string, () => ExtensionContribution> = {
  // INT Extension (Geneia Internal Commands)
  'geneia.int': () => ({
    id: 'geneia.int',
    displayName: 'INT (Geneia Internal)',
    capabilities: { languages: ['int', 'intcnf', 'intpkf'], syntaxHighlight: true, snippets: true, intellisense: true },
    activate: () => console.log('[Extension] INT activated'),
    deactivate: () => console.log('[Extension] INT deactivated'),
    getSyntaxRules: () => [
      { pattern: /#.*/g, className: 'text-zinc-500 italic' },
      { pattern: /\[[^\]\/]+\]/g, className: 'text-cyan-400 font-bold' },
      { pattern: /\[\/\]/g, className: 'text-cyan-400' },
      { pattern: /"[^"]*"|'[^']*'/g, className: 'text-green-400' },
      { pattern: /\b(int|load|pack|run|cmd|exec|list)\b/g, className: 'text-pink-400' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'text-orange-300' },
      { pattern: /^INTPKF$/gm, className: 'text-pink-400 font-bold' },
    ],
    getSnippets: () => [
      { prefix: 'cmd', body: '[${1:command_name}]\n${2:shell_command}\n', description: 'Define a command block' },
      { prefix: 'load', body: 'int load \'${1:file.intcnf}\'', description: 'Load config file' },
      { prefix: 'pack', body: 'int pack \'${1:file.intcnf}\'', description: 'Package config to .intpkf' },
      { prefix: 'run', body: 'int run \'${1:file.intpkf}\'', description: 'Run packaged commands' },
      { prefix: 'exec', body: 'int exec \'${1:command_name}\'', description: 'Execute a defined command' },
      { prefix: 'list', body: 'int list', description: 'List available commands' },
    ],
    getCompletions: () => [
      { label: 'int load', kind: 'keyword', detail: 'Load config file', insertText: 'int load \'${1:file.intcnf}\'' },
      { label: 'int pack', kind: 'keyword', detail: 'Package config', insertText: 'int pack \'${1:file.intcnf}\'' },
      { label: 'int run', kind: 'keyword', detail: 'Run package', insertText: 'int run \'${1:file.intpkf}\'' },
      { label: 'int cmd', kind: 'keyword', detail: 'Define command', insertText: 'int cmd \'${1:name}\' { ${2} }' },
      { label: 'int exec', kind: 'keyword', detail: 'Execute command', insertText: 'int exec \'${1:name}\'' },
      { label: 'int list', kind: 'keyword', detail: 'List commands', insertText: 'int list' },
    ]
  }),

  // Python Extension
  'ms-python.python': () => ({
    id: 'ms-python.python',
    displayName: 'Python',
    capabilities: { languages: ['python', 'py'], syntaxHighlight: true, formatting: true, linting: true, snippets: true, intellisense: true },
    activate: () => console.log('[Extension] Python activated'),
    deactivate: () => console.log('[Extension] Python deactivated'),
    getSyntaxRules: () => [
      { pattern: /#.*/g, className: 'text-zinc-500 italic' },
      { pattern: /"""[\s\S]*?"""|'''[\s\S]*?'''/g, className: 'text-zinc-500 italic' },
      { pattern: /"[^"]*"|'[^']*'/g, className: 'text-green-400' },
      { pattern: /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|raise|pass|break|continue|and|or|not|in|is|lambda|async|await|True|False|None)\b/g, className: 'text-pink-400' },
      { pattern: /\b(print|len|range|str|int|float|list|dict|set|tuple|open|input|type|isinstance|hasattr|getattr|setattr)\b/g, className: 'text-cyan-400' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'text-purple-400' },
      { pattern: /@\w+/g, className: 'text-yellow-400' },
      { pattern: /\b(self|cls)\b/g, className: 'text-orange-400' },
    ],
    getSnippets: () => [
      { prefix: 'def', body: 'def ${1:name}(${2:args}):\n    ${3:pass}', description: 'Define function' },
      { prefix: 'class', body: 'class ${1:Name}:\n    def __init__(self${2:, args}):\n        ${3:pass}', description: 'Define class' },
      { prefix: 'if', body: 'if ${1:condition}:\n    ${2:pass}', description: 'If statement' },
      { prefix: 'for', body: 'for ${1:item} in ${2:items}:\n    ${3:pass}', description: 'For loop' },
      { prefix: 'try', body: 'try:\n    ${1:pass}\nexcept ${2:Exception} as e:\n    ${3:pass}', description: 'Try/except block' },
    ],
    formatCode: (code) => {
      // Basic Python formatting
      return code.split('\n').map(line => {
        const trimmed = line.trimEnd()
        return trimmed
      }).join('\n')
    },
    lintCode: (code) => {
      const results: LintResult[] = []
      const lines = code.split('\n')
      lines.forEach((line, i) => {
        if (line.length > 120) results.push({ line: i + 1, column: 120, message: 'Line too long (>120 chars)', severity: 'warning', rule: 'E501' })
        if (/\t/.test(line)) results.push({ line: i + 1, column: line.indexOf('\t') + 1, message: 'Use spaces instead of tabs', severity: 'warning', rule: 'W191' })
        if (/==\s*(True|False|None)\b/.test(line)) results.push({ line: i + 1, column: 1, message: 'Use "is" for None/True/False comparison', severity: 'warning', rule: 'E711' })
      })
      return results
    },
    getCompletions: () => [
      { label: 'print', kind: 'function', detail: 'Print to stdout', insertText: 'print(${1})' },
      { label: 'def', kind: 'keyword', detail: 'Define function', insertText: 'def ${1:name}(${2}):\n    ${3}' },
      { label: 'class', kind: 'keyword', detail: 'Define class', insertText: 'class ${1:Name}:\n    ${2}' },
      { label: 'import', kind: 'keyword', detail: 'Import module', insertText: 'import ${1}' },
      { label: 'from', kind: 'keyword', detail: 'Import from module', insertText: 'from ${1} import ${2}' },
    ]
  }),

  // JavaScript/TypeScript Extension
  'dbaeumer.vscode-eslint': () => ({
    id: 'dbaeumer.vscode-eslint',
    displayName: 'ESLint',
    capabilities: { languages: ['javascript', 'typescript', 'js', 'ts', 'jsx', 'tsx'], linting: true },
    activate: () => console.log('[Extension] ESLint activated'),
    deactivate: () => console.log('[Extension] ESLint deactivated'),
    lintCode: (code) => {
      const results: LintResult[] = []
      const lines = code.split('\n')
      lines.forEach((line, i) => {
        if (/var\s+/.test(line)) results.push({ line: i + 1, column: line.indexOf('var') + 1, message: 'Unexpected var, use let or const instead', severity: 'warning', rule: 'no-var' })
        if (/console\.log/.test(line)) results.push({ line: i + 1, column: line.indexOf('console') + 1, message: 'Unexpected console statement', severity: 'warning', rule: 'no-console' })
        if (/==(?!=)/.test(line)) results.push({ line: i + 1, column: 1, message: 'Expected === instead of ==', severity: 'warning', rule: 'eqeqeq' })
        if (/;\s*$/.test(line) === false && line.trim() && !line.trim().endsWith('{') && !line.trim().endsWith(',')) {
          // results.push({ line: i + 1, column: line.length, message: 'Missing semicolon', severity: 'error', rule: 'semi' })
        }
      })
      return results
    }
  }),

  // Prettier Extension
  'esbenp.prettier-vscode': () => ({
    id: 'esbenp.prettier-vscode',
    displayName: 'Prettier',
    capabilities: { languages: ['javascript', 'typescript', 'json', 'html', 'css', 'markdown'], formatting: true },
    activate: () => console.log('[Extension] Prettier activated'),
    deactivate: () => console.log('[Extension] Prettier deactivated'),
    formatCode: (code, language) => {
      if (language === 'json') {
        try {
          return JSON.stringify(JSON.parse(code), null, 2)
        } catch { return code }
      }
      // Basic JS/TS formatting
      let formatted = code
      formatted = formatted.replace(/\s*{\s*/g, ' {\n  ')
      formatted = formatted.replace(/\s*}\s*/g, '\n}\n')
      formatted = formatted.replace(/;\s*/g, ';\n')
      return formatted
    }
  }),


  // HTML/CSS Extension
  'ecmel.vscode-html-css': () => ({
    id: 'ecmel.vscode-html-css',
    displayName: 'HTML CSS Support',
    capabilities: { languages: ['html', 'css', 'scss', 'less'], syntaxHighlight: true, intellisense: true, snippets: true },
    activate: () => console.log('[Extension] HTML CSS Support activated'),
    deactivate: () => console.log('[Extension] HTML CSS Support deactivated'),
    getSyntaxRules: () => [
      { pattern: /<!--[\s\S]*?-->/g, className: 'text-zinc-500 italic' },
      { pattern: /<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s|>|$)/g, className: 'text-pink-400' },
      { pattern: /\s[a-zA-Z-]+(?==)/g, className: 'text-cyan-400' },
      { pattern: /"[^"]*"|'[^']*'/g, className: 'text-green-400' },
      { pattern: /&[a-zA-Z]+;/g, className: 'text-purple-400' },
    ],
    getSnippets: () => [
      { prefix: 'html', body: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${1:Document}</title>\n</head>\n<body>\n  ${2}\n</body>\n</html>', description: 'HTML5 boilerplate' },
      { prefix: 'div', body: '<div class="${1}">${2}</div>', description: 'Div element' },
      { prefix: 'link', body: '<link rel="stylesheet" href="${1:style.css}">', description: 'CSS link' },
      { prefix: 'script', body: '<script src="${1:script.js}"></script>', description: 'Script tag' },
    ],
    getCompletions: () => [
      { label: 'div', kind: 'snippet', detail: 'Division element', insertText: '<div>${1}</div>' },
      { label: 'span', kind: 'snippet', detail: 'Span element', insertText: '<span>${1}</span>' },
      { label: 'class', kind: 'property', detail: 'Class attribute', insertText: 'class="${1}"' },
      { label: 'id', kind: 'property', detail: 'ID attribute', insertText: 'id="${1}"' },
    ]
  }),

  // Go Extension
  'golang.go': () => ({
    id: 'golang.go',
    displayName: 'Go',
    capabilities: { languages: ['go'], syntaxHighlight: true, formatting: true, linting: true, snippets: true },
    activate: () => console.log('[Extension] Go activated'),
    deactivate: () => console.log('[Extension] Go deactivated'),
    getSyntaxRules: () => [
      { pattern: /\/\/.*/g, className: 'text-zinc-500 italic' },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-zinc-500 italic' },
      { pattern: /"[^"]*"|`[^`]*`/g, className: 'text-green-400' },
      { pattern: /\b(package|import|func|var|const|type|struct|interface|map|chan|go|defer|return|if|else|for|range|switch|case|default|break|continue|select|fallthrough)\b/g, className: 'text-pink-400' },
      { pattern: /\b(string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|bool|byte|rune|error|nil|true|false|iota)\b/g, className: 'text-cyan-400' },
      { pattern: /\b(fmt|log|os|io|net|http|json|time|sync|context)\b/g, className: 'text-yellow-400' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'text-purple-400' },
    ],
    getSnippets: () => [
      { prefix: 'func', body: 'func ${1:name}(${2:params}) ${3:returnType} {\n\t${4}\n}', description: 'Function' },
      { prefix: 'main', body: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t${1:fmt.Println("Hello")}\n}', description: 'Main package' },
      { prefix: 'struct', body: 'type ${1:Name} struct {\n\t${2:Field} ${3:Type}\n}', description: 'Struct definition' },
      { prefix: 'iferr', body: 'if err != nil {\n\treturn ${1:err}\n}', description: 'Error check' },
    ],
    formatCode: (code) => {
      // Basic Go formatting (gofmt-like)
      return code.split('\n').map(line => line.trimEnd()).join('\n')
    },
    lintCode: (code) => {
      const results: LintResult[] = []
      const lines = code.split('\n')
      lines.forEach((line, i) => {
        if (/\t/.test(line) === false && line.startsWith('  ')) {
          results.push({ line: i + 1, column: 1, message: 'Use tabs for indentation', severity: 'warning' })
        }
      })
      return results
    }
  }),

  // Rust Extension
  'rust-lang.rust-analyzer': () => ({
    id: 'rust-lang.rust-analyzer',
    displayName: 'rust-analyzer',
    capabilities: { languages: ['rust', 'rs'], syntaxHighlight: true, linting: true, snippets: true, intellisense: true },
    activate: () => console.log('[Extension] rust-analyzer activated'),
    deactivate: () => console.log('[Extension] rust-analyzer deactivated'),
    getSyntaxRules: () => [
      { pattern: /\/\/.*/g, className: 'text-zinc-500 italic' },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-zinc-500 italic' },
      { pattern: /"[^"]*"/g, className: 'text-green-400' },
      { pattern: /\b(fn|let|mut|const|static|struct|enum|impl|trait|type|mod|use|pub|crate|self|super|where|as|in|for|loop|while|if|else|match|return|break|continue|move|ref|async|await|dyn|unsafe)\b/g, className: 'text-pink-400' },
      { pattern: /\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result|Box|Rc|Arc|Some|None|Ok|Err|true|false)\b/g, className: 'text-cyan-400' },
      { pattern: /\b(println!|print!|format!|vec!|panic!|assert!|debug!)\b/g, className: 'text-yellow-400' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'text-purple-400' },
      { pattern: /'[a-zA-Z_]\w*/g, className: 'text-orange-400' },
    ],
    getSnippets: () => [
      { prefix: 'fn', body: 'fn ${1:name}(${2:params}) -> ${3:ReturnType} {\n    ${4}\n}', description: 'Function' },
      { prefix: 'struct', body: 'struct ${1:Name} {\n    ${2:field}: ${3:Type},\n}', description: 'Struct' },
      { prefix: 'impl', body: 'impl ${1:Type} {\n    ${2}\n}', description: 'Implementation' },
      { prefix: 'match', body: 'match ${1:expr} {\n    ${2:pattern} => ${3:result},\n}', description: 'Match expression' },
    ]
  }),

  // C/C++ Extension
  'ms-vscode.cpptools': () => ({
    id: 'ms-vscode.cpptools',
    displayName: 'C/C++',
    capabilities: { languages: ['c', 'cpp', 'h', 'hpp'], syntaxHighlight: true, snippets: true, intellisense: true },
    activate: () => console.log('[Extension] C/C++ activated'),
    deactivate: () => console.log('[Extension] C/C++ deactivated'),
    getSyntaxRules: () => [
      { pattern: /\/\/.*/g, className: 'text-zinc-500 italic' },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-zinc-500 italic' },
      { pattern: /"[^"]*"/g, className: 'text-green-400' },
      { pattern: /'[^']*'/g, className: 'text-green-400' },
      { pattern: /#\s*(include|define|ifdef|ifndef|endif|pragma|if|else|elif|undef)\b.*/g, className: 'text-purple-400' },
      { pattern: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|class|public|private|protected|virtual|template|typename|namespace|using|new|delete|this|try|catch|throw|nullptr|true|false)\b/g, className: 'text-pink-400' },
      { pattern: /\b(printf|scanf|malloc|free|strlen|strcpy|strcmp|memcpy|memset|cout|cin|endl|vector|string|map|set)\b/g, className: 'text-cyan-400' },
      { pattern: /\b\d+\.?\d*[fFlLuU]?\b/g, className: 'text-purple-400' },
    ],
    getSnippets: () => [
      { prefix: 'main', body: 'int main(int argc, char *argv[]) {\n    ${1}\n    return 0;\n}', description: 'Main function' },
      { prefix: 'for', body: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3}\n}', description: 'For loop' },
      { prefix: 'class', body: 'class ${1:Name} {\npublic:\n    ${1:Name}();\n    ~${1:Name}();\nprivate:\n    ${2}\n};', description: 'Class definition' },
      { prefix: 'include', body: '#include <${1:iostream}>', description: 'Include header' },
    ]
  }),

  // Java Extension
  'redhat.java': () => ({
    id: 'redhat.java',
    displayName: 'Language Support for Java',
    capabilities: { languages: ['java'], syntaxHighlight: true, snippets: true, intellisense: true, formatting: true },
    activate: () => console.log('[Extension] Java activated'),
    deactivate: () => console.log('[Extension] Java deactivated'),
    getSyntaxRules: () => [
      { pattern: /\/\/.*/g, className: 'text-zinc-500 italic' },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-zinc-500 italic' },
      { pattern: /"[^"]*"/g, className: 'text-green-400' },
      { pattern: /'[^']*'/g, className: 'text-green-400' },
      { pattern: /@\w+/g, className: 'text-yellow-400' },
      { pattern: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null)\b/g, className: 'text-pink-400' },
      { pattern: /\b(System|String|Integer|Double|Boolean|List|ArrayList|Map|HashMap|Set|HashSet|Object|Exception|Thread|Runnable)\b/g, className: 'text-cyan-400' },
      { pattern: /\b\d+\.?\d*[fFdDlL]?\b/g, className: 'text-purple-400' },
    ],
    getSnippets: () => [
      { prefix: 'main', body: 'public static void main(String[] args) {\n    ${1}\n}', description: 'Main method' },
      { prefix: 'class', body: 'public class ${1:Name} {\n    ${2}\n}', description: 'Class definition' },
      { prefix: 'sout', body: 'System.out.println(${1});', description: 'Print to console' },
      { prefix: 'for', body: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n    ${3}\n}', description: 'For loop' },
    ]
  }),

  // Docker Extension
  'ms-azuretools.vscode-docker': () => ({
    id: 'ms-azuretools.vscode-docker',
    displayName: 'Docker',
    capabilities: { languages: ['dockerfile', 'docker-compose'], syntaxHighlight: true, snippets: true },
    activate: () => console.log('[Extension] Docker activated'),
    deactivate: () => console.log('[Extension] Docker deactivated'),
    getSyntaxRules: () => [
      { pattern: /#.*/g, className: 'text-zinc-500 italic' },
      { pattern: /\b(FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b/gi, className: 'text-pink-400' },
      { pattern: /"[^"]*"|'[^']*'/g, className: 'text-green-400' },
    ],
    getSnippets: () => [
      { prefix: 'FROM', body: 'FROM ${1:image}:${2:tag}', description: 'Base image' },
      { prefix: 'RUN', body: 'RUN ${1:command}', description: 'Run command' },
      { prefix: 'COPY', body: 'COPY ${1:src} ${2:dest}', description: 'Copy files' },
      { prefix: 'EXPOSE', body: 'EXPOSE ${1:port}', description: 'Expose port' },
    ]
  }),

  // YAML Extension
  'redhat.vscode-yaml': () => ({
    id: 'redhat.vscode-yaml',
    displayName: 'YAML',
    capabilities: { languages: ['yaml', 'yml'], syntaxHighlight: true, formatting: true },
    activate: () => console.log('[Extension] YAML activated'),
    deactivate: () => console.log('[Extension] YAML deactivated'),
    getSyntaxRules: () => [
      { pattern: /#.*/g, className: 'text-zinc-500 italic' },
      { pattern: /^[\s]*[a-zA-Z_][a-zA-Z0-9_-]*(?=:)/gm, className: 'text-cyan-400' },
      { pattern: /"[^"]*"|'[^']*'/g, className: 'text-green-400' },
      { pattern: /\b(true|false|null|yes|no|on|off)\b/gi, className: 'text-pink-400' },
      { pattern: /\b\d+\.?\d*\b/g, className: 'text-purple-400' },
    ]
  }),

  // Markdown Extension
  'yzhang.markdown-all-in-one': () => ({
    id: 'yzhang.markdown-all-in-one',
    displayName: 'Markdown All in One',
    capabilities: { languages: ['markdown', 'md'], syntaxHighlight: true, formatting: true, snippets: true },
    activate: () => console.log('[Extension] Markdown activated'),
    deactivate: () => console.log('[Extension] Markdown deactivated'),
    getSyntaxRules: () => [
      { pattern: /^#{1,6}\s.*/gm, className: 'text-pink-400 font-bold' },
      { pattern: /\*\*[^*]+\*\*/g, className: 'text-theme-primary font-bold' },
      { pattern: /\*[^*]+\*/g, className: 'text-theme-primary italic' },
      { pattern: /`[^`]+`/g, className: 'text-cyan-400 bg-black/20 px-1 rounded' },
      { pattern: /```[\s\S]*?```/g, className: 'text-green-400' },
      { pattern: /\[([^\]]+)\]\([^)]+\)/g, className: 'text-blue-400 underline' },
      { pattern: /^[-*+]\s/gm, className: 'text-yellow-400' },
      { pattern: /^\d+\.\s/gm, className: 'text-yellow-400' },
    ],
    getSnippets: () => [
      { prefix: 'link', body: '[${1:text}](${2:url})', description: 'Markdown link' },
      { prefix: 'img', body: '![${1:alt}](${2:url})', description: 'Markdown image' },
      { prefix: 'code', body: '```${1:language}\n${2:code}\n```', description: 'Code block' },
      { prefix: 'table', body: '| ${1:Header} | ${2:Header} |\n|---|---|\n| ${3:Cell} | ${4:Cell} |', description: 'Table' },
    ]
  }),

  // Git Extension (GitLens)
  'eamodio.gitlens': () => ({
    id: 'eamodio.gitlens',
    displayName: 'GitLens',
    capabilities: { languages: [] },
    activate: () => console.log('[Extension] GitLens activated'),
    deactivate: () => console.log('[Extension] GitLens deactivated'),
  }),

  // Theme Extensions
  'dracula-theme.theme-dracula': () => ({
    id: 'dracula-theme.theme-dracula',
    displayName: 'Dracula Official',
    capabilities: { themes: true },
    activate: () => console.log('[Extension] Dracula Theme activated'),
    deactivate: () => console.log('[Extension] Dracula Theme deactivated'),
  }),

  'github.github-vscode-theme': () => ({
    id: 'github.github-vscode-theme',
    displayName: 'GitHub Theme',
    capabilities: { themes: true },
    activate: () => console.log('[Extension] GitHub Theme activated'),
    deactivate: () => console.log('[Extension] GitHub Theme deactivated'),
  }),

  'pkief.material-icon-theme': () => ({
    id: 'pkief.material-icon-theme',
    displayName: 'Material Icon Theme',
    capabilities: { themes: true },
    activate: () => console.log('[Extension] Material Icon Theme activated'),
    deactivate: () => console.log('[Extension] Material Icon Theme deactivated'),
  }),
}

// Extension Runtime API
export const ExtensionRuntime = {
  // Initialize extension
  activateExtension(ext: InstalledExtension): boolean {
    if (!ext.enabled) return false
    if (activeExtensions.has(ext.id)) return true

    // Check if we have a built-in implementation
    const factory = builtInExtensions[ext.id]
    if (factory) {
      const contribution = factory()
      extensionRegistry.set(ext.id, contribution)
      contribution.activate()
      activeExtensions.add(ext.id)
      console.log(`[ExtensionRuntime] Activated: ${ext.displayName}`)
      return true
    }

    // For extensions without built-in support, create a generic entry
    const genericContribution: ExtensionContribution = {
      id: ext.id,
      displayName: ext.displayName,
      capabilities: {},
      activate: () => console.log(`[Extension] ${ext.displayName} activated (generic)`),
      deactivate: () => console.log(`[Extension] ${ext.displayName} deactivated`),
    }
    extensionRegistry.set(ext.id, genericContribution)
    genericContribution.activate()
    activeExtensions.add(ext.id)
    return true
  },

  // Deactivate extension
  deactivateExtension(extId: string): void {
    const contribution = extensionRegistry.get(extId)
    if (contribution) {
      contribution.deactivate()
      activeExtensions.delete(extId)
      console.log(`[ExtensionRuntime] Deactivated: ${contribution.displayName}`)
    }
  },

  // Get all active extensions for a language
  getExtensionsForLanguage(language: string): ExtensionContribution[] {
    const results: ExtensionContribution[] = []
    extensionRegistry.forEach(ext => {
      if (ext.capabilities.languages?.includes(language)) {
        results.push(ext)
      }
    })
    return results
  },

  // Get syntax rules for a language
  getSyntaxRules(language: string): SyntaxRule[] {
    const rules: SyntaxRule[] = []
    this.getExtensionsForLanguage(language).forEach(ext => {
      if (ext.getSyntaxRules) {
        rules.push(...ext.getSyntaxRules())
      }
    })
    return rules
  },

  // Get snippets for a language
  getSnippets(language: string): Snippet[] {
    const snippets: Snippet[] = []
    this.getExtensionsForLanguage(language).forEach(ext => {
      if (ext.getSnippets) {
        snippets.push(...ext.getSnippets())
      }
    })
    return snippets
  },

  // Format code
  formatCode(code: string, language: string): string {
    const extensions = this.getExtensionsForLanguage(language)
    for (const ext of extensions) {
      if (ext.formatCode) {
        return ext.formatCode(code, language)
      }
    }
    return code
  },

  // Lint code
  lintCode(code: string, language: string): LintResult[] {
    const results: LintResult[] = []
    this.getExtensionsForLanguage(language).forEach(ext => {
      if (ext.lintCode) {
        results.push(...ext.lintCode(code, language))
      }
    })
    return results
  },

  // Get completions
  getCompletions(code: string, position: number, language: string): Completion[] {
    const completions: Completion[] = []
    this.getExtensionsForLanguage(language).forEach(ext => {
      if (ext.getCompletions) {
        completions.push(...ext.getCompletions(code, position, language))
      }
    })
    return completions
  },

  // Check if extension has built-in support
  hasBuiltInSupport(extId: string): boolean {
    return extId in builtInExtensions
  },

  // Get active extension count
  getActiveCount(): number {
    return activeExtensions.size
  },

  // Get all active extensions
  getActiveExtensions(): string[] {
    return Array.from(activeExtensions)
  },

  // Check if extension is active
  isActive(extId: string): boolean {
    return activeExtensions.has(extId)
  },

  // Get extension contribution
  getContribution(extId: string): ExtensionContribution | undefined {
    return extensionRegistry.get(extId)
  }
}

// Language detection from file extension
export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const languageMap: Record<string, string> = {
    'py': 'python',
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'go': 'go',
    'rs': 'rust',
    'c': 'c',
    'cpp': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'java': 'java',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'markdown': 'markdown',
    'dockerfile': 'dockerfile',
    'gn': 'geneia',
    'intcnf': 'int',
    'intpkf': 'int',
  }
  return languageMap[ext] || ext
}
