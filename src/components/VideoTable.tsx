import { useState } from 'react'
import type { VideoItem } from '../api/types'
import { fmt, fmtDate } from '../utils/format'

type SortKey = 'viewCount' | 'likeCount' | 'commentCount' | 'engagementRate' | 'publishedAt'

const COLS: { key: SortKey; label: string }[] = [
  { key: 'viewCount', label: 'VIEWS' },
  { key: 'likeCount', label: 'LIKES' },
  { key: 'commentCount', label: 'COMMENTS' },
  { key: 'engagementRate', label: 'ENGAGEMENT' },
  { key: 'publishedAt', label: 'DATE' },
]

interface Props {
  videos: VideoItem[]
  onSelectVideo: (video: VideoItem) => void
  selectedVideoId?: string
}

export default function VideoTable({ videos, onSelectVideo, selectedVideoId }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('viewCount')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...videos].sort((a, b) => {
    // Date: compare as timestamps, not strings
    if (sortKey === 'publishedAt') {
      const at = new Date(a.publishedAt).getTime()
      const bt = new Date(b.publishedAt).getTime()
      return sortDir === 'desc' ? bt - at : at - bt
    }
    const av = a[sortKey]
    const bv = b[sortKey]
    if (typeof av === 'number' && typeof bv === 'number')
      return sortDir === 'desc' ? bv - av : av - bv
    return sortDir === 'desc'
      ? String(bv).localeCompare(String(av))
      : String(av).localeCompare(String(bv))
  })

  return (
    <div style={{ border: '3px solid #FF2D20', overflowX: 'auto' }}>
      <table
        role="grid"
        aria-label="Video analytics table"
        style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace' }}
      >
        <thead>
          <tr style={{ background: '#FF2D20' }}>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'left',
                fontSize: 10,
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#0A0A0A',
                borderRight: '2px solid #0A0A0A',
                width: 60,
              }}
            >
              #
            </th>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'left',
                fontSize: 10,
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#0A0A0A',
                borderRight: '2px solid #0A0A0A',
              }}
            >
              TITLE
            </th>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'left',
                fontSize: 10,
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#0A0A0A',
                borderRight: '2px solid #0A0A0A',
              }}
            >
              CATEGORY
            </th>
            {COLS.map(col => (
              <th
                key={col.key}
                scope="col"
                role="columnheader"
                aria-sort={sortKey === col.key ? (sortDir === 'desc' ? 'descending' : 'ascending') : 'none'}
                onClick={() => handleSort(col.key)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSort(col.key)}
                tabIndex={0}
                style={{
                  padding: '10px 12px',
                  textAlign: 'right',
                  fontSize: 10,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: '#0A0A0A',
                  borderRight: '2px solid #0A0A0A',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  outline: 'none',
                }}
              >
                {col.label} {sortKey === col.key ? (sortDir === 'desc' ? '↓' : '↑') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((v, i) => {
            const isSelected = v.id === selectedVideoId
            const isOdd = i % 2 === 0
            return (
              <tr
                key={v.id}
                role="row"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => onSelectVideo(v)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectVideo(v)}
                style={{
                  background: isSelected ? '#FF2D20' : isOdd ? '#0A0A0A' : '#1A1A1A',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  borderBottom: '1px solid #1A1A1A',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = '#2A1A1A'
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = isOdd ? '#0A0A0A' : '#1A1A1A'
                }}
                onFocus={e => {
                  if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = '#2A1A1A'
                }}
                onBlur={e => {
                  if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = isOdd ? '#0A0A0A' : '#1A1A1A'
                }}
              >
                <td style={{ padding: '10px 12px', color: isSelected ? '#0A0A0A' : '#F5F0E8', opacity: 0.5, borderRight: '1px solid #1A1A1A', fontSize: 12 }}>{i + 1}</td>
                <td style={{ padding: '10px 12px', borderRight: '1px solid #1A1A1A', maxWidth: 300 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      style={{ width: 56, height: 40, objectFit: 'cover', border: `2px solid ${isSelected ? '#0A0A0A' : '#FF2D20'}`, flexShrink: 0 }}
                    />
                    <div>
                      <div style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 13,
                        fontWeight: 500,
                        color: isSelected ? '#0A0A0A' : '#F5F0E8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 220,
                      }}>
                        {v.title}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: isSelected ? '#0A0A0A' : '#F5F0E8', opacity: 0.5, marginTop: 2 }}>
                        {v.duration}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', borderRight: '1px solid #1A1A1A' }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: isSelected ? '#0A0A0A' : '#0A0A0A',
                    background: isSelected ? '#F5F0E8' : '#FF2D20',
                    padding: '2px 6px',
                    whiteSpace: 'nowrap',
                  }}>
                    {v.categoryName}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: isSelected ? '#0A0A0A' : '#F5F0E8', borderRight: '1px solid #1A1A1A', fontSize: 13 }}>{fmt(v.viewCount)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: isSelected ? '#0A0A0A' : '#F5F0E8', borderRight: '1px solid #1A1A1A', fontSize: 13 }}>{fmt(v.likeCount)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: isSelected ? '#0A0A0A' : '#F5F0E8', borderRight: '1px solid #1A1A1A', fontSize: 13 }}>{fmt(v.commentCount)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: isSelected ? '#0A0A0A' : '#FF2D20', fontWeight: 700, borderRight: '1px solid #1A1A1A', fontSize: 13 }}>{v.engagementRate}%</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: isSelected ? '#0A0A0A' : '#F5F0E8', opacity: 0.6, fontSize: 11 }}>
                  {fmtDate(v.publishedAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
