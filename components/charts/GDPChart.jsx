import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, AXIS_STYLE, GRID_STROKE } from './theme';
import { formatCompactNumber } from '../../utils/format';

// Expects data: [{ year, value }] — from statisticsService.economy()
export default function GDPChart({ data = [], title = 'GDP (USD)', caption }) {
  return (
    <ChartCard title={title} caption={caption}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gdpFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="year" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatCompactNumber} width={56} />
          <Tooltip formatter={(v) => formatCompactNumber(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e4e6e8' }} />
          <Area type="monotone" dataKey="value" stroke={CHART_COLORS[1]} fill="url(#gdpFill)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
