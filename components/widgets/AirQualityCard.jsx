import * as Icons from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import externalService from '../../services/externalService';

// Renders nothing if coordinates are missing, no monitoring station is
// within range (common outside major cities), or the upstream is
// unavailable - same fail-soft, self-hiding convention as WeatherCard.
export default function AirQualityCard({ lat, lng }) {
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';
  const { data } = useFetch(() => externalService.getAirQuality(lat, lng), [hasCoords, lat, lng]);

  if (!hasCoords || !data) return null;

  const Icon = Icons[data.icon] || Icons.Wind;

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-h4 !text-lg">{Math.round(data.pm25)} <span className="text-caption font-normal">µg/m³</span></p>
        <p className="text-caption">{data.label} · {data.stationName}</p>
      </div>
    </div>
  );
}
