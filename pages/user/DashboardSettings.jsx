import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { KeyRound, Shield, Bell, LogOut, CheckCircle2, AlertTriangle, Mail } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import { Card } from '../../components/kokonut/Card';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';

// Schema for setting a brand-new backup password (no current password needed)
const setPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Schema for changing an existing password
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function DashboardSettings() {
  const navigate = useNavigate();
  const { user, logout, refresh } = useAuth();
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const hasPassword = Boolean(user?.hasPassword);

  // Form for changing existing password
  const changeForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  // Form for setting new backup password
  const setForm = useForm({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onChangePasswordSubmit = async (values) => {
    setUpdatingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed successfully');
      changeForm.reset();
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const onSetPasswordSubmit = async (values) => {
    setUpdatingPassword(true);
    try {
      await authService.setPassword({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success('Backup password set successfully! You can now log in using your Google email and this password.');
      setForm.reset();
      await refresh();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to set password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div>
      <PageSEO title="Settings" />
      <h1 className="text-h3 mb-6 font-display">Account Settings</h1>
      <div className="space-y-6 max-w-xl">
        {/* Linked Login Email Overview for all accounts */}
        <Card className="p-5 border-charcoal-200/80 bg-charcoal-50/50">
          <div className="flex items-center gap-2 mb-1.5">
            <Mail className="h-4 w-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-charcoal-900">Your Login Account</h3>
          </div>
          <p className="text-xs text-charcoal-600">
            Registered Email:{' '}
            <strong className="font-mono text-charcoal-900 select-all">{user?.email}</strong>
          </p>
          <p className="text-[11px] text-charcoal-500 mt-1">
            This email is your login ID for Pakistan AI across all sign-in methods.
          </p>
        </Card>

        {/* Dynamic Password Card: Set Password vs Change Password */}
        {!hasPassword ? (
          /* Case 1: Google User Without Password (Set Backup Password) */
          <Card className="p-6 border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="h-5 w-5 text-amber-600" />
              <h2 className="text-h4 text-charcoal-900">Set Backup Password</h2>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 mb-4 text-xs text-amber-900 leading-relaxed">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                Why set a password?
              </p>
              <p>
                You currently log in via Google. Setting a backup password enables you to log in directly
                with your Google email (<strong className="font-mono">{user?.email}</strong>) and this password
                if Google sign-in is ever unreachable.
              </p>
            </div>

            <form onSubmit={setForm.handleSubmit(onSetPasswordSubmit)} className="space-y-3.5" noValidate>
              <Input
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                error={setForm.formState.errors.newPassword?.message}
                {...setForm.register('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                error={setForm.formState.errors.confirmPassword?.message}
                {...setForm.register('confirmPassword')}
              />
              <Button
                type="submit"
                loading={updatingPassword}
                className="bg-emerald-700 hover:bg-emerald-800 text-white mt-1 w-full sm:w-auto"
              >
                Set Backup Password
              </Button>
            </form>
          </Card>
        ) : (
          /* Case 2: User Already Has A Password (Change Password) */
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="h-5 w-5 text-emerald-700" />
              <h2 className="text-h4">Change Password</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 mb-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Password login is active for <strong className="font-mono">{user?.email}</strong>.</span>
            </div>
            <form onSubmit={changeForm.handleSubmit(onChangePasswordSubmit)} className="space-y-3.5" noValidate>
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                error={changeForm.formState.errors.currentPassword?.message}
                {...changeForm.register('currentPassword')}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                error={changeForm.formState.errors.newPassword?.message}
                {...changeForm.register('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                error={changeForm.formState.errors.confirmPassword?.message}
                {...changeForm.register('confirmPassword')}
              />
              <Button
                type="submit"
                loading={updatingPassword}
                className="bg-emerald-700 hover:bg-emerald-800 text-white mt-1 w-full sm:w-auto"
              >
                Update Password
              </Button>
            </form>
          </Card>
        )}

        {/* Notifications Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-emerald-700" />
            <h2 className="text-h4">Notifications</h2>
          </div>
          <p className="text-body text-sm mb-4">Email notifications for account activity and platform updates.</p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-charcoal-300 text-emerald-700 focus:ring-emerald-600"
            />
            <span className="text-sm font-medium text-charcoal-800">Send me updates and support notifications</span>
          </label>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 bg-red-50/20">
          <div className="flex items-center gap-2 mb-2">
            <LogOut className="h-5 w-5 text-red-600" />
            <h2 className="text-h4 text-red-700">Session</h2>
          </div>
          <p className="text-body text-sm mb-4">Sign out of your account on this device.</p>
          <Button
            variant="secondary"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={async () => {
              await logout();
              navigate('/login', { replace: true });
            }}
          >
            Log out
          </Button>
        </Card>
      </div>
    </div>
  );
}
