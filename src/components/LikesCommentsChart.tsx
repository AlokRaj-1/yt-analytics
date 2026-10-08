import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { ChartDataPoint } from '../api/types'
import { AXIS_TICK_STYLE, TOOLTIP_STYLE, CHART_COLORS, CHART_CONTAINER_STYLE, CHART_SECTION_LABEL } from '../utils/chartTheme'

interface Props { data: ChartDataPoint[] }

export default function LikesCommentsChart({ data }: Props) {
  return (
    <div style={CHART_CONTAINER_STYLE}>
      <div style={CHART_SECTION_LABEL}>Likes vs Comments</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="0" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ ...AXIS_TICK_STYLE, fontSize: 9 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            stroke={CHART_COLORS.grid}
          />
          <YAxis
            tick={AXIS_TICK_STYLE}
            stroke={CHART_COLORS.grid}
            tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: 'rgba(255,45,32,0.08)' }}
          />
          <Legend wrapperStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: CHART_COLORS.offWhite, paddingTop: 8 }} />
          <Bar dataKey="likes" fill={CHART_COLORS.red} radius={0} name="Likes" />
          <Bar dataKey="comments" fill={CHART_COLORS.offWhite} radius={0} name="Comments" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
