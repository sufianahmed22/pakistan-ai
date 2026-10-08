import { useParams, Link } from 'react-router-dom';
import { Mountain as MountainIcon, Compass, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import EntityImage from '../../components/ui/EntityImage';
import EntityGallery from '../../components/ui/EntityGallery';
import { PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import mountainService from '../../services/mountainService';

const EIGHT_THOUSANDERS_RANK = {
  k2: '2nd Highest in the World',
  'nanga-parbat': '9th Highest in the World',
  'gasherbrum-i': '11th Highest in the World',
  'broad-peak': '12th Highest in the World',
  'gasherbrum-ii': '13th Highest in the World',
};

export default function MountainDetail() {
  const { slug } = useParams();
  const { data: mountain, loading, error, reload } = useFetch(() => mountainService.get(slug), [slug]);
  const { data: relatedData } = useFetch(() => mountainService.list({ limit: 4, sort: '-elevationMeters' }), [slug]);
  const related = (Array.isArray(relatedData) ? relatedData : relatedData?.items || []).filter((m) => m.slug !== slug);

  const elevationFeet = mountain?.elevationMeters ? Math.round(mountain.elevationMeters * 3.28084).toLocaleString() : null;
  const worldRank = mountain ? EIGHT_THOUSANDERS_RANK[mountain.slug] : null;

  return (
    <div>
      <PageSEO
        title={mountain?.name ? `${mountain.name} (${mountain.elevationMeters?.toLocaleString()}m) - Peak & Climbing Guide` : 'Mountain Peak'}
        description={mountain?.description || `${mountain?.name || 'Mountain'} rises to an elevation of ${mountain?.elevationMeters} meters in the ${mountain?.range} range of Pakistan.`}
        canonical={`/mountains/${slug}`}
        image={mountain?.image}
        naturalFeature={
          mountain
            ? {
                name: mountain.name,
                description: mountain.description,
                elevationMeters: mountain.elevationMeters,
                type: 'NaturalFeature',
              }
            : undefined
        }
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Mountains', url: '/mountains' },
          { name: mountain?.name || slug, url: `/mountains/${slug}` },
        ]}
      />
      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !mountain} onRetry={reload}>
        {mountain && (
          <>
            {/* Hero Section */}
            <section className="relative flex h-[55vh] min-h-[420px] items-end overflow-hidden bg-charcoal-950 text-white">
              <EntityImage
                sources={entityImageSources(mountain)}
                fallbackSeed={PLACEHOLDER_IDS.mountains}
                alt={mountain.name}
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
                    {mountain.range ? `${mountain.range} Range` : 'Mountain Peak'}
                  </span>
                  {worldRank && (
                    <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      {worldRank}
                    </span>
                  )}
                  {mountain.region && (
                    <span className="badge bg-white/10 text-white/90 border border-white/20">
                      {mountain.region}
                    </span>
                  )}
                </div>
                <h1 className="text-h1">{mountain.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-6 text-white/80 text-sm">
                  {mountain.elevationMeters && (
                    <div className="flex items-center gap-1.5 font-semibold text-gold-200 text-base">
                      <MountainIcon className="h-5 w-5 text-gold-400" />
                      <span>{mountain.elevationMeters.toLocaleString()} m</span>
                      <span className="text-white/60 font-normal">({elevationFeet} ft)</span>
                    </div>
                  )}
                  {mountain.firstAscent && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                      <span>First Ascent: {mountain.firstAscent}</span>
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
                    <h2 className="text-h3 mb-3">Topography & Stature</h2>
                    <p className="text-body-lg text-charcoal-700 leading-relaxed">
                      {mountain.description ||
                        `${mountain.name} is one of the crowning peaks of Pakistan, standing majestically at ${mountain.elevationMeters?.toLocaleString()} meters in the ${mountain.range || 'northern'} range. Renowned worldwide for its formidable terrain and breathtaking scale, it commands the attention of alpine explorers across the globe.`}
                    </p>
                  </div>

                  {/* History & First Ascent */}
                  <div>
                    <h2 className="text-h3 mb-3">Climbing History & Milestones</h2>
                    <p className="text-body-lg text-charcoal-700 leading-relaxed">
                      {mountain.history ||
                        (mountain.firstAscent
                          ? `The summit of ${mountain.name} was famously first achieved in ${mountain.firstAscent}. The mountain continues to be an iconic testing ground for world-class mountaineering expeditions, demanding exceptional technical skill and endurance.`
                          : `The climbing chronicles of ${mountain.name} reflect decades of human grit, alpine triumphs, and expeditions navigating intense high-altitude weather and complex crevassed glaciers.`)}
                    </p>
                  </div>

                  {/* Climbing Routes */}
                  {Array.isArray(mountain.climbingRoutes) && mountain.climbingRoutes.length > 0 && (
                    <div>
                      <h2 className="text-h3 mb-3">Notable Climbing Routes</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mountain.climbingRoutes.map((route, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-charcoal-100 bg-charcoal-50/50">
                            <Compass className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-charcoal-900">{route}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Facts */}
                  {Array.isArray(mountain.facts) && mountain.facts.length > 0 && (
                    <div>
                      <h2 className="text-h3 mb-3">Key Mountain Facts</h2>
                      <div className="space-y-3">
                        {mountain.facts.map((fact, i) => (
                          <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-charcoal-100 bg-white">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-body text-charcoal-700 text-sm">{fact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photo Gallery */}
                  <EntityGallery images={mountain.gallery} alt={mountain.name} placeholderSeed={PLACEHOLDER_IDS.mountains} heading="Expedition Gallery" />
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                  <Card>
                    <h3 className="text-h4 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-emerald-600" /> Peak Summary
                    </h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">Elevation</dt>
                        <dd className="font-semibold text-charcoal-900">{mountain.elevationMeters ? `${mountain.elevationMeters.toLocaleString()} m (${elevationFeet} ft)` : '—'}</dd>
                      </div>
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">Range</dt>
                        <dd className="font-semibold text-charcoal-900">{mountain.range || '—'}</dd>
                      </div>
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">Region</dt>
                        <dd className="font-semibold text-charcoal-900">{mountain.region || '—'}</dd>
                      </div>
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">First Ascent</dt>
                        <dd className="font-semibold text-right text-charcoal-900 max-w-[180px]">{mountain.firstAscent || '—'}</dd>
                      </div>
                      {worldRank && (
                        <div className="flex justify-between pt-1">
                          <dt className="text-charcoal-500">Status</dt>
                          <dd className="font-semibold text-emerald-700">{worldRank}</dd>
                        </div>
                      )}
                    </dl>
                  </Card>

                  <AskAIPrompt entityName={mountain.name} suggestedQuestion={`What makes ${mountain.name} famous and difficult to climb?`} />

                  {/* Related Peaks */}
                  {related.length > 0 && (
                    <div>
                      <h3 className="text-h4 mb-3">Other Iconic Peaks</h3>
                      <div className="space-y-3">
                        {related.slice(0, 3).map((m) => (
                          <Link
                            key={m._id || m.slug}
                            to={`/mountains/${m.slug}`}
                            className="group flex items-center gap-3 p-3 rounded-xl border border-charcoal-100 bg-white hover:border-emerald-300 hover:shadow-soft transition-all"
                          >
                            <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-charcoal-100">
                              <EntityImage sources={entityImageSources(m)} fallbackSeed={PLACEHOLDER_IDS.mountains} alt={m.name} width={120} height={120} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-charcoal-900 text-sm group-hover:text-emerald-700 transition-colors truncate">{m.name}</h4>
                              <p className="text-xs text-charcoal-500 mt-0.5">{m.elevationMeters?.toLocaleString()} m · {m.range || 'Peak'}</p>
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
