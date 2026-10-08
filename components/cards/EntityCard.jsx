import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import EntityImage from '../ui/EntityImage';
import RatingStars from '../reviews/RatingStars';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';
import SaveButton from '../ui/SaveButton';

// Generic image + title + blurb card used for Regions / Cities / Destinations grids.
// `images`: real photo URL(s) for this specific entity (tried in order first).
// `imageSeed`: category-matched placeholder used only if `images` is empty or every
// real photo fails to load - never an unrelated random image.
export default function EntityCard({
  to,
  name,
  blurb,
  images = [],
  imageSeed = PLACEHOLDER_IDS.city,
  tag,
  avgRating,
  ratingCount,
  saveProps,
}) {
  return (
    <Link to={to} className="group block overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-soft hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <EntityImage
          sources={Array.isArray(images) ? images : [images]}
          fallbackSeed={imageSeed}
          alt={name}
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
        {tag && <span className="absolute left-3 top-3 badge bg-white/90 text-charcoal-800">{tag}</span>}
        {saveProps && (
          <div className="absolute right-3 top-3 z-10">
            <SaveButton
              entityType={saveProps.entityType}
              entityId={saveProps.entityId}
              entityName={saveProps.entityName || name}
              variant="icon"
              size="sm"
            />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-h4 !text-lg">{name}</h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-charcoal-300 group-hover:text-emerald-700 transition-colors" />
        </div>
        {ratingCount > 0 && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-charcoal-500">
            <RatingStars value={avgRating} size="sm" />
            <span>{avgRating.toFixed(1)} · {ratingCount}</span>
          </div>
        )}
        {blurb && <p className="text-body mt-1.5 line-clamp-2 text-sm">{blurb}</p>}
      </div>
    </Link>
  );
}
