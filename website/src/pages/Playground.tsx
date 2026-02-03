import React, { useState, useRef } from 'react'
import { EditIcon, ChartIcon, PlayIcon, TerminalIcon } from '../components/Icons'
import './Playground.css'

interface ParseError {
  line: number
  message: string
  code: string
}

type IconType = 'play' | 'info' | 'package' | 'wrench' | 'set' | 'msg' | 'repeat' | 'loop' | 'func' | 'call' | 'unicode' | 'math' | 'wait' | 'check' | 'ok' | 'error' | 'arrow' | 'question' | 'none'

interface OutputLine {
  text: string
  type: 'normal' | 'tip' | 'info' | 'msg' | 'error' | 'system' | 'separator' | 'module' | 'warning'
  icon?: IconType
}

// Example code snippets for all modules
const EXAMPLES: Record<string, string> = {
  hello: `! Welcome to Geneia Playground !

import UI

"Try editing this code!"

var {name} = 'World'
peat 'Hello, '
peat {name}

repeat 'Processing...' & t.s = (3)

turn (2) {
    peat 'Iteration'
}

exit (0)`,

  variables: `! Variables and Data Types !

import Math

"Demonstrating Geneia variables"

var {greeting} = 'Hello'
var {target} = 'World'
hold (count) = (42)
hold (pi) = (3.14159)

peat {greeting}
peat ', '
peat {target}
peat '!'

msg 'Count is 42'
msg 'Pi is approximately 3.14'

exit (0)`,

  loops: `! Loops and Control Flow !

import UI

"Loop examples in Geneia"

turn (3) {
    peat 'Turn iteration'
}

repeat 'Waiting...' & t.s = (2)

each {item} in ['apple', 'banana', 'cherry'] {
    peat 'Fruit: '
    peat {item}
}

exit (0)`,

  functions: `! Functions in Geneia !

import Math

"Function definition and calls"

func greet (name) {
    peat 'Hello, '
    peat {name}
    peat '!'
}

func add (a) (b) {
    hold (result) = (0)
    add {result} {a} {b}
    back {result}
}

call greet 'Developer'
call add (10) (20)

exit (0)`,

  unicode: `! Unicode Support !

import String

"Geneia supports Unicode characters"

str(U+0041)
str(U+0042)
str(U+0043)

str(U+2764)
str(U+1F600)
str(U+1F680)

peat 'Unicode test complete!'

exit (0)`,

  grender_web: `! G_Render - Web Target !

import G_Render

"Universal rendering to web"

.GR.target 'web'
.GR.title 'My Web App'
.GR.theme 'dark'

.GR.view 'main'
.GR.nav 'Home' 'About' 'Contact'
.GR.hero 'Welcome to Geneia!'
.GR.text 'Build amazing apps with ease.'

.GR.grid (3)
.GR.card 'Feature 1' 'Fast and lightweight'
.GR.card 'Feature 2' 'Cross-platform'
.GR.card 'Feature 3' 'Easy to learn'
.GR.endgrid

.GR.btn 'Get Started' 'primary'
.GR.endview
.GR.render

exit (0)`,

  grender_desktop: `! G_Render - Desktop Target !

import G_Render

"Universal rendering to desktop"

.GR.target 'desktop'
.GR.title 'Desktop App'
.GR.theme 'light'

.GR.view 'window'
.GR.text 'Welcome to the desktop app!'
.GR.btn 'Click Me' 'action'
.GR.list 'Item 1' 'Item 2' 'Item 3'
.GR.endview
.GR.render

exit (0)`,

  grender_json: `! G_Render - JSON Output !

import G_Render

"Export UI as JSON data"

.GR.target 'json'
.GR.title 'JSON Export'
.GR.theme 'dark'

.GR.view 'data'
.GR.text 'This will be JSON'
.GR.card 'Card Title' 'Card content here'
.GR.btn 'Action' 'primary'
.GR.endview
.GR.render

exit (0)`,

  opengsl_2d: `! OpenGSL - 2D Graphics !

import OpenGSL

"2D shape rendering"

.OpenGSL.canvas (800) (600)
.OpenGSL.bg '#1a1a2e'

.OpenGSL.color '#e94560'
.OpenGSL.rect (100) (100) (200) (150)

.OpenGSL.color '#0f3460'
.OpenGSL.circle (500) (300) (80)

.OpenGSL.color '#16213e'
.OpenGSL.line (50) (50) (750) (550)

.OpenGSL.render

exit (0)`,

  opengsl_3d: `! OpenGSL - 3D Graphics !

import OpenGSL

"3D shape rendering"

.OpenGSL.canvas (800) (600)
.OpenGSL.bg '#0a0a0a'
.OpenGSL.mode '3d'

.OpenGSL.color '#ff6b6b'
.OpenGSL.cube (0) (0) (0) (100)

.OpenGSL.color '#4ecdc4'
.OpenGSL.sphere (200) (0) (0) (50)

.OpenGSL.color '#ffe66d'
.OpenGSL.pyramid (−200) (0) (0) (80) (120)

.OpenGSL.render

exit (0)`,

  opengws: `! OpenGWS - Web Server !

import OpenGWS

"Web server and package manager"

.GWS.init 'my-project'
.GWS.add 'geneia-utils'
.GWS.add 'geneia-http'

.GWS.route '/' 'index.gn'
.GWS.route '/api' 'api.gn'

.GWS.static 'public'
.GWS.port (8080)
.GWS.serve

exit (0)`,

  openw2g: `! OpenW2G - Web to Geneia !

import OpenW2G

"Convert HTML to Geneia code"

.W2G.parse 'index.html'
.W2G.convert
.W2G.save 'converted.gn'

.W2G.url 'https://example.com'
.W2G.fetch
.W2G.extract 'body'
.W2G.toGeneia

exit (0)`,

  opengnel: `! OpenGNEL - Command Line !

import OpenGNEL

"Command line scripting"

.GNEL.pwd
.GNEL.ls
.GNEL.echo 'Hello from GNEL!'

.GNEL.mkdir 'test_dir'
.GNEL.touch 'test_dir/file.txt'
.GNEL.cat 'test_dir/file.txt'

.GNEL.env 'MY_VAR' 'my_value'
.GNEL.getenv 'MY_VAR'

.GNEL.run 'echo "Running shell command"'

exit (0)`,

  gwebkit: `! G_Web.Kit - Website Generation !

import G_Web.Kit

"Generate complete websites"

.GWeb.page 'index'
.GWeb.title 'My Website'
.GWeb.meta 'description' 'A Geneia-generated site'

.GWeb.header 'Welcome!'
.GWeb.nav 'Home' 'About' 'Contact'
.GWeb.section 'hero' {
    .GWeb.h1 'Build with Geneia'
    .GWeb.p 'Create amazing websites easily.'
    .GWeb.btn 'Get Started'
}

.GWeb.footer '© 2024 My Site'
.GWeb.build

exit (0)`,

  geneiaui: `! GeneiaUI - Desktop GUI !

import GeneiaUI

"Create desktop windows"

.UI.window 'My App' (800) (600)
.UI.theme 'dark'

.UI.label 'Welcome!' (20) (20)
.UI.button 'Click Me' (20) (60) (100) (30)
.UI.textbox 'input1' (20) (100) (200) (25)
.UI.checkbox 'Enable feature' (20) (140)

.UI.panel 'Settings' (250) (20) (300) (200)
.UI.slider 'volume' (0) (100) (50)
.UI.dropdown 'options' 'Option 1' 'Option 2' 'Option 3'

.UI.show

exit (0)`,

  math_demo: `! Math Module Demo !

import Math

"Mathematical operations"

hold (a) = (10)
hold (b) = (5)
hold (result) = (0)

add {result} {a} {b}
peat 'Add: 15'

sub {result} {a} {b}
peat 'Sub: 5'

mul {result} {a} {b}
peat 'Mul: 50'

div {result} {a} {b}
peat 'Div: 2'

gmath.sqrt (16)
gmath.pow (2) (8)
gmath.abs (−42)
gmath.rand (1) (100)

exit (0)`,

  time_units: `! Time Units Demo !

import UI

"Geneia time unit syntax"

repeat 'Seconds...' & t.s = (2)
repeat 'Milliseconds...' & t.ms = (500)

wait & t.s = (1)

peat 'Time demo complete!'

exit (0)`,

  complete: `! Complete Geneia Demo !

import UI
import Math
import G_Render

"Full feature demonstration"

! Variables !
var {appName} = 'Geneia Demo'
hold (version) = (1)

! Output !
peat 'Welcome to '
peat {appName}
msg 'Version 1.0'

! Loops !
turn (2) {
    peat 'Loop iteration'
}

! Functions !
func sayHello (name) {
    peat 'Hello, '
    peat {name}
}

call sayHello 'Developer'

! Math !
hold (x) = (10)
hold (y) = (20)
hold (sum) = (0)
add {sum} {x} {y}

! Unicode !
str(U+2764)
str(U+1F680)

! G_Render !
.GR.target 'terminal'
.GR.title 'Demo Output'
.GR.text 'Rendered content'
.GR.render

exit (0)`
}

