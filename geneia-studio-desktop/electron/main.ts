import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { exec, spawn, ChildProcess } from 'child_process'
// @ts-ignore - ESM module
const translateModule = require('@vitalets/google-translate-api')

let mainWindow: BrowserWindow | null = null
let terminalProcess: ChildProcess | null = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    transparent: false,
    resizable: true,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../public/icon.png'),
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Create menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { label: 'New File', accelerator: 'CmdOrCtrl+N', click: () => mainWindow?.webContents.send('menu-new-file') },
        { label: 'Open...', accelerator: 'CmdOrCtrl+O', click: handleOpen },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => mainWindow?.webContents.send('menu-save') },
        { label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S', click: handleSaveAs },
        { type: 'separator' },
        { label: 'Exit', accelerator: 'Alt+F4', click: () => app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'Run',
      submenu: [
        { label: 'Run Code', accelerator: 'F5', click: () => mainWindow?.webContents.send('menu-run') },
        { label: 'Stop', accelerator: 'Shift+F5', click: () => mainWindow?.webContents.send('menu-stop') },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About Geneia Studio', click: showAbout },
        { label: 'Documentation', click: () => require('electron').shell.openExternal('https://geneia.dev/docs') },
      ],
    },
  ])

  Menu.setApplicationMenu(menu)
}

async function handleOpen() {
  const result = await dialog.showOpenDialog(mainWindow!, {
    filters: [{ name: 'Geneia Files', extensions: ['gn'] }],
    properties: ['openFile'],
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0]
    const content = fs.readFileSync(filePath, 'utf-8')
    mainWindow?.webContents.send('file-opened', { path: filePath, content })
  }
}

async function handleSaveAs() {
  const result = await dialog.showSaveDialog(mainWindow!, {
    filters: [{ name: 'Geneia Files', extensions: ['gn'] }],
    defaultPath: 'untitled.gn',
  })

  if (!result.canceled && result.filePath) {
    mainWindow?.webContents.send('save-file-path', result.filePath)
  }
}

function showAbout() {
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'About Geneia Studio',
    message: 'Geneia Studio IDE',
    detail: 'Version 1.0.0\n\nA modern IDE for the Geneia programming language.\n\n© 2024 Geneia',
  })
}

