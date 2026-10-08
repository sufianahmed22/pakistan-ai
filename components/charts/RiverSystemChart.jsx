import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS } from './theme';

function SankeyNode({ x, y, width, height, index, payload }) {
  return (
    <Layer key={`node-${index}`}>
      <Rectangle x={x} y={y} width={width} height={height} fill={CHART_COLORS[index % CHART_COLORS.length]} radius={3} />
      <text x={x + width + 6} y={y + height / 2} textAnchor="start" dominantBaseline="middle" fontSize={12} fill="#333840">
        {payload.name}
      </text>
    </Layer>
  );
}

// Expects data: { nodes: [{ name }], links: [{ source, target, value }] } — from statisticsService.rivers()
export default function RiverSystemChart({ data, title = 'River System (Indus Basin)', caption }) {
  const hasData = data?.nodes?.length && data?.links?.length;
  return (
    <ChartCard title={title} caption={caption} height={360}>
      {hasData ? (
        <ResponsiveContainer>
          <Sankey
            data={data}
            node={<SankeyNode />}
            nodePadding={24}
            link={{ stroke: '#0a7f53', strokeOpacity: 0.25 }}
            margin={{ top: 8, right: 120, left: 8, bottom: 8 }}
          >
            <Tooltip />
          </Sankey>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-charcoal-300 text-sm">No river data available</div>
      )}
    </ChartCard>
  );
}
