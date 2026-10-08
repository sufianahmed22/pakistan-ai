import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-charcoal-400 ${className}`} role="status">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
