import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import SectionHeading from '../../components/ui/SectionHeading';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import EntityImage from '../../components/ui/EntityImage';
import { useFetch } from '../../hooks/useFetch';
import { placeholderImage, PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import articleService from '../../services/articleService';

export default function Culture() {
  const { data, loading, error, reload } = useFetch(() => articleService.list({ category: 'culture', limit: 12, published: true }), []);
  const articles = (Array.isArray(data) ? data : data?.items || []).filter((a) => a.published !== false);

  return (
    <div>
      <PageSEO
        title="Culture of Pakistan — Arts, Languages & Heritage"
        description="Explore the languages, festivals, music, truck art, and living traditions that shape Pakistani culture."
        canonical="/culture"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Culture', url: '/culture' },
        ]}
      />
      <section className="relative flex h-[45vh] min-h-[340px] items-end overflow-hidden bg-charcoal-950 text-white">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.culture, 1600, 900)}
          alt="Traditional Pakistani cultural celebration"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pb-12">
          <p className="text-eyebrow !text-gold-300 mb-2">Culture</p>
          <h1 className="text-h1">A mosaic of languages and traditions</h1>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-wide">
          <SectionHeading eyebrow="Culture" title="Living traditions" />
          <AsyncState loading={loading} error={error} isEmpty={!loading && !error && articles.length === 0} onRetry={reload} emptyProps={{ title: 'Culture articles coming soon' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <Link
                  key={a._id || a.slug}
                  to={`/articles/${a.slug}`}
                  className="group block card overflow-hidden p-0 hover:shadow-card-hover transition-all duration-300 border border-charcoal-100 bg-white"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-charcoal-900">
                    <EntityImage
                      sources={entityImageSources(a)}
                      fallbackSeed={PLACEHOLDER_IDS.culture}
                      alt={a.title}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                    {a.category && (
                      <span className="absolute left-3 top-3 badge bg-white/90 text-charcoal-900 font-semibold capitalize shadow-sm">
                        {a.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-h4 !text-lg group-hover:text-emerald-700 transition-colors line-clamp-2">{a.title}</h3>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-charcoal-300 group-hover:text-emerald-700 transition-colors" />
                    </div>
                    <p className="text-body text-sm line-clamp-3 text-charcoal-600">
                      {a.summary || a.excerpt || (a.content ? a.content.slice(0, 160) + '...' : '')}
                    </p>
                    <div className="pt-2 text-xs font-semibold text-emerald-700 group-hover:underline flex items-center gap-1">
                      Read full article &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AsyncState>
        </div>
      </section>
      <section className="section bg-charcoal-50/50">
        <div className="container-narrow">
          <AskAIPrompt entityName="Pakistani culture" suggestedQuestion="What is Pakistan famous for?" />
        </div>
      </section>
    </div>
  );
}
