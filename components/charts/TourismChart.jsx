import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, AXIS_STYLE, GRID_STROKE } from './theme';
import { formatCompactNumber } from '../../utils/format';

// Expects data: [{ year, visitors }] — annual tourist-arrival style series
export default function TourismChart({ data = [], title = 'Annual Visitors', caption }) {
  return (
    <ChartCard title={title} caption={caption}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="year" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatCompactNumber} width={56} />
          <Tooltip formatter={(v) => formatCompactNumber(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e4e6e8' }} />
          <Bar dataKey="visitors" fill={CHART_COLORS[2]} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
