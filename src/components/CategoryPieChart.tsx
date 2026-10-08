import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { CategoryBreakdown } from '../api/types'
import { DARK_TOOLTIP_STYLE, CHART_COLORS } from '../utils/chartTheme'

const PIE_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.offWhite,
  '#CC2418',
  '#A0A0A0',
  '#7A0A05',
  '#D4CFC6',
]

interface Props { categories: CategoryBreakdown[] }

export default function CategoryPieChart({ categories }: Props) {
  const data = categories.map(c => ({ name: c.categoryName, value: c.count }))

  return (
    <div style={{ background: CHART_COLORS.offWhite, border: `3px solid ${CHART_COLORS.black}`, padding: 20 }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', color: CHART_COLORS.black, textTransform: 'uppercase', marginBottom: 16 }}>
        Videos by Category
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius={90}
            dataKey="value"
            stroke={CHART_COLORS.black}
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={DARK_TOOLTIP_STYLE}
            formatter={(v, name) => [`${v} videos`, String(name)]}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: CHART_COLORS.black }}
            iconType="square"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
