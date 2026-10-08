import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Textarea = forwardRef(function Textarea({ label, error, className, id, value, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal-700 dark:text-charcoal-200">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        value={value !== undefined ? (value ?? '') : undefined}
        className={cn('input-field resize-none', error && 'border-red-400 focus:border-red-500', className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Textarea;
