import { useEffect } from 'react';
import { useAuth } from './useAuth';
import viewHistoryService from '../services/viewHistoryService';

// Fire-and-forget, logged-in users only (see ViewHistory's design note) -
// tracking should never disrupt browsing, same principle as
// usePageViewTracking.
export function useRecordView(entityType, entityId) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !entityId) return;
    viewHistoryService.record(entityType, entityId).catch(() => {});
  }, [isAuthenticated, entityType, entityId]);
}
