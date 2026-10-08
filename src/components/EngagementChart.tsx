import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import type { ChartDataPoint } from '../api/types'
import { AXIS_TICK_STYLE, TOOLTIP_STYLE, CHART_COLORS, CHART_CONTAINER_STYLE } from '../utils/chartTheme'

interface Props { data: ChartDataPoint[]; avgEngagement: number }

export default function EngagementChart({ data, avgEngagement }: Props) {
  return (
    <div style={CHART_CONTAINER_STYLE}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', color: CHART_COLORS.red, textTransform: 'uppercase' }}>
          Engagement Rate %
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: CHART_COLORS.offWhite, opacity: 0.7 }}>
          avg: <span style={{ color: CHART_COLORS.red, fontWeight: 700 }}>{avgEngagement.toFixed(2)}%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="0" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ ...AXIS_TICK_STYLE, fontSize: 9 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            stroke={CHART_COLORS.grid}
          />
          <YAxis tick={AXIS_TICK_STYLE} stroke={CHART_COLORS.grid} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: 'rgba(255,45,32,0.08)' }}
            formatter={(v) => [`${v}%`, 'Engagement']}
          />
          <ReferenceLine y={avgEngagement} stroke={CHART_COLORS.offWhite} strokeDasharray="4 4" strokeWidth={1} />
          <Bar dataKey="engagement" fill={CHART_COLORS.red} radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
