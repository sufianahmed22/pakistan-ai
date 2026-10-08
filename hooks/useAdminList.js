import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

// Server-paginated list hook shared by every admin content page.
export function useAdminList(service, extraParams = {}) {
  const serviceRef = useRef(service);
  serviceRef.current = service;

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedSearch = useDebounce(search, 350);

  const extraParamsKey = JSON.stringify(extraParams);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentService = serviceRef.current;
      const fetchFn =
        typeof currentService?.list === 'function'
          ? currentService.list.bind(currentService)
          : typeof currentService === 'function'
          ? currentService
          : null;

      if (!fetchFn) {
        throw new Error('No list function provided to useAdminList');
      }

      const res = await fetchFn({ page, limit: 10, search: debouncedSearch || undefined, ...extraParams });
      const list = Array.isArray(res) ? res : res?.items || res?.results || res?.data || [];
      setItems(list);
      const tot = res?.total !== undefined ? res.total : (res?.count !== undefined ? res.count : list.length);
      setTotal(tot);
      const tp = res?.totalPages || (tot ? Math.ceil(tot / (res?.limit || 10)) : 1);
      setTotalPages(tp || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, extraParamsKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, extraParamsKey]);

  return { items, page, setPage, totalPages, total, search, setSearch, loading, error, reload: load };
}
