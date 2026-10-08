import { useEffect, useRef, useState } from 'react';
import { Search, Clock } from 'lucide-react';
import PageSEO from '../layout/PageSEO';
import AsyncState from '../ui/AsyncState';
import EntityCard from '../cards/EntityCard';
import Pagination from '../admin/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { useFetch } from '../../hooks/useFetch';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { PLACEHOLDER_IDS, categoryPlaceholderSeed, entityImageSources, placeholderImage } from '../../utils/placeholderImage';
import { getVisitorId } from '../../utils/visitorId';
import searchHistoryService from '../../services/searchHistoryService';

// Generic public "browse & search" grid shared by Regions / Cities / Places pages.
export default function ContentListingPage({ title, description, service, basePath, blurbKey = 'description', fallbackSeed = PLACEHOLDER_IDS.valley }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 350);
  const { data, loading, error, reload } = useFetch(() => service.list({ page, limit: 12, search: debounced || undefined }), [page, debounced]);
  const items = Array.isArray(data) ? data : data?.items || data?.results || [];
  const totalPages = data?.totalPages || 1;

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchBoxRef = useRef(null);
  useOnClickOutside(searchBoxRef, () => setShowSuggestions(false));

  // Fire-and-forget - record a search once results for it have loaded, and
  // never surface a failure to the visitor (same principle as
  // usePageViewTracking).
  useEffect(() => {
    if (!debounced || loading) return;
    searchHistoryService
      .record({ query: debounced, resultCount: items.length, visitorId: getVisitorId() })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, loading]);

  const loadRecentSearches = () => {
    searchHistoryService
      .listRecent({ visitorId: getVisitorId(), limit: 8 })
      .then((res) => setRecentSearches(res?.items || []))
      .catch(() => {});
  };

  return (
    <div>
      <PageSEO
        title={title}
        description={description}
        canonical={basePath}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: title, url: basePath },
        ]}
      />
      <section className="relative flex min-h-[44vh] items-end overflow-hidden bg-charcoal-950 text-white pb-14 pt-28">
        <img
          src={placeholderImage(fallbackSeed || PLACEHOLDER_IDS.hero, 1920, 1080)}
          alt={title}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <p className="text-eyebrow !text-gold-300 mb-2">Explore</p>
          <h1 className="text-h1">{title}</h1>
          <p className="text-body-lg mt-3 text-white/80 max-w-2xl mx-auto">{description}</p>
        </div>
      </section>
      <section className="section bg-white pt-12">
        <div className="container-wide">
          <div className="relative mb-8 max-w-sm" ref={searchBoxRef}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              onFocus={() => { if (!search) { loadRecentSearches(); setShowSuggestions(true); } }}
              placeholder={`Search ${title.toLowerCase()}…`}
              className="input-field pl-9"
              aria-label={`Search ${title.toLowerCase()}`}
            />
            {showSuggestions && !search && recentSearches.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-xl border border-charcoal-100 bg-white py-1 shadow-lg">
                {recentSearches.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => { setSearch(q); setPage(1); setShowSuggestions(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-charcoal-600 hover:bg-charcoal-50"
                    >
                      <Clock className="h-3.5 w-3.5 text-charcoal-300" /> {q}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <AsyncState
            loading={loading}
            error={error}
            isEmpty={!loading && !error && items.length === 0}
            onRetry={reload}
            emptyProps={{ title: `No ${title.toLowerCase()} found`, description: 'Try a different search term.' }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <EntityCard
                  key={item._id || item.slug}
                  to={`${basePath}/${item.slug}`}
                  name={item.name}
                  blurb={item[blurbKey]}
                  images={entityImageSources(item)}
                  imageSeed={item.category ? categoryPlaceholderSeed(item.category) : fallbackSeed}
                  tag={item.region?.name}
                  avgRating={item.avgRating}
                  ratingCount={item.ratingCount}
                  saveProps={
                    basePath === '/cities'
                      ? { entityType: 'city', entityId: item._id || item.id, entityName: item.name }
                      : basePath === '/places'
                      ? { entityType: 'destination', entityId: item._id || item.id, entityName: item.name }
                      : undefined
                  }
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </AsyncState>
        </div>
      </section>
    </div>
  );
}
