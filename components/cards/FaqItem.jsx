import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-charcoal-100 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-charcoal-900">{question}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-charcoal-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-body mt-3">{answer}</p>}
    </div>
  );
}
