import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import SectionHeading from '../../components/ui/SectionHeading';
import AsyncState from '../../components/ui/AsyncState';
import { RiverSystemChart } from '../../components/charts';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import EntityImage from '../../components/ui/EntityImage';
import { useFetch } from '../../hooks/useFetch';
import { placeholderImage, PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import statisticsService from '../../services/statisticsService';
import riverService from '../../services/riverService';

export default function Rivers() {
  const { data, loading, error, reload } = useFetch(() => statisticsService.rivers(), []);
  const { data: riversData } = useFetch(() => riverService.list({ limit: 12, sort: '-lengthKm' }), []);
  const rivers = Array.isArray(riversData) ? riversData : riversData?.items || [];

  return (
    <div>
      <PageSEO
        title="Rivers of Pakistan — Indus Basin System"
        description="The Indus River and its tributaries form the backbone of Pakistan's agriculture, irrigation, and civilization."
        canonical="/rivers"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Rivers', url: '/rivers' },
        ]}
      />
      <section className="relative flex h-[45vh] min-h-[340px] items-end overflow-hidden bg-charcoal-950 text-white">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.river, 1600, 900)}
          alt="The Indus River winding through a valley"
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
          <h1 className="text-h1">The Indus River system</h1>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-wide">
          <SectionHeading eyebrow="Rivers" title="The lifeline of Pakistan" subtitle="The Indus and its tributaries — Jhelum, Chenab, Ravi, Sutlej and Beas — irrigate one of the world's largest contiguous irrigation systems." />
          <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !(data?.nodes?.length)} onRetry={reload} emptyProps={{ title: 'River data unavailable' }}>
            <RiverSystemChart data={data} />
          </AsyncState>
        </div>
      </section>
      {rivers.length > 0 && (
        <section className="section bg-charcoal-50/50">
          <div className="container-wide">
            <SectionHeading eyebrow="Rivers" title="Notable rivers" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rivers.map((r) => (
                <Link
                  key={r._id || r.slug}
                  to={`/rivers/${r.slug}`}
                  className="group block card overflow-hidden p-0 hover:shadow-card-hover transition-all duration-300 border border-charcoal-100 bg-white"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-charcoal-900">
                    <EntityImage
                      sources={entityImageSources(r)}
                      fallbackSeed={PLACEHOLDER_IDS.river}
                      alt={r.name}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                    {r.lengthKm && (
                      <span className="absolute left-3 top-3 badge bg-white/90 text-charcoal-900 font-semibold shadow-sm">
                        {r.lengthKm.toLocaleString()} km
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-h4 !text-lg group-hover:text-emerald-700 transition-colors">{r.name}</h3>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-charcoal-300 group-hover:text-emerald-700 transition-colors" />
                    </div>
                    <p className="text-body text-sm text-charcoal-500 line-clamp-1">
                      {r.source ? `Source: ${r.source}` : (r.route || 'Major river basin')}
                    </p>
                    {r.importance && (
                      <p className="text-caption text-charcoal-500 line-clamp-2">
                        {r.importance}
                      </p>
                    )}
                    <div className="pt-2 text-xs font-semibold text-emerald-700 group-hover:underline flex items-center gap-1">
                      Explore river system &rarr;
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
          <AskAIPrompt entityName="Pakistan's rivers" suggestedQuestion="What is the major river of Pakistan?" />
        </div>
      </section>
    </div>
  );
}
