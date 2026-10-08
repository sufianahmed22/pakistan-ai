import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import { Card } from '../../components/kokonut/Card';
import { useAuth } from '../../hooks/useAuth';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address (e.g. name@example.com)')
      .max(200),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(200, 'Password cannot exceed 200 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Register() {
  const { register: registerUser } = useAuth();
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
      await registerUser(values);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Map server-side validation error details to specific form fields
      if (err.data?.details && Array.isArray(err.data.details)) {
        err.data.details.forEach((issue) => {
          if (issue.path) {
            setError(issue.path, { type: 'server', message: issue.message });
          }
        });
      }

      // Handle duplicate email account error
      if (err.status === 409 || err.message?.toLowerCase().includes('email')) {
        setError('email', {
          type: 'server',
          message: 'An account with this email address already exists. Please log in instead.',
        });
      }

      // Handle password rejected by backend
      if (err.message?.toLowerCase().includes('password')) {
        setError('password', {
          type: 'server',
          message: err.message,
        });
      }

      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="section flex min-h-[80vh] items-center justify-center bg-charcoal-50/40">
      <PageSEO title="Create an Account" description="Create a free Pakistan AI account to save conversations and favorite places." />
      <Card className="w-full max-w-md">
        <h1 className="text-h3 mb-1">Create your account</h1>
        <p className="text-body mb-6">Join Pakistan AI to save conversations and places.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            helperText="Must be at least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" className="w-full" loading={isSubmitting}>
            <UserPlus className="h-4 w-4" /> Create account
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

        <GoogleAuthButton text="signup_with" />

        <p className="mt-6 text-center text-sm text-charcoal-500">
          Already have an account? <Link to="/login" className="font-semibold text-emerald-700 hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
