interface SkeletonProps {
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
}

/**
 * Single skeleton block — a pulsing dark rectangle.
 * Neo-Brutalist: hard edges, no radius, red shimmer.
 */
export function Skeleton({ width = '100%', height = 16, style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        background: '#1A1A1A',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,45,32,0.08) 50%, transparent 100%)',
        animation: 'skeleton-shimmer 1.4s infinite',
      }} />
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

/** Four stat cards skeleton — mirrors OverviewCards layout */
export function OverviewCardsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '3px solid #1A1A1A' }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ background: '#1A1A1A', padding: 20, minHeight: 140, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton width={80} height={10} />
          <Skeleton width={120} height={48} />
          <Skeleton width={140} height={10} />
        </div>
      ))}
    </div>
  )
}

/** Chart area skeleton */
export function ChartSkeleton() {
  return (
    <div style={{ background: '#0A0A0A', border: '3px solid #1A1A1A', padding: 20 }}>
      <Skeleton width={120} height={11} style={{ marginBottom: 20 }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 180 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height={`${30 + Math.sin(i) * 30 + 40}%`}
          />
        ))}
      </div>
    </div>
  )
}

/** Video table skeleton — 6 rows */
export function VideoTableSkeleton() {
  return (
    <div style={{ border: '3px solid #1A1A1A' }}>
      {/* Header */}
      <div style={{ background: '#1A1A1A', padding: '12px 16px', display: 'flex', gap: 16 }}>
        {[60, 300, 100, 80, 80, 80, 100, 80].map((w, i) => (
          <Skeleton key={i} width={w} height={10} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: i % 2 === 0 ? '#0A0A0A' : '#1A1A1A',
            borderBottom: '1px solid #1A1A1A',
          }}
        >
          <Skeleton width={24} height={10} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 300px' }}>
            <Skeleton width={56} height={40} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton width="90%" height={12} />
              <Skeleton width={40} height={9} />
            </div>
          </div>
          {[80, 70, 70, 80, 100, 70].map((w, j) => (
            <Skeleton key={j} width={w} height={10} style={{ marginLeft: 'auto' }} />
          ))}
        </div>
      ))}
    </div>
  )
}
