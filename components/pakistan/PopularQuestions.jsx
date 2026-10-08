import { useNavigate } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import AsyncState from '../ui/AsyncState';
import { useFetch } from '../../hooks/useFetch';
import faqService from '../../services/faqService';
import { MessageCircleQuestion } from 'lucide-react';

export default function PopularQuestions() {
  const { data, loading, error, reload } = useFetch(() => faqService.list({ limit: 6 }), []);
  const faqs = Array.isArray(data) ? data : data?.items || [];
  const navigate = useNavigate();

  return (
    <section className="section bg-white">
      <div className="container-wide">
        <SectionHeading eyebrow="Popular Questions" title="What people ask Pakistan AI" align="center" />
        <AsyncState loading={loading} error={error} isEmpty={!loading && !error && faqs.length === 0} onRetry={reload} emptyProps={{ title: 'No questions yet' }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faqs.map((f) => (
              <button
                key={f._id || f.question}
                onClick={() => navigate(`/ask?q=${encodeURIComponent(f.question)}`)}
                className="flex items-start gap-3 rounded-2xl border border-charcoal-100 bg-white p-5 text-left shadow-soft hover:border-emerald-300 transition-colors"
              >
                <MessageCircleQuestion className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" />
                <span className="text-sm font-medium text-charcoal-800">{f.question}</span>
              </button>
            ))}
          </div>
        </AsyncState>
      </div>
    </section>
  );
}
