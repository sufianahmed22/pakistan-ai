import * as Icons from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import externalService from '../../services/externalService';

// Renders nothing if coordinates are missing or the upstream weather
// service is unavailable - a missing widget should never look broken.
export default function WeatherCard({ lat, lng }) {
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';
  const { data } = useFetch(() => externalService.getWeather(lat, lng), [hasCoords, lat, lng]);

  if (!hasCoords || !data) return null;

  const Icon = Icons[data.icon] || Icons.Cloud;

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-h4 !text-lg">{Math.round(data.temperature)}°C</p>
        <p className="text-caption">{data.label}</p>
      </div>
    </div>
  );
}
