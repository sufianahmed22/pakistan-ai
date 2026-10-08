import SectionHeading from '../ui/SectionHeading';
import AsyncState from '../ui/AsyncState';
import EntityCard from '../cards/EntityCard';
import { categoryPlaceholderSeed, entityImageSources } from '../../utils/placeholderImage';
import { useFetch } from '../../hooks/useFetch';
import destinationService from '../../services/destinationService';

export default function DestinationsSection() {
  const { data, loading, error, reload } = useFetch(() => destinationService.list({ limit: 6 }), []);
  const destinations = Array.isArray(data) ? data : data?.items || [];

  return (
    <section className="section bg-white">
      <div className="container-wide">
        <SectionHeading eyebrow="Tourism" title="Famous destinations" subtitle="From Hunza's terraced valleys to the ancient streets of Lahore." />
        <AsyncState loading={loading} error={error} isEmpty={!loading && !error && destinations.length === 0} onRetry={reload} emptyProps={{ title: 'Destinations coming soon' }}>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin snap-x">
            {destinations.map((d) => (
              <div key={d._id || d.slug} className="min-w-[280px] snap-start">
                <EntityCard to={`/places/${d.slug}`} name={d.name} blurb={d.description} images={entityImageSources(d)} imageSeed={categoryPlaceholderSeed(d.category)} tag={d.region?.name} avgRating={d.avgRating} ratingCount={d.ratingCount} />
              </div>
            ))}
          </div>
        </AsyncState>
      </div>
    </section>
  );
}
