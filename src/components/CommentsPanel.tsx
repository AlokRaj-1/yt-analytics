import { useState } from 'react'
import DOMPurify from 'dompurify'
import { useComments } from '../hooks/useComments'
import type { VideoItem } from '../api/types'

interface Props {
  video: VideoItem | null
}

export default function CommentsPanel({ video }: Props) {
  const { data: comments, isLoading, error } = useComments(video?.id ?? '', video?.title ?? '')
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!video) {
    return (
      <div style={{ border: '3px solid #1A1A1A', padding: 40, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', color: '#FF2D20', textTransform: 'uppercase', marginBottom: 8 }}>
          Comments
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#F5F0E8', opacity: 0.4 }}>
          ← Select a video from the table to view comments
        </div>
      </div>
    )
  }

  return (
    <div style={{ border: '3px solid #FF2D20' }}>
      {/* Header */}
      <div style={{ background: '#FF2D20', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', color: '#0A0A0A', textTransform: 'uppercase' }}>
            Top Comments
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#0A0A0A', opacity: 0.7, marginTop: 2, maxWidth: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {video.title}
          </div>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 20, color: '#0A0A0A' }}>
          {video.commentCount.toLocaleString()}
        </div>
      </div>

      {/* Comments list */}
      <div style={{ maxHeight: 480, overflowY: 'auto' }}>
        {isLoading && (
          <div style={{ padding: 24, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#F5F0E8', opacity: 0.5 }}>
            Loading comments...
          </div>
        )}
        {!isLoading && !!error && (
          <div style={{ padding: 24, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#FF2D20' }}>
            {`↳ ${(error instanceof Error ? error.message : null) ?? 'Failed to load comments.'}`}
          </div>
        )}
        {!isLoading && !error && (!comments || comments.length === 0) && (
          <div style={{ padding: 24, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#F5F0E8', opacity: 0.5 }}>
            No comments found or comments are disabled for this video.
          </div>
        )}
        {comments?.map((c, i) => {
          const isExp = expanded === c.id
          return (
            <div
              key={c.id}
              onClick={() => setExpanded(isExp ? null : c.id)}
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid #1A1A1A',
                background: i % 2 === 0 ? '#0A0A0A' : '#1A1A1A',
                cursor: 'pointer',
                borderLeft: '4px solid #FF2D20',
                transition: 'background 0.1s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 0 }}>
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    style={{ width: 28, height: 28, border: '2px solid #FF2D20', flexShrink: 0, objectFit: 'cover' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: '#FF2D20', letterSpacing: '0.05em' }}>
                      {c.authorName}
                    </div>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      color: '#F5F0E8',
                      marginTop: 4,
                      lineHeight: 1.5,
                      overflow: isExp ? 'visible' : 'hidden',
                      textOverflow: isExp ? 'unset' : 'ellipsis',
                      whiteSpace: isExp ? 'normal' : 'nowrap',
                    }}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.text, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'], ALLOWED_ATTR: ['href', 'target'] }) }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  {c.likeCount > 0 && (
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#FF2D20', fontWeight: 700 }}>
                      ♥ {c.likeCount.toLocaleString()}
                    </span>
                  )}
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#F5F0E8', opacity: 0.4 }}>
                    {new Date(c.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
