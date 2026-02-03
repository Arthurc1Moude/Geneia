export {}

declare global {
  interface Window {
    process?: {
      type?: string
    }
    require?: (module: string) => {
      ipcRenderer?: {
        send: (channel: string, ...args: unknown[]) => void
        on: (channel: string, listener: (...args: unknown[]) => void) => void
        invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
      }
    }
  }
}
