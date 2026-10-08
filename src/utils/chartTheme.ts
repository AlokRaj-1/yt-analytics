import type { CSSProperties } from 'react'

/**
 * Shared Recharts theme for all chart components.
 * Centralises all Neo-Brutalist chart styling in one place.
 */
export const CHART_COLORS = {
  red: '#FF2D20',
  offWhite: '#F5F0E8',
  black: '#0A0A0A',
  darkGray: '#1A1A1A',
  grid: '#1A1A1A',
} as const

/**
 * Recharts `tick` prop expects SVG text attributes, not CSSProperties.
 * `fontFamily`, `fontSize`, and `fill` are valid SVG presentation attributes.
 */
export const AXIS_TICK_STYLE = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 10,
  fill: '#F5F0E8',
} as const

export const TOOLTIP_STYLE: Record<string, unknown> = {
  background: '#F5F0E8',
  border: '2px solid #0A0A0A',
  borderRadius: 0,
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 12,
  color: '#0A0A0A',
}

export const DARK_TOOLTIP_STYLE: Record<string, unknown> = {
  background: '#0A0A0A',
  border: '2px solid #FF2D20',
  borderRadius: 0,
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 12,
  color: '#F5F0E8',
}

export const CHART_SECTION_LABEL: CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.15em',
  color: '#FF2D20',
  textTransform: 'uppercase',
  marginBottom: 16,
}

export const CHART_CONTAINER_STYLE: CSSProperties = {
  background: '#0A0A0A',
  border: '3px solid #FF2D20',
  padding: 20,
}
