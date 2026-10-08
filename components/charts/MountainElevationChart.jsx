import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, AXIS_STYLE, GRID_STROKE } from './theme';
import { formatNumber } from '../../utils/format';

// Expects data: [{ name, elevation }] — from statisticsService.mountains()
export default function MountainElevationChart({ data = [], title = 'Highest Peaks (m)', caption }) {
  return (
    <ChartCard title={title} caption={caption} height={Math.max(280, data.length * 44)}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
          <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
          <YAxis type="category" dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} width={110} />
          <Tooltip formatter={(v) => `${formatNumber(v)} m`} contentStyle={{ borderRadius: 12, border: '1px solid #e4e6e8' }} />
          <Bar dataKey="elevation" fill={CHART_COLORS[1]} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
