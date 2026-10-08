import { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import { useFetch } from '../../hooks/useFetch';
import factService from '../../services/factService';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

function formatCategory(cat) {
  if (!cat) return 'General';
  if (cat === 'GeneralFacts') return 'General Facts';
  if (cat === 'HistoricalSites') return 'Historical Sites';
  return cat.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export default function Facts() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data, loading, error, reload } = useFetch(
    () => factService.list({ limit: 100 }),
    []
  );
  const facts = Array.isArray(data) ? data : data?.items || [];

  const categories = useMemo(() => {
    const cats = ['All'];
    const set = new Set();
    facts.forEach((f) => {
      if (f.category && f.category.trim()) {
        set.add(f.category.trim());
      }
    });
    return [...cats, ...Array.from(set)];
  }, [facts]);

  const filteredFacts = useMemo(() => {
    return facts.filter((f) => {
      const matchesCategory =
        selectedCategory === 'All' || f.category === selectedCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        f.title?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q) ||
        f.source?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [facts, selectedCategory, search]);

  return (
    <div>
      <PageSEO
        title="Fast Facts about Pakistan"
        description="Bite-sized, sourced facts about Pakistan's geography, world records, culture, and history."
        canonical="/facts"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Facts', url: '/facts' },
        ]}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-charcoal-950 text-white pb-14 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.history, 1920, 1080)}
          alt="Historic architecture and landmarks in Pakistan"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <p className="text-eyebrow !text-gold-300 mb-2">Facts & Curiosities</p>
          <h1 className="text-h1">Fast facts about Pakistan</h1>
          <p className="text-body-lg mt-3 text-white/80 max-w-2xl mx-auto">
            Bite-sized, verified facts about Pakistan's geography, rich history, cultural heritage, and world records.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-white">
        <div className="container-wide">
          {/* Controls: Search & Category summary */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search facts by keyword, topic, or source…"
                className="input-field pl-10 pr-9 py-2.5 text-sm w-full"
                aria-label="Search facts"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-charcoal-500">
              Showing <span className="font-semibold text-charcoal-900">{filteredFacts.length}</span> of{' '}
              <span className="font-semibold text-charcoal-900">{facts.length}</span> facts
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? facts.length
                    : facts.filter((f) => f.category === cat).length;
                const formattedName = formatCategory(cat);
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-charcoal-100/80 text-charcoal-700 hover:bg-charcoal-200 transition-colors'
                    }`}
                  >
                    {formattedName} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Facts Grid / Empty State */}
          <AsyncState
            loading={loading}
            error={error}
            isEmpty={!loading && !error && facts.length === 0}
            onRetry={reload}
            emptyProps={{ title: 'No facts found' }}
          >
            {filteredFacts.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-xl border border-dashed border-charcoal-200 bg-charcoal-50/50">
                <Sparkles className="mx-auto h-8 w-8 text-charcoal-400 mb-3" />
                <h3 className="text-base font-semibold text-charcoal-800">No matching facts found</h3>
                <p className="text-sm text-charcoal-500 mt-1 max-w-sm mx-auto">
                  No facts match your search {search ? `"${search}"` : ''}{' '}
                  {selectedCategory !== 'All' ? `in category "${formatCategory(selectedCategory)}"` : ''}.
                </p>
                {(search || selectedCategory !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory('All');
                    }}
                    className="btn-secondary mt-4 text-xs"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFacts.map((f) => {
                  const factCategory = formatCategory(f.category);
                  const factText = f.description || f.body || f.text || '';
                  const askPrompt = `Tell me more about this fact regarding ${factCategory} in Pakistan: "${f.title}". ${factText}`.trim();

                  return (
                    <article
                      key={f._id || f.title}
                      className="card group flex flex-col justify-between p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md border border-charcoal-100/90 hover:border-emerald-200/80 bg-white"
                    >
                      <div>
                        {/* Top category & source */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200/70">
                            <Sparkles className="h-3 w-3 text-gold-500 shrink-0" />
                            {factCategory}
                          </span>
                          {f.source && (
                            <span
                              className="text-[11px] text-charcoal-400 truncate max-w-[140px] italic"
                              title={`Source: ${f.source}`}
                            >
                              {f.source}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-charcoal-900 group-hover:text-emerald-800 transition-colors mb-2 leading-snug">
                          {f.title}
                        </h3>

                        {/* Description */}
                        <p className="text-body text-sm leading-relaxed text-charcoal-600">
                          {factText || 'No description available.'}
                        </p>
                      </div>

                      {/* Footer with Clickable Ask More */}
                      <div className="mt-5 pt-3 border-t border-charcoal-100/80 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => navigate(`/ask?q=${encodeURIComponent(askPrompt)}`)}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors group/btn cursor-pointer"
                          aria-label={`Ask more about ${f.title}`}
                        >
                          <span>Ask more</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </AsyncState>

          {/* Ask AI Prompt Teaser */}
          <div className="mt-14">
            <AskAIPrompt
              suggestedQuestion="What are some lesser-known historical and cultural facts about Pakistan?"
              entityName="Pakistan"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
