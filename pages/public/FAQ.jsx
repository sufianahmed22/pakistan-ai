import PageSEO from '../../components/layout/PageSEO';
import AsyncState from '../../components/ui/AsyncState';
import FaqItem from '../../components/cards/FaqItem';
import { useFetch } from '../../hooks/useFetch';
import faqService from '../../services/faqService';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function FAQ() {
  const { data, loading, error, reload } = useFetch(() => faqService.list({ limit: 50 }), []);
  const faqs = Array.isArray(data) ? data : data?.items || [];

  return (
    <div>
      <PageSEO
        title="Frequently Asked Questions"
        description="Answers to common questions about Pakistan AI, verified data sources, and encyclopedia features."
        canonical="/faq"
        faqItems={faqs}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'FAQ', url: '/faq' },
        ]}
      />
      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-charcoal-950 text-white pb-14 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.culture, 1920, 1080)}
          alt="Pakistani cultural arts and heritage"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <p className="text-eyebrow !text-gold-300 mb-2">Help & Answers</p>
          <h1 className="text-h1">Frequently asked questions</h1>
          <p className="text-body-lg mt-3 text-white/80 max-w-2xl mx-auto">
            Everything you need to know about Pakistan AI, data sourcing, platform features, and user accounts.
          </p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-narrow">
          <AsyncState loading={loading} error={error} isEmpty={!loading && !error && faqs.length === 0} onRetry={reload} emptyProps={{ title: 'No FAQs yet' }}>
            <div>
              {faqs.map((f, i) => (
                <FaqItem key={f._id || i} question={f.question} answer={f.answer} defaultOpen={i === 0} />
              ))}
            </div>
          </AsyncState>
        </div>
      </section>
    </div>
  );
}
