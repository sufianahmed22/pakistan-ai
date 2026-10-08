import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageSEO from '../../components/layout/PageSEO';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import { Card } from '../../components/kokonut/Card';
import authService from '../../services/authService';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="section flex min-h-[80vh] items-center justify-center bg-charcoal-50/40">
      <PageSEO title="Forgot Password" description="Reset your Pakistan AI account password." />
      <Card className="w-full max-w-md">
        <h1 className="text-h3 mb-1">Reset your password</h1>
        <p className="text-body mb-6">Enter your email and we'll send you a reset link.</p>
        {sent ? (
          <p className="rounded-xl bg-emerald-50 p-4 text-emerald-800">If an account exists for that email, a reset link is on its way.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
            <Button type="submit" className="w-full" loading={isSubmitting}>
              <Mail className="h-4 w-4" /> Send reset link
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-charcoal-500">
          <Link to="/login" className="font-semibold text-emerald-700 hover:underline">Back to login</Link>
        </p>
      </Card>
    </div>
  );
}
