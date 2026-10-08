import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Trash2, ArrowUpRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import PageSEO from '../../components/layout/PageSEO';
import EmptyState from '../../components/ui/EmptyState';
import AsyncState from '../../components/ui/AsyncState';
import EntityImage from '../../components/ui/EntityImage';
import RatingStars from '../../components/reviews/RatingStars';
import { useFetch } from '../../hooks/useFetch';
import savedService from '../../services/savedService';
import { categoryPlaceholderSeed, entityImageSources, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function DashboardSaved() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'destination' | 'city'
  const [search, setSearch] = useState('');

  const { data, loading, error, reload } = useFetch(
    () => savedService.list({ limit: 100 }),
    []
  );

  const rawItems = data?.items || [];
  const counts = data?.counts || { total: 0, destinations: 0, cities: 0 };

  const handleRemove = async (savedId, entityName) => {
    try {
      await savedService.remove(savedId);
      toast.success(`Removed "${entityName}" from saved places`);
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to remove saved item');
    }
  };

  const filteredItems = rawItems.filter((item) => {
    const matchesTab =
      activeTab === 'all' || item.entityType === activeTab;
    const name = item.entity?.name || '';
    const location = item.entity?.location || item.entity?.province || item.entity?.region?.name || '';
    const matchesSearch =
      !search.trim() ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <PageSEO title="Saved Places" />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h3">Saved Places & Cities</h1>
          <p className="text-body text-charcoal-500 mt-1">
            All your bookmarked destinations and cities across Pakistan.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50'
            }`}
          >
            All ({counts.total || rawItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('destination')}
            className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'destination'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50'
            }`}
          >
            Places & Destinations ({counts.destinations || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('city')}
            className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'city'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50'
            }`}
          >
            Cities ({counts.cities || 0})
          </button>
        </div>

        {rawItems.length > 0 && (
          <div className="relative max-w-xs w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved items..."
              className="w-full rounded-xl border border-charcoal-200 bg-white py-1.5 pl-9 pr-3 text-sm text-charcoal-800 placeholder-charcoal-400 focus:border-emerald-600 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        )}
      </div>

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={!loading && !error && filteredItems.length === 0}
        onRetry={reload}
        emptyProps={{
          icon: Bookmark,
          title: rawItems.length === 0 ? 'No saved places yet' : 'No matching items found',
          description:
            rawItems.length === 0
              ? 'Bookmark destinations and cities as you explore Pakistan AI to keep track of where you want to go.'
              : 'Try clearing your search query or switching tabs.',
          action: (
            <div className="mt-3 flex flex-wrap gap-3 justify-center">
              <Link to="/tourism" className="btn-primary text-sm">
                Explore Destinations
              </Link>
              <Link to="/cities" className="btn-secondary text-sm">
                Explore Cities
              </Link>
            </div>
          ),
        }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const entity = item.entity;
            if (!entity) return null;

            const isCity = item.entityType === 'city';
            const detailUrl = isCity ? `/cities/${entity.slug}` : `/places/${entity.slug}`;
            const placeholderSeed = isCity
              ? PLACEHOLDER_IDS.city
              : categoryPlaceholderSeed(entity.category);
            const tagLabel = isCity
              ? 'City'
              : entity.category === 'HistoricalSites'
              ? 'Historical Site'
              : entity.category || 'Destination';

            return (
              <div
                key={item._id || item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-soft transition-all hover:shadow-lg"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <EntityImage
                    sources={entityImageSources(entity)}
                    fallbackSeed={placeholderSeed}
                    alt={entity.name}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                  <span className="absolute left-3 top-3 badge bg-white/90 text-charcoal-800 font-medium text-xs">
                    {tagLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item._id || item.id, entity.name)}
                    aria-label={`Remove ${entity.name} from saved`}
                    title="Remove from saved"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-md transition-all hover:bg-rose-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={detailUrl}
                        className="text-h4 !text-lg font-semibold text-charcoal-900 group-hover:text-emerald-700 transition-colors"
                      >
                        {entity.name}
                      </Link>
                      <Link to={detailUrl} className="text-charcoal-400 group-hover:text-emerald-700">
                        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>

                    {(entity.location || entity.province || entity.region?.name) && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-500">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">
                          {entity.location || entity.province || entity.region?.name}
                        </span>
                      </p>
                    )}

                    {entity.ratingCount > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-charcoal-500">
                        <RatingStars value={entity.avgRating} size="sm" />
                        <span>
                          {entity.avgRating.toFixed(1)} · {entity.ratingCount}
                        </span>
                      </div>
                    )}

                    {entity.description && (
                      <p className="text-body mt-2 line-clamp-2 text-xs sm:text-sm text-charcoal-600">
                        {entity.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between">
                    <span className="text-caption text-charcoal-400">
                      Saved {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={detailUrl}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AsyncState>
    </div>
  );
}
