import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import { Send, Users } from 'lucide-react';
import { useAdminList } from '../../hooks/useAdminList';
import { formatDate } from '../../utils/format';
import adminService from '../../services/adminService';
import { TELEGRAM_LINK } from '../../config';

const telegramListService = { list: adminService.telegramUsers };

export default function AdminTelegram() {
  const { items, page, setPage, totalPages, loading, error, reload } = useAdminList(telegramListService);

  const columns = [
    { key: 'username', label: 'Telegram Username', render: (r) => r.username ? `@${r.username}` : r.telegramId },
    { key: 'messageCount', label: 'Messages', render: (r) => r.messageCount ?? 0 },
    { key: 'lastActiveAt', label: 'Last Active', render: (r) => (r.lastActiveAt ? formatDate(r.lastActiveAt) : '—') },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Telegram"
        description={<>Bot: <a className="text-emerald-700 underline" href={TELEGRAM_LINK} target="_blank" rel="noreferrer">{TELEGRAM_LINK}</a></>}
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Telegram Users" value={items?.length} icon={Users} />
        <StatCard label="Bot Status" value={null} icon={Send} suffix={<span className="text-base font-semibold text-emerald-700">Active</span>} />
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
        emptyProps={{ title: 'No Telegram users yet' }}
      />
    </div>
  );
}
