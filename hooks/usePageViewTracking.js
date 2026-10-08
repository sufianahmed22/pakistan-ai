import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '../services/analyticsService';
import { getVisitorId } from '../utils/visitorId';

// Fires a page-view event on first mount and on every client-side route
// change, for the admin "Site Traffic" dashboard. Silently ignores failures
// (rate-limited, offline, etc.) - tracking should never disrupt browsing.
export function usePageViewTracking() {
  const location = useLocation();

  useEffect(() => {
    analyticsService
      .trackPageView({
        path: location.pathname,
        visitorId: getVisitorId(),
        referrer: document.referrer || undefined,
      })
      .catch(() => {});
  }, [location.pathname]);
}
