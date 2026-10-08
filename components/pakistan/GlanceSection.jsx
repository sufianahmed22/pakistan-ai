import { Landmark, Coins, Mountain, Waves, Map, Languages } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlanceCard from '../cards/GlanceCard';
import { PAKISTAN_GLANCE } from '../../constants/pakistanFacts';

const ICONS = [Landmark, Coins, Mountain, Waves, Map, Languages];

export default function GlanceSection() {
  return (
    <section className="section bg-white">
      <div className="container-wide">
        <SectionHeading eyebrow="Pakistan at a Glance" title="The essentials, at a glance" align="center" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PAKISTAN_GLANCE.map((f, i) => (
            <GlanceCard key={f.label} label={f.label} value={f.value} icon={ICONS[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
