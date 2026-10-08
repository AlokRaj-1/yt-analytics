import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches uncaught React render errors and shows a styled
 * fallback instead of a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production this is where you'd call Sentry.captureException(error, { extra: info })
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state

    if (error) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          minHeight: '100vh',
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{ maxWidth: 560, width: '100%' }}>
            <div style={{ background: '#FF2D20', padding: '12px 20px', marginBottom: 0 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.2em', color: '#0A0A0A', textTransform: 'uppercase' }}>
                Something went wrong
              </span>
            </div>
            <div style={{ border: '3px solid #FF2D20', borderTop: 'none', padding: 24, background: '#1A1A1A' }}>
              <pre style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                color: '#F5F0E8',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: '0 0 20px',
                lineHeight: 1.6,
              }}>
                {error.message}
              </pre>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#FF2D20',
                  border: '3px solid #0A0A0A',
                  color: '#0A0A0A',
                  padding: '10px 20px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Try again →
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
