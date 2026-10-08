import { useState, useMemo, useRef } from 'react';
import {
  Search,
  Calendar,
  Sparkles,
  LayoutGrid,
  GalleryHorizontal,
  GitCommit,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  X,
} from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import SectionHeading from '../../components/ui/SectionHeading';
import AsyncState from '../../components/ui/AsyncState';
import AskAIPrompt from '../../components/chatbot/AskAIPrompt';
import MilestoneCard from '../../components/history/MilestoneCard';
import MilestoneCarousel from '../../components/history/MilestoneCarousel';
import MilestoneDetailModal from '../../components/history/MilestoneDetailModal';
import CompactTimeline from '../../components/history/CompactTimeline';
import { useFetch } from '../../hooks/useFetch';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';
import historyService from '../../services/historyService';
import { cn } from '../../utils/cn';

// Comprehensive Era metadata definition
const ERAS_CONFIG = [
  {
    id: 'all',
    label: 'All Milestones',
    tag: 'Complete Archive',
    title: 'Complete Historical Chronology (Ancient to 2025)',
    years: '3300 BCE – 2025 CE',
    summary:
      'A comprehensive journey traversing five thousand years of heritage, sovereignty, resilience, and modern development.',
  },
  {
    id: '1940s-1950s',
    label: '1947–1959',
    tag: 'Founding Era',
    title: 'Independence & Birth of the Republic',
    years: '1947 – 1959',
    summary:
      'The heroic dawn of sovereign Pakistan under Quaid-e-Azam Muhammad Ali Jinnah, the historic resettlement, Objectives Resolution, and the first Constitution of 1956.',
  },
  {
    id: '1960s',
    label: '1960s',
    tag: 'Decade of Growth',
    title: 'Infrastructure, Dams & National Defence',
    years: '1960 – 1969',
    summary:
      'Signing of the landmark Indus Waters Treaty, construction of Tarbela and Mangla dams, the September 1965 Defence, and the founding of Islamabad as the new federal capital.',
  },
  {
    id: '1970s',
    label: '1970s',
    tag: 'Constitutional Era',
    title: 'Democratic Elections, Constitution & Diplomacy',
    years: '1970 – 1979',
    summary:
      'First direct adult-franchise general elections, unanimous enactment of the historic 1973 Constitution, Lahore OIC Islamic Summit, and founding of the strategic nuclear deterrence program.',
  },
  {
    id: '1980s',
    label: '1980s',
    tag: 'Frontiers & Sports',
    title: 'Engineering Wonders, High Frontiers & Sports Glory',
    years: '1980 – 1989',
    summary:
      'Inauguration of the 1,300-km Karakoram Highway, Jahangir Khan’s invincible 555-match squash streak, and election of Benazir Bhutto as the Muslim world’s first female prime minister.',
  },
  {
    id: '1990s',
    label: '1990s',
    tag: 'Triumph & Deterrence',
    title: 'World Cup Victory, Motorways & Youm-e-Takbeer',
    years: '1990 – 1999',
    summary:
      'The historic 1992 Cricket World Cup triumph at Melbourne, inauguration of South Asia’s first high-speed motorway (M-2), and the May 1998 nuclear tests establishing strategic parity.',
  },
  {
    id: '2000s',
    label: '2000s',
    tag: 'Maritime & Resilience',
    title: 'Gwadar Port, Earthquake Resilience & T20 Glory',
    years: '2000 – 2009',
    summary:
      'Laying the foundations of Gwadar deep-sea port, unprecedented national solidarity during the 2005 Kashmir earthquake, National Monument in Islamabad, and the 2009 T20 World Cup title.',
  },
  {
    id: '2010s',
    label: '2010s',
    tag: 'Democracy & CPEC',
    title: '18th Amendment, CPEC Investments & Peace Corridor',
    years: '2010 – 2019',
    summary:
      'Historic 18th Constitutional Amendment, first civilian democratic power transitions, Malala Yousafzai’s Nobel Peace Prize, the launch of CPEC, and Kartarpur Peace Corridor.',
  },
  {
    id: '2020s',
    label: '2020–2025',
    tag: 'Modern Leap',
    title: 'Pandemic Response, Climate Justice & Tech Innovation',
    years: '2020 – 2025',
    summary:
      'Global acclaim for data-driven NCOC pandemic leadership, Loss & Damage climate advocacy at COP27, SIFC economic initiative, and surging digital technology exports.',
  },
  {
    id: 'ancient',
    label: 'Ancient Eras',
    tag: 'Pre-1947 Heritage',
    title: 'From the Indus Valley to the Pakistan Movement',
    years: 'c. 3300 BCE – 1947 CE',
    summary:
      'Five millennia of civilization across Mohenjo-daro, Harappa, Gandharan Buddhist art at Taxila, early Islamic scholarship in Sindh, Mughal splendor in Lahore, and the 1940 Lahore Resolution.',
  },
];

