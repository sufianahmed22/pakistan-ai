import SectionHeading from '../ui/SectionHeading';
import AsyncState from '../ui/AsyncState';
import { PopulationChart, ProvincePopulationChart } from '../charts';
import { useFetch } from '../../hooks/useFetch';
import statisticsService from '../../services/statisticsService';

export default function PopulationSection() {
  const pop = useFetch(() => statisticsService.population(), []);
  const provinces = useFetch(() => statisticsService.provinces(), []);

  return (
    <section className="section bg-charcoal-50/50">
      <div className="container-wide">
        <SectionHeading eyebrow="Data & Statistics" title="Pakistan's population, visualized" subtitle="Live figures pulled directly from our statistics API — always labeled with their year and source." />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AsyncState loading={pop.loading} error={pop.error} isEmpty={!pop.loading && !pop.data?.length} onRetry={pop.reload} emptyProps={{ title: 'Population data unavailable' }}>
            <PopulationChart data={pop.data || []} />
          </AsyncState>
          <AsyncState loading={provinces.loading} error={provinces.error} isEmpty={!provinces.loading && !provinces.data?.length} onRetry={provinces.reload} emptyProps={{ title: 'Provincial data unavailable' }}>
            <ProvincePopulationChart data={provinces.data || []} />
          </AsyncState>
        </div>
      </div>
    </section>
  );
}