const Playground: React.FC = () => {
  const [code, setCode] = useState(EXAMPLES.hello)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [errors, setErrors] = useState<ParseError[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedExample, setSelectedExample] = useState('hello')
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Sync scroll for line numbers
  const [scrollTop, setScrollTop] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  // Line count for line numbers
  const lineCount = code.split('\n').length

  // Valid syntax elements
  const validKeywords = [
    'var', 'hold', 'peat', 'msg', 'repeat', 'turn', 'func', 'check', 
    'import', 'export', 'exit', 'str', 'back', 'call', 'wait', 'stop', 
    'skip', 'each', 'list', 'add', 'sub', 'mul', 'div', 'len', 'get', 
    'set', 'del', 'rand', 'math', 'join', 'size', 'gmath'
  ]

  // Time units: t.s, t.ms, t.m, t.h, t.d

  const validModules = [
    'UI', 'Math', 'Graphics', 'Network', 'File', 'System', 'Console', 
    'Data', 'Time', 'String', 'Array', 'JSON', 'HTTP', 'Crypto',
    'GeneiaUI', 'OpenGSL', 'G_Web', 'G_Web.Kit', 'GWeb', 
    'OpenGWS', 'GWS', 'OpenW2G', 'W2G', 'G_Render', 'GR', 
    'OpenGNEL', 'GNEL'
  ]

  const moduleAliases: Record<string, string[]> = {
    'G_Render': ['GR'],
    'OpenGSL': ['GSL'],
    'OpenGWS': ['GWS'],
    'OpenW2G': ['W2G'],
    'OpenGNEL': ['GNEL'],
    'G_Web.Kit': ['GWeb'],
    'GeneiaUI': ['UI']
  }

  // Validate Geneia syntax
  const validateSyntax = (lines: string[]): ParseError[] => {
    const errs: ParseError[] = []
    const declaredVars = new Set<string>()
    const declaredFuncs = new Set<string>()
    let braceDepth = 0
    let importedModules = new Set<string>()

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      const lineNum = i + 1

      if (!trimmed) continue

      // Track brace depth (for validation)
      
      // Comments - must start and end with !
      if (trimmed.startsWith('!')) {
        if (!trimmed.endsWith('!')) {
          errs.push({ line: lineNum, message: 'Unclosed comment - missing closing !', code: trimmed })
        }
        continue
      }

      // Tips - must start and end with "
      if (trimmed.startsWith('"')) {
        if (!trimmed.endsWith('"') || trimmed.length === 1) {
          errs.push({ line: lineNum, message: 'Unclosed tip - missing closing "', code: trimmed })
        }
        continue
      }

      // Import statements
      if (trimmed.startsWith('import ')) {
        const moduleName = trimmed.substring(7).trim()
        if (!moduleName) {
          errs.push({ line: lineNum, message: 'import needs module name', code: trimmed })
        } else if (!validModules.includes(moduleName)) {
          errs.push({ line: lineNum, message: `Unknown module: ${moduleName}`, code: trimmed })
        } else {
          importedModules.add(moduleName)
          // Add aliases
          if (moduleAliases[moduleName]) {
            moduleAliases[moduleName].forEach(alias => importedModules.add(alias))
          }
        }
        continue
      }

      // Module function calls (.Module.function)
      if (trimmed.startsWith('.')) {
        const match = trimmed.match(/^\.([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)/)
        if (!match) {
          errs.push({ line: lineNum, message: 'Invalid module call syntax: .Module.function', code: trimmed })
        } else {
          const modName = match[1]
          // Check if module is imported or is a known alias
          const isKnown = importedModules.has(modName) || 
                          validModules.some(m => moduleAliases[m]?.includes(modName)) ||
                          ['GR', 'GSL', 'GWS', 'W2G', 'GNEL', 'GWeb', 'UI', 'OpenGSL'].includes(modName)
          if (!isKnown) {
            errs.push({ line: lineNum, message: `Module not imported: ${modName}`, code: trimmed })
          }
        }
        continue
      }

      // var syntax: var {name} = 'value'
      if (trimmed.startsWith('var ')) {
        const varMatch = trimmed.match(/^var\s+\{([^}]*)\}\s*=\s*'([^']*)'$/)
        if (!varMatch) {
          if (!trimmed.includes('{')) {
            errs.push({ line: lineNum, message: "var needs {name}: var {name} = 'value'", code: trimmed })
          } else if (!trimmed.includes('}')) {
            errs.push({ line: lineNum, message: 'Unclosed { in variable name', code: trimmed })
          } else if (!trimmed.includes('=')) {
            errs.push({ line: lineNum, message: "var needs =: var {name} = 'value'", code: trimmed })
          } else if (!trimmed.includes("'")) {
            errs.push({ line: lineNum, message: "var value needs quotes: = 'value'", code: trimmed })
          } else {
            const quotes = (trimmed.match(/'/g) || []).length
            if (quotes % 2 !== 0) {
              errs.push({ line: lineNum, message: 'Unclosed string quote', code: trimmed })
            }
          }
        } else {
          const varName = varMatch[1].trim()
          if (!varName) {
            errs.push({ line: lineNum, message: 'Empty variable name', code: trimmed })
          } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
            errs.push({ line: lineNum, message: 'Invalid variable name', code: trimmed })
          } else {
            declaredVars.add(varName)
          }
        }
        continue
      }

      // hold syntax: hold (name) = (number)
      if (trimmed.startsWith('hold ')) {
        const holdMatch = trimmed.match(/^hold\s+\(([^)]*)\)\s*=\s*\(([^)]*)\)$/)
        if (!holdMatch) {
          if (!trimmed.includes('(')) {
            errs.push({ line: lineNum, message: 'hold needs (name): hold (x) = (10)', code: trimmed })
          } else if (!trimmed.includes(')')) {
            errs.push({ line: lineNum, message: 'Unclosed ( in hold', code: trimmed })
          } else if (!trimmed.includes('=')) {
            errs.push({ line: lineNum, message: 'hold needs =: hold (x) = (10)', code: trimmed })
          } else {
            errs.push({ line: lineNum, message: 'hold format: hold (name) = (number)', code: trimmed })
          }
        } else {
          const varName = holdMatch[1].trim()
          const value = holdMatch[2].trim()
          if (!varName) {
            errs.push({ line: lineNum, message: 'Empty variable name', code: trimmed })
          } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
            errs.push({ line: lineNum, message: 'Invalid variable name', code: trimmed })
          } else {
            declaredVars.add(varName)
          }
          if (value && isNaN(Number(value.replace('−', '-')))) {
            errs.push({ line: lineNum, message: 'hold value must be number', code: trimmed })
          }
        }
        continue
      }

      // peat syntax
      if (trimmed.startsWith('peat ') || trimmed === 'peat') {
        if (trimmed === 'peat') {
          errs.push({ line: lineNum, message: "peat needs content: peat 'text' or peat {var}", code: trimmed })
        } else {
          const after = trimmed.substring(5).trim()
          if (!after.startsWith("'") && !after.startsWith('{')) {
            errs.push({ line: lineNum, message: "peat needs 'text' or {var}", code: trimmed })
          } else if (after.startsWith("'")) {
            const quotes = (after.match(/'/g) || []).length
            if (quotes % 2 !== 0) {
              errs.push({ line: lineNum, message: 'Unclosed quote in peat', code: trimmed })
            }
          } else if (after.startsWith('{') && !after.includes('}')) {
            errs.push({ line: lineNum, message: 'Unclosed { in peat', code: trimmed })
          }
        }
        continue
      }

      // msg syntax
      if (trimmed.startsWith('msg ') || trimmed === 'msg') {
        if (trimmed === 'msg') {
          errs.push({ line: lineNum, message: "msg needs content: msg 'text'", code: trimmed })
        } else if (!trimmed.includes("'")) {
          errs.push({ line: lineNum, message: "msg needs quotes: msg 'text'", code: trimmed })
        } else {
          const quotes = (trimmed.match(/'/g) || []).length
          if (quotes % 2 !== 0) {
            errs.push({ line: lineNum, message: 'Unclosed quote in msg', code: trimmed })
          }
        }
        continue
      }

      // repeat syntax: repeat 'text' & t.s = (n)
      if (trimmed.startsWith('repeat ')) {
        if (!trimmed.includes('&')) {
          errs.push({ line: lineNum, message: "repeat needs &: repeat 'text' & t.s = (3)", code: trimmed })
        } else if (!trimmed.includes('t.')) {
          errs.push({ line: lineNum, message: 'repeat needs time unit: t.s, t.ms, t.m', code: trimmed })
        } else if (!trimmed.includes('=')) {
          errs.push({ line: lineNum, message: 'repeat needs = for duration', code: trimmed })
        } else {
          const timeMatch = trimmed.match(/t\.(s|ms|m|h|d)/)
          if (!timeMatch) {
            errs.push({ line: lineNum, message: 'Invalid time unit (use t.s, t.ms, t.m, t.h, t.d)', code: trimmed })
          }
        }
        continue
      }

      // turn syntax: turn (n) { ... }
      if (trimmed.startsWith('turn ')) {
        const turnMatch = trimmed.match(/^turn\s+\((\d+)\)\s*\{?$/)
        if (!turnMatch) {
          if (!trimmed.includes('(')) {
            errs.push({ line: lineNum, message: 'turn needs (count): turn (3) { }', code: trimmed })
          } else {
            errs.push({ line: lineNum, message: 'turn format: turn (n) { }', code: trimmed })
          }
        }
        if (trimmed.includes('{')) {
          braceDepth++
        }
        continue
      }

      // func syntax
      if (trimmed.startsWith('func ')) {
        const funcMatch = trimmed.match(/^func\s+([a-zA-Z_][a-zA-Z0-9_]*)/)
        if (!funcMatch) {
          errs.push({ line: lineNum, message: 'func needs name: func myFunc (args) { }', code: trimmed })
        } else {
          declaredFuncs.add(funcMatch[1])
        }
        if (trimmed.includes('{')) {
          braceDepth++
        }
        continue
      }

      // call syntax
      if (trimmed.startsWith('call ')) {
        const callMatch = trimmed.match(/^call\s+([a-zA-Z_][a-zA-Z0-9_]*)/)
        if (!callMatch) {
          errs.push({ line: lineNum, message: 'call needs function name', code: trimmed })
        }
        continue
      }

      // str(U+XXXX) syntax
      if (trimmed.startsWith('str(') || trimmed.match(/^str\s*\(/)) {
        const strMatch = trimmed.match(/^str\s*\((U\+[0-9A-Fa-f]+)\)$/)
        if (!strMatch) {
          if (!trimmed.includes(')')) {
            errs.push({ line: lineNum, message: 'str() missing )', code: trimmed })
          } else if (!trimmed.includes('U+')) {
            errs.push({ line: lineNum, message: 'str() needs U+: str(U+0041)', code: trimmed })
          } else {
            errs.push({ line: lineNum, message: 'str() format: str(U+XXXX)', code: trimmed })
          }
        } else {
          const hex = strMatch[1].replace('U+', '')
          const codePoint = parseInt(hex, 16)
          if (codePoint > 0x10FFFF) {
            errs.push({ line: lineNum, message: 'Unicode too large (max U+10FFFF)', code: trimmed })
          }
        }
        continue
      }

      // exit syntax
      if (trimmed.startsWith('exit ') || trimmed === 'exit') {
        if (trimmed !== 'exit') {
          const exitMatch = trimmed.match(/^exit\s+\((\d+)\)$/)
          if (!exitMatch) {
            errs.push({ line: lineNum, message: 'exit format: exit (0)', code: trimmed })
          }
        }
        continue
      }

      // wait syntax
      if (trimmed.startsWith('wait ')) {
        if (!trimmed.includes('&') || !trimmed.includes('t.')) {
          errs.push({ line: lineNum, message: 'wait format: wait & t.s = (n)', code: trimmed })
        }
        continue
      }

      // each syntax
      if (trimmed.startsWith('each ')) {
        if (!trimmed.includes('{') || !trimmed.includes('in')) {
          errs.push({ line: lineNum, message: 'each format: each {item} in [list] { }', code: trimmed })
        }
        if (trimmed.includes('{')) braceDepth++
        continue
      }

      // check syntax (if-like)
      if (trimmed.startsWith('check ')) {
        if (!trimmed.includes('{')) {
          errs.push({ line: lineNum, message: 'check needs { }: check (condition) { }', code: trimmed })
        }
        if (trimmed.includes('{')) braceDepth++
        continue
      }

      // Math operations
      if (['add', 'sub', 'mul', 'div'].some(op => trimmed.startsWith(op + ' '))) {
        const parts = trimmed.split(/\s+/)
        if (parts.length < 4) {
          errs.push({ line: lineNum, message: `${parts[0]} needs: ${parts[0]} {result} {a} {b}`, code: trimmed })
        }
        continue
      }

      // gmath functions
      if (trimmed.startsWith('gmath.')) {
        const gmathMatch = trimmed.match(/^gmath\.([a-z]+)\s*\(/)
        if (!gmathMatch) {
          errs.push({ line: lineNum, message: 'gmath format: gmath.func(args)', code: trimmed })
        }
        continue
      }

      // Closing brace
      if (trimmed === '}') {
        braceDepth--
        if (braceDepth < 0) {
          errs.push({ line: lineNum, message: 'Unexpected closing brace }', code: trimmed })
          braceDepth = 0
        }
        continue
      }

      // Check for unknown keywords
      const firstWord = trimmed.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '')
      if (firstWord && !validKeywords.includes(firstWord) && !trimmed.startsWith('.') && !trimmed.startsWith('}')) {
        // Could be a variable reference or other valid syntax
        if (!trimmed.startsWith('{') && !trimmed.match(/^[a-zA-Z_][a-zA-Z0-9_]*\s*\(/)) {
          // Only warn, don't error - might be valid
        }
      }
    }

    // Check for unclosed braces
    if (braceDepth > 0) {
      errs.push({ line: lines.length, message: `${braceDepth} unclosed brace(s) - missing }`, code: '' })
    }

    return errs
  }


  // Simulate code execution
  const executeCode = (codeText: string): OutputLine[] => {
    const lines = codeText.split('\n')
    const result: OutputLine[] = []
    const variables: Record<string, string | number> = {}
    let exitCode: number | null = null

    result.push({ text: 'Running Geneia code...', type: 'system', icon: 'play' })
    result.push({ text: '─'.repeat(40), type: 'separator', icon: 'none' })

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      if (!trimmed) continue
      if (exitCode !== null) break

      // Comments - skip
      if (trimmed.startsWith('!') && trimmed.endsWith('!')) continue

      // Tips - show as info
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        const tip = trimmed.slice(1, -1)
        result.push({ text: tip, type: 'tip', icon: 'info' })
        continue
      }

      // Import - acknowledge
      if (trimmed.startsWith('import ')) {
        const mod = trimmed.substring(7).trim()
        result.push({ text: `Imported: ${mod}`, type: 'module', icon: 'package' })
        continue
      }

      // Module calls
      if (trimmed.startsWith('.')) {
        const match = trimmed.match(/^\.([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)(.*)$/)
        if (match) {
          const [, modName, funcName, args] = match
          result.push({ text: `${modName}.${funcName}${args ? ': ' + args.trim() : ''}`, type: 'module', icon: 'wrench' })
        }
        continue
      }

      // var declaration
      if (trimmed.startsWith('var ')) {
        const varMatch = trimmed.match(/^var\s+\{([^}]+)\}\s*=\s*'([^']*)'/)
        if (varMatch) {
          variables[varMatch[1]] = varMatch[2]
          result.push({ text: `Set ${varMatch[1]} = "${varMatch[2]}"`, type: 'info', icon: 'set' })
        }
        continue
      }

      // hold declaration
      if (trimmed.startsWith('hold ')) {
        const holdMatch = trimmed.match(/^hold\s+\(([^)]+)\)\s*=\s*\(([^)]+)\)/)
        if (holdMatch) {
          const val = parseFloat(holdMatch[2].replace('−', '-'))
          variables[holdMatch[1]] = val
          result.push({ text: `Set ${holdMatch[1]} = ${val}`, type: 'info', icon: 'set' })
        }
        continue
      }

      // peat output
      if (trimmed.startsWith('peat ')) {
        const after = trimmed.substring(5).trim()
        if (after.startsWith("'")) {
          const text = after.match(/'([^']*)'/)?.[1] || ''
          result.push({ text: text, type: 'normal', icon: 'none' })
        } else if (after.startsWith('{')) {
          const varName = after.match(/\{([^}]+)\}/)?.[1]
          if (varName && variables[varName] !== undefined) {
            result.push({ text: String(variables[varName]), type: 'normal', icon: 'none' })
          } else {
            result.push({ text: `{${varName}}`, type: 'normal', icon: 'none' })
          }
        }
        continue
      }

      // msg output
      if (trimmed.startsWith('msg ')) {
        const msgMatch = trimmed.match(/msg\s+'([^']*)'/)
        if (msgMatch) {
          result.push({ text: msgMatch[1], type: 'msg', icon: 'msg' })
        }
        continue
      }

      // repeat
      if (trimmed.startsWith('repeat ')) {
        const repeatMatch = trimmed.match(/repeat\s+'([^']*)'\s*&\s*t\.(s|ms|m|h|d)\s*=\s*\((\d+)\)/)
        if (repeatMatch) {
          const [, text, unit, count] = repeatMatch
          const unitNames: Record<string, string> = { s: 'second', ms: 'millisecond', m: 'minute', h: 'hour', d: 'day' }
          result.push({ text: `"${text}" for ${count} ${unitNames[unit]}(s)`, type: 'info', icon: 'repeat' })
        }
        continue
      }

      // turn loop
      if (trimmed.startsWith('turn ')) {
        const turnMatch = trimmed.match(/turn\s+\((\d+)\)/)
        if (turnMatch) {
          const count = parseInt(turnMatch[1])
          result.push({ text: `Loop ${count} times`, type: 'info', icon: 'loop' })
        }
        continue
      }

      // func definition
      if (trimmed.startsWith('func ')) {
        const funcMatch = trimmed.match(/func\s+([a-zA-Z_][a-zA-Z0-9_]*)/)
        if (funcMatch) {
          result.push({ text: `Defined function: ${funcMatch[1]}`, type: 'info', icon: 'func' })
        }
        continue
      }

      // call function
      if (trimmed.startsWith('call ')) {
        const callMatch = trimmed.match(/call\s+([a-zA-Z_][a-zA-Z0-9_]*)(.*)/)
        if (callMatch) {
          result.push({ text: `Called: ${callMatch[1]}${callMatch[2] ? ' with' + callMatch[2] : ''}`, type: 'info', icon: 'call' })
        }
        continue
      }

      // str unicode
      if (trimmed.startsWith('str(')) {
        const strMatch = trimmed.match(/str\((U\+[0-9A-Fa-f]+)\)/)
        if (strMatch) {
          const codePoint = parseInt(strMatch[1].replace('U+', ''), 16)
          try {
            const char = String.fromCodePoint(codePoint)
            result.push({ text: `${strMatch[1]} -> ${char}`, type: 'normal', icon: 'unicode' })
          } catch {
            result.push({ text: `${strMatch[1]} -> (invalid)`, type: 'warning', icon: 'unicode' })
          }
        }
        continue
      }

      // Math operations
      if (['add', 'sub', 'mul', 'div'].some(op => trimmed.startsWith(op + ' '))) {
        const parts = trimmed.split(/\s+/)
        if (parts.length >= 4) {
          const op = parts[0]
          const opSymbols: Record<string, string> = { add: '+', sub: '-', mul: '*', div: '/' }
          result.push({ text: `${op}: ${parts[2]} ${opSymbols[op]} ${parts[3]} -> ${parts[1]}`, type: 'info', icon: 'math' })
        }
        continue
      }

      // gmath functions
      if (trimmed.startsWith('gmath.')) {
        const gmathMatch = trimmed.match(/gmath\.([a-z]+)\s*\(([^)]*)\)/)
        if (gmathMatch) {
          result.push({ text: `gmath.${gmathMatch[1]}(${gmathMatch[2]})`, type: 'info', icon: 'math' })
        }
        continue
      }

      // wait
      if (trimmed.startsWith('wait ')) {
        const waitMatch = trimmed.match(/wait\s*&\s*t\.(s|ms|m|h|d)\s*=\s*\((\d+)\)/)
        if (waitMatch) {
          result.push({ text: `Wait ${waitMatch[2]} ${waitMatch[1]}`, type: 'info', icon: 'wait' })
        }
        continue
      }

      // each loop
      if (trimmed.startsWith('each ')) {
        result.push({ text: 'Each loop', type: 'info', icon: 'loop' })
        continue
      }

      // check condition
      if (trimmed.startsWith('check ')) {
        result.push({ text: 'Check condition', type: 'info', icon: 'question' })
        continue
      }

      // exit
      if (trimmed.startsWith('exit ')) {
        const exitMatch = trimmed.match(/exit\s+\((\d+)\)/)
        if (exitMatch) {
          exitCode = parseInt(exitMatch[1])
        }
        continue
      }
      if (trimmed === 'exit') {
        exitCode = 0
        continue
      }
    }

    result.push({ text: '─'.repeat(40), type: 'separator', icon: 'none' })
    if (exitCode !== null) {
      result.push({ text: `Exited with code ${exitCode}`, type: 'system', icon: 'ok' })
    } else {
      result.push({ text: 'Execution complete', type: 'system', icon: 'ok' })
    }

    return result
  }

  // Run the code
  const runCode = () => {
    setIsRunning(true)
    setOutput([])
    setErrors([])

    // Validate first
    const lines = code.split('\n')
    const syntaxErrors = validateSyntax(lines)

    setTimeout(() => {
      if (syntaxErrors.length > 0) {
        setErrors(syntaxErrors)
        const errorOutput: OutputLine[] = [
          { text: 'Syntax Errors Found:', type: 'error', icon: 'error' },
          { text: '─'.repeat(40), type: 'separator', icon: 'none' }
        ]
        syntaxErrors.forEach(err => {
          errorOutput.push({ text: `Line ${err.line}: ${err.message}`, type: 'error', icon: 'error' })
          if (err.code) {
            errorOutput.push({ text: `  ${err.code}`, type: 'warning', icon: 'arrow' })
          }
        })
        setOutput(errorOutput)
      } else {
        const result = executeCode(code)
        setOutput(result)
      }
      setIsRunning(false)
    }, 300)
  }

  // Handle example selection
  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value
    setSelectedExample(key)
    if (EXAMPLES[key]) {
      setCode(EXAMPLES[key])
      setOutput([])
      setErrors([])
    }
  }

  // Clear output
  const clearOutput = () => {
    setOutput([])
    setErrors([])
  }

  // Get error lines for highlighting
  const errorLines = new Set(errors.map(e => e.line))


  return (
    <div className="playground-page">
      <div className="container">
        <div className="playground-header">
          <h1>Geneia Playground</h1>
          <p>Write, validate, and run Geneia code in your browser</p>
        </div>

        <div className="playground-layout">
          {/* Editor Panel */}
          <div className="editor-panel">
            <div className="panel-header">
              <div className="panel-title">
                <EditIcon size={18} />
                <span>Editor</span>
              </div>
              <div className="panel-actions">
                <select 
                  className="example-select" 
                  value={selectedExample}
                  onChange={handleExampleChange}
                >
                  <optgroup label="Basics">
                    <option value="hello">Hello World</option>
                    <option value="variables">Variables</option>
                    <option value="loops">Loops</option>
                    <option value="functions">Functions</option>
                    <option value="unicode">Unicode</option>
                    <option value="math_demo">Math</option>
                    <option value="time_units">Time Units</option>
                  </optgroup>
                  <optgroup label="G_Render">
                    <option value="grender_web">G_Render - Web</option>
                    <option value="grender_desktop">G_Render - Desktop</option>
                    <option value="grender_json">G_Render - JSON</option>
                  </optgroup>
                  <optgroup label="Open Products">
                    <option value="opengsl_2d">OpenGSL - 2D</option>
                    <option value="opengsl_3d">OpenGSL - 3D</option>
                    <option value="opengws">OpenGWS - Server</option>
                    <option value="openw2g">OpenW2G - Web to Geneia</option>
                    <option value="opengnel">OpenGNEL - CLI</option>
                  </optgroup>
                  <optgroup label="Modules">
                    <option value="gwebkit">G_Web.Kit</option>
                    <option value="geneiaui">GeneiaUI</option>
                  </optgroup>
                  <optgroup label="Complete">
                    <option value="complete">Full Demo</option>
                  </optgroup>
                </select>
                <button 
                  className="btn btn-primary glass-btn"
                  onClick={runCode}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <span className="spinner"></span>
                      Running...
                    </>
                  ) : (
                    <>
                      <PlayIcon size={16} />
                      Run
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="editor-container">
              <div className="line-numbers" style={{ transform: `translateY(-${scrollTop}px)` }}>
                {Array.from({ length: lineCount }, (_, i) => (
                  <div 
                    key={i + 1} 
                    className={`line-number ${errorLines.has(i + 1) ? 'error-line-num' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                ref={editorRef}
                className="code-editor notranslate"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                placeholder="Write your Geneia code here..."
              />
            </div>
            {errors.length > 0 && (
              <div className="error-summary">
                <span className="error-count">{errors.length} error{errors.length > 1 ? 's' : ''} found</span>
                <span className="error-hint">Check the output panel for details</span>
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className={`output-panel ${errors.length > 0 ? 'has-errors' : ''}`}>
            <div className="panel-header">
              <div className="panel-title">
                <TerminalIcon size={18} />
                <span>Output</span>
              </div>
              <div className="panel-actions">
                <button 
                  className="btn btn-secondary glass-btn"
                  onClick={clearOutput}
                  disabled={output.length === 0}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="output-area" ref={outputRef}>
              {output.length === 0 ? (
                <div className="output-placeholder">
                  <ChartIcon size={48} />
                  <p>Click "Run" to execute your code</p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    Output will appear here
                  </p>
                </div>
              ) : (
                <div className="output-content notranslate">
                  {output.map((line, idx) => (
                    <div key={idx} className={`output-line ${line.type}-line`}>
                      {line.icon && line.icon !== 'none' && (
                        <span className={`output-icon icon-${line.icon}`}></span>
                      )}
                      <span className="output-text">{line.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Syntax Tips */}
        <div className="playground-tips glass-card">
          <h3>Geneia Syntax Quick Reference</h3>
          
          <div className="tips-grid">
            <div className="tip-item">
              <code className="variable">{'{'}name{'}'}</code>
              <span>Variable names</span>
            </div>
            <div className="tip-item">
              <code className="string">'text'</code>
              <span>String values</span>
            </div>
            <div className="tip-item">
              <code className="tip-code">"tip"</code>
              <span>Running tips</span>
            </div>
            <div className="tip-item">
              <code className="comment">!...!</code>
              <span>Comments</span>
            </div>
            <div className="tip-item">
              <code className="number">(42)</code>
              <span>Numbers</span>
            </div>
          </div>

          <div className="products-row">
            <span className="product-badge-sm">G_Render</span>
            <span className="product-badge-sm">OpenGSL</span>
            <span className="product-badge-sm">OpenGWS</span>
            <span className="product-badge-sm">OpenW2G</span>
            <span className="product-badge-sm">OpenGNEL</span>
            <span className="product-badge-sm">G_Web.Kit</span>
            <span className="product-badge-sm">GeneiaUI</span>
          </div>

          <div className="keywords-row">
            <span className="keyword-badge">var</span>
            <span className="keyword-badge">hold</span>
            <span className="keyword-badge">peat</span>
            <span className="keyword-badge">msg</span>
            <span className="keyword-badge">turn</span>
            <span className="keyword-badge">func</span>
            <span className="keyword-badge">call</span>
            <span className="keyword-badge">check</span>
            <span className="keyword-badge">each</span>
            <span className="keyword-badge">repeat</span>
            <span className="keyword-badge">wait</span>
            <span className="keyword-badge">exit</span>
            <span className="keyword-badge">import</span>
            <span className="keyword-badge">str</span>
            <span className="keyword-badge">gmath</span>
          </div>

          <div className="moude-credit">
            © 2024 Moude AI Inc. — Geneia and all Open* products
          </div>
        </div>
      </div>
    </div>
  )
}

export default Playground
