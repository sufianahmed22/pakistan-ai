import { Link } from 'react-router-dom';
import { MessagesSquare, Bookmark, Clock, MessageSquareText, ShieldAlert, ArrowRight } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import StatCard from '../../components/admin/StatCard';
import AsyncState from '../../components/ui/AsyncState';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/format';
import conversationService from '../../services/conversationService';
import savedService from '../../services/savedService';
import contactService from '../../services/contactService';
import RecentlyViewedList from '../../components/widgets/RecentlyViewedList';
import ExplorerBadges from '../../components/widgets/ExplorerBadges';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(() => conversationService.list({ page: 1, limit: 5 }), []);
  const { data: savedData } = useFetch(() => savedService.list({ limit: 1 }), []);
  const { data: messagesData } = useFetch(() => contactService.listMyMessages({ limit: 1 }), []);

  const conversations = Array.isArray(data) ? data : data?.items || [];
  const savedCount = savedData?.counts?.total ?? (Array.isArray(savedData?.items) ? savedData.items.length : 0);
  const messagesCount = messagesData?.total ?? (Array.isArray(messagesData?.items) ? messagesData.items.length : (Array.isArray(messagesData) ? messagesData.length : 0));

  return (
    <div>
      <PageSEO title="Dashboard" />
      <h1 className="text-h3 mb-1">Welcome, {user?.name?.split(' ')[0] || 'explorer'}</h1>
      <p className="text-body mb-6">Here's a snapshot of your activity on Pakistan AI.</p>

      {/* Backup Password Callout for users without a password */}
      {user && !user.hasPassword && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-charcoal-900">Set a backup password for your Google account</p>
              <p className="text-xs text-charcoal-600 mt-0.5">
                You log in using <strong className="font-mono text-charcoal-800">{user.email}</strong> via Google. Create a password so you can always log in directly without Google if needed.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/settings"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-sm"
          >
            <span>Set Password</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Conversations" value={conversations.length} icon={MessagesSquare} />
        <StatCard label="Saved Places" value={savedCount} icon={Bookmark} />
        <StatCard label="Support Inquiries" value={messagesCount} icon={MessageSquareText} />
        <StatCard label="Member Since" value={null} icon={Clock} suffix={<span className="text-base font-semibold">{user?.createdAt ? formatDate(user.createdAt) : '—'}</span>} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h4">Recent Conversations</h2>
          <Link to="/dashboard/conversations" className="text-sm font-semibold text-emerald-700 hover:underline">View all</Link>
        </div>
        <AsyncState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && conversations.length === 0}
          onRetry={reload}
          emptyProps={{ title: 'No conversations yet', description: 'Ask Pakistan AI something to get started.', action: <Link to="/ask" className="btn-primary mt-2">Ask Pakistan AI</Link> }}
        >
          <ul className="divide-y divide-charcoal-100">
            {conversations.map((c) => (
              <li key={c._id || c.id} className="py-3 flex items-center justify-between">
                <span className="text-charcoal-700 line-clamp-1">{c.title || c.messages?.[0]?.question || 'Conversation'}</span>
                <span className="text-caption shrink-0">{formatDate(c.createdAt)}</span>
              </li>
            ))}
          </ul>
        </AsyncState>
      </Card>

      <RecentlyViewedList />
      <ExplorerBadges />
    </div>
  );
}
