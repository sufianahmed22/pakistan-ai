import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { REGIONS_SCHEMATIC } from '../../constants/pakistanFacts';
import { useFetch } from '../../hooks/useFetch';
import { formatCompactNumber } from '../../utils/format';
import regionService from '../../services/regionService';

// SIMPLIFICATION NOTICE: this environment has no network access to fetch a real
// Pakistan GeoJSON/TopoJSON boundary file, so instead of shipping a static flat <img>
// (which the spec explicitly disallows) we render a stylized, schematic SVG where each
// of Pakistan's 7 regions is its own genuinely interactive <path>/<g> shape: hover shows
// a live tooltip (population/area/capital, fetched via regionService — never hardcoded),
// and click navigates to /regions/:slug. The shapes are an abstract mosaic laid out in
// roughly the real relative north-south/east-west arrangement, NOT accurate cartographic
// boundaries. Swap in a real TopoJSON + d3-geo projection in production.
const SHAPES = {
  'gilgit-baltistan': 'M 120 10 L 340 10 L 320 70 L 140 70 Z',
  'azad-kashmir': 'M 260 75 L 340 75 L 330 130 L 270 130 Z',
  'khyber-pakhtunkhwa': 'M 30 75 L 255 75 L 235 200 L 60 200 Z',
  'islamabad-capital-territory': 'M 225 100 L 260 100 L 255 125 L 220 125 Z',
  punjab: 'M 65 205 L 300 135 L 340 260 L 180 340 Z',
  balochistan: 'M 10 210 L 175 205 L 175 400 L 10 430 Z',
  sindh: 'M 180 300 L 300 265 L 330 420 L 200 440 Z',
};

const LABEL_POS = {
  'gilgit-baltistan': [230, 40],
  'azad-kashmir': [300, 100],
  'khyber-pakhtunkhwa': [130, 140],
  'islamabad-capital-territory': [300, 90],
  punjab: [210, 240],
  balochistan: [90, 320],
  sindh: [250, 360],
};

export default function PakistanMap({ regionsData }) {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const { data: fetchedRegions } = useFetch(() => (regionsData ? Promise.resolve(regionsData) : regionService.list({ limit: 20 })), [!!regionsData]);
  const regions = regionsData || (Array.isArray(fetchedRegions) ? fetchedRegions : fetchedRegions?.items) || [];

  const findRegion = (slug) => regions.find((r) => r.slug === slug);

  return (
    <div className="relative">
      <svg viewBox="0 0 350 450" className="w-full h-auto max-h-[520px]" role="img" aria-label="Interactive schematic map of Pakistan's regions">
        {REGIONS_SCHEMATIC.map((r) => {
          const isHovered = hovered === r.slug;
          return (
            <g key={r.slug}>
              <motion.path
                d={SHAPES[r.slug]}
                fill={isHovered ? '#08653F' : '#0a7f53'}
                fillOpacity={isHovered ? 1 : 0.75}
                stroke="#faf9f6"
                strokeWidth={2}
                className="cursor-pointer transition-colors"
                onMouseEnter={() => setHovered(r.slug)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(r.slug)}
                onBlur={() => setHovered(null)}
                onClick={() => navigate(`/regions/${r.slug}`)}
                tabIndex={0}
                role="button"
                aria-label={`View ${r.name}`}
                whileHover={{ scale: 1.02 }}
              />
              <text
                x={LABEL_POS[r.slug][0]}
                y={LABEL_POS[r.slug][1]}
                textAnchor="middle"
                className="pointer-events-none select-none"
                fontSize="9"
                fill="white"
                fontWeight="600"
              >
                {r.name.length > 14 ? r.name.split(' ')[0] : r.name}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-xl bg-charcoal-950 px-4 py-3 text-white shadow-glass min-w-[200px]">
          {(() => {
            const meta = REGIONS_SCHEMATIC.find((r) => r.slug === hovered);
            const live = findRegion(hovered);
            return (
              <>
                <p className="font-display font-semibold">{meta.name}</p>
                <p className="text-xs text-white/60 mt-1">Capital: {live?.capital || meta.capital}</p>
                {live?.population && <p className="text-xs text-white/60">Population: {formatCompactNumber(live.population)}</p>}
                {live?.area && <p className="text-xs text-white/60">Area: {formatCompactNumber(live.area)} km²</p>}
                {!live && <p className="text-xs text-gold-300 mt-1">Click to explore →</p>}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
