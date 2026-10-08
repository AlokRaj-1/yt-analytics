import { useQuery } from '@tanstack/react-query'
import { fetchComments } from '../api/youtube'

export function useComments(videoId: string, videoTitle: string) {
  return useQuery({
    queryKey: ['comments', videoId],
    queryFn: () => fetchComments(videoId, videoTitle),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
    // Comments can be disabled by the creator — treat as empty, not a fatal error
    retry: (failureCount, error: unknown) => {
      const msg = error instanceof Error ? error.message : ''
      const isDisabled = msg.includes('403') || msg.includes('commentsDisabled')
      return !isDisabled && failureCount < 2
    },
  })
}
