import { useEffect } from 'react'
import { toast } from '../components/Toast'

export function useGlobalErrorHandler() {
  useEffect(() => {
    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      toast.error('Runtime Error', event.message || 'An unexpected error occurred')
      event.preventDefault()
    }

    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason)
      const message = event.reason?.message || event.reason?.toString() || 'Promise rejected'
      toast.error('Async Error', message)
      event.preventDefault()
    }

    // Handle network errors
    const handleOffline = () => {
      toast.warning('Offline', 'You are currently offline')
    }

    const handleOnline = () => {
      toast.success('Online', 'Connection restored')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])
}
