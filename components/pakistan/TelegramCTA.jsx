import { Send } from 'lucide-react';
import AnimatedBackground from '../kokonut/AnimatedBackground';
import { TELEGRAM_LINK } from '../../config';

export default function TelegramCTA() {
  return (
    <section className="relative overflow-hidden bg-emerald-800 py-20 text-white">
      <AnimatedBackground />
      <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 flex flex-col items-center text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
          <Send className="h-7 w-7" />
        </span>
        <h2 className="text-h2 max-w-lg">Ask Pakistan AI, right from Telegram</h2>
        <p className="text-body-lg mt-3 max-w-md text-white/70">Chat with the same AI assistant without ever leaving Telegram.</p>
        <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="btn-gold mt-8">
          <Send className="h-4 w-4" /> Open Telegram Bot
        </a>
      </div>
    </section>
  );
}
