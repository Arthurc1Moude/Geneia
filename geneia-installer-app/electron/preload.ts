import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  selectInstallPath: () => ipcRenderer.invoke('select-install-path'),
  installGeneia: (options: any) => ipcRenderer.invoke('install-geneia', options),
  checkDependencies: () => ipcRenderer.invoke('check-dependencies'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  onInstallProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('install-progress', (event, data) => callback(data));
  }
});
