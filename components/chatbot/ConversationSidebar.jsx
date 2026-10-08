import { useState } from 'react';
import { toast } from 'sonner';
import { Search, Trash2, Plus, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/format';
import conversationService from '../../services/conversationService';

export default function ConversationSidebar({ activeId, onSelect, onNew, className = '' }) {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);
  const { data, loading, reload } = useFetch(
    () => (isAuthenticated ? conversationService.list({ search: debounced || undefined }) : Promise.resolve([])),
    [debounced, isAuthenticated]
  );
  const conversations = Array.isArray(data) ? data : data?.items || [];

  const remove = async (e, conv) => {
    e.stopPropagation();
    try {
      await conversationService.remove(conv._id || conv.id);
      toast.success('Conversation deleted');
      reload();
      if ((conv._id || conv.id) === activeId) onNew();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className="p-4">
        <button onClick={onNew} className="btn-primary w-full justify-center text-sm">
          <Plus className="h-4 w-4" /> New conversation
        </button>
      </div>
      {isAuthenticated && (
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="input-field pl-9 py-2 text-sm"
              aria-label="Search conversations"
            />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-4">
        {!isAuthenticated && (
          <p className="px-3 text-sm text-charcoal-400">Log in to save and revisit your conversations.</p>
        )}
        {isAuthenticated && loading && <p className="px-3 text-sm text-charcoal-400">Loading…</p>}
        {isAuthenticated && !loading && conversations.length === 0 && (
          <p className="px-3 text-sm text-charcoal-400">No conversations yet.</p>
        )}
        <ul className="space-y-1">
          {conversations.map((c) => {
            const id = c._id || c.id;
            return (
              <li key={id}>
                <button
                  onClick={() => onSelect(c)}
                  className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    activeId === id ? 'bg-emerald-50 text-emerald-800' : 'text-charcoal-600 hover:bg-charcoal-50'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate">{c.title || c.messages?.[0]?.question || 'Conversation'}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => remove(e, c)}
                    aria-label="Delete conversation"
                    className="shrink-0 rounded-lg p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </button>
                <p className="pl-9 text-[11px] text-charcoal-300">{formatDate(c.createdAt)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
