import { useSearchParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Tabs from '../../components/kokonut/Tabs';
import AsyncState from '../../components/ui/AsyncState';
import { PopulationChart, ProvincePopulationChart, MountainElevationChart, RiverSystemChart, GDPChart, ScatterDemographicsChart } from '../../components/charts';
import { useFetch } from '../../hooks/useFetch';
import statisticsService from '../../services/statisticsService';

const TABS = [
  { value: 'population', label: 'Population' },
  { value: 'geography', label: 'Geography' },
  { value: 'economy', label: 'Economy' },
  { value: 'demographics', label: 'Demographics' },
];

export default function AdminStatistics() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'population';

  const pop = useFetch(() => statisticsService.population(), []);
  const provinces = useFetch(() => statisticsService.provinces(), []);
  const rivers = useFetch(() => statisticsService.rivers(), []);
  const mountains = useFetch(() => statisticsService.mountains(), []);
  const economy = useFetch(() => statisticsService.economy(), []);
  const demographics = useFetch(() => statisticsService.demographics(), []);

  return (
    <div>
      <AdminPageHeader title="Statistics" description="Source data behind the public Statistics & Geography pages." />
      <Tabs tabs={TABS} value={tab} defaultTab={tab} onChange={(v) => setParams({ tab: v })} className="mb-6" />

      {tab === 'population' && (
        <AsyncState loading={pop.loading} error={pop.error} isEmpty={!pop.loading && !pop.data?.length} onRetry={pop.reload}>
          <PopulationChart data={pop.data || []} />
        </AsyncState>
      )}
      {tab === 'geography' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AsyncState loading={mountains.loading} error={mountains.error} isEmpty={!mountains.loading && !mountains.data?.length} onRetry={mountains.reload}>
            <MountainElevationChart data={mountains.data || []} />
          </AsyncState>
          <AsyncState loading={rivers.loading} error={rivers.error} isEmpty={!rivers.loading && !(rivers.data?.nodes?.length)} onRetry={rivers.reload}>
            <RiverSystemChart data={rivers.data} />
          </AsyncState>
          <AsyncState loading={provinces.loading} error={provinces.error} isEmpty={!provinces.loading && !provinces.data?.length} onRetry={provinces.reload}>
            <ProvincePopulationChart data={provinces.data || []} />
          </AsyncState>
        </div>
      )}
      {tab === 'economy' && (
        <AsyncState loading={economy.loading} error={economy.error} isEmpty={!economy.loading && !economy.data?.length} onRetry={economy.reload}>
          <GDPChart data={economy.data || []} />
        </AsyncState>
      )}
      {tab === 'demographics' && (
        <AsyncState loading={demographics.loading} error={demographics.error} isEmpty={!demographics.loading && !demographics.data?.length} onRetry={demographics.reload}>
          <ScatterDemographicsChart data={demographics.data || []} xLabel="Age" yLabel="Share (%)" />
        </AsyncState>
      )}
    </div>
  );
}
