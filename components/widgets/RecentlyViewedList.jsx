import { Link } from 'react-router-dom';
import EntityImage from '../ui/EntityImage';
import { entityImageSources, PLACEHOLDER_IDS, categoryPlaceholderSeed } from '../../utils/placeholderImage';
import { useFetch } from '../../hooks/useFetch';
import viewHistoryService from '../../services/viewHistoryService';

const BASE_PATH = { destination: '/places', city: '/cities', region: '/regions' };

function seedFor(entityType, entity) {
  return entityType === 'destination' ? categoryPlaceholderSeed(entity.category) : PLACEHOLDER_IDS.city;
}

// Bonus convenience section - renders nothing (not even an empty state) if
// there's no history yet, since this isn't a page anyone navigates to
// directly.
export default function RecentlyViewedList() {
  const { data } = useFetch(() => viewHistoryService.listRecent({ limit: 6 }), []);
  const items = data?.items || [];

  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-h4 mb-4">Recently Viewed</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map(({ entityType, entity }) => (
          <Link
            key={`${entityType}-${entity._id || entity.id}`}
            to={`${BASE_PATH[entityType]}/${entity.slug}`}
            className="group block w-40 shrink-0 overflow-hidden rounded-xl border border-charcoal-100 bg-white shadow-soft hover:shadow-lg transition-shadow"
          >
            <div className="h-24 w-full overflow-hidden">
              <EntityImage
                sources={entityImageSources(entity)}
                fallbackSeed={seedFor(entityType, entity)}
                alt={entity.name}
                width={320}
                height={200}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="line-clamp-1 px-3 py-2 text-sm font-semibold text-charcoal-800">{entity.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
