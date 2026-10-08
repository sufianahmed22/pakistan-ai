import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AsyncState from '../../components/ui/AsyncState';
import { AIRequestsChart, KnowledgeUsageChart } from '../../components/charts';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import { formatCompactNumber } from '../../utils/format';
import adminService from '../../services/adminService';

export default function AdminAnalytics() {
  const { data, loading, error, reload } = useFetch(() => adminService.aiAnalytics(), []);

  return (
    <div>
      <AdminPageHeader title="AI Analytics" description="How the AI assistant is being used, and how often cached knowledge answers requests instead of a live model call." />
      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !data} onRetry={reload}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AIRequestsChart data={data?.requestsByDay || []} />
          <KnowledgeUsageChart data={data?.categoryBreakdown || []} />
        </div>
        <Card className="mt-6">
          <h3 className="text-h4 mb-4">Popular Questions</h3>
          {data?.popularQuestions?.length ? (
            <ol className="space-y-2 list-decimal list-inside text-charcoal-700">
              {data.popularQuestions.map((q, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{q.question}</span>
                  <span className="text-charcoal-400">{formatCompactNumber(q.count)} asks</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-body">No question data yet.</p>
          )}
        </Card>
      </AsyncState>
    </div>
  );
}
