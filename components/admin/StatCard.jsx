import { Card } from '../kokonut/Card';
import { formatCompactNumber } from '../../utils/format';

export default function StatCard({ label, value, icon: Icon, tone = 'emerald', suffix }) {
  return (
    <Card className="flex items-center gap-4">
      {Icon && (
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-${tone}-50 text-${tone}-700`}>
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-caption truncate">{label}</p>
        <p className="text-h3 truncate">
          {value === null || value === undefined ? '—' : formatCompactNumber(value)}
          {suffix}
        </p>
      </div>
    </Card>
  );
}
