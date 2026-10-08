import { asOfLabel } from '../../utils/format';
import Badge from '../kokonut/Badge';

// Renders Value / Year / Source per the "never present stale data as current" rule.
export default function StatValue({ record, formatter, label }) {
  if (!record) return <span className="text-charcoal-300">No data</span>;
  const value = formatter ? formatter(record.value) : record.value;
  return (
    <div>
      {label && <p className="text-caption mb-1">{label}</p>}
      <p className="text-h3 text-charcoal-900">{value}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <Badge tone="charcoal">{asOfLabel(record)}</Badge>
        {record.source && <span className="text-xs text-charcoal-400">Source: {record.source}</span>}
      </div>
    </div>
  );
}
