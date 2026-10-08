import { Activity } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { formatRelativeTime } from '../../utils/format';
import externalService from '../../services/externalService';

// Self-contained section (owns its own <section>/<container> wrapper, not
// just a bare card) so it can disappear completely - no empty section, no
// empty card - when there's been no notable activity in the last 30 days or
// the USGS feed is unreachable, same fail-soft principle as every other
// widget here.
export default function RecentEarthquakesCard() {
  const { data } = useFetch(() => externalService.getRecentEarthquakes(), []);

  if (!data || data.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="card p-6">
          <div className="mb-3 flex items-center gap-2 text-charcoal-700">
            <Activity className="h-4 w-4 text-amber-600" />
            <h3 className="text-h4 !text-base">Recent Seismic Activity</h3>
          </div>
          <p className="text-caption mb-4 text-charcoal-400">Magnitude 4.0+ events in the region, last 30 days (USGS)</p>
          <ul className="space-y-3 text-sm">
            {data.slice(0, 6).map((eq) => (
              <li key={`${eq.place}-${eq.time}`} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-charcoal-800">M{eq.magnitude?.toFixed(1)} · {eq.place}</p>
                  <p className="text-caption text-charcoal-400">{formatRelativeTime(eq.time)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
