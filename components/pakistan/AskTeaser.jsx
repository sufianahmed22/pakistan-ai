import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Card } from '../kokonut/Card';
import SectionHeading from '../ui/SectionHeading';
import { SUGGESTED_QUESTIONS } from '../../constants/pakistanFacts';

export default function AskTeaser() {
  const navigate = useNavigate();
  return (
    <section className="section bg-charcoal-50/50">
      <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading eyebrow="Ask Pakistan AI" title="Your personal guide to everything about Pakistan" subtitle="History, geography, culture, travel tips, and live statistics — answered instantly, sourced honestly." />
          <button onClick={() => navigate('/ask')} className="btn-primary">
            <Sparkles className="h-4 w-4" /> Start a conversation
          </button>
        </div>
        <Card className="p-4">
          <div className="rounded-xl bg-charcoal-50 p-4 space-y-3">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
              <button key={q} onClick={() => navigate(`/ask?q=${encodeURIComponent(q)}`)} className="flex w-full items-center gap-2 rounded-lg bg-white px-4 py-3 text-left text-sm text-charcoal-700 shadow-soft hover:text-emerald-700">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" /> {q}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
