import { memo } from 'react';
import { Calendar, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import EntityImage from '../ui/EntityImage';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';

function MilestoneCard({ event, onSelect }) {
  if (!event) return null;

  const { title, yearRange, description, image, gallery, era } = event;

  return (
    <div
      onClick={() => onSelect?.(event)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-gold-500/5 cursor-pointer"
    >
      {/* Top Banner / Image */}
      <div>
        <div className="relative mb-4 h-44 w-full overflow-hidden rounded-xl bg-charcoal-900">
          <EntityImage
            sources={[image]}
            fallbackSeed={PLACEHOLDER_IDS.history}
            alt={title}
            width={600}
            height={340}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />

          {/* Year Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-charcoal-950/90 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur-md">
            <Calendar className="h-3.5 w-3.5 text-gold-400" />
            <span>{yearRange}</span>
          </div>

          {/* Gallery Indicator if multiple images */}
          {gallery?.length > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-charcoal-950/80 px-2 py-0.5 text-[11px] text-white/80 backdrop-blur-md">
              <ImageIcon className="h-3 w-3 text-gold-400" />
              <span>+{gallery.length}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white transition-colors group-hover:text-gold-300 sm:text-lg line-clamp-2">
          {title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-xs leading-relaxed text-charcoal-300 line-clamp-3 sm:text-sm">
          {description}
        </p>
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
        <span className="text-charcoal-400 font-mono text-[11px] truncate max-w-[150px]">
          {era ? era.replace(/([A-Z])/g, ' $1').trim() : 'Historical Milestone'}
        </span>
        <span className="flex items-center gap-1 font-semibold text-gold-400 transition-transform group-hover:translate-x-0.5">
          Read story <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

export default memo(MilestoneCard);
