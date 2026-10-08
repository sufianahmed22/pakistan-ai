import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import Textarea from '../kokonut/Textarea';
import Button from '../kokonut/Button';
import RatingStars from './RatingStars';
import { useAuth } from '../../hooks/useAuth';
import reviewService from '../../services/reviewService';

// Top-level mode (no parentId): textarea + optional star rating.
// Reply mode (parentId given): textarea only, no rating - the backend
// rejects a rating on a reply, this just keeps the UI honest about it.
export default function ReviewForm({ destinationId, cityId, parentId = null, onPosted, onCancel }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <p className="rounded-xl border border-charcoal-100 bg-charcoal-50/60 p-4 text-sm text-charcoal-600">
        <Link to="/login" state={{ from: location }} className="font-semibold text-emerald-700 hover:underline">
          Log in
        </Link>{' '}
        to leave a {parentId ? 'reply' : 'review or rating'}.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please write something first');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { text: text.trim() };
      if (parentId) {
        payload.parentId = parentId;
      } else if (rating > 0) {
        payload.rating = rating;
      }
      if (cityId) {
        await reviewService.createForCity(cityId, payload);
      } else {
        await reviewService.create(destinationId, payload);
      }
      toast.success(parentId ? 'Reply posted' : 'Review posted — thanks for sharing!');
      setText('');
      setRating(0);
      onPosted?.();
    } catch (err) {
      toast.error(err.message || 'Failed to post — please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!parentId && (
        <div>
          <p className="mb-1.5 text-sm font-medium text-charcoal-700">Your rating (optional)</p>
          <RatingStars value={rating} onChange={setRating} size="lg" />
        </div>
      )}
      <Textarea
        rows={parentId ? 2 : 4}
        placeholder={parentId ? 'Write a reply…' : 'Share your experience with this destination…'}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size={parentId ? 'sm' : 'md'} loading={submitting}>
          <Send className="h-4 w-4" /> {parentId ? 'Post Reply' : 'Post Review'}
        </Button>
      </div>
    </form>
  );
}
