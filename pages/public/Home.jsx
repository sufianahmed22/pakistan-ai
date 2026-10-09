import { SITE_URL } from '../../config';
import PageSEO from '../../components/layout/PageSEO';
import Hero from '../../components/pakistan/Hero';
import GlanceSection from '../../components/pakistan/GlanceSection';
import AskTeaser from '../../components/pakistan/AskTeaser';
import DestinationsSection from '../../components/pakistan/DestinationsSection';
import DeveloperSection from '../../components/pakistan/DeveloperSection';
import FinalCTA from '../../components/pakistan/FinalCTA';

// Secondary sections preserved for optional future use
// import CurrencyTickerSection from '../../components/pakistan/CurrencyTickerSection';
// import HolidaysCard from '../../components/widgets/HolidaysCard';
// import ExploreGrid from '../../components/pakistan/ExploreGrid';
// import MapSection from '../../components/pakistan/MapSection';
// import PopulationSection from '../../components/pakistan/PopulationSection';
// import ProvincesSection from '../../components/pakistan/ProvincesSection';
// import GeographySection from '../../components/pakistan/GeographySection';
// import TimelineSection from '../../components/pakistan/TimelineSection';
import CultureFoodTeaser from '../../components/pakistan/CultureFoodTeaser';
import PopularQuestions from '../../components/pakistan/PopularQuestions';
import TelegramCTA from '../../components/pakistan/TelegramCTA';

export default function Home() {
  return (
    <>
      <PageSEO
        title={undefined}
        description="Pakistan AI is an interactive encyclopedia, tourism guide, and AI assistant for everything about Pakistan — history, culture, geography, statistics, and more."
        canonical="/"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Pakistan AI',
            url: `${SITE_URL}/`,
            description: 'Interactive encyclopedia, tourism guide, and conversational AI assistant for Pakistan.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/ask?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Pakistan AI',
            url: `${SITE_URL}/`,
            logo: `${SITE_URL}/favicon/favicon.svg`,
          },
        ]}
      />
      
      {/* 1. Hero with conversational search prompt */}
      <Hero />

      {/* 2. Key essential numbers at a glance */}
      <GlanceSection />

      {/* Commented out secondary sections to keep home page concise
      <CurrencyTickerSection />
      <HolidaysCard />
      */}

      {/* 3. AI conversation prompt / teaser */}
      <AskTeaser />
      
      {/* Commented out secondary sections
      <ProvincesSection />
      <ExploreGrid />
      <MapSection />
      <PopulationSection />
      <GeographySection />
      <TimelineSection />
      */}

      {/* 4. Top destinations & travel highlights */}
      <DestinationsSection />

      {/* Commented out secondary sections */}
      <CultureFoodTeaser />
      <PopularQuestions />
      <TelegramCTA />
     

      {/* 5. Creator & Developer Section */}
      <DeveloperSection />

      {/* 6. Exploration CTA */}
      <FinalCTA />
    </>
  );
}
