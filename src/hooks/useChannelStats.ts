import { useQuery } from '@tanstack/react-query'
import { fetchChannelStats } from '../api/youtube'

export function useChannelStats(channelId: string) {
  return useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => fetchChannelStats(channelId),
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
  })
}
