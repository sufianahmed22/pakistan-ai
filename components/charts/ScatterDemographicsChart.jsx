import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, AXIS_STYLE, GRID_STROKE } from './theme';

// Expects data: [{ x, y, z, name }] — from statisticsService.demographics()
export default function ScatterDemographicsChart({ data = [], title = 'Demographics', caption, xLabel, yLabel }) {
  return (
    <ChartCard title={title} caption={caption}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} />
          <XAxis dataKey="x" name={xLabel} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis dataKey="y" name={yLabel} tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <ZAxis dataKey="z" range={[60, 400]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fill={CHART_COLORS[3]} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