export default function History() {
  // 'All Milestones' is active/focused by default
  const [selectedEra, setSelectedEra] = useState('all');
  // 'Responsive Visual Card Grid' is active/focused by default
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'carousel' | 'timeline'
  const [search, setSearch] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const controlsRef = useRef(null);

  const { data, loading, error, reload } = useFetch(
    () => historyService.list({ limit: 100 }),
    []
  );
  const events = useMemo(() => (Array.isArray(data) ? data : data?.items || []), [data]);

  // Match event to era
  const isEventInEra = (e, eraId) => {
    if (eraId === 'all') return true;

    const yr = e.yearRange || '';
    const order = e.order || 0;

    if (eraId === 'ancient') {
      return (
        order <= 7 ||
        yr.includes('BCE') ||
        yr.includes('CE') ||
        (e.era !== 'ModernPakistan' && e.era !== 'Independence1947')
      );
    }
    if (eraId === '1940s-1950s') {
      return (
        yr.includes('1947') ||
        yr.includes('1948') ||
        yr.includes('1949') ||
        yr.includes('195') ||
        e.era === 'Independence1947' ||
        (order >= 8 && order <= 14)
      );
    }
    if (eraId === '1960s') {
      return yr.includes('196') || (order >= 15 && order <= 18);
    }
    if (eraId === '1970s') {
      return yr.includes('197') || (order >= 19 && order <= 24);
    }
    if (eraId === '1980s') {
      return yr.includes('198') || (order >= 25 && order <= 28);
    }
    if (eraId === '1990s') {
      return yr.includes('199') || (order >= 29 && order <= 32);
    }
    if (eraId === '2000s') {
      return yr.includes('200') || (order >= 33 && order <= 37);
    }
    if (eraId === '2010s') {
      return yr.includes('201') || (order >= 38 && order <= 45);
    }
    if (eraId === '2020s') {
      return yr.includes('202') || (order >= 46 && order <= 50);
    }

    return true;
  };

  // Compute counts for each era badge
  const eraCounts = useMemo(() => {
    const counts = {};
    ERAS_CONFIG.forEach((era) => {
      counts[era.id] = events.filter((e) => isEventInEra(e, era.id)).length;
    });
    return counts;
  }, [events]);

  // Filtered list based on search and selected era
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.yearRange?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // When searching, search across all events unless an explicit era filter is desired
      if (search && selectedEra === 'all') return true;

      return isEventInEra(e, selectedEra);
    });
  }, [events, selectedEra, search]);

  const currentEraMeta = useMemo(() => {
    return ERAS_CONFIG.find((era) => era.id === selectedEra) || ERAS_CONFIG[0];
  }, [selectedEra]);

  // Era navigation steppers
  const currentEraIndex = ERAS_CONFIG.findIndex((era) => era.id === selectedEra);
  const handlePrevEra = () => {
    if (currentEraIndex > 0) {
      setSelectedEra(ERAS_CONFIG[currentEraIndex - 1].id);
    } else {
      setSelectedEra(ERAS_CONFIG[ERAS_CONFIG.length - 1].id);
    }
  };
  const handleNextEra = () => {
    if (currentEraIndex < ERAS_CONFIG.length - 1) {
      setSelectedEra(ERAS_CONFIG[currentEraIndex + 1].id);
    } else {
      setSelectedEra(ERAS_CONFIG[0].id);
    }
  };

  // Milestone modal index tracking
  const currentModalIndex = useMemo(() => {
    if (!selectedMilestone) return -1;
    return filteredEvents.findIndex(
      (e) => (e._id && e._id === selectedMilestone._id) || e.title === selectedMilestone.title
    );
  }, [selectedMilestone, filteredEvents]);

  const handleModalNavigate = (newIndex) => {
    if (newIndex >= 0 && newIndex < filteredEvents.length) {
      setSelectedMilestone(filteredEvents[newIndex]);
    }
  };

  return (
    <div className="bg-charcoal-950 min-h-screen text-white">
      <PageSEO
        title="History of Pakistan — Interactive Timeline (1947 to 2025 & Ancient Eras)"
        description="Explore an interactive chronological chronicle of Pakistan's history: from the Indus Valley Civilization to 1947 Independence, key modern milestones, and 2025 technological advancements."
        canonical="/history"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'History', url: '/history' },
        ]}
      />

      {/* Hero Header */}
      <section className="relative flex min-h-[380px] items-end overflow-hidden bg-charcoal-950 pb-12 pt-28 text-white">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.history, 1600, 900)}
          alt="Historic landmarks in Pakistan"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-transparent" />

        <div className="container-wide relative z-10 px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur-md mb-4">
            <Clock className="h-3.5 w-3.5 text-gold-400" />
            <span>Interactive Chronicle • 1947 to 2025</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
            Five Thousand Years <span className="text-gold-400">of Heritage</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-charcoal-300 max-w-2xl leading-relaxed">
            From the Indus Valley Civilization to the founding of sovereign Pakistan in 1947 and our
            transformative leap to 2025. Browse milestones era-by-era with zero endless vertical scrolling.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-charcoal-300 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-base">5,000+</span>
              <span className="text-charcoal-400">Years Chronicle</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-gold-400 text-base">{events.length || 50}</span>
              <span className="text-charcoal-400">Pivotal Milestones</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-base">9</span>
              <span className="text-charcoal-400">Historic Eras</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-emerald-400 text-base">3</span>
              <span className="text-charcoal-400">View Layouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Interactive Toolbar & Era Navigator */}
      <section
        ref={controlsRef}
        className="sticky top-0 z-30 border-y border-white/10 bg-charcoal-950/90 py-3 backdrop-blur-xl shadow-xl transition-all"
      >
        <div className="container-wide px-4 sm:px-8 space-y-3">
          {/* Top Row: Era Selector Track + Quick Prev/Next buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePrevEra}
              aria-label="Previous era"
              className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Scrollable Pills List */}
            <div className="flex flex-1 items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {ERAS_CONFIG.map((era) => {
                const isSelected = selectedEra === era.id;
                const count = eraCounts[era.id] || 0;
                return (
                  <button
                    key={era.id}
                    onClick={() => {
                      setSelectedEra(era.id);
                    }}
                    className={cn(
                      'flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus:outline-none',
                      isSelected
                        ? 'bg-gold-400 text-charcoal-950 shadow-md font-bold scale-[1.02] ring-2 ring-gold-400/50'
                        : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <span>{era.label}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[10px] font-mono',
                          isSelected ? 'bg-charcoal-950 text-gold-300' : 'bg-white/10 text-white/60'
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextEra}
              aria-label="Next era"
              className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Row: Search Box + View Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-white/5">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events (e.g. Independence, 1965, Constitution, Nuclear, CPEC)..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-9 pr-8 text-xs sm:text-sm text-white placeholder-charcoal-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 self-end sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                title="Responsive Visual Card Grid (Compact 2-3 Columns)"
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus:outline-none',
                  viewMode === 'grid'
                    ? 'bg-gold-400 text-charcoal-950 font-bold shadow-md ring-2 ring-gold-400/50'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode('carousel')}
                title="Interactive Carousel Stage (Zero Vertical Scrolling)"
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus:outline-none',
                  viewMode === 'carousel'
                    ? 'bg-gold-400 text-charcoal-950 font-bold shadow-md ring-2 ring-gold-400/50'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <GalleryHorizontal className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Stage</span>
              </button>

              <button
                onClick={() => setViewMode('timeline')}
                title="Modern Streamlined Timeline (Single Column)"
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all focus:outline-none',
                  viewMode === 'timeline'
                    ? 'bg-gold-400 text-charcoal-950 font-bold shadow-md ring-2 ring-gold-400/50'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <GitCommit className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Chronology</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Timeline Section */}
      <section className="section bg-charcoal-950 text-white pt-8 pb-16">
        <div className="container-wide px-4 sm:px-8">
          {/* Active Era Spotlight Banner */}
          {!search && (
            <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold-400/20 px-2.5 py-0.5 text-xs font-bold text-gold-300">
                      {currentEraMeta.tag}
                    </span>
                    <span className="text-xs font-mono text-charcoal-400">{currentEraMeta.years}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    {currentEraMeta.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-300 leading-relaxed">
                    {currentEraMeta.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 md:flex-col md:items-end">
                  <span className="text-xs text-charcoal-400">
                    Showing {filteredEvents.length} milestone{filteredEvents.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Search Result Counter if active */}
          {search && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs sm:text-sm">
              <span className="text-charcoal-300">
                Found <strong className="text-gold-400">{filteredEvents.length}</strong> event
                {filteredEvents.length === 1 ? '' : 's'} matching "{search}"
              </span>
              <button
                onClick={() => setSearch('')}
                className="text-xs font-semibold text-gold-400 hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Async State Handler */}
          <AsyncState
            loading={loading}
            error={error}
            isEmpty={!loading && !error && filteredEvents.length === 0}
            onRetry={reload}
            emptyProps={{
              title: search
                ? 'No historical milestones match your search'
                : 'No milestones in this era yet',
              description: search
                ? 'Try searching with different terms or switch to "All Milestones".'
                : 'Select another decade above or click "All Milestones" to see the full timeline.',
            }}
          >
            {/* View Layout 1: Interactive Carousel Stage */}
            {viewMode === 'carousel' && (
              <div className="space-y-8">
                <MilestoneCarousel
                  events={filteredEvents}
                  onSelectMilestone={(ev) => setSelectedMilestone(ev)}
                />

                {/* Sub-grid of thumbnails in this era for instant access */}
                {filteredEvents.length > 1 && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-4">
                      All Milestones in this Era ({filteredEvents.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredEvents.map((ev) => (
                        <div
                          key={ev._id || ev.title}
                          onClick={() => setSelectedMilestone(ev)}
                          className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition-all hover:bg-white/[0.08] hover:border-gold-400/40 cursor-pointer"
                        >
                          <span className="rounded-lg bg-gold-400/10 border border-gold-400/20 px-2 py-1 text-[11px] font-mono font-bold text-gold-300 shrink-0">
                            {ev.yearRange}
                          </span>
                          <span className="text-xs font-semibold text-white group-hover:text-gold-300 line-clamp-1 truncate">
                            {ev.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View Layout 2: Responsive Visual Cards Grid (2-3 columns) */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((ev) => (
                  <MilestoneCard
                    key={ev._id || ev.title}
                    event={ev}
                    onSelect={(event) => setSelectedMilestone(event)}
                  />
                ))}
              </div>
            )}

            {/* View Layout 3: Modern Compact Single-Sided Timeline */}
            {viewMode === 'timeline' && (
              <CompactTimeline
                events={filteredEvents}
                onSelectMilestone={(ev) => setSelectedMilestone(ev)}
              />
            )}
          </AsyncState>
        </div>
      </section>

      {/* Embedded Ask AI Section */}
      <section className="section bg-white text-charcoal-950">
        <div className="container-narrow">
          <AskAIPrompt
            entityName={`Pakistan's ${currentEraMeta.label} milestones`}
            suggestedQuestion={
              selectedEra === '1940s-1950s'
                ? 'What were the most crucial decisions made during the founding years of Pakistan between 1947 and 1956?'
                : selectedEra === '1970s'
                ? 'How did the unanimous 1973 Constitution reshape democratic governance and provincial autonomy in Pakistan?'
                : selectedEra === '1990s'
                ? 'What were the geopolitical and national circumstances surrounding Pakistan’s 1998 Chagai nuclear tests?'
                : 'Can you explain the major turning points in Pakistan\'s history between 1947 and 2025?'
            }
          />
        </div>
      </section>

      {/* Interactive Milestone Detail Modal */}
      {selectedMilestone && (
        <MilestoneDetailModal
          event={selectedMilestone}
          allEvents={filteredEvents}
          currentIndex={currentModalIndex}
          onClose={() => setSelectedMilestone(null)}
          onNavigate={handleModalNavigate}
        />
      )}
    </div>
  );
}
