import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

// Uniform wrapper used across the app so every list/detail page handles
// loading / error / empty consistently against real API responses.
export default function AsyncState({ loading, error, isEmpty, onRetry, emptyProps, loadingLabel, children }) {
  if (loading) return <LoadingState label={loadingLabel} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (isEmpty) return <EmptyState {...emptyProps} />;
  return children;
}
