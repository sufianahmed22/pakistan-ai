import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, X } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/kokonut/Badge';
import ConfirmDialog from '../../components/forms/ConfirmDialog';
import { useAdminList } from '../../hooks/useAdminList';
import { formatDate, truncate } from '../../utils/format';
import moderationService from '../../services/moderationService';

const STATUS_TONE = { pending: 'amber', resolved: 'emerald', dismissed: 'charcoal' };

// Moderation queue, not single-entity CRUD - built directly on DataTable
// rather than AdminEntityListPage, same documented exception used for
// Tickets/Conversations elsewhere in this codebase.
export default function AdminReviewReports() {
  const [status, setStatus] = useState('pending');
  const service = { list: (params) => moderationService.listReviewReports(params) };
  const { items, page, setPage, totalPages, loading, error, reload } = useAdminList(service, { status });
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(null);

  const columns = [
    {
      key: 'review',
      label: 'Reported Review',
      render: (r) => (
        <div className="max-w-sm">
          <p className="line-clamp-2 text-sm">{truncate(r.reviewId?.text, 140) || '(review removed)'}</p>
          <p className="text-caption mt-1 text-charcoal-400">
            {r.reviewId?.destinationId?.name || (r.reviewId?.cityId?.name ? `City: ${r.reviewId.cityId.name}` : '—')}
          </p>
        </div>
      ),
    },
    { key: 'reason', label: 'Reason', render: (r) => <span className="line-clamp-2 max-w-xs block">{r.reason}</span> },
    { key: 'reporter', label: 'Reporter', render: (r) => r.reporterId?.name || r.reporterId?.email || '—' },
    { key: 'createdAt', label: 'Reported On', render: (r) => formatDate(r.createdAt) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <Badge tone={STATUS_TONE[r.status] || 'charcoal'}>{r.status}</Badge>,
    },
  ];

  const dismiss = async (row) => {
    setBusy(row._id);
    try {
      await moderationService.resolveReviewReport(row._id || row.id, 'dismiss');
      toast.success('Report dismissed');
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to dismiss report');
    } finally {
      setBusy(null);
    }
  };

  const confirmDelete = async () => {
    setBusy('delete');
    try {
      await moderationService.resolveReviewReport(deleting._id || deleting.id, 'delete_review');
      toast.success('Review deleted');
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Review Reports" description="User-flagged destination reviews awaiting a moderation decision." />
      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-charcoal-200 px-3 py-2 text-sm"
          aria-label="Filter by status"
        >
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>
      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={reload}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyProps={{ title: 'No reports here' }}
        rowActions={(row) =>
          row.status === 'pending' ? (
            <div className="flex justify-end gap-1">
              <button
                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                onClick={() => setDeleting(row)}
                aria-label="Delete review"
                disabled={busy === row._id}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100"
                onClick={() => dismiss(row)}
                aria-label="Dismiss report"
                disabled={busy === row._id}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <span className="text-caption text-charcoal-400">—</span>
          )
        }
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete this review?"
        description="This hides the review from the destination page. It can be restored from the database if needed, but there's no restore button in the admin UI yet."
        confirming={busy === 'delete'}
      />
    </div>
  );
}
