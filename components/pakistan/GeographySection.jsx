import SectionHeading from '../ui/SectionHeading';
import AsyncState from '../ui/AsyncState';
import { MountainElevationChart, RiverSystemChart } from '../charts';
import { useFetch } from '../../hooks/useFetch';
import statisticsService from '../../services/statisticsService';

export default function GeographySection() {
  const mountains = useFetch(() => statisticsService.mountains(), []);
  const rivers = useFetch(() => statisticsService.rivers(), []);

  return (
    <section className="section bg-white">
      <div className="container-wide">
        <SectionHeading eyebrow="Geography" title="Mountains, rivers, and everything between" subtitle="Home to five of the world's fourteen 8,000m peaks and the mighty Indus river system." />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AsyncState loading={mountains.loading} error={mountains.error} isEmpty={!mountains.loading && !mountains.data?.length} onRetry={mountains.reload} emptyProps={{ title: 'Mountain data unavailable' }}>
            <MountainElevationChart data={mountains.data || []} />
          </AsyncState>
          <AsyncState loading={rivers.loading} error={rivers.error} isEmpty={!rivers.loading && !(rivers.data?.nodes?.length)} onRetry={rivers.reload} emptyProps={{ title: 'River data unavailable' }}>
            <RiverSystemChart data={rivers.data} />
          </AsyncState>
        </div>
      </div>
    </section>
  );
}
