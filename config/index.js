export const APP_NAME = 'Pakistan AI';
export const APP_TAGLINE = 'Discover Pakistan. Ask Anything.';
export const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'pakistan_ai_bot';
export const TELEGRAM_LINK = `https://t.me/${TELEGRAM_BOT_USERNAME}`;
export const CHAT_MAX_CHARS = 1000;
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Website base URL for canonical tags, OpenGraph social previews, and Schema.org metadata.
 * Configurable via VITE_SITE_URL (or VITE_CLIENT_URL / VITE_APP_URL).
 * Defaults in-browser to window.location.origin, and in SSR/tests to 'http://localhost:5173'.
 */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  import.meta.env.VITE_CLIENT_URL ||
  import.meta.env.VITE_APP_URL ||
  (typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'http://localhost:5173')
).replace(/\/+$/, '');

/**
 * Helper to construct absolute website URLs cleanly
 */
export function getAbsoluteUrl(path = '') {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

