import { fmt } from '../utils/format'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className="flex flex-col justify-between p-5"
      style={{
        background: accent ? '#FF2D20' : '#1A1A1A',
        border: '3px solid #0A0A0A',
        borderColor: accent ? '#0A0A0A' : '#FF2D20',
        minHeight: 140,
      }}
    >
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: accent ? '#0A0A0A' : '#FF2D20',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 900,
          fontSize: 48,
          lineHeight: 1,
          color: accent ? '#0A0A0A' : '#F5F0E8',
          letterSpacing: '-2px',
        }}
      >
        {typeof value === 'number' ? fmt(value) : value}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: accent ? '#0A0A0A' : '#F5F0E8',
            opacity: 0.7,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  )
}

interface OverviewCardsProps {
  subscriberCount: number
  viewCount: number
  videoCount: number
  avgEngagement: number
}

export default function OverviewCards({
  subscriberCount,
  viewCount,
  videoCount,
  avgEngagement,
}: OverviewCardsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
        border: '3px solid #FF2D20',
      }}
    >
      <StatCard label="Subscribers" value={subscriberCount} sub="Total channel subscribers" accent />
      <StatCard label="Total Views" value={viewCount} sub="All-time channel views" />
      <StatCard label="Videos" value={videoCount} sub="Published videos" />
      <StatCard
        label="Avg Engagement"
        value={avgEngagement.toFixed(2) + '%'}
        sub="(Likes + Comments) / Views"
      />
    </div>
  )
}
