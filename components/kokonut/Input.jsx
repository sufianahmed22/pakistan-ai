import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input({ label, error, helperText, className, id, value, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal-700 dark:text-charcoal-200">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        value={value !== undefined ? (value ?? '') : undefined}
        className={cn(
          'input-field',
          error && 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/15 bg-red-50/30 dark:bg-red-950/20',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-600 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-charcoal-500 dark:text-charcoal-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
