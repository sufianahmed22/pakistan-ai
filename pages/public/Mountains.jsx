import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import SectionHeading from '../../components/ui/SectionHeading';
import AsyncState from '../../components/ui/AsyncState';
import { MountainElevationChart } from '../../components/charts';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import EntityImage from '../../components/ui/EntityImage';
import { useFetch } from '../../hooks/useFetch';
import { placeholderImage, PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import statisticsService from '../../services/statisticsService';
import mountainService from '../../services/mountainService';

export default function Mountains() {
  const { data, loading, error, reload } = useFetch(() => statisticsService.mountains(), []);
  const { data: mountainsData } = useFetch(() => mountainService.list({ limit: 12, sort: '-elevationMeters' }), []);
  const mountains = Array.isArray(mountainsData) ? mountainsData : mountainsData?.items || [];

  return (
    <div>
      <PageSEO
        title="Mountains of Pakistan — Peaks & Ranges"
        description="Pakistan is home to K2 and five of the world's fourteen 8,000-metre peaks across the Karakoram, Himalaya, and Hindu Kush."
        canonical="/mountains"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Mountains', url: '/mountains' },
        ]}
      />
      <section className="relative flex h-[45vh] min-h-[340px] items-end overflow-hidden bg-charcoal-950 text-white">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.mountains, 1600, 900)}
          alt="Snow-capped peaks in the Karakoram range"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pb-12">
          <p className="text-eyebrow !text-gold-300 mb-2">Geography</p>
          <h1 className="text-h1">Mountains of Pakistan</h1>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-wide">
          <SectionHeading eyebrow="Peaks" title="The roof of the world" subtitle="Pakistan's Karakoram, Himalaya, and Hindu Kush ranges hold some of the planet's highest summits." />
          <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !data?.length} onRetry={reload} emptyProps={{ title: 'Mountain data unavailable' }}>
            <MountainElevationChart data={data || []} height={480} />
          </AsyncState>
        </div>
      </section>
      {mountains.length > 0 && (
        <section className="section bg-charcoal-50/50">
          <div className="container-wide">
            <SectionHeading eyebrow="Peaks" title="Notable mountains" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mountains.map((m) => (
                <Link
                  key={m._id || m.slug}
                  to={`/mountains/${m.slug}`}
                  className="group block card overflow-hidden p-0 hover:shadow-card-hover transition-all duration-300 border border-charcoal-100 bg-white"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-charcoal-900">
                    <EntityImage
                      sources={entityImageSources(m)}
                      fallbackSeed={PLACEHOLDER_IDS.mountains}
                      alt={m.name}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                    {m.elevationMeters && (
                      <span className="absolute left-3 top-3 badge bg-white/90 text-charcoal-900 font-semibold shadow-sm">
                        {m.elevationMeters.toLocaleString()} m
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-h4 !text-lg group-hover:text-emerald-700 transition-colors">{m.name}</h3>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-charcoal-300 group-hover:text-emerald-700 transition-colors" />
                    </div>
                    <p className="text-body text-sm text-charcoal-500">
                      {m.range ? `${m.range} Range` : ''}{m.region ? ` · ${m.region}` : ''}
                    </p>
                    {m.firstAscent && (
                      <p className="text-caption text-charcoal-400 line-clamp-1">
                        First ascent: {m.firstAscent}
                      </p>
                    )}
                    <div className="pt-2 text-xs font-semibold text-emerald-700 group-hover:underline flex items-center gap-1">
                      Explore mountain details &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section bg-white">
        <div className="container-narrow">
          <AskAIPrompt entityName="Pakistan's mountains" suggestedQuestion="What is the highest mountain in Pakistan?" />
        </div>
      </section>
    </div>
  );
}
