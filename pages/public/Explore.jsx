import { Link } from 'react-router-dom';
import { Map, Building2, MapPin, Mountain, Waves, BarChart3 } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import PakistanMap from '../../components/maps/PakistanMap';
import SectionHeading from '../../components/ui/SectionHeading';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

const LINKS = [
  { to: '/regions', label: 'Regions', icon: Map, desc: 'Provinces and territories' },
  { to: '/cities', label: 'Cities', icon: Building2, desc: 'Major cities and metros' },
  { to: '/places', label: 'Places to Visit', icon: MapPin, desc: 'Curated destinations' },
  { to: '/mountains', label: 'Mountains', icon: Mountain, desc: 'Peaks and ranges' },
  { to: '/rivers', label: 'Rivers', icon: Waves, desc: 'The Indus basin' },
  { to: '/statistics', label: 'Statistics', icon: BarChart3, desc: 'Live data & charts' },
];

export default function Explore() {
  return (
    <div>
      <PageSEO title="Explore Pakistan" description="Explore Pakistan's regions, cities, destinations, mountains, rivers and statistics." canonical="/explore" />
      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-charcoal-950 text-white pb-14 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.hero, 1920, 1080)}
          alt="Explore Pakistan landscape"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <p className="text-eyebrow !text-gold-300 mb-2">Explore</p>
          <h1 className="text-h1">Every corner of Pakistan, one click away</h1>
          <p className="text-body-lg mt-3 text-white/80 max-w-2xl mx-auto">
            Discover provinces, metropolitan cities, historic landmarks, and mountain ranges across the nation.
          </p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-wide grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map(({ to, label, icon: Icon, desc }) => (
            <Link key={to} to={to} className="card p-6 hover:border-emerald-300 transition-colors">
              <Icon className="h-6 w-6 text-emerald-700 mb-3" />
              <h3 className="text-h4 !text-lg">{label}</h3>
              <p className="text-body mt-1 text-sm">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section bg-charcoal-50/50">
        <div className="container-wide">
          <SectionHeading eyebrow="Interactive Map" title="Choose a region to begin" align="center" />
          <PakistanMap />
        </div>
      </section>
    </div>
  );
}
