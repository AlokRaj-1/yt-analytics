export interface ChannelStats {
  id: string
  title: string
  description: string
  thumbnail: string
  subscriberCount: number
  viewCount: number
  videoCount: number
  publishedAt: string
}

export interface VideoItem {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  categoryId: string
  categoryName: string
  viewCount: number
  likeCount: number
  commentCount: number
  engagementRate: number
  duration: string
}

export interface CommentItem {
  id: string
  authorName: string
  authorAvatar: string
  text: string
  likeCount: number
  publishedAt: string
  videoId: string
  videoTitle: string
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  count: number
  totalViews: number
}

export interface ChartDataPoint {
  label: string
  views: number
  likes: number
  comments: number
  engagement: number
}
