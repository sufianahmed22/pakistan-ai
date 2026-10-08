import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LayoutDashboard, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { cn } from '../../utils/cn';

export default function UserMenu({ scrolled }) {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors',
          scrolled ? 'text-charcoal-800 hover:bg-charcoal-100' : 'text-white hover:bg-white/10'
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold">
          {(user?.name || 'U').slice(0, 1).toUpperCase()}
        </span>
        {user?.name?.split(' ')[0] || 'Account'}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 mt-2 w-60 rounded-2xl border border-charcoal-100 bg-white p-2 shadow-glass"
          >
            <div className="px-3 py-2 border-b border-charcoal-100 mb-1">
              <p className="text-xs font-bold text-charcoal-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-charcoal-500 truncate">{user?.email}</p>
            </div>
            <Link to="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50" onClick={() => setOpen(false)}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50" onClick={() => setOpen(false)}>
                <ShieldCheck className="h-4 w-4" /> Admin Panel
              </Link>
            )}
            <Link to="/dashboard/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50" onClick={() => setOpen(false)}>
              <User className="h-4 w-4" /> Profile
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
