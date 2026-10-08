import { Card } from '../kokonut/Card';

export default function GlanceCard({ label, value, icon: Icon }) {
  return (
    <Card className="text-center py-6">
      {Icon && <Icon className="mx-auto mb-3 h-6 w-6 text-emerald-700" />}
      <p className="text-caption">{label}</p>
      <p className="text-h4 !text-lg mt-1">{value}</p>
    </Card>
  );
}