// IPC handlers
ipcMain.handle('save-file', async (_, { path: filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('read-file', async (_, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return { success: true, content }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// Window controls
ipcMain.on('window-minimize', () => mainWindow?.minimize())
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.on('window-close', () => mainWindow?.close())

// Google Translate handler (hidden from users)
ipcMain.handle('translate-text', async (_, { text, targetLang }) => {
  try {
    const translate = translateModule.translate || translateModule.default || translateModule
    const result = await translate(text, { to: targetLang.split('-')[0] })
    return { success: true, translated: result.text }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// Geneia Compiler - Syntax check via --check flag
ipcMain.handle('check-syntax', async (_, code: string, filename?: string) => {
  return new Promise((resolve) => {
    // Find compiler path relative to app
    const compilerPaths = [
      path.join(__dirname, '../../compiler/geneia'),
      path.join(process.cwd(), 'compiler/geneia'),
      path.join(app.getAppPath(), '../compiler/geneia'),
    ]
    
    let compilerPath = ''
    for (const p of compilerPaths) {
      if (fs.existsSync(p)) {
        compilerPath = p
        break
      }
    }
    
    if (!compilerPath) {
      // Compiler not found, return empty result (fallback to JS checker)
      resolve({ valid: true, errors: [], compilerNotFound: true })
      return
    }
    
    // Write code to temp file
    const tmpFile = path.join(app.getPath('temp'), `geneia_check_${Date.now()}.gn`)
    fs.writeFileSync(tmpFile, code, 'utf-8')
    
    exec(`"${compilerPath}" --check "${tmpFile}"`, { timeout: 5000 }, (error, stdout, stderr) => {
      // Clean up temp file
      try { fs.unlinkSync(tmpFile) } catch {}
      
      try {
        // Parse JSON output from compiler
        const result = JSON.parse(stdout || '{"valid":true,"errors":[]}')
        resolve(result)
      } catch {
        // If compiler output isn't JSON, treat as error
        if (error || stderr) {
          resolve({
            valid: false,
            errors: [{
              line: 1,
              column: 1,
              message: stderr || error?.message || 'Unknown compiler error',
              severity: 'error',
              code: 'E000'
            }]
          })
        } else {
          resolve({ valid: true, errors: [] })
        }
      }
    })
  })
})

// INT Terminal - Execute shell commands
ipcMain.handle('int-exec', async (_, command: string) => {
  return new Promise((resolve) => {
    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, output: stderr || error.message })
      } else {
        resolve({ success: true, output: stdout || stderr })
      }
    })
  })
})

// INT Terminal - Load .intcnf config file
ipcMain.handle('int-load-config', async (_, filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const commands: Record<string, string> = {}
    let currentCmd = ''
    let cmdBody = ''
    
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        if (currentCmd && cmdBody) {
          commands[currentCmd] = cmdBody.trim()
        }
        currentCmd = trimmed.slice(1, -1)
        cmdBody = ''
      } else if (currentCmd) {
        cmdBody += line + '\n'
      }
    }
    
    if (currentCmd && cmdBody) {
      commands[currentCmd] = cmdBody.trim()
    }
    
    return { success: true, commands }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// INT Terminal - Pack config to .intpkf
ipcMain.handle('int-pack', async (_, { configPath, outputPath }) => {
  try {
    const content = fs.readFileSync(configPath, 'utf-8')
    const commands: Record<string, string> = {}
    let currentCmd = ''
    let cmdBody = ''
    
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        if (currentCmd && cmdBody) {
          commands[currentCmd] = cmdBody.trim()
        }
        currentCmd = trimmed.slice(1, -1)
        cmdBody = ''
      } else if (currentCmd) {
        cmdBody += line + '\n'
      }
    }
    
    if (currentCmd && cmdBody) {
      commands[currentCmd] = cmdBody.trim()
    }
    
    // Write packaged format
    let output = 'INTPKF\n1.0\n' + Object.keys(commands).length + '\n'
    for (const [name, body] of Object.entries(commands)) {
      output += `[${name}]\n${body}\n[/]\n`
    }
    
    fs.writeFileSync(outputPath, output, 'utf-8')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// INT Terminal - Run .intpkf package
ipcMain.handle('int-run-package', async (_, filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    
    if (lines[0] !== 'INTPKF') {
      return { success: false, error: 'Invalid package format' }
    }
    
    const results: Array<{ name: string; output: string }> = []
    let currentCmd = ''
    let cmdBody = ''
    let inCmd = false
    
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('[') && line !== '[/]') {
        currentCmd = line.slice(1, -1)
        cmdBody = ''
        inCmd = true
      } else if (line === '[/]') {
        if (currentCmd && cmdBody) {
          // Execute the command
          const output = await new Promise<string>((resolve) => {
            exec(cmdBody.trim(), { timeout: 30000 }, (error, stdout, stderr) => {
              resolve(stdout || stderr || (error?.message ?? ''))
            })
          })
          results.push({ name: currentCmd, output })
        }
        inCmd = false
        currentCmd = ''
      } else if (inCmd) {
        cmdBody += line + '\n'
      }
    }
    
    return { success: true, results }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// INT Terminal - Start interactive shell
ipcMain.handle('int-start-shell', async () => {
  if (terminalProcess) {
    terminalProcess.kill()
  }
  
  const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
  terminalProcess = spawn(shell, [], {
    cwd: process.cwd(),
    env: process.env,
  })
  
  terminalProcess.stdout?.on('data', (data) => {
    mainWindow?.webContents.send('int-shell-output', data.toString())
  })
  
  terminalProcess.stderr?.on('data', (data) => {
    mainWindow?.webContents.send('int-shell-output', data.toString())
  })
  
  terminalProcess.on('close', () => {
    mainWindow?.webContents.send('int-shell-closed')
    terminalProcess = null
  })
  
  return { success: true }
})

// INT Terminal - Send command to shell
ipcMain.handle('int-shell-input', async (_, command: string) => {
  if (terminalProcess && terminalProcess.stdin) {
    terminalProcess.stdin.write(command + '\n')
    return { success: true }
  }
  return { success: false, error: 'No shell running' }
})

// INT Terminal - Stop shell
ipcMain.handle('int-stop-shell', async () => {
  if (terminalProcess) {
    terminalProcess.kill()
    terminalProcess = null
  }
  return { success: true }
})

ipcMain.handle('translate-batch', async (_, { texts, targetLang }) => {
  try {
    const translate = translateModule.translate || translateModule.default || translateModule
    const lang = targetLang.split('-')[0]
    const results: Record<string, string> = {}
    
    for (const text of texts) {
      try {
        const result = await translate(text, { to: lang })
        results[text] = result.text
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50))
      } catch {
        results[text] = text // Fallback to original
      }
    }
    
    return { success: true, translations: results }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
