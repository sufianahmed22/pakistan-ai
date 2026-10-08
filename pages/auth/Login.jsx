import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import { Card } from '../../components/kokonut/Card';
import { useAuth } from '../../hooks/useAuth';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
      const res = await login(values);
      const role = res?.user?.role || res?.role;
      const isAdmin = ['admin', 'superadmin'].includes(role);
      const fallback = isAdmin ? '/admin' : '/dashboard';
      const from = location.state?.from;
      let redirectTo = from ? `${from.pathname}${from.search || ''}` : fallback;
      if (redirectTo.includes('/dashboard/settings')) {
        redirectTo = '/dashboard';
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.data?.details && Array.isArray(err.data.details)) {
        err.data.details.forEach((issue) => {
          if (issue.path) {
            setError(issue.path, { type: 'server', message: issue.message });
          }
        });
      }

      if (err.status === 401 || err.message?.toLowerCase().includes('credentials')) {
        setError('password', {
          type: 'server',
          message: 'Invalid email or password',
        });
      }

      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="section flex min-h-[80vh] items-center justify-center bg-charcoal-50/40">
      <PageSEO title="Login" description="Log in to Pakistan AI to save conversations and personalize your experience." />
      <Card className="w-full max-w-md">
        <h1 className="text-h3 mb-1">Welcome back</h1>
        <p className="text-body mb-6">Log in to continue exploring Pakistan.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-emerald-700 hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            <LogIn className="h-4 w-4" /> Log in
          </Button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-charcoal-200" />
          </div>
          <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
            Or continue with
          </span>
        </div>

        <GoogleAuthButton text="signin_with" />

        <p className="mt-6 text-center text-sm text-charcoal-500">
          Don't have an account? <Link to="/register" className="font-semibold text-emerald-700 hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  );
}
