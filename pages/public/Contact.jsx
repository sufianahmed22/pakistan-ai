import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, MessageSquareText, MessagesSquare, ArrowRight, CheckCircle2, Clock, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageSEO from '../../components/layout/PageSEO';
import Input from '../../components/kokonut/Input';
import Textarea from '../../components/kokonut/Textarea';
import Button from '../../components/kokonut/Button';
import { Card } from '../../components/kokonut/Card';
import contactService from '../../services/contactService';
import { useAuth } from '../../hooks/useAuth';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(3, 'Enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function Contact() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      message: '',
    },
  });

  useEffect(() => {
    if (user) {
      if (user.name) setValue('name', user.name);
      if (user.email) setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (values) => {
    try {
      await contactService.send(values);
      setSubmittedData({
        ...values,
        submittedAt: new Date(),
      });
      toast.success('Inquiry received! We typically reply within 24–48 hours.');
      reset({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    }
  };

  return (
    <div>
      <PageSEO
        title="Contact & Support"
        description="Get in touch with the Pakistan AI team for questions, feedback, or knowledge contributions."
        canonical="/contact"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
      />

      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-charcoal-950 text-white pb-14 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.city, 1920, 1080)}
          alt="Modern Pakistan skyline and communications"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <p className="text-eyebrow !text-gold-300 mb-2">Connect</p>
          <h1 className="text-h1">Get in touch</h1>
          <p className="text-body-lg mt-3 text-white/80 max-w-2xl mx-auto">
            Have questions, feedback, or want to contribute knowledge? Send us a message and our team will get back to you.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-emerald-700 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal-900">Email</p>
                <p className="text-body text-sm">hello@pakistan-ai.app</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquareText className="h-5 w-5 text-emerald-700 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal-900">Support</p>
                <p className="text-body text-sm">Use the form or chat with Pakistan AI directly.</p>
              </div>
            </div>

            {isAuthenticated && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <MessagesSquare className="h-4 w-4" />
                  Your Dashboard Messages
                </div>
                <p className="text-xs text-emerald-700/90 mt-1">
                  View and follow up on previous inquiries and admin responses anytime.
                </p>
                <Link
                  to="/dashboard/messages"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline mt-2.5"
                >
                  Go to Messages & Support <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          <Card className="lg:col-span-2">
            {submittedData ? (
              <div className="py-6 px-4 text-center sm:px-8 space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
                  <CheckCircle2 className="h-9 w-9 text-emerald-700" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-semibold text-amber-800">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Expected Response: 24 to 48 Hours
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-charcoal-900">
                    Thank You! We’ve Received Your Message
                  </h2>
                  <p className="text-sm sm:text-base text-charcoal-600 max-w-lg mx-auto leading-relaxed">
                    Our support team has logged your inquiry and will review it promptly. You can expect a thoughtful response from our staff within <strong>24 to 48 hours</strong>.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="rounded-xl border border-charcoal-200 bg-charcoal-50/70 p-4 text-left max-w-lg mx-auto text-xs space-y-2">
                  <div className="flex justify-between border-b border-charcoal-100 pb-2">
                    <span className="text-charcoal-500">Subject:</span>
                    <span className="font-semibold text-charcoal-900">{submittedData.subject}</span>
                  </div>
                  <div className="flex justify-between border-b border-charcoal-100 pb-2">
                    <span className="text-charcoal-500">Contact Email:</span>
                    <span className="font-medium text-charcoal-800">{submittedData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Submitted:</span>
                    <span className="text-charcoal-700">
                      {submittedData.submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard/messages"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors w-full sm:w-auto"
                    >
                      <MessagesSquare className="h-4 w-4" />
                      Track in Dashboard Messages
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors w-full sm:w-auto"
                    >
                      Create Account to Track
                    </Link>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setSubmittedData(null)}
                    className="w-full sm:w-auto"
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {isAuthenticated && (
                  <div className="mb-4 pb-3 border-b border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
                    <span>
                      Signed in as <strong className="text-charcoal-800">{user?.name}</strong> ({user?.email})
                    </span>
                    <span className="text-emerald-700 font-medium">Trackable in Dashboard</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Name" error={errors.name?.message} {...register('name')} />
                    <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
                  </div>
                  <Input label="Subject" error={errors.subject?.message} {...register('subject')} />
                  <Textarea label="Message" rows={5} error={errors.message?.message} {...register('message')} />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-charcoal-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      Typical response SLA: <strong>24–48 hours</strong>
                    </p>
                    <Button type="submit" loading={isSubmitting} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                      Send Message
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
