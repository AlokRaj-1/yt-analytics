import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import type { ChartDataPoint } from '../api/types'
import { AXIS_TICK_STYLE, TOOLTIP_STYLE, CHART_COLORS, CHART_CONTAINER_STYLE, CHART_SECTION_LABEL } from '../utils/chartTheme'

interface Props { data: ChartDataPoint[] }

export default function ViewsChart({ data }: Props) {
  return (
    <div style={CHART_CONTAINER_STYLE}>
      <div style={CHART_SECTION_LABEL}>Views Over Time</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="0" stroke={CHART_COLORS.grid} />
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
            cursor={{ stroke: CHART_COLORS.red, strokeWidth: 1 }}
            formatter={(v) => [Number(v).toLocaleString(), 'Views']}
          />
          <Line
            type="monotone"
            dataKey="views"
            stroke={CHART_COLORS.red}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.red, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: CHART_COLORS.red }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
