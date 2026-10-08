import { useState } from 'react'
import { useChannelStats } from '../hooks/useChannelStats'
import { useVideoStats, flattenVideos, buildChartData, buildCategoryBreakdown } from '../hooks/useVideoStats'
import OverviewCards from '../components/OverviewCards'
import VideoTable from '../components/VideoTable'
import ViewsChart from '../components/ViewsChart'
import LikesCommentsChart from '../components/LikesCommentsChart'
import CategoryPieChart from '../components/CategoryPieChart'
import EngagementChart from '../components/EngagementChart'
import CommentsPanel from '../components/CommentsPanel'
import { OverviewCardsSkeleton, ChartSkeleton, VideoTableSkeleton } from '../components/Skeleton'
import type { VideoItem } from '../api/types'

const DEMO_CHANNEL_ID = 'UCVHFbw7woebPpCQYeFhIknw' // fallback demo — MrBeast

interface Props {
  channelId: string
  onLogout?: () => void
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 900,
      fontSize: 13,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#FF2D20',
      borderBottom: '3px solid #FF2D20',
      paddingBottom: 8,
      marginBottom: 16,
    }}>
      {children}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <div style={{ width: 160, height: 11, background: '#1A1A1A', marginBottom: 12 }} />
        <OverviewCardsSkeleton />
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ width: 200, height: 11, background: '#1A1A1A', marginBottom: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <ChartSkeleton /><ChartSkeleton />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <ChartSkeleton /><ChartSkeleton />
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ width: 120, height: 11, background: '#1A1A1A', marginBottom: 12 }} />
        <VideoTableSkeleton />
      </div>
    </>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div style={{ border: '3px solid #FF2D20', padding: 24, background: '#0A0A0A' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: '#FF2D20', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
        Error
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#F5F0E8' }}>{message}</div>
    </div>
  )
}

export default function Dashboard({ channelId, onLogout }: Props) {
  const id = channelId || DEMO_CHANNEL_ID
  const { data: channel, isLoading: chLoading, error: chError } = useChannelStats(id)
  const {
    data: videoPages,
    isLoading: vLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: vError,
  } = useVideoStats(id)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)

  const videos = flattenVideos(videoPages)
  const chartData = buildChartData(videos)
  const categories = buildCategoryBreakdown(videos)
  const avgEngagement = videos.length > 0
    ? videos.reduce((s, v) => s + v.engagementRate, 0) / videos.length
    : 0

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      {/* ── Header ── */}
      <header style={{ background: '#0A0A0A', borderBottom: '4px solid #FF2D20', padding: '0 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Logo mark */}
            <div style={{ background: '#FF2D20', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M17.6 2.2C17.4 1.5 16.8 1 16.1 0.8C14.7 0.4 9 0.4 9 0.4C9 0.4 3.3 0.4 1.9 0.8C1.2 1 0.6 1.5 0.4 2.2C0 3.6 0 7 0 7C0 7 0 10.4 0.4 11.8C0.6 12.5 1.2 13 1.9 13.2C3.3 13.6 9 13.6 9 13.6C9 13.6 14.7 13.6 16.1 13.2C16.8 13 17.4 12.5 17.6 11.8C18 10.4 18 7 18 7C18 7 18 3.6 17.6 2.2ZM7.2 10V4L11.9 7L7.2 10Z" fill="#0A0A0A"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 14, letterSpacing: '0.2em', color: '#F5F0E8', textTransform: 'uppercase' }}>
                YT Analytics
              </div>
              {channel && (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#FF2D20', letterSpacing: '0.05em' }}>
                  {channel.title}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {channel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={channel.thumbnail} alt={channel.title} style={{ width: 32, height: 32, border: '2px solid #FF2D20', objectFit: 'cover' }} />
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F5F0E8', opacity: 0.7 }}>
                  {channel.subscriberCount.toLocaleString()} subscribers
                </div>
              </div>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: '2px solid #FF2D20',
                  color: '#FF2D20',
                  padding: '6px 14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 32px 64px' }}>
        {/* Errors */}
        {(chError || vError) && (
          <div style={{ marginBottom: 24 }}>
            <ErrorState message={(chError as Error)?.message ?? (vError as Error)?.message ?? 'Unknown error. Check your API key.'} />
          </div>
        )}

        {/* Overview */}
        {(chLoading || vLoading) ? (
          <DashboardSkeleton />
        ) : channel ? (
          <>
            {/* Stats strip */}
            <div style={{ marginBottom: 32 }}>
              <SectionTitle>Channel Overview</SectionTitle>
              <OverviewCards
                subscriberCount={channel.subscriberCount}
                viewCount={channel.viewCount}
                videoCount={channel.videoCount}
                avgEngagement={avgEngagement}
              />
            </div>

            {/* Charts row */}
            <div style={{ marginBottom: 32 }}>
              <SectionTitle>Performance Charts</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ border: '0' }}><ViewsChart data={chartData} /></div>
                <div style={{ border: '0', borderLeft: '0' }}><LikesCommentsChart data={chartData} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 0 }}>
                <div><EngagementChart data={chartData} avgEngagement={avgEngagement} /></div>
                <div style={{ borderLeft: '0' }}><CategoryPieChart categories={categories} /></div>
              </div>
            </div>

            {/* Video Table */}
            {videos.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <SectionTitle>Videos — {videos.length}{hasNextPage ? '+' : ''} loaded</SectionTitle>
                <VideoTable videos={videos} onSelectVideo={setSelectedVideo} selectedVideoId={selectedVideo?.id} />

                {/* Load More */}
                {(hasNextPage || isFetchingNextPage) && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 0, borderTop: '3px solid #FF2D20' }}>
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      style={{
                        width: '100%',
                        background: isFetchingNextPage ? '#1A1A1A' : '#0A0A0A',
                        border: 'none',
                        borderTop: 'none',
                        color: isFetchingNextPage ? '#F5F0E8' : '#FF2D20',
                        padding: '14px',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        cursor: isFetchingNextPage ? 'not-allowed' : 'pointer',
                        opacity: isFetchingNextPage ? 0.5 : 1,
                      }}
                    >
                      {isFetchingNextPage ? 'Loading...' : `Load more videos →`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Comments */}
            <div>
              <SectionTitle>Comments</SectionTitle>
              <CommentsPanel video={selectedVideo} />
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}
