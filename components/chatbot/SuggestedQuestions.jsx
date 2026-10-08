import { Sparkles } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../../constants/pakistanFacts';

export default function SuggestedQuestions({ onSelect, questions = SUGGESTED_QUESTIONS }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="flex items-center gap-2 rounded-xl border border-charcoal-100 bg-white px-4 py-3 text-left text-sm text-charcoal-700 shadow-soft hover:border-emerald-300 hover:text-emerald-800 transition-colors"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" /> {q}
        </button>
      ))}
    </div>
  );
}
