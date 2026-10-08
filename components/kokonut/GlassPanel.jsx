import { cn } from '../../utils/cn';

export default function GlassPanel({ className, children, dark = true, ...props }) {
  return (
    <div className={cn(dark ? 'glass-panel' : 'glass-panel-light', 'rounded-2xl', className)} {...props}>
      {children}
    </div>
  );
}
