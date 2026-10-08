import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

// Reusable 1-5 star control.
// - Read-only mode (no onChange): renders `value` as a static display,
//   used on destination cards / headers to show avgRating.
// - Interactive mode (onChange given): a controlled input for the review
//   form, one star per clickable button.
export default function RatingStars({ value = 0, onChange, size = 'md', className }) {
  const interactive = typeof onChange === 'function';
  const starSize = size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className={cn('flex items-center gap-0.5', className)} role={interactive ? 'radiogroup' : undefined} aria-label={interactive ? 'Rating' : `Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const Star_ = (
          <Star
            className={cn(starSize, filled ? 'fill-gold-400 text-gold-400' : 'text-charcoal-200')}
            aria-hidden="true"
          />
        );
        if (!interactive) {
          return <span key={star}>{Star_}</span>;
        }
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-pressed={star <= value}
            className="rounded p-0.5 transition-transform hover:scale-110"
          >
            {Star_}
          </button>
        );
      })}
    </div>
  );
}
