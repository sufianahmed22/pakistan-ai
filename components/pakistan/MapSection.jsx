import SectionHeading from '../ui/SectionHeading';
import PakistanMap from '../maps/PakistanMap';

export default function MapSection() {
  return (
    <section className="section bg-white">
      <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading eyebrow="Interactive Map" title="Every region, one click away" subtitle="Hover a region for a quick snapshot, or click through for the full profile — geography, culture, cities, and more." />
          <p className="text-caption">Schematic interactive map — hover or click any region.</p>
        </div>
        <PakistanMap />
      </div>
    </section>
  );
}
