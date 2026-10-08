/**
 * Shared number formatter used across all components.
 * Avoids duplicating this logic in OverviewCards, VideoTable, etc.
 */
export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

/**
 * Short date string: "Jan 5, '24"
 */
export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  })
}

/**
 * Engagement rate: (likes + comments) / views * 100, rounded to 2dp.
 */
export function calcEngagement(views: number, likes: number, comments: number): number {
  return views > 0 ? parseFloat(((likes + comments) / views * 100).toFixed(2)) : 0
}
