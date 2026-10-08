import { useState } from 'react';
import { toast } from 'sonner';
import { Users, MessagesSquare, BrainCircuit, Percent, Ticket, Send, Eye, UserCheck, RefreshCw } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/kokonut/Button';
import AsyncState from '../../components/ui/AsyncState';
import { AIRequestsChart, KnowledgeUsageChart } from '../../components/charts';
import { useFetch } from '../../hooks/useFetch';
import adminService from '../../services/adminService';
import { cn } from '../../utils/cn';

export default function AdminOverview() {
  const { data, loading, error, reload } = useFetch(() => adminService.overview(), []);
  const [rebuildingSeo, setRebuildingSeo] = useState(false);

  const handleRebuildSeo = async () => {
    setRebuildingSeo(true);
    try {
      const res = await adminService.rebuildSeo();
      toast.success(res.message || 'Sitemap & SEO updated successfully!');
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to update sitemap & SEO');
    } finally {
      setRebuildingSeo(false);
    }
  };

  const cards = [
    { label: 'Total Users', value: data?.totalUsers, icon: Users, tone: 'emerald' },
    { label: 'Total Questions', value: data?.totalQuestions, icon: MessagesSquare, tone: 'gold' },
    { label: 'Knowledge Entries', value: data?.knowledgeEntries, icon: BrainCircuit, tone: 'emerald' },
    { label: 'Knowledge Hit Rate', value: data?.knowledgeHitRate, icon: Percent, tone: 'gold', suffix: '%' },
    { label: 'Open Tickets', value: data?.openTickets, icon: Ticket, tone: 'emerald' },
    { label: 'Telegram Users', value: data?.telegramUsers, icon: Send, tone: 'gold' },
    { label: 'Page Views (30d)', value: data?.totalPageViews, icon: Eye, tone: 'emerald' },
    { label: 'Unique Visitors (30d)', value: data?.uniqueVisitors, icon: UserCheck, tone: 'gold' },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Live snapshot of Pakistan AI activity."
        action={
          <Button
            variant="secondary"
            onClick={handleRebuildSeo}
            loading={rebuildingSeo}
            className="flex items-center gap-2 border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-sm font-medium"
          >
            <RefreshCw className={cn('h-4 w-4', rebuildingSeo && 'animate-spin')} />
            Update Sitemap & SEO
          </Button>
        }
      />
      <AsyncState loading={loading} error={error} isEmpty={false} onRetry={reload}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AIRequestsChart data={data?.requestsByDay || []} caption="Questions answered per day, AI vs. knowledge-base lookups." />
          <KnowledgeUsageChart data={data?.categoryBreakdown || []} caption="Distribution of knowledge base entries by category." />
        </div>
      </AsyncState>
    </div>
  );
}
