import { useFetch } from '../../hooks/useFetch';
import { formatRelativeTime } from '../../utils/format';
import externalService from '../../services/externalService';

const LABELS = { USD: 'USD', EUR: 'EUR', GBP: 'GBP', AED: 'AED', SAR: 'SAR', CNY: 'CNY', INR: 'INR' };

// Slim horizontal exchange-rate ticker for the homepage - CurrencyCard (the
// fuller vertical version) is used on the destination sidebar instead.
// Renders nothing while loading/on failure, matching the fail-soft
// principle used everywhere Part 1 touches the free currency API.
export default function CurrencyTickerSection() {
  const { data } = useFetch(() => externalService.getCurrencyRates(), []);

  if (!data?.rates) return null;

  return (
    <section className="border-y border-charcoal-100 bg-charcoal-50/60 py-3">
      <div className="container-wide flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
        {Object.entries(data.rates).map(([code, rate]) => (
          <span key={code} className="flex items-center gap-1.5 text-charcoal-600">
            <span className="font-semibold text-charcoal-800">{LABELS[code] || code}</span>
            Rs {(1 / rate).toFixed(2)}
          </span>
        ))}
        {data.updatedAt && <span className="text-caption text-charcoal-400">Updated {formatRelativeTime(data.updatedAt)}</span>}
      </div>
    </section>
  );
}
