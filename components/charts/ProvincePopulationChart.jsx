import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, AXIS_STYLE, GRID_STROKE } from './theme';
import { formatCompactNumber } from '../../utils/format';

// Expects data: [{ name, value }] — from statisticsService.provinces()
export default function ProvincePopulationChart({ data = [], title = 'Population by Province', caption }) {
  return (
    <ChartCard title={title} caption={caption}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatCompactNumber} width={56} />
          <Tooltip formatter={(v) => formatCompactNumber(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e4e6e8' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
