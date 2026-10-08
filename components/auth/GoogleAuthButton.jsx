import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function GoogleAuthButton({ text = 'signin_with' }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isConfigured = Boolean(
    clientId &&
    clientId.trim() !== '' &&
    !clientId.includes('your-google-client-id')
  );

  const handleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error('No credential returned from Google');
      }
      const res = await loginWithGoogle(credentialResponse.credential);
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
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  const handleError = () => {
    toast.error('Google sign-in could not be completed. Please try again.');
  };

  if (!isConfigured) {
    return (
      <button
        type="button"
        onClick={() => toast.info('Google Client ID is not configured yet. Add VITE_GOOGLE_CLIENT_ID to Frontend/.env')}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-charcoal-200 bg-white text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 hover:border-charcoal-300 transition-all shadow-sm"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    );
  }

  return (
    <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text}
        theme="outline"
        shape="pill"
        width="100%"
      />
    </div>
  );
}
