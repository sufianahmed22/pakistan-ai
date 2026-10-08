import PageSEO from '../../components/layout/PageSEO';
import SectionHeading from '../../components/ui/SectionHeading';
import AsyncState from '../../components/ui/AsyncState';
import { PopulationChart, ProvincePopulationChart, MountainElevationChart, RiverSystemChart, GDPChart, ScatterDemographicsChart } from '../../components/charts';
import { useFetch } from '../../hooks/useFetch';
import statisticsService from '../../services/statisticsService';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

function Section({ eyebrow, title, subtitle, children }) {
  return (
    <section className="section border-t border-charcoal-100">
      <div className="container-wide">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {children}
      </div>
    </section>
  );
}

export default function StatisticsPage() {
  const pop = useFetch(() => statisticsService.population(), []);
  const provinces = useFetch(() => statisticsService.provinces(), []);
  const mountains = useFetch(() => statisticsService.mountains(), []);
  const rivers = useFetch(() => statisticsService.rivers(), []);
  const economy = useFetch(() => statisticsService.economy(), []);
  const demographics = useFetch(() => statisticsService.demographics(), []);

  return (
    <div>
      <PageSEO
        title="Statistics & National Indicators"
        description="Comprehensive statistics for Pakistan — population, provinces, geography, and economy, sourced from official World Bank and PBS census data."
        canonical="/statistics"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Statistics', url: '/statistics' },
        ]}
      />
      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-charcoal-950 text-white pb-14 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.city, 1920, 1080)}
          alt="Pakistan urban cityscape and demographic data visualization"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <p className="text-eyebrow !text-gold-300 mb-2">Data & Analytics</p>
          <h1 className="text-h1">Pakistan in numbers</h1>
          <p className="text-body-lg mt-3 text-white/80 max-w-2xl mx-auto">
            Comprehensive national indicators across demographics, provincial populations, mountain elevations, river systems, and macroeconomic trends. Every figure is labeled with its source and year.
          </p>
        </div>
      </section>

      <Section eyebrow="Population" title="Population growth & distribution">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AsyncState loading={pop.loading} error={pop.error} isEmpty={!pop.loading && !pop.data?.length} onRetry={pop.reload} emptyProps={{ title: 'No data available' }}>
            <PopulationChart data={pop.data || []} />
          </AsyncState>
          <AsyncState loading={provinces.loading} error={provinces.error} isEmpty={!provinces.loading && !provinces.data?.length} onRetry={provinces.reload} emptyProps={{ title: 'No data available' }}>
            <ProvincePopulationChart data={provinces.data || []} />
          </AsyncState>
        </div>
      </Section>

      <Section eyebrow="Geography" title="Mountains & rivers">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AsyncState loading={mountains.loading} error={mountains.error} isEmpty={!mountains.loading && !mountains.data?.length} onRetry={mountains.reload} emptyProps={{ title: 'No data available' }}>
            <MountainElevationChart data={mountains.data || []} />
          </AsyncState>
          <AsyncState loading={rivers.loading} error={rivers.error} isEmpty={!rivers.loading && !(rivers.data?.nodes?.length)} onRetry={rivers.reload} emptyProps={{ title: 'No data available' }}>
            <RiverSystemChart data={rivers.data} />
          </AsyncState>
        </div>
      </Section>

      <Section eyebrow="Economy" title="GDP over time">
        <AsyncState loading={economy.loading} error={economy.error} isEmpty={!economy.loading && !economy.data?.length} onRetry={economy.reload} emptyProps={{ title: 'No data available' }}>
          <GDPChart data={economy.data || []} />
        </AsyncState>
      </Section>

      <Section eyebrow="Demographics" title="Population structure">
        <AsyncState loading={demographics.loading} error={demographics.error} isEmpty={!demographics.loading && !demographics.data?.length} onRetry={demographics.reload} emptyProps={{ title: 'No data available' }}>
          <ScatterDemographicsChart data={demographics.data || []} xLabel="Age" yLabel="Share (%)" />
        </AsyncState>
      </Section>
    </div>
  );
}
