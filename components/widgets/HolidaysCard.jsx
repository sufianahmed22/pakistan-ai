import { CalendarHeart } from 'lucide-react';
import { Card } from '../kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import externalService from '../../services/externalService';

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const CURRENT_MONTH = now.getMonth() + 1;
const NEXT_MONTH = CURRENT_MONTH === 12 ? 1 : CURRENT_MONTH + 1;
const NEXT_MONTH_YEAR = CURRENT_MONTH === 12 ? CURRENT_YEAR + 1 : CURRENT_YEAR;

// Self-contained section (not just an inline widget) because, unlike
// WeatherCard/CurrencyCard which sit inside a Card that already has other
// guaranteed content next to them, this is meant to be mounted on its own
// on Home.jsx - so it has to own its whole wrapper and disappear completely
// (no empty section, no empty Card) when there's nothing upcoming or the
// holidays API key isn't configured yet, same fail-soft principle as every
// other widget here, just applied one level higher.
export default function HolidaysCard() {
  const { data: currentMonth } = useFetch(() => externalService.getHolidays(CURRENT_YEAR, CURRENT_MONTH), []);
  const { data: nextMonth } = useFetch(() => externalService.getHolidays(NEXT_MONTH_YEAR, NEXT_MONTH), []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = [...(currentMonth || []), ...(nextMonth || [])]
    .filter((h) => h.date && new Date(h.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="section bg-charcoal-50/50">
      <div className="container-narrow">
        <Card>
          <div className="mb-3 flex items-center gap-2 text-charcoal-700">
            <CalendarHeart className="h-4 w-4 text-emerald-700" />
            <h3 className="text-h4 !text-base">Upcoming Public Holidays</h3>
          </div>
          <ul className="space-y-2 text-sm">
            {upcoming.map((h) => (
              <li key={`${h.name}-${h.date}`} className="flex items-center justify-between gap-3">
                <span className="text-charcoal-700">{h.name}</span>
                <span className="shrink-0 text-charcoal-400">{formatDate(h.date)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
