import EntityImage from './EntityImage';

/**
 * Shared "extra photos" grid used by every content type's detail page
 * (Region, City, Destination, and anywhere else a gallery is wired up).
 *
 * This is the single place that enforces "an empty gallery shows nothing on
 * the website" - it renders null outright (no heading, no empty grid, no
 * placeholder) whenever `images` has nothing in it, rather than leaving that
 * check scattered across every page that uses it.
 *
 * Each thumbnail gets its own EntityImage fail-over (falling back to the
 * shared category placeholder only if that specific gallery photo 404s),
 * rather than hiding the whole grid if one of up to 3 photos fails to load.
 */
export default function EntityGallery({ images, alt = '', placeholderSeed, heading = null, className = 'grid grid-cols-2 sm:grid-cols-3 gap-3' }) {
  const gallery = Array.isArray(images) ? images.filter(Boolean) : [];
  if (gallery.length === 0) return null;

  return (
    <div>
      {heading && <h2 className="text-h3 mb-3">{heading}</h2>}
      <div className={className}>
        {gallery.map((src, i) => (
          <EntityImage
            key={src}
            sources={[src]}
            fallbackSeed={placeholderSeed}
            alt={`${alt} photo ${i + 1}`.trim()}
            width={400}
            height={400}
            className="h-28 w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}
