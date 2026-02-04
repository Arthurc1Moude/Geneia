export interface SystemInfo {
  platform: string;
  arch: string;
  release: string;
  cpus: number;
  memory: number;
  homedir: string;
  username: string;
}

export interface InstallOptions {
  installPath: string;
  installType: 'full' | 'minimal';
}

export interface InstallProgress {
  step: number;
  total: number;
  message: string;
  percentage: number;
}

export interface ElectronAPI {
  getSystemInfo: () => Promise<SystemInfo>;
  selectInstallPath: () => Promise<string | null>;
  installGeneia: (options: InstallOptions) => Promise<any>;
  checkDependencies: () => Promise<Record<string, boolean>>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  openExternal: (url: string) => Promise<void>;
  onInstallProgress: (callback: (data: InstallProgress) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
