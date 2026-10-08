# public/images

This project ships without network access to fetch or license real photography, so a single,
consistent placeholder-image strategy is used everywhere (documented once here and in
`utils/placeholderImage.js`): hotlinked Unsplash photography (`https://images.unsplash.com/photo-<id>?...`)
with descriptive `alt` text, chosen per content category (mountains, valleys, cities, deserts,
rivers, culture, food, history, markets).

**For production**, replace these with real, licensed photography organized into the
subfolders below (used by filename convention, not by hardcoded path — swap the
`placeholderImage()` helper for local `/images/...` paths once real assets are added):

- `pakistan/` — flag, national symbols, wide country shots
- `cities/` — one hero image per major city (karachi.jpg, lahore.jpg, islamabad.jpg, …)
- `regions/` — one hero image per province/territory
- `destinations/` — tourist destination photography
- `history/` — historical/archival imagery
- `culture/` — festivals, crafts, music, dress

Recommended format: WebP, 1600×900 for hero images, 800×600 for cards, with descriptive
filenames matching each entity's slug.
