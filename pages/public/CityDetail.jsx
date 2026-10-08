import { useParams } from 'react-router-dom';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import { formatCompactNumber } from '../../utils/format';
import EntityImage from '../../components/ui/EntityImage';
import EntityGallery from '../../components/ui/EntityGallery';
import { PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import cityService from '../../services/cityService';
import { useRecordView } from '../../hooks/useRecordView';

import RatingStars from '../../components/reviews/RatingStars';
import ReviewThread from '../../components/reviews/ReviewThread';
import SaveButton from '../../components/ui/SaveButton';

export default function CityDetail() {
  const { slug } = useParams();
  const { data: city, loading, error, reload } = useFetch(() => cityService.get(slug), [slug]);
  useRecordView('city', city?._id || city?.id);

  return (
    <div>
      <PageSEO
        title={city?.name ? `${city.name} — City Guide & Highlights` : 'City'}
        description={city?.description || `Explore ${city?.name}, Pakistan — history, geography, attractions, and cultural highlights.`}
        canonical={`/cities/${slug}`}
        image={city?.image}
        place={
          city
            ? {
                name: city.name,
                description: city.description,
                geo: city.coordinates ? { lat: city.coordinates.lat, lng: city.coordinates.lng } : undefined,
                address: { region: city.province, locality: city.name },
              }
            : undefined
        }
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Cities', url: '/cities' },
          { name: city?.name || slug, url: `/cities/${slug}` },
        ]}
      />
      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !city} onRetry={reload}>
        {city && (
          <>
            <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden bg-charcoal-950 text-white">
              <EntityImage
                sources={entityImageSources(city)}
                fallbackSeed={PLACEHOLDER_IDS.city}
                alt={`Skyline of ${city.name}`}
                width={1600}
                height={900}
                fetchPriority="high"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
              <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pb-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-eyebrow !text-gold-300 mb-2">City</p>
                    <h1 className="text-h1">{city.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-white/70">
                      {city.province && <p>{city.province}</p>}
                      {city.ratingCount > 0 && (
                        <p className="flex items-center gap-2">
                          <RatingStars value={city.avgRating} />
                          <span>{city.avgRating.toFixed(1)} · {city.ratingCount} {city.ratingCount === 1 ? 'review' : 'reviews'}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-1">
                    <SaveButton entityType="city" entityId={city._id || city.id} entityName={city.name} />
                  </div>
                </div>
              </div>
            </section>

            <section className="section bg-white">
              <div className="container-wide grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  {[
                    ['Overview', city.description],
                    ['Geography', city.geography],
                    ['History', city.history],
                    ['Culture', city.culture],
                    ['Food', city.food],
                    ['Tourism', city.tourism],
                  ].map(([label, text]) => (
                    <div key={label}>
                      <h2 className="text-h3 mb-3">{label}</h2>
                      <p className="text-body-lg">{text || `${label} details for this city are being compiled.`}</p>
                    </div>
                  ))}
                  <EntityGallery images={city.gallery} alt={city.name} placeholderSeed={PLACEHOLDER_IDS.city} heading="Gallery" />
                  <div>
                    <ReviewThread cityId={city._id || city.id} />
                  </div>
                </div>
                <aside className="space-y-6">
                  <Card>
                    <h3 className="text-h4 mb-4">Statistics</h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between"><dt className="text-charcoal-400">Population</dt><dd className="font-semibold">{city.population ? formatCompactNumber(city.population) : '—'}</dd></div>
                      <div className="flex justify-between"><dt className="text-charcoal-400">Province</dt><dd className="font-semibold">{city.province || '—'}</dd></div>
                      <div className="flex justify-between"><dt className="text-charcoal-400">Elevation</dt><dd className="font-semibold">{city.elevation ? `${city.elevation} m` : '—'}</dd></div>
                    </dl>
                    {city.statsYear && <p className="text-caption mt-3">As of {city.statsYear}</p>}
                  </Card>
                  <AskAIPrompt entityName={city.name} suggestedQuestion={`Tell me about ${city.name}`} />
                </aside>
              </div>
            </section>
          </>
        )}
      </AsyncState>
    </div>
  );
}
