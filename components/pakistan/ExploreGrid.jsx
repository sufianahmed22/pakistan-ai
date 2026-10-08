import SectionHeading from '../ui/SectionHeading';
import EntityCard from '../cards/EntityCard';
import AsyncState from '../ui/AsyncState';
import { PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import { useFetch } from '../../hooks/useFetch';
import regionService from '../../services/regionService';

export default function ExploreGrid() {
  const { data, loading, error, reload } = useFetch(() => regionService.list({ limit: 6 }), []);
  const regions = Array.isArray(data) ? data : data?.items || [];

  return (
    <section className="section bg-charcoal-50/50">
      <div className="container-wide">
        <SectionHeading eyebrow="Explore" title="Explore Pakistan region by region" subtitle="From glacier peaks to coastal deltas — every province and territory, one interactive map." />
        <AsyncState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && regions.length === 0}
          onRetry={reload}
          emptyProps={{ title: 'Regions coming soon' }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((r) => (
              <EntityCard key={r._id || r.slug} to={`/regions/${r.slug}`} name={r.name} blurb={r.description} images={entityImageSources(r)} imageSeed={PLACEHOLDER_IDS.mountains} />
            ))}
          </div>
        </AsyncState>
      </div>
    </section>
  );
}
