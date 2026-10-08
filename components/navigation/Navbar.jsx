import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Send, Sparkles, User } from 'lucide-react';
import { PUBLIC_NAV_LINKS } from '../../constants/nav';
import { TELEGRAM_LINK, APP_NAME } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import MobileMenu from './MobileMenu';
import UserMenu from './UserMenu';
import { cn } from '../../utils/cn';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The navbar stays mounted across page navigations (it lives outside the
  // <Outlet>), so the browser doesn't reset scroll position on route change.
  // Without this, navigating away while scrolled down leaves the navbar
  // showing its "at top" transparent/white-text style on a page whose top
  // section isn't a dark hero - the washed-out look reported in the bug.
  useEffect(() => {
    window.scrollTo(0, 0);
    setScrolled(false);
  }, [location.pathname]);

  const isScrolledOrLight = scrolled || location.pathname.startsWith('/dashboard') || location.pathname === '/ask';

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isScrolledOrLight ? 'glass-panel-light shadow-soft py-3' : 'bg-black/20 py-5'
        )}
      >
        <nav className="container-wide flex items-center justify-between px-6 sm:px-10 lg:px-1" aria-label="Primary">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className={cn(isScrolledOrLight ? 'text-emerald-800' : 'text-white')}>{APP_NAME}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                    isScrolledOrLight ? 'text-charcoal-700 hover:bg-charcoal-100' : 'text-white/90 hover:bg-white/10',
                    isActive && (isScrolledOrLight ? 'text-emerald-800 font-semibold' : 'text-white font-semibold')
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                isScrolledOrLight ? 'text-charcoal-700 hover:bg-charcoal-100' : 'text-white/90 hover:bg-white/10'
              )}
            >
              <Send className="h-4 w-4" aria-hidden="true" /> Telegram
            </a>
            <button
              onClick={() => navigate('/ask')}
              className="btn-primary text-sm px-4 py-2.5"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Ask AI
            </button>
            {isAuthenticated ? (
              <UserMenu scrolled={isScrolledOrLight} />
            ) : (
              <Link
                to="/login"
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                  isScrolledOrLight ? 'text-charcoal-800 hover:bg-charcoal-100' : 'text-white hover:bg-white/10'
                )}
              >
                <User className="h-4 w-4" aria-hidden="true" /> Login
              </Link>
            )}
          </div>

          <button
            className={cn('lg:hidden rounded-full p-2', isScrolledOrLight ? 'text-charcoal-800' : 'text-white')}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      {/* spacer so fixed navbar doesn't overlap non-hero pages */}
    </>
  );
}
