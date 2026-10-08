import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Sparkles, Send, User, LayoutDashboard, ShieldCheck, Bookmark, MessageSquareText, LogOut } from 'lucide-react';
import { PUBLIC_NAV_LINKS } from '../../constants/nav';
import { TELEGRAM_LINK, APP_NAME } from '../../config';
import { useAuth } from '../../hooks/useAuth';

export default function MobileMenu({ open, onClose }) {
  const { isAuthenticated, logout, isAdmin, user } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-charcoal-950 lg:hidden scrollbar-thin pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-charcoal-950 px-6 py-4">
            <span className="font-display text-xl font-bold text-white">{APP_NAME}</span>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Account Quick Section (if logged in) */}
          {isAuthenticated && (
            <div className="mx-6 mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  {(user?.name || 'U').slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-white truncate">{user?.name || 'Explorer'}</p>
                  <p className="text-xs text-white/60 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-emerald-500/20 pt-3">
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" /> Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-xl bg-gold-500/10 border border-gold-500/20 px-3 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500/20 transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-400" /> Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard/saved"
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <Bookmark className="h-3.5 w-3.5 text-emerald-400" /> Saved Places
                </Link>
                <Link
                  to="/dashboard/messages"
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <MessageSquareText className="h-3.5 w-3.5 text-emerald-400" /> Support
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Links Grid */}
          <div className="px-6 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 px-2">Navigation</p>
            <motion.nav
              initial="closed"
              animate="open"
              variants={{ open: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } } }}
              className="grid grid-cols-2 gap-1.5 sm:grid-cols-2"
            >
              {PUBLIC_NAV_LINKS.map((link) => (
                <motion.div
                  key={link.to}
                  variants={{ closed: { opacity: 0, y: 6 }, open: { opacity: 1, y: 0 } }}
                >
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-2.5 text-base font-display font-medium text-white/90 hover:bg-white/10 hover:text-gold-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3 px-6">
            <Link to="/ask" onClick={onClose} className="btn-gold justify-center py-3">
              <Sparkles className="h-4 w-4" /> Ask Pakistan AI
            </Link>
            <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="btn-ghost justify-center py-3">
              <Send className="h-4 w-4" /> Open Telegram Bot
            </a>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="btn-secondary justify-center bg-transparent border-white/20 text-white hover:bg-white/10 mt-1 py-2.5"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                className="btn-secondary justify-center bg-transparent border-white/20 text-white hover:bg-white/10 mt-1 py-2.5"
              >
                <User className="h-4 w-4" /> Login / Sign Up
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
