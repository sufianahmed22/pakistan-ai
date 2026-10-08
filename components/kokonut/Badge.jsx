import { cn } from '../../utils/cn';

const tones = {
  emerald: 'bg-emerald-100 text-emerald-800',
  gold: 'bg-gold-100 text-gold-800',
  charcoal: 'bg-charcoal-100 text-charcoal-700',
  red: 'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-800',
};

export default function Badge({ tone = 'emerald', className, children }) {
  return <span className={cn('badge', tones[tone], className)}>{children}</span>;
}
