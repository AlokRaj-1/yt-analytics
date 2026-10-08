import { useState } from 'react'
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
