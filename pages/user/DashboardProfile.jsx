import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, KeyRound, AlertCircle, ArrowRight, User as UserIcon } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import { Card } from '../../components/kokonut/Card';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';

const schema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
});

export default function DashboardProfile() {
  const { user, refresh } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name || '', email: user.email || '' });
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      await authService.updateProfile({ name: values.name.trim() });
      toast.success('Profile changes saved successfully');
      await refresh();
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const isGoogleUser = Boolean(user?.googleId || user?.authProvider === 'google');
  const hasPassword = Boolean(user?.hasPassword);

  return (
    <div className="space-y-6 max-w-xl">
      <PageSEO title="Profile" />
      <div>
        <h1 className="text-h3 font-display">Profile & Account</h1>
        <p className="text-body text-sm mt-1">Manage your identity and authentication credentials.</p>
      </div>

      {/* Primary Login Identity Card */}
      <Card className="p-6 border-emerald-100 bg-emerald-50/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-h4 text-charcoal-900">Primary Login Email</h2>
              <p className="text-xs text-charcoal-500">Your permanent identity for Pakistan AI</p>
            </div>
          </div>
          {isGoogleUser ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Google Account
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Direct Account
            </span>
          )}
        </div>

        {/* Highlighted Email Box */}
        <div className="rounded-xl border border-charcoal-200/60 bg-white p-3.5 shadow-sm">
          <p className="text-caption text-charcoal-400 font-mono text-[11px] uppercase tracking-wider mb-1">
            Registered Login Address
          </p>
          <p className="text-base font-bold text-charcoal-900 font-mono select-all">
            {user?.email || '—'}
          </p>
        </div>

        {/* Security / Password Status Callout */}
        <div className="mt-4 border-t border-emerald-100/80 pt-3.5">
          {hasPassword ? (
            <div className="flex items-center justify-between text-xs text-charcoal-600">
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Password is set. You can sign in using this email + password anytime.
              </span>
              <Link to="/dashboard/settings" className="font-semibold text-emerald-700 hover:underline">
                Manage
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  No backup password set yet. If Google login is ever unavailable, set a password now to sign in directly.
                </span>
              </div>
              <Link
                to="/dashboard/settings"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors"
              >
                Set Password <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Edit Profile Details */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon className="h-5 w-5 text-emerald-700" />
          <h2 className="text-h4">Personal Information</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Full name" error={errors.name?.message} {...register('name')} />
          <Input
            label="Email address"
            type="email"
            disabled
            helperText="Email is bound to your account and cannot be modified."
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" loading={isSubmitting} className="bg-emerald-700 hover:bg-emerald-800 text-white">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
