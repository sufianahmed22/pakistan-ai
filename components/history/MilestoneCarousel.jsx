import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, ArrowRight, Maximize2 } from 'lucide-react';
import EntityImage from '../ui/EntityImage';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function MilestoneCarousel({ events = [], onSelectMilestone }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const railRef = useRef(null);

  // Keep active index in bounds if events array changes
  useEffect(() => {
    if (activeIndex >= events.length) {
      setActiveIndex(0);
    }
  }, [events.length, activeIndex]);

  if (!events || events.length === 0) return null;

  const currentEvent = events[activeIndex] || events[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0));
  };

  // Scroll active mini-chip into view in the horizontal scrubber
  const handleSelect = (idx) => {
    setActiveIndex(idx);
    if (railRef.current) {
      const child = railRef.current.children[idx];
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Top Progress & Scrubber Bar */}
      <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5">
        <div className="flex items-center justify-between text-xs text-charcoal-400">
          <span className="font-semibold uppercase tracking-wider text-gold-400">
            Interactive Timeline Stage
          </span>
          <span className="font-mono">
            Milestone {activeIndex + 1} of {events.length}
          </span>
        </div>

        {/* Horizontal Mini Timeline Scrubber */}
        <div
          ref={railRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10"
        >
          {events.map((ev, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={ev._id || i}
                onClick={() => handleSelect(i)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all ${
                  isActive
                    ? 'bg-gold-400 text-charcoal-950 font-bold shadow-md scale-105'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-[10px] opacity-70">#{i + 1}</span>
                <span className="truncate max-w-[120px]">{ev.yearRange}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage: Featured Milestone Spotlight */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left: Featured Image */}
        <div className="lg:col-span-6 relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl border border-white/10 bg-charcoal-950 shadow-inner group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent._id || currentEvent.title}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <EntityImage
                sources={[currentEvent.image]}
                fallbackSeed={PLACEHOLDER_IDS.history}
                alt={currentEvent.title}
                width={800}
                height={500}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Year Badge on Image */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-charcoal-950/85 border border-gold-400/30 px-3 py-1 text-xs font-bold text-gold-300 backdrop-blur-md">
            <Calendar className="h-3.5 w-3.5 text-gold-400" />
            <span>{currentEvent.yearRange}</span>
          </div>

          {/* Quick Zoom Trigger */}
          <button
            onClick={() => onSelectMilestone?.(currentEvent)}
            className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-charcoal-950/80 border border-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur-md hover:bg-charcoal-900 transition-colors"
          >
            <Maximize2 className="h-3 w-3 text-gold-400" />
            <span>View Full Details</span>
          </button>
        </div>

        {/* Right: Milestone Story Content */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent._id || currentEvent.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-xs text-gold-400 font-semibold uppercase tracking-wider">
                <span>Era: {currentEvent.era ? currentEvent.era.replace(/([A-Z])/g, ' $1').trim() : 'Modern Pakistan'}</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white leading-tight">
                {currentEvent.title}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-charcoal-200">
                {currentEvent.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Actions & Next / Prev Controls */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <button
              onClick={() => onSelectMilestone?.(currentEvent)}
              className="flex items-center gap-2 rounded-xl bg-gold-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-charcoal-950 hover:bg-gold-300 transition-all shadow-lg shadow-gold-500/10"
            >
              <span>Explore Milestone Narrative</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Stepper buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous milestone"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/15"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next milestone"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/15"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
