import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Bug, Copy, Check } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: string
  copied: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: '', copied: false }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.setState({ errorInfo: errorInfo.componentStack || '' })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: '' })
  }

  handleCopy = () => {
    const { error, errorInfo } = this.state
    const text = `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo}`
    navigator.clipboard.writeText(text)
    this.setState({ copied: true })
    setTimeout(() => this.setState({ copied: false }), 2000)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="h-full flex items-center justify-center p-8 bg-theme-primary">
          <div className="max-w-md w-full p-6 rounded-2xl bg-theme-editor border border-red-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-theme-primary">Something went wrong</h2>
                <p className="text-sm text-theme-muted">An unexpected error occurred</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 mb-4">
              <p className="text-sm text-red-400 font-mono break-all">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            <details className="mb-4">
              <summary className="text-xs text-theme-muted cursor-pointer hover:text-theme-secondary">
                Show technical details
              </summary>
              <pre className="mt-2 p-2 rounded bg-black/20 text-xs text-theme-muted overflow-auto max-h-32 font-mono">
                {this.state.error?.stack}
              </pre>
            </details>

            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 px-4 rounded-lg bg-theme-secondary text-theme-primary text-sm hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <Bug className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-2 px-4 rounded-lg gradient-btn text-white text-sm flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload App
              </button>
              <button
                onClick={this.handleCopy}
                className="py-2 px-3 rounded-lg bg-theme-secondary text-theme-muted text-sm hover:bg-black/10 dark:hover:bg-white/10"
                title="Copy error"
              >
                {this.state.copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
