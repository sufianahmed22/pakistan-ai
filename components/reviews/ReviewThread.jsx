import { useCallback, useState } from 'react';
import Button from '../kokonut/Button';
import AsyncState from '../ui/AsyncState';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import { useFetch } from '../../hooks/useFetch';
import reviewService from '../../services/reviewService';

// Mounted on the destination detail page. Owns pagination for the
// top-level review list; replies are owned/lazily-loaded by each
// ReviewItem itself.
export default function ReviewThread({ destinationId, cityId }) {
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState([]);

  const fetcher = useCallback(() => {
    if (cityId) {
      return reviewService.listForCity(cityId, { page, limit: 10 });
    }
    return reviewService.listForDestination(destinationId, { page, limit: 10 });
  }, [destinationId, cityId, page]);
  const { data, loading, error, reload } = useFetch(fetcher, [fetcher]);

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const allItems = page === 1 ? items : [...accumulated, ...items];

  const handlePosted = () => {
    setPage(1);
    setAccumulated([]);
    reload();
  };

  const handleChanged = () => {
    setAccumulated([]);
    setPage(1);
    reload();
  };

  const loadMore = () => {
    setAccumulated(allItems);
    setPage((p) => p + 1);
  };

  return (
    <div>
      <h2 className="text-h3 mb-4">Reviews {data?.total ? `(${data.total})` : ''}</h2>
      <div className="mb-6">
        <ReviewForm destinationId={destinationId} cityId={cityId} onPosted={handlePosted} />
      </div>
      <AsyncState
        loading={loading && page === 1}
        error={error}
        isEmpty={!loading && !error && allItems.length === 0}
        onRetry={reload}
        emptyProps={{ title: 'No reviews yet', description: 'Be the first to share your experience.' }}
      >
        <div className="space-y-4">
          {allItems.map((review) => (
            <ReviewItem
              key={review._id || review.id}
              review={review}
              destinationId={destinationId}
              onChanged={handleChanged}
            />
          ))}
        </div>
        {page < totalPages && (
          <div className="mt-6 text-center">
            <Button variant="secondary" onClick={loadMore} loading={loading && page > 1}>
              Load more reviews
            </Button>
          </div>
        )}
      </AsyncState>
    </div>
  );
}
