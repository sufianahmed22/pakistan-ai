export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatCompactNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function asOfLabel(record) {
  if (!record) return '';
  if (record.year) return `As of ${record.year}`;
  if (record.date) return `As of ${new Date(record.date).toLocaleDateString()}`;
  return 'Estimate';
}

export function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatRelativeTime(d) {
  if (!d) return '';
  const date = new Date(d);
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const divisions = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];
  for (const [unit, secondsInUnit] of divisions) {
    if (Math.abs(diffSec) >= secondsInUnit) {
      const value = Math.round(diffSec / secondsInUnit);
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(value, unit);
    }
  }
  return 'just now';
}

export function truncate(str, len = 140) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len).trim() + '…' : str;
}
