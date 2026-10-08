import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function CultureFoodTeaser() {
  return (
    <section className="section bg-charcoal-50/50">
      <div className="container-wide grid grid-cols-1 gap-6 md:grid-cols-2">
        <TeaserCard
          to="/culture"
          label="Culture"
          title="Centuries of tradition, living today"
          seed={PLACEHOLDER_IDS.culture}
        />
        <TeaserCard
          to="/tourism"
          label="Food"
          title="A cuisine shaped by empires and provinces"
          seed={PLACEHOLDER_IDS.food}
        />
      </div>
    </section>
  );
}

function TeaserCard({ to, label, title, seed }) {
  return (
    <Link to={to} className="group relative block h-72 overflow-hidden rounded-3xl">
      <img src={placeholderImage(seed, 1000, 700)} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent" />
      <div className="absolute bottom-0 p-8 text-white">
        <p className="text-eyebrow !text-gold-300 mb-2">{label}</p>
        <h3 className="text-h3 !text-2xl max-w-sm">{title}</h3>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
          Learn more <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
