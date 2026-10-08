import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { KeyRound } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import { Card } from '../../components/kokonut/Card';
import authService from '../../services/authService';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (values) => {
    try {
      await authService.resetPassword({ token, password: values.password });
      toast.success('Password reset — please log in');
      navigate('/login');
    } catch (err) {
      if (err.data?.details && Array.isArray(err.data.details)) {
        err.data.details.forEach((issue) => {
          if (issue.path) {
            setError(issue.path, { type: 'server', message: issue.message });
          }
        });
      }
      toast.error(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="section flex min-h-[80vh] items-center justify-center bg-charcoal-50/40">
      <PageSEO title="Reset Password" description="Choose a new password for your Pakistan AI account." />
      <Card className="w-full max-w-md">
        <h1 className="text-h3 mb-1">Set a new password</h1>
        {!token && <p className="mb-6 rounded-xl bg-amber-50 p-4 text-amber-800">This reset link is missing a token — request a new one.</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            helperText="Must be at least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" className="w-full" loading={isSubmitting} disabled={!token}>
            <KeyRound className="h-4 w-4" /> Reset password
          </Button>
        </form>
      </Card>
    </div>
  );
}
