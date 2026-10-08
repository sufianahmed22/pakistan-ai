import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, AXIS_STYLE, GRID_STROKE } from './theme';
import { formatCompactNumber } from '../../utils/format';

// Expects data: [{ year, value }] — from statisticsService.population()
export default function PopulationChart({ data = [], title = 'Population Growth', caption }) {
  return (
    <ChartCard title={title} caption={caption}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="year" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatCompactNumber} width={56} />
          <Tooltip formatter={(v) => formatCompactNumber(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e4e6e8' }} />
          <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
