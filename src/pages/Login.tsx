import { useState } from 'react'

interface Props {
  onSubmit: (channelId: string) => void
}

export default function Login({ onSubmit }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = input.trim()
    if (!val) { setError('Enter a channel ID or handle'); return }
    // Normalise @handle → strip the @
    const clean = val.startsWith('@') ? val : val
    onSubmit(clean)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Big logo */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            background: '#FF2D20',
            marginBottom: 24,
          }}>
            <svg width="36" height="28" viewBox="0 0 18 14" fill="none">
              <path d="M17.6 2.2C17.4 1.5 16.8 1 16.1 0.8C14.7 0.4 9 0.4 9 0.4C9 0.4 3.3 0.4 1.9 0.8C1.2 1 0.6 1.5 0.4 2.2C0 3.6 0 7 0 7C0 7 0 10.4 0.4 11.8C0.6 12.5 1.2 13 1.9 13.2C3.3 13.6 9 13.6 9 13.6C9 13.6 14.7 13.6 16.1 13.2C16.8 13 17.4 12.5 17.6 11.8C18 10.4 18 7 18 7C18 7 18 3.6 17.6 2.2ZM7.2 10V4L11.9 7L7.2 10Z" fill="#0A0A0A"/>
            </svg>
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 900,
            fontSize: 42,
            letterSpacing: '-2px',
            color: '#F5F0E8',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}>
            YT Analytics
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            color: '#FF2D20',
            marginTop: 8,
            letterSpacing: '0.15em',
          }}>
            CHANNEL & VIDEO ANALYTICS
          </div>
        </div>

        {/* Card */}
        <div style={{ border: '3px solid #FF2D20', background: '#1A1A1A' }}>
          <div style={{ background: '#FF2D20', padding: '12px 20px' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.2em', color: '#0A0A0A', textTransform: 'uppercase' }}>
              Enter Channel
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.15em', color: '#F5F0E8', textTransform: 'uppercase', marginBottom: 8 }}>
                Channel ID or Handle
              </label>
              <input
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setError('') }}
                placeholder="e.g. UCxxxxxx or @MrBeast"
                style={{
                  width: '100%',
                  background: '#0A0A0A',
                  border: '2px solid #FF2D20',
                  color: '#F5F0E8',
                  padding: '12px 14px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {error && (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#FF2D20', marginTop: 6 }}>
                  ↳ {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#FF2D20',
                border: '3px solid #0A0A0A',
                color: '#0A0A0A',
                padding: '14px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Analyse Channel →
            </button>
          </form>
        </div>

        {/* Note */}
        <div style={{ marginTop: 20, padding: '12px 16px', border: '2px solid #1A1A1A' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#F5F0E8', opacity: 0.5, lineHeight: 1.8 }}>
            <div>① Copy your Channel ID from YouTube Studio → Settings → Channel</div>
            <div>② Add <code style={{ background: '#0A0A0A', padding: '0 4px', color: '#FF2D20' }}>VITE_YT_API_KEY</code> to <code style={{ background: '#0A0A0A', padding: '0 4px', color: '#FF2D20' }}>.env</code></div>
            <div>③ Public channels only — private/unlisted videos are excluded</div>
          </div>
        </div>
      </div>
    </div>
  )
}
