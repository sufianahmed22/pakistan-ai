import { useParams, Link } from 'react-router-dom';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import EntityCard from '../../components/cards/EntityCard';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import { formatCompactNumber } from '../../utils/format';
import EntityImage from '../../components/ui/EntityImage';
import EntityGallery from '../../components/ui/EntityGallery';
import { PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import regionService from '../../services/regionService';
import cityService from '../../services/cityService';
import destinationService from '../../services/destinationService';
import { useRecordView } from '../../hooks/useRecordView';

export default function RegionDetail() {
  const { slug } = useParams();
  const { data: region, loading, error, reload } = useFetch(() => regionService.get(slug), [slug]);
  const regionRef = region?._id || region?.id || slug;
  const { data: citiesData } = useFetch(
    () => (regionRef ? cityService.list({ region: regionRef, limit: 12 }) : Promise.resolve([])),
    [regionRef]
  );
  const cities = Array.isArray(citiesData) ? citiesData : citiesData?.items || [];

  const { data: placesData } = useFetch(
    () => (regionRef ? destinationService.list({ region: regionRef, limit: 12 }) : Promise.resolve([])),
    [regionRef]
  );
  const places = Array.isArray(placesData) ? placesData : placesData?.items || [];

  useRecordView('region', region?._id || region?.id);

  return (
    <div>
      <PageSEO
        title={region?.name ? `${region.name} — Provinces & Territories of Pakistan` : 'Region'}
        description={region?.description || `Discover ${region?.name}, Pakistan — history, geography, major cities, and culture.`}
        canonical={`/regions/${slug}`}
        image={region?.image}
        place={
          region
            ? {
                name: region.name,
                description: region.description,
                address: { region: region.name },
                isTouristDestination: false,
              }
            : undefined
        }
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Regions', url: '/regions' },
          { name: region?.name || slug, url: `/regions/${slug}` },
        ]}
      />
      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !region} onRetry={reload}>
        {region && (
          <>
            {/* Hero */}
            <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden bg-charcoal-950 text-white">
              <EntityImage
                sources={entityImageSources(region)}
                fallbackSeed={PLACEHOLDER_IDS.mountains}
                alt={`Landscape of ${region.name}`}
                width={1600}
                height={900}
                fetchPriority="high"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
              <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pb-12">
                <p className="text-eyebrow !text-gold-300 mb-2">Region</p>
                <h1 className="text-h1">{region.name}</h1>
                {region.capital && <p className="text-white/70 mt-2">Capital: {region.capital}</p>}
              </div>
            </section>

            <section className="section bg-white">
              <div className="container-wide grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  <div>
                    <h2 className="text-h3 mb-3">Overview</h2>
                    <p className="text-body-lg">{region.description || 'A comprehensive overview of this region is coming soon.'}</p>
                  </div>
                  <div>
                    <h2 className="text-h3 mb-3">Geography</h2>
                    <p className="text-body-lg">{region.geography || 'Geographic details for this region are being compiled.'}</p>
                  </div>
                  <div>
                    <h2 className="text-h3 mb-3">Culture</h2>
                    <p className="text-body-lg">{region.culture || 'Cultural highlights for this region are being compiled.'}</p>
                  </div>
                  <div>
                    <h2 className="text-h3 mb-3">Food</h2>
                    <p className="text-body-lg">{region.food || 'Regional cuisine details are being compiled.'}</p>
                  </div>
                  <div>
                    <h2 className="text-h3 mb-3">History</h2>
                    <p className="text-body-lg">{region.history || 'The historical background of this region is being compiled.'}</p>
                  </div>
                  <div>
                    <h2 className="text-h3 mb-3">Tourism</h2>
                    <p className="text-body-lg">{region.tourism || 'Tourism highlights for this region are being compiled.'}</p>
                  </div>
                  <EntityGallery images={region.gallery} alt={region.name} placeholderSeed={PLACEHOLDER_IDS.mountains} heading="Gallery" />

                  {/* Places to Visit */}
                  <div>
                    <h2 className="text-h3 mb-3">Places to Visit</h2>
                    {places.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {places.map((p) => (
                          <EntityCard
                            key={p._id || p.slug}
                            to={`/places/${p.slug}`}
                            name={p.name}
                            blurb={p.description}
                            images={entityImageSources(p)}
                            imageSeed={PLACEHOLDER_IDS.valley}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-body">No places to visit listed for this region yet.</p>
                    )}
                  </div>

                  {/* Cities */}
                  <div>
                    <h2 className="text-h3 mb-3">Cities</h2>
                    {cities.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cities.map((c) => (
                          <EntityCard
                            key={c._id || c.slug}
                            to={`/cities/${c.slug}`}
                            name={c.name}
                            blurb={c.description}
                            images={entityImageSources(c)}
                            imageSeed={PLACEHOLDER_IDS.city}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-body">No cities listed for this region yet.</p>
                    )}
                  </div>
                </div>
                <aside className="space-y-6">
                  <Card>
                    <h3 className="text-h4 mb-4">Statistics</h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between"><dt className="text-charcoal-400">Population</dt><dd className="font-semibold">{region.population ? formatCompactNumber(region.population) : '—'}</dd></div>
                      <div className="flex justify-between"><dt className="text-charcoal-400">Area</dt><dd className="font-semibold">{region.area ? `${formatCompactNumber(region.area)} km²` : '—'}</dd></div>
                      <div className="flex justify-between"><dt className="text-charcoal-400">Capital</dt><dd className="font-semibold">{region.capital || '—'}</dd></div>
                    </dl>
                    {region.statsYear && <p className="text-caption mt-3">As of {region.statsYear}</p>}
                  </Card>
                  <AskAIPrompt entityName={region.name} suggestedQuestion={`Tell me about ${region.name}`} />
                </aside>
              </div>
            </section>
          </>
        )}
      </AsyncState>
      <p className="sr-only"><Link to="/regions">Back to regions</Link></p>
    </div>
  );
}
