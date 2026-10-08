import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchVideos } from '../api/youtube'
import type { VideoItem, CategoryBreakdown, ChartDataPoint } from '../api/types'

export function useVideoStats(channelId: string) {
  return useInfiniteQuery({
    queryKey: ['videos', channelId],
    queryFn: ({ pageParam }) => fetchVideos(channelId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
  })
}

/** Flatten all pages into a single video array */
export function flattenVideos(
  data: ReturnType<typeof useVideoStats>['data']
): VideoItem[] {
  return data?.pages.flatMap(p => p.items) ?? []
}

export function buildChartData(videos: VideoItem[]): ChartDataPoint[] {
  return [...videos]
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    .slice(-15)
    .map(v => ({
      label: v.title.length > 20 ? v.title.slice(0, 20) + '…' : v.title,
      views: v.viewCount,
      likes: v.likeCount,
      comments: v.commentCount,
      engagement: v.engagementRate,
    }))
}

export function buildCategoryBreakdown(videos: VideoItem[]): CategoryBreakdown[] {
  const map: Record<string, CategoryBreakdown> = {}
  for (const v of videos) {
    if (!map[v.categoryId]) {
      map[v.categoryId] = { categoryId: v.categoryId, categoryName: v.categoryName, count: 0, totalViews: 0 }
    }
    map[v.categoryId].count++
    map[v.categoryId].totalViews += v.viewCount
  }
  return Object.values(map).sort((a, b) => b.count - a.count)
}
