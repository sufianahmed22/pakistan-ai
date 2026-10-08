import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Compact embedded "Ask AI" section used on Region/City/Destination detail pages —
// pre-filled with a contextually relevant suggested question, linking through to /ask.
export default function AskAIPrompt({ suggestedQuestion, entityName }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="rounded-2xl bg-charcoal-950 p-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-eyebrow !text-gold-300 mb-2">Ask Pakistan AI</p>
        <h3 className="text-h4 mb-4">Have a question about {entityName}?</h3>
        <button
          onClick={() => navigate(`/ask?q=${encodeURIComponent(suggestedQuestion)}`)}
          className="flex w-full items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3.5 text-left text-sm text-white/90 hover:bg-white/20 transition-colors"
        >
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold-300 shrink-0" /> {suggestedQuestion}</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </button>
        {!isAuthenticated && (
          <p className="mt-3 text-xs text-white/40">Sign up or log in to chat with Pakistan AI.</p>
        )}
      </div>
    </div>
  );
}
