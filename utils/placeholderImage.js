// Consistent image-placeholder strategy for this project (documented once, used everywhere):
// We use Pexels hotlinked photography (free to use, no attribution required — see
// https://www.pexels.com/license/) with descriptive alt text as a category-matched
// LAST-RESORT fallback, used only when an entity has no real photo of its own (see
// components/ui/EntityImage.jsx) or every real candidate fails to load. In production, replace
// these URLs with real, licensed photography stored under public/images/** (see
// public/images/README_IMAGES.md).
export function placeholderImage(seed, w = 1200, h = 800) {
  return `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
}

// Curated set of real Pexels photo IDs with a Pakistan/mountains/culture/city feel,
// mapped by category so pages stay visually consistent.
export const PLACEHOLDER_IDS = {
  hero: '35302566', // Snow-capped peaks in Hunza Valley, Pakistan
  mountains: '2324562', // Snow-capped mountain range
  valley: '35302566', // Snow-capped peaks in Hunza Valley, Pakistan
  city: '34096455', // Aerial night view of Karachi's illuminated cityscape
  desert: '50628', // Desert sand dunes under a clear sky
  river: '5273752', // River flowing in a mountainous valley
  culture: '11405929', // Truck art in Pakistan
  food: '4224304', // Chicken biryani
  history: '12912453', // Badshahi Mosque, Lahore
  market: '29306863', // Bustling bazaar in Pakistan with clothing stalls
};

// Destination.category -> the closest-matching placeholder bucket, so a card without a
// real photo at least shows something plausible for its *type* of place instead of a
// randomly rotating, unrelated image (a mosque no longer shows a desert dune shot, etc).
const DESTINATION_CATEGORY_SEED = {
  Mountains: PLACEHOLDER_IDS.mountains,
  Valleys: PLACEHOLDER_IDS.valley,
  HistoricalSites: PLACEHOLDER_IDS.history,
  Beaches: PLACEHOLDER_IDS.river,
  Cities: PLACEHOLDER_IDS.city,
  Deserts: PLACEHOLDER_IDS.desert,
  Adventure: PLACEHOLDER_IDS.mountains,
  Heritage: PLACEHOLDER_IDS.history,
};

export function categoryPlaceholderSeed(category) {
  return DESTINATION_CATEGORY_SEED[category] || PLACEHOLDER_IDS.valley;
}

// Every content type stores a single primary `image`; this is the one source
// EntityImage tries before falling back to a category placeholder. `gallery`
// is a separate, optional set of extra photos shown in its own section (see
// components/ui/EntityGallery.jsx) - it is deliberately NOT chained in here
// as hero fail-over candidates anymore, so a gallery photo never gets shown
// twice (once as the "real" hero, once again in the gallery grid).
export function entityImageSources(entity) {
  if (!entity) return [];
  return [entity.image].filter(Boolean);
}
