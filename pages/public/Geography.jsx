import PageSEO from '../../components/layout/PageSEO';
import SectionHeading from '../../components/ui/SectionHeading';
import AsyncState from '../../components/ui/AsyncState';
import { MountainElevationChart, RiverSystemChart } from '../../components/charts';
import PakistanMap from '../../components/maps/PakistanMap';
import { useFetch } from '../../hooks/useFetch';
import statisticsService from '../../services/statisticsService';
import RecentEarthquakesCard from '../../components/widgets/RecentEarthquakesCard';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function Geography() {
  const mountains = useFetch(() => statisticsService.mountains(), []);
  const rivers = useFetch(() => statisticsService.rivers(), []);

  return (
    <div>
      <PageSEO
        title="Geography of Pakistan"
        description="Pakistan's geography — mountain ranges, river systems, plains, plateaus and coastline."
        canonical="/geography"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Geography', url: '/geography' },
        ]}
      />
      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-charcoal-950 text-white pb-14 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.mountains, 1920, 1080)}
          alt="Pakistan's diverse geographic terrain and mountain ranges"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <p className="text-eyebrow !text-gold-300 mb-2">Geography</p>
          <h1 className="text-h1">From the world's second-highest peak to the Arabian Sea</h1>
          <p className="text-body-lg mt-3 text-white/80 max-w-2xl mx-auto">
            Discover Pakistan's extraordinary terrain—from the towering Karakoram, Himalaya, and Hindu Kush ranges to fertile plains, rugged plateaus, and coastal shores.
          </p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-wide">
          <SectionHeading eyebrow="Regions" title="A schematic overview" />
          <PakistanMap />
        </div>
      </section>
      <section className="section bg-charcoal-50/50">
        <div className="container-wide grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AsyncState loading={mountains.loading} error={mountains.error} isEmpty={!mountains.loading && !mountains.data?.length} onRetry={mountains.reload} emptyProps={{ title: 'Mountain data unavailable' }}>
            <MountainElevationChart data={mountains.data || []} />
          </AsyncState>
          <AsyncState loading={rivers.loading} error={rivers.error} isEmpty={!rivers.loading && !(rivers.data?.nodes?.length)} onRetry={rivers.reload} emptyProps={{ title: 'River data unavailable' }}>
            <RiverSystemChart data={rivers.data} />
          </AsyncState>
        </div>
      </section>
      <RecentEarthquakesCard />
    </div>
  );
}
