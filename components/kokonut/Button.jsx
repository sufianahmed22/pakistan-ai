import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
  ghost: 'btn-ghost',
  link: 'text-emerald-700 font-semibold hover:underline underline-offset-4',
};

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: '',
  lg: 'text-lg px-8 py-4',
};

const Button = forwardRef(function Button(
  { as: Comp = 'button', variant = 'primary', size = 'md', loading, className, children, ...props },
  ref
) {
  if (variant === 'link') {
    return (
      <Comp ref={ref} className={cn(variants.link, className)} {...props}>
        {children}
      </Comp>
    );
  }
  return (
    <Comp ref={ref} className={cn(variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Comp>
  );
});

export default Button;
