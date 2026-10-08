import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from '../kokonut/Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 py-16 px-6 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      <p className="text-h4 text-red-800">Unable to load this content</p>
      <p className="text-body max-w-md">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
      )}
    </div>
  );
}
