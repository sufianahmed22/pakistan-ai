import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Menu, X, Bell, BellRing } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_NAV_GROUPS } from '../constants/nav';
import { APP_NAME } from '../config';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/cn';
import pushService from '../services/pushNotificationService';
import adminService from '../services/adminService';

function isNavItemActive(to, location) {
  const [targetPath, targetQuery = ''] = to.split('?');
  const targetParams = new URLSearchParams(targetQuery);
  const currentParams = new URLSearchParams(location.search);

  // Exact path match required for root /admin dashboard
  if (targetPath === '/admin') {
    return location.pathname === '/admin' && !location.search;
  }

  // Path must match either exactly or as a child sub-route (e.g. /admin/knowledge/:id)
  const matchesPath =
    location.pathname === targetPath || location.pathname.startsWith(`${targetPath}/`);
  if (!matchesPath) {
    return false;
  }

  // Handle routes with distinct query-based sections
  if (targetPath === '/admin/tickets') {
    const isTargetContact = targetParams.get('type') === 'contact';
    const isCurrentContact = currentParams.get('type') === 'contact';
    return isTargetContact === isCurrentContact;
  }

  if (targetPath === '/admin/settings') {
    const targetTab = targetParams.get('tab') || 'general';
    const currentTab = currentParams.get('tab') || 'general';
    return targetTab === currentTab;
  }

  if (targetPath === '/admin/statistics') {
    const targetTab = targetParams.get('tab') || 'population';
    const currentTab = currentParams.get('tab') || 'population';
    return targetTab === currentTab;
  }

  // If target specified query params, all must match
  if (targetQuery) {
    for (const [k, v] of targetParams.entries()) {
      if (currentParams.get(k) !== v) return false;
    }
    return true;
  }

  return true;
}

const NAV_COUNT_KEYS = {
  '/admin/cities': 'cities',
  '/admin/regions': 'regions',
  '/admin/destinations': 'destinations',
  '/admin/mountains': 'mountains',
  '/admin/rivers': 'rivers',
  '/admin/history': 'history',
  '/admin/articles': 'articles',
  '/admin/facts': 'facts',
  '/admin/faqs': 'faqs',
  '/admin/conversations': 'conversations',
  '/admin/knowledge': 'knowledge',
  '/admin/knowledge-refresh': 'knowledgeRefresh',
  '/admin/users': 'users',
  '/admin/telegram': 'telegram',
  '/admin/tickets': 'tickets',
  '/admin/tickets?type=contact': 'contact',
  '/admin/review-reports': 'reviewReports',
};

function SidebarContent({ onNavigate, counts = {} }) {
  const location = useLocation();

  return (
    <nav className="space-y-6">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-white/30">{group.label}</p>
          <div className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const Icon = Icons[item.icon] || Icons.Circle;
              const isActive = isNavItemActive(item.to, location);
              const countKey = NAV_COUNT_KEYS[item.to];
              const count = counts?.[countKey];

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-emerald-700 text-white font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate flex-1">{item.label}</span>
                  {typeof count === 'number' && (
                    <span
                      className={cn(
                        'ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
                        isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [isPushActive, setIsPushActive] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [counts, setCounts] = useState({});
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    adminService
      .counts()
      .then((data) => {
        if (mounted && data) setCounts(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    pushService.getExistingSubscription().then((sub) => {
      if (sub) setIsPushActive(true);
    }).catch(() => {});
  }, []);

  const handleTogglePush = async () => {
    setPushLoading(true);
    try {
      if (isPushActive) {
        // Send a test alert when already active
        await pushService.sendTestPush();
        toast.success('Test alert dispatched! Check your desktop notification.');
      } else {
        await pushService.subscribeToPush();
        setIsPushActive(true);
        toast.success('Web Push notifications enabled! You will receive instant alerts for new tickets and contact inquiries.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update push notifications');
    } finally {
      setPushLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-charcoal-50">
      <aside className="hidden w-72 shrink-0 overflow-y-auto bg-charcoal-950 p-5 lg:block">
        <Link to="/admin" className="font-display text-xl font-bold text-white">{APP_NAME} <span className="text-gold-400">Admin</span></Link>
        <div className="mt-8">
          <SidebarContent counts={counts} />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 overflow-y-auto bg-charcoal-950 p-5">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-white">{APP_NAME} Admin</span>
              <button onClick={() => setOpen(false)} aria-label="Close sidebar" className="text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6">
              <SidebarContent onNavigate={() => setOpen(false)} counts={counts} />
            </div>
          </div>
          <div className="flex-1 bg-charcoal-950/50" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-charcoal-100 bg-white px-6 py-4">
          <button className="lg:hidden text-charcoal-700" onClick={() => setOpen(true)} aria-label="Open sidebar">
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4">
            {/* VAPID Push Alert Status & Toggle */}
            <button
              type="button"
              onClick={handleTogglePush}
              disabled={pushLoading}
              title={isPushActive ? 'Web Push Active - Click to send a test alert' : 'Enable Web Push for inquiries and tickets'}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all',
                isPushActive
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 shadow-sm'
                  : 'border-charcoal-200 bg-white text-charcoal-700 hover:bg-charcoal-50'
              )}
            >
              {isPushActive ? (
                <>
                  <BellRing className="h-3.5 w-3.5 text-emerald-700 animate-pulse" />
                  <span className="hidden sm:inline">Push Alerts: Active</span>
                </>
              ) : (
                <>
                  <Bell className="h-3.5 w-3.5 text-charcoal-500" />
                  <span className="hidden sm:inline">Enable Push Alerts</span>
                </>
              )}
            </button>

            <div className="hidden lg:block text-sm text-charcoal-500">
              Signed in as <span className="font-semibold text-charcoal-800">{user?.name}</span> ({user?.role})
            </div>
            <Link to="/" className="text-sm font-medium text-emerald-700 hover:underline">View site</Link>
          </div>
        </header>
        <main className="p-6 sm:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
