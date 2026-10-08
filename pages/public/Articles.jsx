import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Search, ArrowRight, Sparkles, Filter } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import SectionHeading from '../../components/ui/SectionHeading';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import { Card } from '../../components/kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';
import articleService from '../../services/articleService';
import { cn } from '../../utils/cn';

const CATEGORIES = ['All', 'Culture', 'History', 'Tourism', 'Geography', 'Cuisine', 'General'];

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { data, loading, error, reload } = useFetch(
    () => articleService.list({ limit: 50, published: true }),
    []
  );

  const articles = Array.isArray(data) ? data : data?.items || [];

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      // Exclude draft articles from the public listing
      if (a.published === false) return false;

      const matchCat =
        selectedCategory === 'All' ||
        a.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !search.trim() ||
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.summary?.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, search]);

  return (
    <div>
      <PageSEO
        title="Articles, Guides & Stories — Pakistan AI Encyclopedia"
        description="Explore in-depth articles, travel chronicles, cultural essays, and historical accounts celebrating Pakistan."
        canonical="/articles"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Articles', url: '/articles' },
        ]}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-[380px] items-end overflow-hidden bg-charcoal-950 text-white pb-12 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.articles || PLACEHOLDER_IDS.history, 1600, 800)}
          alt="Pakistan heritage and literature"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1600}
          height={800}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-transparent" />

        <div className="container-wide relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur-sm mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Encyclopedia & Guides
            </span>
            <h1 className="text-3xl font-display font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Articles & Stories of Pakistan
            </h1>
            <p className="mt-3 text-base text-charcoal-300 sm:text-lg leading-relaxed">
              Curated essays, cultural journeys, architectural wonders, and historical chronicles from the Indus Valley to the modern nation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Filters */}
      <section className="section bg-charcoal-50/70">
        <div className="container-wide">
          {/* Controls Bar: Search & Category Filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-xs font-semibold transition-all shadow-sm',
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                      : 'border border-charcoal-200 bg-white text-charcoal-700 hover:bg-charcoal-100 hover:text-charcoal-900'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px] sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title or keyword…"
                className="w-full rounded-xl border border-charcoal-200 bg-white py-2 pl-9 pr-3 text-xs text-charcoal-900 placeholder-charcoal-400 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <AsyncState
            loading={loading}
            error={error}
            isEmpty={!loading && !error && filteredArticles.length === 0}
            onRetry={reload}
            emptyProps={{
              title: search ? 'No matching articles found' : 'No articles available yet',
              description: search
                ? `No articles match "${search}". Try searching for something else or clear filters.`
                : 'Check back soon for new stories and guides.',
            }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => {
                const words = article.content ? article.content.split(/\s+/).filter(Boolean).length : 0;
                const readMinutes = Math.max(1, Math.round(words / 200));

                return (
                  <Link
                    key={article._id || article.slug}
                    to={`/articles/${article.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-700/40 hover:shadow-lg"
                  >
                    {/* Cover Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden bg-charcoal-100">
                      <img
                        src={article.image || placeholderImage(article.slug || PLACEHOLDER_IDS.articles, 800, 480)}
                        alt={article.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-emerald-800/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
                          {article.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-3 text-xs text-charcoal-500 mb-2">
                        {article.createdAt && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.createdAt)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readMinutes} min read
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-charcoal-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {article.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-charcoal-600 line-clamp-3 flex-1">
                        {article.summary || (article.content ? article.content.replace(/<[^>]+>/g, '').slice(0, 140) + '…' : '')}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-charcoal-100 pt-3 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                        <span>Read full story</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </AsyncState>
        </div>
      </section>

      {/* Interactive AI Prompt Banner */}
      <section className="section bg-white">
        <div className="container-narrow">
          <AskAIPrompt
            entityName="Pakistan's culture & stories"
            suggestedQuestion="Can you recommend the most fascinating historical stories of Pakistan?"
          />
        </div>
      </section>
    </div>
  );
}
