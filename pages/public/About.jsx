import { Sparkles, BrainCircuit, ShieldCheck, Globe2 } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import { APP_NAME } from '../../config';
import CountryProfileCard from '../../components/widgets/CountryProfileCard';
import DeveloperSection from '../../components/pakistan/DeveloperSection';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

const PILLARS = [
  { icon: BrainCircuit, title: 'AI-Powered', text: 'Every answer is generated or retrieved through an AI knowledge engine trained on Pakistan.' },
  { icon: Globe2, title: 'Comprehensive', text: 'History, culture, geography, tourism, and live statistics, all in one place.' },
  { icon: ShieldCheck, title: 'Sourced & Dated', text: 'Every statistic is labeled with its year and source — never presented as more current than it is.' },
  { icon: Sparkles, title: 'Independent', text: `${APP_NAME} is an independent platform, not affiliated with the Government of Pakistan.` },
];

export default function About() {
  return (
    <div>
      <PageSEO
        title="About Us — Pakistan AI"
        description={`About ${APP_NAME} — an independent AI-powered encyclopedia and tourism guide exploring Pakistan.`}
        canonical="/about"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
      />
      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-charcoal-950 text-white pb-14 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.hero, 1920, 1080)}
          alt="Breathtaking landscapes of Pakistan"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <p className="text-eyebrow !text-gold-300 mb-2">About Us</p>
          <h1 className="text-h1">Built to make Pakistan easy to discover</h1>
          <p className="text-body-lg mt-3 text-white/80 max-w-2xl mx-auto">
            {APP_NAME} combines an interactive encyclopedia, a tourism guide, live data visualization, and a
            conversational AI assistant — all focused on celebrating and understanding Pakistan.
          </p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-wide grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <Icon className="h-6 w-6 text-emerald-700 mb-3" />
              <h3 className="text-h4 !text-lg">{title}</h3>
              <p className="text-body mt-1.5 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>
      
      <CountryProfileCard />

      {/* Developer / Creator Profile Section */}
      <DeveloperSection />

      <section className="section bg-charcoal-50/50">
        <div className="container-narrow">
          <h2 className="text-h2 mb-4">Our approach</h2>
          <p className="text-body-lg mb-4">
            Rather than a static wiki, {APP_NAME} pairs curated, human-reviewed content with an AI assistant that can
            answer open-ended questions in natural language — always citing the year and source for anything that
            can change over time.
          </p>
          <p className="text-body-lg">
            The platform is independently built and maintained, and is not affiliated with, endorsed by, or
            operated on behalf of the Government of Pakistan.
          </p>
        </div>
      </section>
    </div>
  );
}
