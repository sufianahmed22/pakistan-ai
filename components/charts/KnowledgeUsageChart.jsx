import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS } from './theme';

// Admin-only. Expects data: [{ name, value }] — knowledge entries by category.
export default function KnowledgeUsageChart({ data = [], title = 'Knowledge Base by Category', caption }) {
  return (
    <ChartCard title={title} caption={caption}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
