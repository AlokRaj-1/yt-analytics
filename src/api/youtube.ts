import axios from 'axios'
import type { ChannelStats, VideoItem, CommentItem } from './types'
import type {
  YTChannel,
  YTVideoCategory,
  YTSearchResult,
  YTVideo,
  YTCommentThread,
} from './ytTypes'
import { calcEngagement } from '../utils/format'

const BASE = 'https://www.googleapis.com/youtube/v3'
const API_KEY = import.meta.env.VITE_YT_API_KEY as string

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  const h = parseInt(match[1] ?? '0')
  const m = parseInt(match[2] ?? '0')
  const s = parseInt(match[3] ?? '0')
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

// ── category map ──────────────────────────────────────────────────────────────

export async function fetchCategoryMap(): Promise<Record<string, string>> {
  const res = await axios.get<{ items: YTVideoCategory[] }>(`${BASE}/videoCategories`, {
    params: { part: 'snippet', regionCode: 'US', key: API_KEY },
  })
  const map: Record<string, string> = {}
  for (const item of res.data.items ?? []) {
    map[item.id] = item.snippet.title
  }
  return map
}

// ── channel stats ─────────────────────────────────────────────────────────────

export async function fetchChannelStats(channelId: string): Promise<ChannelStats> {
  // Determine the correct lookup param based on input format:
  //   @handle  → forHandle (strip leading @)
  //   UC...    → id
  //   anything else → forUsername (legacy YouTube usernames)
  let lookupParam: Record<string, string>
  if (channelId.startsWith('@')) {
    lookupParam = { forHandle: channelId.slice(1) }
  } else if (/^UC[\w-]{22}$/.test(channelId)) {
    lookupParam = { id: channelId }
  } else {
    lookupParam = { forUsername: channelId }
  }

  const res = await axios.get<{ items?: YTChannel[] }>(`${BASE}/channels`, {
    params: { part: 'snippet,statistics', ...lookupParam, key: API_KEY },
  })
  const ch = res.data.items?.[0]
  if (!ch) throw new Error(`Channel not found. Try using the full Channel ID (starts with "UC") or "@handle" format.`)
  return {
    id: ch.id,
    title: ch.snippet.title,
    description: ch.snippet.description,
    thumbnail: ch.snippet.thumbnails?.high?.url ?? ch.snippet.thumbnails?.default?.url ?? '',
    subscriberCount: parseInt(ch.statistics.subscriberCount ?? '0'),
    viewCount: parseInt(ch.statistics.viewCount ?? '0'),
    videoCount: parseInt(ch.statistics.videoCount ?? '0'),
    publishedAt: ch.snippet.publishedAt,
  }
}

// ── resolve any input → UC channel ID ────────────────────────────────────────

export async function resolveChannelId(input: string): Promise<string> {
  // Already a UC id — return as-is
  if (/^UC[\w-]{22}$/.test(input)) return input

  let lookupParam: Record<string, string>
  if (input.startsWith('@')) {
    lookupParam = { forHandle: input.slice(1) }
  } else {
    lookupParam = { forUsername: input }
  }

  const res = await axios.get<{ items?: { id: string }[] }>(`${BASE}/channels`, {
    params: { part: 'id', ...lookupParam, key: API_KEY },
  })
  const id = res.data.items?.[0]?.id
  if (!id) throw new Error(`Channel not found. Try "@handle" or the UC... Channel ID.`)
  return id
}

export interface VideoPage {
  items: VideoItem[]
  nextPageToken: string | null
}

// ── video list ────────────────────────────────────────────────────────────────

export async function fetchVideos(rawChannelId: string, pageToken?: string): Promise<VideoPage> {
  // Resolve @handle / username → UC id before searching
  const channelId = await resolveChannelId(rawChannelId)

  // Step 1 – search for video IDs (one page = 50 results)
  const searchRes = await axios.get<{ items: YTSearchResult[]; nextPageToken?: string }>(`${BASE}/search`, {
    params: {
      part: 'snippet',
      channelId,
      maxResults: 50,
      type: 'video',
      order: 'date',
      key: API_KEY,
      ...(pageToken ? { pageToken } : {}),
    },
  })
  const items = searchRes.data.items ?? []
  const nextPageToken: string | null = searchRes.data.nextPageToken ?? null

  if (items.length === 0) return { items: [], nextPageToken: null }

  const ids: string[] = items.map(i => i.id.videoId).filter((id): id is string => !!id)

  // Step 2 – batch fetch statistics + contentDetails
  const statsRes = await axios.get<{ items: YTVideo[] }>(`${BASE}/videos`, {
    params: {
      part: 'snippet,statistics,contentDetails',
      id: ids.join(','),
      key: API_KEY,
    },
  })

  // Step 3 – category map
  const catMap = await fetchCategoryMap()

  const videoItems: VideoItem[] = statsRes.data.items.map((v): VideoItem => {
    const views = parseInt(v.statistics?.viewCount ?? '0')
    const likes = parseInt(v.statistics?.likeCount ?? '0')
    const comments = parseInt(v.statistics?.commentCount ?? '0')
    const catId = v.snippet?.categoryId ?? ''
    return {
      id: v.id,
      title: v.snippet?.title ?? '',
      thumbnail: v.snippet?.thumbnails?.medium?.url ?? v.snippet?.thumbnails?.default?.url ?? '',
      publishedAt: v.snippet?.publishedAt ?? '',
      categoryId: catId,
      categoryName: catMap[catId] ?? 'Unknown',
      viewCount: views,
      likeCount: likes,
      commentCount: comments,
      engagementRate: calcEngagement(views, likes, comments),
      duration: formatDuration(v.contentDetails?.duration ?? ''),
    }
  })

  return { items: videoItems, nextPageToken }
}

// ── comments ──────────────────────────────────────────────────────────────────

export async function fetchComments(videoId: string, videoTitle: string): Promise<CommentItem[]> {
  const res = await axios.get<{ items: YTCommentThread[] }>(`${BASE}/commentThreads`, {
    params: {
      part: 'snippet',
      videoId,
      maxResults: 20,
      order: 'relevance',
      key: API_KEY,
    },
  })
  return (res.data.items ?? []).map((c): CommentItem => {
    const top = c.snippet.topLevelComment.snippet
    return {
      id: c.id,
      authorName: top.authorDisplayName,
      authorAvatar: top.authorProfileImageUrl,
      text: top.textDisplay,
      likeCount: top.likeCount ?? 0,
      publishedAt: top.publishedAt,
      videoId,
      videoTitle,
    }
  })
}

// ── my channel (OAuth) ────────────────────────────────────────────────────────

export async function fetchMyChannelId(accessToken: string): Promise<string> {
  const res = await axios.get<{ items?: { id: string }[] }>(`${BASE}/channels`, {
    params: { part: 'id', mine: true },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data.items?.[0]?.id ?? ''
}
