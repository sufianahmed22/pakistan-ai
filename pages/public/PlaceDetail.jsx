import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import EntityCard from '../../components/cards/EntityCard';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import EntityImage from '../../components/ui/EntityImage';
import EntityGallery from '../../components/ui/EntityGallery';
import RatingStars from '../../components/reviews/RatingStars';
import ReviewThread from '../../components/reviews/ReviewThread';
import WeatherCard from '../../components/widgets/WeatherCard';
import CurrencyCard from '../../components/widgets/CurrencyCard';
import AirQualityCard from '../../components/widgets/AirQualityCard';
import { useRecordView } from '../../hooks/useRecordView';
import { categoryPlaceholderSeed, entityImageSources } from '../../utils/placeholderImage';
import destinationService from '../../services/destinationService';

import SaveButton from '../../components/ui/SaveButton';

export default function PlaceDetail() {
  const { slug } = useParams();
  const { data: place, loading, error, reload } = useFetch(() => destinationService.get(slug), [slug]);
  const { data: relatedData } = useFetch(() => destinationService.list({ limit: 3 }), [slug]);
  const related = (Array.isArray(relatedData) ? relatedData : relatedData?.items || []).filter((r) => r.slug !== slug);
  useRecordView('destination', place?._id || place?.id);

  return (
    <div>
      <PageSEO
        title={place?.name ? `${place.name} — Places to Visit in Pakistan` : 'Destination'}
        description={place?.description || `Plan your visit to ${place?.name}, Pakistan — highlights, travel guide, history, and directions.`}
        canonical={`/places/${slug}`}
        image={place?.image}
        place={
          place
            ? {
                name: place.name,
                description: place.description,
                geo: place.coordinates ? { lat: place.coordinates.lat, lng: place.coordinates.lng } : undefined,
                address: { region: place.region?.name, locality: place.location || place.name },
                isTouristDestination: true,
              }
            : undefined
        }
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Places to Visit', url: '/places' },
          { name: place?.name || slug, url: `/places/${slug}` },
        ]}
      />
      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !place} onRetry={reload}>
        {place && (
          <>
            <section className="relative flex h-[55vh] min-h-[420px] items-end overflow-hidden bg-charcoal-950 text-white">
              <EntityImage
                sources={entityImageSources(place)}
                fallbackSeed={categoryPlaceholderSeed(place.category)}
                alt={place.name}
                width={1600}
                height={1000}
                fetchPriority="high"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
              <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pb-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-eyebrow !text-gold-300 mb-2">Destination</p>
                    <h1 className="text-h1">{place.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-white/70">
                      {place.region && <p className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {place.region.name}</p>}
                      {place.ratingCount > 0 && (
                        <p className="flex items-center gap-2">
                          <RatingStars value={place.avgRating} />
                          <span>{place.avgRating.toFixed(1)} · {place.ratingCount} {place.ratingCount === 1 ? 'review' : 'reviews'}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-1">
                    <SaveButton entityType="destination" entityId={place._id || place.id} entityName={place.name} />
                  </div>
                </div>
              </div>
            </section>

            <section className="section bg-white">
              <div className="container-wide grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  {[
                    ['Overview', place.description],
                    ['History', place.history],
                    ['Best Time to Visit', place.bestTime],
                    ['Travel Information', place.travelInfo],
                  ].map(([label, text]) => (
                    <div key={label}>
                      <h2 className="text-h3 mb-3">{label}</h2>
                      <p className="text-body-lg">{text || `${label} details for this destination are being compiled.`}</p>
                    </div>
                  ))}
                  <EntityGallery images={place.gallery} alt={place.name} placeholderSeed={categoryPlaceholderSeed(place.category)} heading="Gallery" />
                  <div>
                    <ReviewThread destinationId={place._id || place.id} />
                  </div>
                </div>
                <aside className="space-y-6">
                  <Card>
                    <h3 className="text-h4 mb-4">Location</h3>
                    <p className="text-body text-sm">{place.location || place.region?.name || 'Location details coming soon.'}</p>
                  </Card>
                  <Card>
                    <h3 className="text-h4 mb-4">Local Conditions</h3>
                    <div className="space-y-4">
                      <WeatherCard lat={place.coordinates?.lat} lng={place.coordinates?.lng} />
                      <AirQualityCard lat={place.coordinates?.lat} lng={place.coordinates?.lng} />
                      <CurrencyCard />
                    </div>
                  </Card>
                  <AskAIPrompt entityName={place.name} suggestedQuestion={`Tell me about ${place.name}`} />
                  {related.length > 0 && (
                    <div>
                      <h3 className="text-h4 mb-3">Related Destinations</h3>
                      <div className="space-y-4">
                        {related.slice(0, 2).map((r) => (
                          <EntityCard key={r._id || r.slug} to={`/places/${r.slug}`} name={r.name} blurb={r.description} images={entityImageSources(r)} imageSeed={categoryPlaceholderSeed(r.category)} />
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </section>
          </>
        )}
      </AsyncState>
    </div>
  );
}
