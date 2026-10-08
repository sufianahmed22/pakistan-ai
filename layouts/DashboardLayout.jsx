import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, MessagesSquare, Bookmark, MessageSquareText, User, Settings } from 'lucide-react';
import Navbar from '../components/navigation/Navbar';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/cn';

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/dashboard/conversations', label: 'Conversations', icon: MessagesSquare },
  { to: '/dashboard/saved', label: 'Saved Places', icon: Bookmark },
  { to: '/dashboard/messages', label: 'Messages & Support', icon: MessageSquareText },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-50/40">
      <Navbar />

      <div className="flex flex-1 pt-20">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-charcoal-100 bg-white p-6 lg:block">
          <div className="mb-6 pb-4 border-b border-charcoal-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">User Dashboard</p>
            <p className="font-display font-semibold text-charcoal-900 mt-1 truncate">{user?.name || 'Explorer'}</p>
            <p className="text-xs text-charcoal-500 truncate">{user?.email}</p>
          </div>
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-charcoal-600 hover:bg-charcoal-50'
                  )
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Dashboard Tabs */}
          <div className="border-b border-charcoal-100 bg-white px-4 py-2.5 lg:hidden overflow-x-auto scrollbar-none flex items-center gap-1.5">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                      : 'text-charcoal-600 hover:bg-charcoal-100'
                  )
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </div>

          <main className="flex-1 p-6 sm:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
