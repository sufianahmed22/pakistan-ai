import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Eye, RefreshCcw, Ban, Trash2, History } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/admin/SearchBar';
import Badge from '../../components/kokonut/Badge';
import ConfirmDialog from '../../components/forms/ConfirmDialog';
import { useAdminList } from '../../hooks/useAdminList';
import { formatDate } from '../../utils/format';
import knowledgeService from '../../services/knowledgeService';

// Matches spec §45: columns Question / Category / Status / Hit Count / Last Refreshed;
// actions View / Edit / Refresh / Disable / Delete / History, server-side paginated.
export default function AdminKnowledge() {
  const { items, page, setPage, totalPages, search, setSearch, loading, error, reload } = useAdminList(knowledgeService);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(null);

  const columns = [
    { key: 'question', label: 'Question', render: (r) => <span className="line-clamp-2 max-w-xs block">{r.question}</span> },
    { key: 'category', label: 'Category', render: (r) => <Badge tone="charcoal">{r.category || 'General'}</Badge> },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <Badge tone={r.status === 'active' ? 'emerald' : r.status === 'flagged' ? 'amber' : 'red'}>
          {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : 'Active'}
        </Badge>
      ),
    },
    { key: 'usageCount', label: 'Hit Count', render: (r) => r.usageCount ?? 0 },
    { key: 'updatedAt', label: 'Last Updated', render: (r) => (r.updatedAt ? formatDate(r.updatedAt) : '—') },
  ];

  const refresh = async (row) => {
    setBusy(row._id);
    try {
      await knowledgeService.refresh(row._id || row.id);
      toast.success('Refresh requested');
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to refresh');
    } finally {
      setBusy(null);
    }
  };

  const toggleDisable = async (row) => {
    const isDisabled = row.status === 'disabled';
    setBusy(row._id);
    try {
      await knowledgeService.update(row._id || row.id, { status: isDisabled ? 'active' : 'disabled' });
      toast.success(isDisabled ? 'Entry enabled' : 'Entry disabled');
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    setBusy('delete');
    try {
      await knowledgeService.remove(deleting._id || deleting.id);
      toast.success('Entry deleted');
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Knowledge Base" description="Cached AI-generated answers used to avoid redundant OpenAI calls." />
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search knowledge entries…" />
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
        emptyProps={{ title: 'No knowledge entries yet' }}
        rowActions={(row) => (
          <div className="flex justify-end gap-1">
            <Link to={`/admin/knowledge/${row._id || row.id}`} className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100" aria-label="View entry">
              <Eye className="h-4 w-4" />
            </Link>
            <Link to={`/admin/knowledge/${row._id || row.id}`} className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100" aria-label="History">
              <History className="h-4 w-4" />
            </Link>
            <button className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50" onClick={() => refresh(row)} aria-label="Refresh answer" disabled={busy === row._id}>
              <RefreshCcw className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
              onClick={() => toggleDisable(row)}
              aria-label={row.status === 'disabled' ? 'Enable entry' : 'Disable entry'}
              disabled={busy === row._id}
            >
              <Ban className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => setDeleting(row)} aria-label="Delete entry">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete this knowledge entry?" confirming={busy === 'delete'} />
    </div>
  );
}
