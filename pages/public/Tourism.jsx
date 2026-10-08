import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import SectionHeading from '../../components/ui/SectionHeading';
import AsyncState from '../../components/ui/AsyncState';
import EntityCard from '../../components/cards/EntityCard';
import { TourismChart } from '../../components/charts';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import { useFetch } from '../../hooks/useFetch';
import { placeholderImage, PLACEHOLDER_IDS, categoryPlaceholderSeed, entityImageSources } from '../../utils/placeholderImage';
import destinationService from '../../services/destinationService';
import statisticsService from '../../services/statisticsService';

export default function Tourism() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { data, loading, error, reload } = useFetch(
    () => destinationService.list({ limit: 100, sort: 'name' }),
    []
  );
  const destinations = Array.isArray(data) ? data : data?.items || [];
  const tourism = useFetch(() => statisticsService.economy({ metric: 'tourism' }), []);

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchesCategory =
        selectedCategory === 'All' || d.category === selectedCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        d.name?.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query) ||
        d.location?.toLowerCase().includes(query) ||
        d.region?.name?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [destinations, selectedCategory, search]);

  const categories = useMemo(() => {
    const cats = ['All'];
    const set = new Set();
    destinations.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return [...cats, ...Array.from(set)];
  }, [destinations]);

  return (
    <div>
      <PageSEO
        title="Tourism in Pakistan — Destinations & Travel Guide"
        description="Plan your journey through Pakistan's mountains, valleys, deserts, and historic cities with curated travel insights."
        canonical="/tourism"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Tourism', url: '/tourism' },
        ]}
      />
      <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden bg-charcoal-950 text-white">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.valley, 1600, 900)}
          alt="A scenic valley in northern Pakistan"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pb-12">
          <p className="text-eyebrow !text-gold-300 mb-2">Tourism</p>
          <h1 className="text-h1">One of the world's great undiscovered destinations</h1>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <SectionHeading
              eyebrow="Destinations"
              title="Where to go in Pakistan"
              description={`Explore all ${destinations.length || ''} iconic destinations across Pakistan — valleys, peaks, historical sites, and cultural heritage.`}
            />
            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations…"
                className="input-field pl-9 py-2 text-sm w-full"
                aria-label="Search destinations"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? destinations.length
                    : destinations.filter((d) => d.category === cat).length;
                const formattedName =
                  cat === 'HistoricalSites' ? 'Historical Sites' : cat;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-charcoal-100/70 text-charcoal-600 hover:bg-charcoal-200/70'
                    }`}
                  >
                    {formattedName} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <AsyncState
            loading={loading}
            error={error}
            isEmpty={!loading && !error && filtered.length === 0}
            onRetry={reload}
            emptyProps={{
              title: 'No destinations found',
              description: 'Try adjusting your search or category filter.',
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d) => (
                <EntityCard
                  key={d._id || d.slug}
                  to={`/places/${d.slug}`}
                  name={d.name}
                  blurb={d.description}
                  images={entityImageSources(d)}
                  imageSeed={categoryPlaceholderSeed(d.category)}
                  tag={d.region?.name || (d.category === 'HistoricalSites' ? 'Historical Site' : d.category)}
                  avgRating={d.avgRating}
                  ratingCount={d.ratingCount}
                  saveProps={{ entityType: 'destination', entityId: d._id || d.id, entityName: d.name }}
                />
              ))}
            </div>
          </AsyncState>
        </div>
      </section>
      <section className="section bg-charcoal-50/50">
        <div className="container-wide">
          <SectionHeading eyebrow="Trends" title="Tourism over time" />
          <AsyncState loading={tourism.loading} error={tourism.error} isEmpty={!tourism.loading && !tourism.data?.length} onRetry={tourism.reload} emptyProps={{ title: 'Tourism data unavailable' }}>
            <TourismChart data={tourism.data || []} />
          </AsyncState>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-narrow">
          <AskAIPrompt entityName="tourism in Pakistan" suggestedQuestion="Tell me about Hunza Valley" />
        </div>
      </section>
    </div>
  );
}
