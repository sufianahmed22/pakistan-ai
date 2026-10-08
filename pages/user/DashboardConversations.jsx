import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Trash2, Search } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import { Card } from '../../components/kokonut/Card';
import ConfirmDialog from '../../components/forms/ConfirmDialog';
import { useDebounce } from '../../hooks/useDebounce';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import conversationService from '../../services/conversationService';

export default function DashboardConversations() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);
  const { data, loading, error, reload } = useFetch(() => conversationService.list({ search: debounced || undefined }), [debounced]);
  const conversations = Array.isArray(data) ? data : data?.items || [];
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

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
      <PageSEO title="My Conversations" />
      <h1 className="text-h3 mb-6">Conversations</h1>
      <div className="relative mb-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations…" className="input-field pl-9" />
      </div>
      <AsyncState
        loading={loading}
        error={error}
        isEmpty={!loading && !error && conversations.length === 0}
        onRetry={reload}
        emptyProps={{ title: 'No conversations found' }}
      >
        <div className="space-y-3">
          {conversations.map((c) => (
            <Card key={c._id || c.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Link to={`/ask?c=${c._id || c.id}`} className="font-semibold text-charcoal-800 hover:text-emerald-700 line-clamp-1">
                  {c.title || c.messages?.[0]?.question || 'Conversation'}
                </Link>
                <p className="text-caption mt-1">{formatDate(c.createdAt)} · {c.messages?.length || 0} messages</p>
              </div>
              <button onClick={() => setDeleting(c)} aria-label="Delete conversation" className="rounded-lg p-2 text-red-500 hover:bg-red-50 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      </AsyncState>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete this conversation?" confirming={busy} />
    </div>
  );
}
