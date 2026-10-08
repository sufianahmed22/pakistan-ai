import { toast } from 'sonner';
import { RefreshCcw } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/kokonut/Badge';
import Button from '../../components/kokonut/Button';
import { useAdminList } from '../../hooks/useAdminList';
import { formatDate } from '../../utils/format';
import knowledgeService from '../../services/knowledgeService';

// Entries due (or overdue) for a refresh, per category-specific intervals
// (see KNOWLEDGE_REFRESH_DAYS_* in the root .env.example).
export default function AdminKnowledgeRefresh() {
  const { items, page, setPage, totalPages, loading, error, reload } = useAdminList(knowledgeService, { dueForRefresh: true });

  const columns = [
    { key: 'question', label: 'Question', render: (r) => <span className="line-clamp-2 max-w-sm block">{r.question}</span> },
    { key: 'category', label: 'Category', render: (r) => <Badge tone="charcoal">{r.category || 'General'}</Badge> },
    { key: 'lastRefreshedAt', label: 'Last Refreshed', render: (r) => (r.lastRefreshedAt ? formatDate(r.lastRefreshedAt) : 'Never') },
    { key: 'refreshDays', label: 'Interval', render: (r) => (r.refreshDays ? `${r.refreshDays} days` : '—') },
  ];

  const refreshOne = async (row) => {
    try {
      await knowledgeService.refresh(row._id || row.id);
      toast.success('Refresh queued');
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to queue refresh');
    }
  };

  return (
    <div>
      <AdminPageHeader title="Refresh Queue" description="Knowledge entries due for a refresh based on category refresh intervals." />
      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={reload}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyProps={{ title: 'Nothing due for refresh', description: 'All knowledge entries are up to date.' }}
        rowActions={(row) => (
          <Button size="sm" variant="secondary" onClick={() => refreshOne(row)}>
            <RefreshCcw className="h-3.5 w-3.5" /> Refresh
          </Button>
        )}
      />
    </div>
  );
}
