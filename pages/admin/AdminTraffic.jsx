import { Eye, Users } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatCard from '../../components/admin/StatCard';
import AsyncState from '../../components/ui/AsyncState';
import { TrafficChart } from '../../components/charts';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import { formatCompactNumber } from '../../utils/format';
import analyticsService from '../../services/analyticsService';

export default function AdminTraffic() {
  const { data, loading, error, reload } = useFetch(() => analyticsService.traffic({ days: 30 }), []);

  const cards = [
    { label: 'Page Views (30d)', value: data?.totalViews, icon: Eye, tone: 'emerald' },
    { label: 'Unique Visitors (30d)', value: data?.uniqueVisitors, icon: Users, tone: 'gold' },
  ];

  return (
    <div>
      <AdminPageHeader title="Site Traffic" description="How many people are visiting the public site, and which pages they're viewing." />
      <AsyncState loading={loading} error={error} isEmpty={false} onRetry={reload}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>
        <div className="mt-6">
          <TrafficChart data={data?.viewsByDay || []} caption="Page views and unique visitors per day, last 30 days." />
        </div>
        <Card className="mt-6">
          <h3 className="text-h4 mb-4">Most Visited Pages</h3>
          {data?.topPages?.length ? (
            <ol className="space-y-2 list-decimal list-inside text-charcoal-700">
              {data.topPages.map((p, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span className="truncate">{p.path}</span>
                  <span className="text-charcoal-400">{formatCompactNumber(p.views)} views</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-body">No traffic data yet.</p>
          )}
        </Card>
      </AsyncState>
    </div>
  );
}
