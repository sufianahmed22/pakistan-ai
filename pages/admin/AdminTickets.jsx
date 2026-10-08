import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { MessageSquare, ShieldCheck, User, Send, Mail, Ticket } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/admin/SearchBar';
import Badge from '../../components/kokonut/Badge';
import Dialog from '../../components/kokonut/Dialog';
import Button from '../../components/kokonut/Button';
import { useAdminList } from '../../hooks/useAdminList';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';
import ticketService from '../../services/ticketService';
import contactService from '../../services/contactService';

const TICKET_STATUS_TONE = {
  Open: 'amber',
  InProgress: 'gold',
  WaitingForUser: 'gold',
  Resolved: 'emerald',
  Responded: 'emerald',
  Closed: 'charcoal',
  new: 'amber',
  read: 'gold',
  responded: 'emerald',
};

export default function AdminTickets() {
  const [params, setParams] = useSearchParams();
  const isContact = params.get('type') === 'contact';
  const service = isContact ? contactService : ticketService;
  const { items, page, setPage, totalPages, total, search, setSearch, loading, error, reload } = useAdminList(
    service,
    { type: isContact ? 'contact' : 'tickets' }
  );
  const [busy, setBusy] = useState(null);

  // Thread dialog state
  const [activeItem, setActiveItem] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState(isContact ? 'Responded' : 'Resolved');
  const [submittingReply, setSubmittingReply] = useState(false);

  const columns = isContact
    ? [
        { key: 'name', label: 'From', render: (r) => (r.email ? `${r.name} <${r.email}>` : r.name) },
        { key: 'subject', label: 'Subject', render: (r) => r.subject || r.message?.slice(0, 60) || '—' },
        {
          key: 'status',
          label: 'Status',
          render: (r) => {
            const raw = r.status || 'Open';
            const display = raw === 'new' ? 'Open' : raw === 'responded' ? 'Responded' : raw;
            return <Badge tone={TICKET_STATUS_TONE[raw] || 'charcoal'}>{display}</Badge>;
          },
        },
        {
          key: 'replies',
          label: 'Replies',
          render: (r) => (
            <span className="text-xs text-charcoal-500 font-medium">
              {r.replies?.length || 0} {r.replies?.length === 1 ? 'reply' : 'replies'}
            </span>
          ),
        },
        { key: 'createdAt', label: 'Received', render: (r) => formatDate(r.createdAt) },
      ]
    : [
        { key: 'subject', label: 'Subject', render: (r) => r.subject || r.description?.slice(0, 60) || '—' },
        { key: 'email', label: 'From', render: (r) => r.contactEmail || r.email || (r.userId ? 'Registered User' : '—') },
        {
          key: 'status',
          label: 'Status',
          render: (r) => <Badge tone={TICKET_STATUS_TONE[r.status] || 'charcoal'}>{r.status || 'Open'}</Badge>,
        },
        {
          key: 'replies',
          label: 'Replies',
          render: (r) => (
            <span className="text-xs text-charcoal-500 font-medium">
              {r.replies?.length || 0} {r.replies?.length === 1 ? 'reply' : 'replies'}
            </span>
          ),
        },
        { key: 'createdAt', label: 'Received', render: (r) => formatDate(r.createdAt) },
      ];

  const setStatus = async (row, status) => {
    const id = row._id || row.id || row.ticketId;
    setBusy(id);
    try {
      await service.update(id, { status });
      toast.success(`Marked as ${status}`);
      reload();
      if (activeItem && (activeItem._id === id || activeItem.ticketId === id)) {
        setActiveItem((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setBusy(null);
    }
  };

  const openThread = (item) => {
    setActiveItem(item);
    setReplyText('');
    setReplyStatus(isContact ? 'Responded' : 'Resolved');
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeItem) return;

    setSubmittingReply(true);
    const id = activeItem._id || activeItem.id || activeItem.ticketId;
    try {
      const res = await service.reply(id, { message: replyText.trim() });
      if (replyStatus && replyStatus !== activeItem.status) {
        await service.update(id, { status: replyStatus });
      }

      toast.success('Reply submitted and sent to user.');
      setReplyText('');

      const updatedItem = res?.message || res?.ticket || {
        ...activeItem,
        status: replyStatus || (isContact ? 'Responded' : 'InProgress'),
        replies: [
          ...(activeItem.replies || []),
          {
            author: 'Admin',
            role: 'admin',
            message: replyText.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      };
      setActiveItem(updatedItem);
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={isContact ? 'Contact Messages' : 'Support Tickets'}
        description={
          isContact
            ? 'Inquiries and messages submitted through the public contact form.'
            : 'Support requests raised through the AI chat assistant.'
        }
      />

      {/* Switcher Tabs */}
      <div className="mb-6 flex gap-2 border-b border-charcoal-200">
        <button
          type="button"
          onClick={() => {
            setParams({ type: 'contact' });
            setSearch('');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px',
            isContact
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/70 rounded-t-lg'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          )}
        >
          <Mail className="h-4 w-4" />
          Contact Messages
          {isContact && typeof total === 'number' && total > 0 && (
            <span className="ml-1 rounded-full bg-emerald-700/10 px-2 py-0.5 text-xs text-emerald-800 font-bold">
              {total}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setParams({});
            setSearch('');
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px',
            !isContact
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/70 rounded-t-lg'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          )}
        >
          <Ticket className="h-4 w-4" />
          Support Tickets
          {!isContact && typeof total === 'number' && total > 0 && (
            <span className="ml-1 rounded-full bg-emerald-700/10 px-2 py-0.5 text-xs text-emerald-800 font-bold">
              {total}
            </span>
          )}
        </button>
      </div>

      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={isContact ? 'Search messages by name, email, subject…' : 'Search tickets…'}
        />
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
        emptyProps={{ title: isContact ? 'No contact messages yet' : 'No tickets yet' }}
        rowActions={(row) => {
          const rowId = row._id || row.id || row.ticketId;
          const normalizedStatus =
            row.status === 'new'
              ? 'Open'
              : row.status === 'read'
              ? 'InProgress'
              : row.status === 'responded'
              ? 'Responded'
              : row.status || 'Open';

          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openThread(row)}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <MessageSquare className="h-3 w-3" />
                View & Reply
              </button>
              <select
                value={normalizedStatus}
                disabled={busy === rowId}
                onChange={(e) => setStatus(row, e.target.value)}
                className="rounded-lg border border-charcoal-200 px-2 py-1 text-xs bg-white text-charcoal-800"
                aria-label="Status"
              >
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Responded">Responded</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          );
        }}
      />

      {/* View & Reply Dialog */}
      <Dialog
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        title={isContact ? 'Contact Message Thread' : 'Support Ticket Thread'}
        className="max-w-2xl"
      >
        {activeItem && (
          <div className="space-y-5">
            {/* Thread Header */}
            <div className="pb-4 border-b border-charcoal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">{activeItem.subject || 'General Inquiry'}</h3>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  From: <strong className="text-charcoal-800">{activeItem.name || activeItem.contactName || 'User'}</strong>{' '}
                  &lt;{activeItem.email || activeItem.contactEmail || 'No email'}&gt; • {formatDate(activeItem.createdAt)}
                </p>
              </div>
              <Badge tone={TICKET_STATUS_TONE[activeItem.status] || 'charcoal'}>
                {activeItem.status === 'new' ? 'Open' : activeItem.status === 'responded' ? 'Responded' : activeItem.status}
              </Badge>
            </div>

            {/* Original Inquiry */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">Client Inquiry</p>
              <div className="rounded-xl border border-charcoal-200 bg-charcoal-50/70 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-charcoal-700 mb-1.5">
                  <User className="h-3.5 w-3.5 text-charcoal-500" />
                  {activeItem.name || activeItem.contactName || 'Client'} wrote:
                </div>
                <p className="text-sm text-charcoal-800 whitespace-pre-wrap leading-relaxed">
                  {activeItem.message || activeItem.description}
                </p>
              </div>
            </div>

            {/* Conversation Replies Thread */}
            {activeItem.replies && activeItem.replies.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                  Replies ({activeItem.replies.length})
                </p>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {activeItem.replies.map((r, idx) => {
                    const isAdmin = r.role === 'admin' || (!isContact && r.author !== (activeItem.contactName || 'User'));
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'rounded-xl p-3.5 text-sm transition-all',
                          isAdmin
                            ? 'border border-emerald-200 bg-emerald-50/70 ml-3'
                            : 'border border-charcoal-200 bg-white mr-3'
                        )}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold flex items-center gap-1.5">
                            {isAdmin ? (
                              <>
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                                <span className="text-emerald-800">Support Team ({r.author})</span>
                              </>
                            ) : (
                              <>
                                <User className="h-3.5 w-3.5 text-charcoal-600" />
                                <span className="text-charcoal-800">{r.author || 'User'}</span>
                              </>
                            )}
                          </span>
                          <span className="text-charcoal-400">{formatDate(r.createdAt || new Date())}</span>
                        </div>
                        <p className="text-charcoal-800 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                          {r.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-charcoal-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-charcoal-800">
                  Write Reply (Visible in User Dashboard)
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-charcoal-500">Update status to:</span>
                  <select
                    value={replyStatus}
                    onChange={(e) => setReplyStatus(e.target.value)}
                    className="border border-charcoal-200 rounded-md px-2 py-0.5 text-xs bg-white text-charcoal-800"
                  >
                    <option value="Responded">Responded</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Type your response to the user here..."
                className="w-full text-sm rounded-xl border border-charcoal-200 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                required
              />

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveItem(null)}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  loading={submittingReply}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Reply
                </Button>
              </div>
            </form>
          </div>
        )}
      </Dialog>
    </div>
  );
}
