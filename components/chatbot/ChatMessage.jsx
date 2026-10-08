import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Sparkles, User, AlertTriangle } from 'lucide-react';
import MarkdownAnswer from './MarkdownAnswer';
import TypingIndicator from './TypingIndicator';

export default function ChatMessage({ message, onRegenerate, onRetry }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
      )}
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={
            isUser
              ? 'rounded-2xl rounded-tr-sm bg-emerald-700 px-4 py-3 text-white'
              : 'rounded-2xl rounded-tl-sm border border-charcoal-100 bg-white px-4 py-3 shadow-soft'
          }
        >
          {isUser ? (
            <p className="text-[15px] leading-relaxed">{message.content}</p>
          ) : message.pending ? (
            <TypingIndicator />
          ) : message.error ? (
            <div className="flex flex-col gap-2 text-red-600">
              <span className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4" /> {message.error}</span>
              <button onClick={() => onRetry?.(message.id)} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline">
                <RotateCcw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          ) : (
            <MarkdownAnswer content={message.content} />
          )}
        </div>
        {!isUser && !message.pending && !message.error && message.content && (
          <div className="mt-1.5 flex gap-3 pl-1">
            <button onClick={copy} className="inline-flex items-center gap-1 text-xs text-charcoal-400 hover:text-charcoal-700">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? 'Copied' : 'Copy'}
            </button>
            {onRegenerate && (
              <button onClick={() => onRegenerate(message.id)} className="inline-flex items-center gap-1 text-xs text-charcoal-400 hover:text-charcoal-700">
                <RotateCcw className="h-3 w-3" /> Regenerate
              </button>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal-800 text-white">
          <User className="h-4 w-4" />
        </span>
      )}
    </motion.div>
  );
}
