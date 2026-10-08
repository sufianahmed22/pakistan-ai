import SectionHeading from '../ui/SectionHeading';
import AsyncState from '../ui/AsyncState';
import EntityCard from '../cards/EntityCard';
import { PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import { useFetch } from '../../hooks/useFetch';
import regionService from '../../services/regionService';

export default function ProvincesSection() {
  const { data, loading, error, reload } = useFetch(() => regionService.list({ limit: 7 }), []);
  const regions = Array.isArray(data) ? data : data?.items || [];

  return (
    <section className="section bg-charcoal-50/50">
      <div className="container-wide">
        <SectionHeading eyebrow="Provinces & Territories" title="Four provinces, three territories, one nation" />
        <AsyncState loading={loading} error={error} isEmpty={!loading && !error && regions.length === 0} onRetry={reload} emptyProps={{ title: 'No provinces available yet' }}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {regions.map((r) => (
              <EntityCard key={r._id || r.slug} to={`/regions/${r.slug}`} name={r.name} blurb={r.capital ? `Capital: ${r.capital}` : undefined} images={entityImageSources(r)} imageSeed={PLACEHOLDER_IDS.mountains} />
            ))}
          </div>
        </AsyncState>
      </div>
    </section>
  );
}
