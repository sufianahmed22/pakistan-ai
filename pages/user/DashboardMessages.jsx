import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ShieldCheck,
  User,
  Send,
  ChevronDown,
  ChevronUp,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  CornerDownRight,
} from 'lucide-react';
import { toast } from 'sonner';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import Badge from '../../components/kokonut/Badge';
import Button from '../../components/kokonut/Button';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';
import contactService from '../../services/contactService';

const STATUS_CONFIG = {
  Open: { label: 'Pending Review', tone: 'amber' },
  new: { label: 'Pending Review', tone: 'amber' },
  InProgress: { label: 'In Progress', tone: 'gold' },
  read: { label: 'In Progress', tone: 'gold' },
  Responded: { label: 'Admin Replied', tone: 'emerald' },
  responded: { label: 'Admin Replied', tone: 'emerald' },
  Closed: { label: 'Closed', tone: 'charcoal' },
};

export default function DashboardMessages() {
  const { data, loading, error, reload } = useFetch(() => contactService.listMyMessages({ limit: 50 }), []);
  const messages = Array.isArray(data) ? data : data?.items || [];

  const [expandedId, setExpandedId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [filter, setFilter] = useState('All');

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleReplyChange = (id, text) => {
    setReplyTexts((prev) => ({ ...prev, [id]: text }));
  };

  const handleSendFollowUp = async (id) => {
    const text = replyTexts[id]?.trim();
    if (!text) return;

    setSubmittingId(id);
    try {
      await contactService.replyToMyMessage(id, { message: text });
      toast.success('Your reply has been sent to our support team.');
      setReplyTexts((prev) => ({ ...prev, [id]: '' }));
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'All') return true;
    if (filter === 'Responded') return m.status === 'Responded' || m.status === 'responded';
    if (filter === 'Pending') return m.status === 'Open' || m.status === 'new' || m.status === 'InProgress';
    if (filter === 'Closed') return m.status === 'Closed';
    return true;
  });

  return (
    <div>
      <PageSEO title="Messages & Support" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-h3 font-display">Messages & Support</h1>
          <p className="text-body text-sm mt-1">
            Track your contact inquiries, support questions, and responses from the Pakistan AI team.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Message
        </Link>
      </div>

      {/* Filter Tabs */}
      {messages.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          {['All', 'Responded', 'Pending', 'Closed'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                filter === tab
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Messages List */}
      <AsyncState
        loading={loading}
        error={error}
        isEmpty={!loading && !error && filteredMessages.length === 0}
        onRetry={reload}
        emptyProps={{
          title: filter === 'All' ? 'No messages yet' : `No ${filter.toLowerCase()} messages`,
          description:
            filter === 'All'
              ? 'Have questions about tourism, history, culture, or the platform? Send us a message.'
              : 'Try selecting a different filter above.',
          action: (
            <Link to="/contact" className="btn-primary mt-3 inline-flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Send a Message
            </Link>
          ),
        }}
      >
        <div className="space-y-4">
          {filteredMessages.map((item) => {
            const isExpanded = expandedId === item._id;
            const statusCfg = STATUS_CONFIG[item.status] || { label: item.status, tone: 'charcoal' };
            const adminReplies = item.replies?.filter((r) => r.role === 'admin') || [];
            const hasAdminReplied = adminReplies.length > 0;

            return (
              <Card
                key={item._id}
                className={cn(
                  'overflow-hidden transition-all border duration-200',
                  isExpanded ? 'border-emerald-300 shadow-md' : 'hover:border-charcoal-300'
                )}
              >
                {/* Collapsible Card Header */}
                <div
                  onClick={() => toggleExpand(item._id)}
                  className="cursor-pointer p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={cn(
                        'mt-0.5 rounded-full p-2 shrink-0',
                        hasAdminReplied
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {hasAdminReplied ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-charcoal-900 text-base truncate">
                          {item.subject || 'General Inquiry'}
                        </h3>
                        <Badge tone={statusCfg.tone}>{statusCfg.label}</Badge>
                      </div>
                      <p className="text-xs text-charcoal-500">
                        Submitted on {formatDate(item.createdAt)} •{' '}
                        {item.replies?.length > 0 ? (
                          <span className="font-medium text-emerald-700">
                            {item.replies.length} response{item.replies.length === 1 ? '' : 's'}
                          </span>
                        ) : (
                          <span>Awaiting response</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-semibold text-emerald-700">
                      {isExpanded ? 'Hide conversation' : 'View conversation'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-emerald-700" />
                    )}
                  </div>
                </div>

                {/* Expanded Conversation Thread */}
                {isExpanded && (
                  <div className="border-t border-charcoal-100 bg-charcoal-50/40 p-5 space-y-4">
                    {/* 1. What Client Said */}
                    <div className="rounded-xl border border-charcoal-200 bg-white p-4 shadow-2xs">
                      <div className="flex items-center justify-between text-xs text-charcoal-500 mb-2">
                        <span className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-charcoal-600" />
                          You wrote:
                        </span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <p className="text-sm text-charcoal-800 whitespace-pre-wrap leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    {/* 2. Replies Thread (What Admin Replied & Follow-ups) */}
                    {item.replies && item.replies.length > 0 ? (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                          <CornerDownRight className="h-3.5 w-3.5 text-emerald-700" />
                          Conversation History
                        </div>

                        {item.replies.map((reply, idx) => {
                          const isAdmin = reply.role === 'admin';
                          return (
                            <div
                              key={idx}
                              className={cn(
                                'rounded-xl p-4 text-sm transition-all shadow-2xs',
                                isAdmin
                                  ? 'border border-emerald-300 bg-emerald-50/80 ml-2 sm:ml-6'
                                  : 'border border-charcoal-200 bg-white ml-0 mr-2 sm:mr-6'
                              )}
                            >
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className="font-semibold flex items-center gap-1.5">
                                  {isAdmin ? (
                                    <>
                                      <ShieldCheck className="h-4 w-4 text-emerald-700" />
                                      <span className="text-emerald-900 font-bold">
                                        Pakistan AI Support Team ({reply.author})
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <User className="h-4 w-4 text-charcoal-600" />
                                      <span className="text-charcoal-800 font-semibold">You wrote:</span>
                                    </>
                                  )}
                                </span>
                                <span className="text-charcoal-400">{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="text-charcoal-900 whitespace-pre-wrap leading-relaxed text-sm">
                                {reply.message}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-4 flex items-start gap-3">
                        <Clock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">Message Received</p>
                          <p className="text-xs text-amber-800/90 mt-0.5">
                            Our team has received your message and is reviewing it. When an administrator responds,
                            their answer will appear right here!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 3. Follow-up Reply Box */}
                    {item.status !== 'Closed' && (
                      <div className="pt-3 border-t border-charcoal-200/80">
                        <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                          Send a follow-up message:
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <textarea
                            value={replyTexts[item._id] || ''}
                            onChange={(e) => handleReplyChange(item._id, e.target.value)}
                            rows={2}
                            placeholder="Add more details or reply back to support…"
                            className="flex-1 rounded-xl border border-charcoal-200 p-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                          />
                          <Button
                            type="button"
                            loading={submittingId === item._id}
                            disabled={!replyTexts[item._id]?.trim()}
                            onClick={() => handleSendFollowUp(item._id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0 sm:self-end flex items-center justify-center gap-1.5"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Send
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </AsyncState>
    </div>
  );
}
