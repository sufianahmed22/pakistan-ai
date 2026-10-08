import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EntityImage from '../ui/EntityImage';
import EntityGallery from '../ui/EntityGallery';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function MilestoneDetailModal({
  event,
  allEvents = [],
  currentIndex = -1,
  onClose,
  onNavigate,
}) {
  const navigate = useNavigate();
  const panelRef = useRef(null);

  // Close on Escape or arrow keys for fast browsing
  useEffect(() => {
    if (!event) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate?.(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < allEvents.length - 1) {
        onNavigate?.(currentIndex + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [event, currentIndex, allEvents.length, onClose, onNavigate]);

  if (!event) return null;

  const { title, yearRange, description, image, gallery, era } = event;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allEvents.length - 1;

  const handleAskAI = () => {
    const question = `Tell me about the historical significance of "${title}" (${yearRange}) in the history of Pakistan.`;
    navigate(`/ask?q=${encodeURIComponent(question)}`);
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-white/15 bg-charcoal-900/95 text-white shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-charcoal-950/60">
            <div className="flex items-center gap-2 text-xs text-charcoal-400">
              <span className="rounded-full bg-gold-500/10 border border-gold-500/20 px-2.5 py-0.5 text-gold-300 font-mono font-semibold">
                {yearRange}
              </span>
              <span>•</span>
              <span className="capitalize">{era ? era.replace(/([A-Z])/g, ' $1').trim() : 'Milestone'}</span>
              {currentIndex >= 0 && (
                <>
                  <span>•</span>
                  <span>
                    {currentIndex + 1} of {allEvents.length}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-full p-1.5 text-charcoal-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Featured Image */}
            <div className="relative h-56 sm:h-72 w-full overflow-hidden rounded-2xl bg-charcoal-950 border border-white/10">
              <EntityImage
                sources={[image]}
                fallbackSeed={PLACEHOLDER_IDS.history}
                alt={title}
                width={800}
                height={450}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1">
                  Historical Turning Point
                </p>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {title}
                </h2>
              </div>
            </div>

            {/* Description Narrative */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <p className="text-sm sm:text-base leading-relaxed text-charcoal-200">
                {description}
              </p>
            </div>

            {/* Additional Gallery if available */}
            {gallery?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-charcoal-300">
                  <ImageIcon className="h-3.5 w-3.5 text-gold-400" />
                  <span>Historical Archive Photos ({gallery.length})</span>
                </div>
                <EntityGallery
                  images={gallery}
                  alt={title}
                  placeholderSeed={PLACEHOLDER_IDS.history}
                />
              </div>
            )}

            {/* Ask AI Contextual Callout */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-gold-500/20 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/20 text-gold-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-gold-300">Want deeper analysis?</p>
                  <p className="text-xs text-charcoal-300">Ask Pakistan AI about cause, impact, and historical context</p>
                </div>
              </div>
              <button
                onClick={handleAskAI}
                className="w-full sm:w-auto shrink-0 rounded-xl bg-gold-400 px-4 py-2 text-xs font-bold text-charcoal-950 hover:bg-gold-300 transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>

          {/* Footer Navigation Bar: Previous / Next Milestone */}
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-3.5 bg-charcoal-950/80">
            <button
              onClick={() => hasPrev && onNavigate?.(currentIndex - 1)}
              disabled={!hasPrev}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Milestone</span>
            </button>

            <button
              onClick={() => hasNext && onNavigate?.(currentIndex + 1)}
              disabled={!hasNext}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none"
            >
              <span>Next Milestone</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
