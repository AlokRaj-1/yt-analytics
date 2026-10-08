import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

export default function App() {
  const [channelId, setChannelId] = useState<string | null>(null)

  // Listen for the search event dispatched by the Dashboard search bar
  useEffect(() => {
    const handler = (e: Event) => {
      const newChannel = (e as CustomEvent<string>).detail
      if (newChannel) {
        // Clear React Query cache so the new channel loads fresh
        queryClient.clear()
        setChannelId(newChannel)
      }
    }
    window.addEventListener('yt-search', handler)
    return () => window.removeEventListener('yt-search', handler)
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {channelId ? (
          <Dashboard channelId={channelId} onLogout={() => setChannelId(null)} />
        ) : (
          <Login onSubmit={setChannelId} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
