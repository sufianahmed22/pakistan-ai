import { useParams, Link } from 'react-router-dom';
import { BookOpen, User, Calendar, Tag, ArrowLeft, Clock, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import EntityImage from '../../components/ui/EntityImage';
import EntityGallery from '../../components/ui/EntityGallery';
import { PLACEHOLDER_IDS, entityImageSources } from '../../utils/placeholderImage';
import articleService from '../../services/articleService';
import { formatDate } from '../../utils/format';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const { data: article, loading, error, reload } = useFetch(() => articleService.get(slug), [slug]);
  const { data: relatedData } = useFetch(
    () => articleService.list({ category: article?.category, limit: 4, published: true }),
    [slug, article?.category]
  );
  const related = (Array.isArray(relatedData) ? relatedData : relatedData?.items || []).filter(
    (a) => a.slug !== slug && a.published !== false
  );

  // Compute estimated reading time
  const wordCount = article?.content ? article.content.split(/\s+/).filter(Boolean).length : 0;
  const readTimeMin = Math.max(1, Math.round(wordCount / 200));

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageSEO
        title={article?.title ? `${article.title} — Pakistan AI Encyclopedia` : 'Article Detail'}
        description={article?.summary || (article?.content ? article.content.slice(0, 160) : 'Explore articles on Pakistani culture, history, and traditions.')}
        canonical={`/articles/${slug}`}
        image={article?.image}
        type="article"
        article={
          article
            ? {
                title: article.title,
                description: article.summary,
                author: article.author || 'Pakistan AI Team',
                datePublished: article.createdAt,
                dateModified: article.updatedAt,
              }
            : undefined
        }
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: article?.category === 'culture' ? 'Culture' : 'Articles', url: article?.category === 'culture' ? '/culture' : '/articles' },
          { name: article?.title || slug, url: `/articles/${slug}` },
        ]}
      />
      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !article} onRetry={reload}>
        {article && (
          <>
            {/* Header Hero */}
            <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden bg-charcoal-950 text-white">
              <EntityImage
                sources={entityImageSources(article)}
                fallbackSeed={PLACEHOLDER_IDS.culture}
                alt={article.title}
                width={1600}
                height={900}
                fetchPriority="high"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-transparent" />
              <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pb-12">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Link
                    to="/culture"
                    className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors mr-2"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Culture
                  </Link>
                  {article.category && (
                    <span className="badge bg-gold-500/20 text-gold-300 border border-gold-500/30 capitalize font-medium">
                      {article.category}
                    </span>
                  )}
                  {article.year && (
                    <span className="badge bg-white/10 text-white/90 border border-white/20">
                      {article.year}
                    </span>
                  )}
                </div>
                <h1 className="text-h1 max-w-4xl text-balance">{article.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-6 text-white/80 text-sm">
                  {article.author && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-emerald-400" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span>{readTimeMin} min read ({wordCount} words)</span>
                  </div>
                  {article.publishedAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Article Content */}
            <section className="section bg-white">
              <div className="container-wide grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  {/* Summary Callout */}
                  {article.summary && (
                    <div className="rounded-2xl border-l-4 border-emerald-600 bg-emerald-50/60 p-6 text-emerald-950 font-serif text-lg italic leading-relaxed shadow-sm">
                      {article.summary}
                    </div>
                  )}

                  {/* Main Article Body */}
                  <div className="prose prose-lg text-charcoal-800 leading-relaxed max-w-none space-y-6">
                    {article.content ? (
                      article.content
                        .split(/\n\n+/)
                        .filter(Boolean)
                        .map((paragraph, idx) => {
                          // Handle markdown headings if present
                          if (paragraph.startsWith('### ')) {
                            return (
                              <h3 key={idx} className="text-h4 text-charcoal-900 mt-6 mb-2">
                                {paragraph.replace(/^###\s+/, '')}
                              </h3>
                            );
                          }
                          if (paragraph.startsWith('## ')) {
                            return (
                              <h2 key={idx} className="text-h3 text-charcoal-900 mt-8 mb-3">
                                {paragraph.replace(/^##\s+/, '')}
                              </h2>
                            );
                          }
                          return (
                            <p key={idx} className="text-body-lg text-charcoal-700 leading-relaxed">
                              {paragraph}
                            </p>
                          );
                        })
                    ) : (
                      <p className="text-body-lg text-charcoal-600">Article content is being prepared.</p>
                    )}
                  </div>

                  {/* Tags */}
                  {Array.isArray(article.tags) && article.tags.length > 0 && (
                    <div className="pt-6 border-t border-charcoal-100 flex flex-wrap items-center gap-2">
                      <Tag className="h-4 w-4 text-charcoal-400 mr-1" />
                      {article.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-charcoal-100 text-charcoal-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Gallery */}
                  <EntityGallery images={article.gallery} alt={article.title} placeholderSeed={PLACEHOLDER_IDS.culture} heading="Article Visuals" />
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                  <Card>
                    <h3 className="text-h4 mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-emerald-600" /> Article Overview
                    </h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">Category</dt>
                        <dd className="font-semibold text-charcoal-900 capitalize">{article.category || 'General'}</dd>
                      </div>
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">Author</dt>
                        <dd className="font-semibold text-charcoal-900">{article.author || 'Pakistan AI Team'}</dd>
                      </div>
                      <div className="flex justify-between border-b border-charcoal-100 pb-2">
                        <dt className="text-charcoal-500">Reading Time</dt>
                        <dd className="font-semibold text-charcoal-900">{readTimeMin} min</dd>
                      </div>
                      <div className="flex justify-between pt-1">
                        <dt className="text-charcoal-500">Published</dt>
                        <dd className="font-semibold text-charcoal-900">{formatDate(article.publishedAt || article.createdAt)}</dd>
                      </div>
                    </dl>
                    <button
                      onClick={handleCopyLink}
                      className="mt-5 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-charcoal-200 text-charcoal-700 text-sm font-medium hover:bg-charcoal-50 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                      <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
                    </button>
                  </Card>

                  <AskAIPrompt entityName={article.title} suggestedQuestion={`Can you tell me more about ${article.title}?`} />

                  {/* Related Articles */}
                  {related.length > 0 && (
                    <div>
                      <h3 className="text-h4 mb-3">Related Articles</h3>
                      <div className="space-y-3">
                        {related.slice(0, 3).map((a) => (
                          <Link
                            key={a._id || a.slug}
                            to={`/articles/${a.slug}`}
                            className="group flex items-center gap-3 p-3 rounded-xl border border-charcoal-100 bg-white hover:border-emerald-300 hover:shadow-soft transition-all"
                          >
                            <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-charcoal-100">
                              <EntityImage sources={entityImageSources(a)} fallbackSeed={PLACEHOLDER_IDS.culture} alt={a.title} width={120} height={120} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-charcoal-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">{a.title}</h4>
                              <p className="text-xs text-charcoal-500 mt-0.5 line-clamp-1">{a.summary || a.category}</p>
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
