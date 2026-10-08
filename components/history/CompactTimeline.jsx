import { memo } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import EntityImage from '../ui/EntityImage';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';

function CompactTimeline({ events = [], onSelectMilestone }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-3xl pl-6 sm:pl-8">
      {/* Vertical Spine Line */}
      <span className="absolute left-2.5 sm:left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-gold-400 via-white/20 to-gold-400/40" />

      <div className="space-y-6">
        {events.map((event, index) => {
          return (
            <div
              key={event._id || index}
              className="group relative flex items-start gap-4 transition-all"
            >
              {/* Timeline Pin Node */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-charcoal-950 ring-2 ring-gold-400 group-hover:scale-125 group-hover:ring-gold-300 transition-all">
                <div className="h-2 w-2 rounded-full bg-gold-400" />
              </div>

              {/* Event Card */}
              <div
                onClick={() => onSelectMilestone?.(event)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:border-gold-400/40 hover:bg-white/[0.08] hover:shadow-lg cursor-pointer flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold-500/10 border border-gold-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-gold-300">
                      {event.yearRange}
                    </span>
                    <span className="text-[11px] text-charcoal-400 font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal-300 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Thumbnail if present */}
                {event.image && (
                  <div className="h-20 w-28 sm:h-24 sm:w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-charcoal-950">
                    <EntityImage
                      sources={[event.image]}
                      fallbackSeed={PLACEHOLDER_IDS.history}
                      alt={event.title}
                      width={250}
                      height={180}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(CompactTimeline);
