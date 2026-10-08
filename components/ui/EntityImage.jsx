import { useEffect, useState } from 'react';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

/**
 * Renders a content-matched image with a real fail-over chain:
 *   1. Try each URL in `sources` in order (an entity's own photo(s) - e.g.
 *      Destination.image, City.image).
 *   2. If every real source is missing or fails to load (404, network error),
 *      fall back to a category-appropriate placeholder (never a random/unrelated one).
 *
 * This replaces the old pattern of picking a placeholder image by rotating index,
 * which showed unrelated photos (e.g. a desert dune for a mosque).
 */
export default function EntityImage({
  sources = [],
  fallbackSeed = PLACEHOLDER_IDS.valley,
  alt,
  className,
  width = 800,
  height = 600,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
}) {
  const candidates = [...sources.filter(Boolean), placeholderImage(fallbackSeed, width, height)];
  const [index, setIndex] = useState(0);

  // Reset to the first candidate whenever the entity (and thus its sources) changes.
  useEffect(() => setIndex(0), [sources.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  const src = candidates[Math.min(index, candidates.length - 1)];

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      width={width}
      height={height}
      className={className}
      onError={() => setIndex((i) => (i + 1 < candidates.length ? i + 1 : i))}
    />
  );
}
