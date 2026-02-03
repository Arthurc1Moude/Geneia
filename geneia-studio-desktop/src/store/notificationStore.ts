import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'syntax'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  timestamp: number
  read: boolean
  source?: 'system' | 'auth' | 'extension' | 'grammar' | 'run'
  line?: number
  file?: string
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  getUnreadCount: () => number
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notif) => {
        const newNotif: Notification = {
          ...notif,
          id: Math.random().toString(36).slice(2, 11),
          timestamp: Date.now(),
          read: false
        }
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 100)
        }))
      },
      
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearAll: () => set({ notifications: [] }),
      
      getUnreadCount: () => get().notifications.filter(n => !n.read).length
    }),
    {
      name: 'geneia-notifications',
      partialize: (state) => ({ notifications: state.notifications.slice(0, 50) })
    }
  )
)

// Helper to add notifications
export const notify = {
  success: (title: string, message?: string, source?: Notification['source']) => 
    useNotificationStore.getState().addNotification({ type: 'success', title, message, source }),
  error: (title: string, message?: string, source?: Notification['source']) => 
    useNotificationStore.getState().addNotification({ type: 'error', title, message, source }),
  warning: (title: string, message?: string, source?: Notification['source']) => 
    useNotificationStore.getState().addNotification({ type: 'warning', title, message, source }),
  info: (title: string, message?: string, source?: Notification['source']) => 
    useNotificationStore.getState().addNotification({ type: 'info', title, message, source }),
  syntax: (title: string, message?: string, line?: number, file?: string) => 
    useNotificationStore.getState().addNotification({ type: 'syntax', title, message, source: 'grammar', line, file })
}
