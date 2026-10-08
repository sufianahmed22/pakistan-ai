import { useFetch } from '../../hooks/useFetch';
import { formatRelativeTime } from '../../utils/format';
import externalService from '../../services/externalService';

const LABELS = { USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', AED: 'UAE Dirham', SAR: 'Saudi Riyal', CNY: 'Chinese Yuan', INR: 'Indian Rupee' };

// Global widget - not tied to any one destination. Renders nothing while
// loading/on failure, same fail-soft principle as WeatherCard.
export default function CurrencyCard() {
  const { data } = useFetch(() => externalService.getCurrencyRates(), []);

  if (!data?.rates) return null;

  return (
    <div>
      <ul className="space-y-2 text-sm">
        {Object.entries(data.rates).map(([code, rate]) => (
          <li key={code} className="flex items-center justify-between">
            <span className="text-charcoal-500">{LABELS[code] || code}</span>
            <span className="font-semibold text-charcoal-800">
              1 {code} = Rs {(1 / rate).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      {data.updatedAt && <p className="text-caption mt-3 text-charcoal-400">Rates updated {formatRelativeTime(data.updatedAt)}</p>}
    </div>
  );
}
