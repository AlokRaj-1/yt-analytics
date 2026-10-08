// Raw YouTube Data API v3 response shapes
// These replace `any` casts in youtube.ts and provide type safety for API responses.

export interface YTThumbnail {
  url: string
  width?: number
  height?: number
}

export interface YTThumbnails {
  default?: YTThumbnail
  medium?: YTThumbnail
  high?: YTThumbnail
  standard?: YTThumbnail
  maxres?: YTThumbnail
}

// channels.list
export interface YTChannelSnippet {
  title: string
  description: string
  publishedAt: string
  thumbnails: YTThumbnails
}

export interface YTChannelStatistics {
  viewCount?: string
  subscriberCount?: string
  hiddenSubscriberCount?: boolean
  videoCount?: string
}

export interface YTChannel {
  id: string
  snippet: YTChannelSnippet
  statistics: YTChannelStatistics
}

// search.list
export interface YTSearchResultId {
  kind: string
  videoId?: string
}

export interface YTSearchResult {
  id: YTSearchResultId
  snippet: {
    title: string
    publishedAt: string
    channelId: string
  }
}

// videos.list
export interface YTVideoSnippet {
  title: string
  publishedAt: string
  categoryId: string
  thumbnails: YTThumbnails
}

export interface YTVideoStatistics {
  viewCount?: string
  likeCount?: string
  commentCount?: string
  favoriteCount?: string
}

export interface YTVideoContentDetails {
  duration: string
}

export interface YTVideo {
  id: string
  snippet: YTVideoSnippet
  statistics: YTVideoStatistics
  contentDetails: YTVideoContentDetails
}

// videoCategories.list
export interface YTVideoCategory {
  id: string
  snippet: { title: string; assignable: boolean }
}

// commentThreads.list
export interface YTCommentSnippet {
  authorDisplayName: string
  authorProfileImageUrl: string
  textDisplay: string
  likeCount: number
  publishedAt: string
  updatedAt: string
}

export interface YTCommentThread {
  id: string
  snippet: {
    topLevelComment: {
      id: string
      snippet: YTCommentSnippet
    }
    totalReplyCount: number
  }
}
