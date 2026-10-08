import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Compass } from 'lucide-react';
import AnimatedBackground from '../kokonut/AnimatedBackground';
import TextEffect from '../kokonut/TextEffect';
import { SUGGESTED_QUESTIONS } from '../../constants/pakistanFacts';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';
import { useAuth } from '../../hooks/useAuth';

export default function Hero() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/ask?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-charcoal-950 text-white">
      <img
        src={placeholderImage(PLACEHOLDER_IDS.hero, 1920, 1280)}
        alt="Mountain landscape of northern Pakistan at golden hour"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-950/30" />
      <AnimatedBackground />

      <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 pt-24 pb-16 text-center mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-eyebrow !text-gold-300 mb-5"
        >
          An AI-powered encyclopedia of Pakistan
        </motion.p>
        <TextEffect as="h1" text="Discover Pakistan. Ask Anything." className="text-hero mx-auto max-w-4xl" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/70"
        >
          History, culture, geography, tourism and live statistics — explored through a premium AI
          assistant built entirely around Pakistan.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          onSubmit={submit}
          className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-full glass-panel p-2 pl-5"
        >
          <Search className="h-5 w-5 shrink-0 text-white/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask anything about Pakistan…"
            aria-label="Ask anything about Pakistan"
            className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          />
          <button type="submit" className="btn-gold shrink-0 px-5 py-2.5 text-sm">Ask</button>
        </motion.form>
        {!isAuthenticated && (
          <p className="mx-auto mt-3 max-w-2xl text-xs text-white/50">
            Sign up or log in to chat with Pakistan AI — it's free and only takes a moment.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5"
        >
          {SUGGESTED_QUESTIONS.map((sq) => (
            <button key={sq} onClick={() => navigate(`/ask?q=${encodeURIComponent(sq)}`)} className="chip">
              {sq}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <button onClick={() => navigate('/ask')} className="btn-gold">
            <Sparkles className="h-4 w-4" /> Ask Pakistan AI
          </button>
          <button onClick={() => navigate('/explore')} className="btn-ghost">
            <Compass className="h-4 w-4" /> Explore Pakistan
          </button>
        </motion.div>
      </div>
    </section>
  );
}
