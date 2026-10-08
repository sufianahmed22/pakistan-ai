import SectionHeading from '../ui/SectionHeading';
import TimelineItem from '../cards/TimelineItem';
import AsyncState from '../ui/AsyncState';
import { useFetch } from '../../hooks/useFetch';
import articleService from '../../services/articleService';

export default function TimelineSection() {
  const { data, loading, error, reload } = useFetch(() => articleService.list({ category: 'history', limit: 8 }), []);
  const events = Array.isArray(data) ? data : data?.items || [];

  return (
    <section className="section bg-charcoal-950 text-white">
      <div className="container-wide">
        <SectionHeading eyebrow="History" title="A timeline of Pakistan" dark align="center" />
        <AsyncState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && events.length === 0}
          onRetry={reload}
          emptyProps={{ title: 'Historical timeline coming soon' }}
        >
          <div className="mx-auto max-w-4xl relative">
            <span className="absolute left-2 sm:left-1/2 top-0 bottom-0 w-px bg-white/10" />
            {events.map((e, i) => (
              <TimelineItem key={e._id || e.slug || i} year={e.year || e.date} title={e.title} description={e.summary || e.excerpt} align={i % 2 === 0 ? 'left' : 'right'} />
            ))}
          </div>
        </AsyncState>
      </div>
    </section>
  );
}
