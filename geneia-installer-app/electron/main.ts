import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { spawn, exec } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    transparent: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const url = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(url);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('get-system-info', async () => {
  return {
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    cpus: os.cpus().length,
    memory: Math.round(os.totalmem() / (1024 ** 3)),
    homedir: os.homedir(),
    username: os.userInfo().username
  };
});

ipcMain.handle('select-install-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select Installation Directory'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('install-geneia', async (event, options: {
  installPath: string;
  installType: 'full' | 'minimal';
}) => {
  return new Promise((resolve, reject) => {
    const { installPath, installType } = options;
    const platform = os.platform();
    
    // Get the C++ installer addon
    const installerAddon = require('../build/Release/installer.node');
    
    // Start installation
    const steps = [
      'Preparing installation environment',
      'Compiling Geneia compiler',
      'Installing binaries',
      'Setting up modules',
      'Installing examples',
      'Configuring environment',
      'Creating shortcuts',
      'Finalizing installation'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        mainWindow?.webContents.send('install-progress', {
          step: currentStep + 1,
          total: steps.length,
          message: steps[currentStep],
          percentage: Math.round(((currentStep + 1) / steps.length) * 100)
        });
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Run actual installation using C++ addon
        try {
          const result = installerAddon.install(installPath, installType);
          resolve({ success: true, path: installPath, result });
        } catch (error: any) {
          reject({ success: false, error: error.message });
        }
      }
    }, 800);
  });
});

ipcMain.handle('check-dependencies', async () => {
  const checks = {
    git: false,
    make: false,
    gpp: false,
    node: false
  };

  const checkCommand = (cmd: string): Promise<boolean> => {
    return new Promise((resolve) => {
      exec(`${cmd} --version`, (error) => {
        resolve(!error);
      });
    });
  };

  checks.git = await checkCommand('git');
  checks.make = await checkCommand('make');
  checks.gpp = await checkCommand('g++');
  checks.node = await checkCommand('node');

  return checks;
});

ipcMain.handle('minimize-window', () => {
  mainWindow?.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('close-window', () => {
  mainWindow?.close();
});

ipcMain.handle('open-external', async (event, url: string) => {
  const { shell } = require('electron');
  await shell.openExternal(url);
});
