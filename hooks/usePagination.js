import { useState, useMemo } from 'react';

export function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const params = useMemo(() => ({ page, limit }), [page, limit]);

  return { page, limit, setPage, setLimit, params };
}
