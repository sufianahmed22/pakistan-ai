import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, AXIS_STYLE, GRID_STROKE } from './theme';

// Admin-only. Expects data: [{ date, aiRequests, dbResponses }]
export default function AIRequestsChart({ data = [], title = 'AI Requests vs. DB Responses', caption }) {
  return (
    <ChartCard title={title} caption={caption}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="date" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e6e8' }} />
          <Legend />
          <Line type="monotone" dataKey="aiRequests" name="AI Requests" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="dbResponses" name="DB Responses" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
