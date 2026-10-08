import { useParams, Link } from 'react-router-dom';
import { Waves, Compass, MapPin, Droplets, CheckCircle2, Navigation } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import EntityImage from '../../components/ui/EntityImage';
import EntityGallery from '../../components/ui/EntityGallery';
import { PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import riverService from '../../services/riverService';

export default function RiverDetail() {
  const { slug } = useParams();
  const { data: river, loading, error, reload } = useFetch(() => riverService.get(slug), [slug]);
  const { data: relatedData } = useFetch(() => riverService.list({ limit: 4, sort: '-lengthKm' }), [slug]);
  const related = (Array.isArray(relatedData) ? relatedData : relatedData?.items || []).filter((r) => r.slug !== slug);

  const lengthMiles = river?.lengthKm ? Math.round(river.lengthKm * 0.621371).toLocaleString() : null;

  return (
    <div>
      <PageSEO
        title={river?.name ? `${river.name} (${river.lengthKm?.toLocaleString()} km) - Rivers of Pakistan` : 'River Detail'}
        description={river?.importance || river?.description || `${river?.name || 'River'} is one of Pakistan's vital waterways spanning ${river?.lengthKm} kilometers.`}
        canonical={`/rivers/${slug}`}
        image={river?.image}
        naturalFeature={
          river
            ? {
                name: river.name,
                description: river.description || river.importance,
                lengthKm: river.lengthKm,
                type: 'BodyOfWater',
              }
            : undefined
        }
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Rivers', url: '/rivers' },
          { name: river?.name || slug, url: `/rivers/${slug}` },
        ]}
      />
      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !river} onRetry={reload}>
        {river && (
          <>
            {/* Hero Section */}
            <section className="relative flex h-[55vh] min-h-[420px] items-end overflow-hidden bg-charcoal-950 text-white">
              <EntityImage
                sources={entityImageSources(river)}
                fallbackSeed={PLACEHOLDER_IDS.river}
                alt={river.name}
                width={1600}
                height={900}
                fetchPriority="high"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
              <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pb-12">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="badge bg-gold-500/20 text-gold-300 border border-gold-500/30 font-medium">
                    Indus Basin System
                  </span>
                  {river.lengthKm && (
                    <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      {river.lengthKm.toLocaleString()} km
                    </span>
                  )}
                </div>
                <h1 className="text-h1">{river.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-6 text-white/80 text-sm">
                  {river.lengthKm && (
                    <div className="flex items-center gap-1.5 font-semibold text-gold-200 text-base">
                      <Waves className="h-5 w-5 text-gold-400" />
                      <span>{river.lengthKm.toLocaleString()} km</span>
                      <span className="text-white/60 font-normal">({lengthMiles} miles)</span>
                    </div>
                  )}
                  {river.source && (
                    <div className="flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-emerald-400" />
                      <span>Origin: {river.source}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Content Body */}
            <section className="section bg-white">
              <div className="container-wide grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  {/* Overview */}
                  <div>
                    <h2 className="text-h3 mb-3">Hydrological Overview</h2>
                    <p className="text-body-lg text-charcoal-700 leading-relaxed">
                      {river.description ||
                        `${river.name} is one of the pivotal waterways of Pakistan, playing an essential role in the country's hydrology, ecology, and agrarian prosperity. Stretching over ${river.lengthKm ? `${river.lengthKm.toLocaleString()} kilometers` : 'its extensive course'}, it feeds life into the surrounding valleys and plains.`}
                    </p>
                  </div>

                  {/* Course & Route */}
                  <div>
                    <h2 className="text-h3 mb-3">Course & Geographic Flow</h2>
                    <p className="text-body-lg text-charcoal-700 leading-relaxed">
                      {river.route ||
                        (river.source
                          ? `Originating at ${river.source}, ${river.name} winds across northern mountain gorges before descending into the fertile plains of Pakistan, nourishing agricultural basins along its path.`
                          : `${river.name} follows a historic geographical pathway through Pakistan, sustaining local communities, irrigation canals, and natural wetlands.`)}
                    </p>
                  </div>

                  {/* Importance */}
                  <div>
                    <h2 className="text-h3 mb-3">Agricultural & Economic Importance</h2>
                    <p className="text-body-lg text-charcoal-700 leading-relaxed">
                      {river.importance ||
                        `${river.name} forms a crucial component of Pakistan's extensive contiguous canal irrigation network, supporting crop production, drinking water supplies, and hydroelectric power generation.`}
                    </p>
                  </div>

                  {/* Tributaries */}
                  {Array.isArray(river.tributaries) && river.tributaries.length > 0 && (
                    <div>
                      <h2 className="text-h3 mb-3">Key Tributaries & Confluences</h2>
                      <div className="flex flex-wrap gap-2.5">
                        {river.tributaries.map((trib, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            <Droplets className="h-3.5 w-3.5 text-emerald-600" />
                            {trib}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Facts */}
                  {Array.isArray(river.facts) && river.facts.length > 0 && (
                    <div>
                      <h2 className="text-h3 mb-3">Key Hydrological Facts</h2>
                      <div className="space-y-3">
                        {river.facts.map((fact, i) => (
                          <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-charcoal-100 bg-white">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-body text-charcoal-700 text-sm">{fact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photo Gallery */}
                  <EntityGallery images={river.gallery} alt={river.name} placeholderSeed={PLACEHOLDER_IDS.river} heading="River Gallery" />
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                  <Card>
                    <h3 className="text-h4 mb-4 flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-emerald-600" /> River Profile
                    </h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">Total Length</dt>
                        <dd className="font-semibold text-charcoal-900">{river.lengthKm ? `${river.lengthKm.toLocaleString()} km (${lengthMiles} mi)` : '—'}</dd>
                      </div>
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">Source Origin</dt>
                        <dd className="font-semibold text-right text-charcoal-900 max-w-[180px]">{river.source || '—'}</dd>
                      </div>
                      {Array.isArray(river.regions) && river.regions.length > 0 && (
                        <div className="flex justify-between border-b border-charcoal-100 pb-2">
                          <dt className="text-charcoal-500">Regions</dt>
                          <dd className="font-semibold text-right text-charcoal-900 max-w-[180px]">{river.regions.join(', ')}</dd>
                        </div>
                      )}
                      <div className="flex justify-between pt-1">
                        <dt className="text-charcoal-500">Basin</dt>
                        <dd className="font-semibold text-emerald-700">Indus River Basin</dd>
                      </div>
                    </dl>
                  </Card>

                  <AskAIPrompt entityName={river.name} suggestedQuestion={`What is the historical and economic importance of ${river.name}?`} />

                  {/* Related Rivers */}
                  {related.length > 0 && (
                    <div>
                      <h3 className="text-h4 mb-3">Other Major Rivers</h3>
                      <div className="space-y-3">
                        {related.slice(0, 3).map((r) => (
                          <Link
                            key={r._id || r.slug}
                            to={`/rivers/${r.slug}`}
                            className="group flex items-center gap-3 p-3 rounded-xl border border-charcoal-100 bg-white hover:border-emerald-300 hover:shadow-soft transition-all"
                          >
                            <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-charcoal-100">
                              <EntityImage sources={entityImageSources(r)} fallbackSeed={PLACEHOLDER_IDS.river} alt={r.name} width={120} height={120} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-charcoal-900 text-sm group-hover:text-emerald-700 transition-colors truncate">{r.name}</h4>
                              <p className="text-xs text-charcoal-500 mt-0.5">{r.lengthKm?.toLocaleString()} km</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </section>
          </>
        )}
      </AsyncState>
    </div>
  );
}
