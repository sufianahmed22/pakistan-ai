import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Eye } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/admin/SearchBar';
import ConfirmDialog from '../../components/forms/ConfirmDialog';
import Dialog from '../../components/kokonut/Dialog';
import { useAdminList } from '../../hooks/useAdminList';
import { formatDate } from '../../utils/format';
import conversationService from '../../services/conversationService';

export default function AdminConversations() {
  const { items, page, setPage, totalPages, search, setSearch, loading, error, reload } = useAdminList(conversationService);
  const [deleting, setDeleting] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [busy, setBusy] = useState(false);

  const columns = [
    { key: 'user', label: 'User', render: (r) => r.user?.name || r.user?.email || 'Anonymous' },
    { key: 'messageCount', label: 'Messages', render: (r) => r.messages?.length ?? r.messageCount ?? '—' },
    { key: 'createdAt', label: 'Started', render: (r) => formatDate(r.createdAt) },
  ];

  const handleDelete = async () => {
    setBusy(true);
    try {
      await conversationService.remove(deleting._id || deleting.id);
      toast.success('Conversation deleted');
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to delete conversation');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Conversations" description="All AI chat conversations across the platform." />
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search conversations…" />
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
        emptyProps={{ title: 'No conversations yet' }}
        rowActions={(row) => (
          <div className="flex justify-end gap-1">
            <button className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100" onClick={() => setViewing(row)} aria-label="View conversation">
              <Eye className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => setDeleting(row)} aria-label="Delete conversation">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
      <Dialog open={!!viewing} onClose={() => setViewing(null)} title="Conversation" className="max-w-2xl">
        <div className="max-h-[60vh] space-y-3 overflow-y-auto scrollbar-thin">
          {(viewing?.messages || []).map((m, i) => (
            <div key={i} className="rounded-xl border border-charcoal-100 p-3">
              <p className="text-sm font-semibold text-charcoal-800">Q: {m.question}</p>
              <p className="text-sm text-charcoal-600 mt-1">A: {m.answer}</p>
            </div>
          ))}
          {!viewing?.messages?.length && <p className="text-body">No messages recorded.</p>}
        </div>
      </Dialog>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete this conversation?" confirming={busy} />
    </div>
  );
}
