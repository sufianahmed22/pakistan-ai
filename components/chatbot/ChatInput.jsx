import { useRef, useState } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { CHAT_MAX_CHARS } from '../../config';

export default function ChatInput({
  onSend,
  loading,
  autoFocus,
  disabled = false,
  placeholder = 'Ask anything about Pakistan…',
}) {
  const [value, setValue] = useState('');
  const ref = useRef(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || loading || disabled) return;
    onSend(trimmed);
    setValue('');
    if (ref.current) ref.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleChange = (e) => {
    if (disabled) return;
    const v = e.target.value.slice(0, CHAT_MAX_CHARS);
    setValue(v);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  return (
    <div
      className={`rounded-2xl border p-3 shadow-soft transition-colors ${
        disabled
          ? 'border-charcoal-200 bg-charcoal-50/80 cursor-not-allowed'
          : 'border-charcoal-200 bg-white'
      }`}
    >
      <textarea
        ref={ref}
        autoFocus={autoFocus && !disabled}
        disabled={disabled || loading}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder={placeholder}
        aria-label="Ask Pakistan AI"
        className={`w-full resize-none border-0 bg-transparent p-1 text-[15px] focus:outline-none ${
          disabled
            ? 'cursor-not-allowed text-charcoal-400 placeholder:text-charcoal-400'
            : 'text-charcoal-900 placeholder:text-charcoal-400'
        }`}
      />
      <div className="flex items-center justify-between pt-2">
        <span className={`text-xs ${value.length >= CHAT_MAX_CHARS ? 'text-red-500' : 'text-charcoal-300'}`}>
          {value.length}/{CHAT_MAX_CHARS}
        </span>
        <button
          onClick={submit}
          disabled={loading || !value.trim() || disabled}
          className="btn-primary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
