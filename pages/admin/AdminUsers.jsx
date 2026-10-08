import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, Trash2, KeyRound, RefreshCw, Key } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/admin/SearchBar';
import Badge from '../../components/kokonut/Badge';
import Dialog from '../../components/kokonut/Dialog';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import ConfirmDialog from '../../components/forms/ConfirmDialog';
import { useAdminList } from '../../hooks/useAdminList';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/format';
import adminService from '../../services/adminService';

const userListService = { list: adminService.users };

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const { items, page, setPage, totalPages, search, setSearch, loading, error, reload } = useAdminList(userListService);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  // Change password modal state
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (r) => (
        <Badge tone={r.role === 'superadmin' ? 'gold' : r.role === 'admin' ? 'emerald' : 'charcoal'}>
          {r.role || 'user'}
        </Badge>
      ),
    },
    { key: 'createdAt', label: 'Joined', render: (r) => formatDate(r.createdAt) },
  ];

  const toggleAdmin = async (row) => {
    try {
      const nextRole = row.role === 'admin' ? 'user' : 'admin';
      await adminService.updateUser(row._id || row.id, { role: nextRole });
      toast.success(`Role updated to ${nextRole}`);
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setSubmittingPassword(true);
    try {
      await adminService.setUserPassword(passwordUser._id || passwordUser.id, newPassword);
      toast.success(`Password updated for ${passwordUser.name}`);
      setPasswordUser(null);
      setNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await adminService.removeUser(deleting._id || deleting.id);
      toast.success('User removed');
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to remove user');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Manage registered platform users, staff privileges, and credentials."
      />
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users by name or email…" />
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
        emptyProps={{ title: 'No users found' }}
        rowActions={(row) => (
          <div className="flex justify-end items-center gap-1">
            {/* Change Password button (Available to Super Admin or Admin) */}
            <button
              className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100 transition-colors"
              onClick={() => {
                setPasswordUser(row);
                setNewPassword('');
              }}
              title="Change Password"
              aria-label="Change Password"
            >
              <KeyRound className="h-4 w-4 text-emerald-700" />
            </button>

            {/* Toggle Admin role */}
            <button
              className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100 transition-colors"
              onClick={() => toggleAdmin(row)}
              title="Toggle Admin Role"
              aria-label="Toggle admin role"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>

            {/* Delete User */}
            <button
              className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => setDeleting(row)}
              title="Remove User"
              aria-label="Remove user"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />

      {/* Password Change Dialog */}
      <Dialog
        open={Boolean(passwordUser)}
        onClose={() => setPasswordUser(null)}
        title="Change User Password"
        className="max-w-md"
      >
        {passwordUser && (
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="rounded-xl border border-charcoal-200 bg-charcoal-50/70 p-3.5 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Target User:</span>
                <span className="font-bold text-charcoal-900">{passwordUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Email:</span>
                <span className="font-medium text-charcoal-800">{passwordUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Current Role:</span>
                <span className="font-bold text-emerald-800 uppercase">{passwordUser.role || 'user'}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-charcoal-800">New Password</label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline font-medium"
                >
                  <RefreshCw className="h-3 w-3" /> Generate Random
                </button>
              </div>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters..."
                required
              />
              <p className="text-[11px] text-charcoal-500 mt-1">
                The user can log in immediately with this new password. Active reset tokens will be cleared.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-charcoal-100">
              <Button type="button" variant="secondary" onClick={() => setPasswordUser(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={submittingPassword} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                Set Password
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Remove this user?"
        confirming={busy}
      />
    </div>
  );
}
