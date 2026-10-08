import { useState } from 'react';
import { toast } from 'sonner';
import { MessageCircle, Pencil, Trash2, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../kokonut/Button';
import Textarea from '../kokonut/Textarea';
import RatingStars from './RatingStars';
import ReviewForm from './ReviewForm';
import ReportReviewDialog from './ReportReviewDialog';
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime } from '../../utils/format';
import reviewService from '../../services/reviewService';

function isOwnReview(user, review) {
  if (!user || !review?.userId) return false;
  const authorId = review.userId._id || review.userId.id || review.userId;
  return String(authorId) === String(user.id);
}

function authorName(review) {
  return review.userId?.name || 'Pakistan AI user';
}

// One review or reply row. Top-level reviews additionally render a
// "Show N replies" toggle (replies load lazily on first expand, one level
// deep only - no nested Reply button on a reply).
export default function ReviewItem({ review, destinationId, isReply = false, onChanged }) {
  const { user, isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(review.text);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [replies, setReplies] = useState(null);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const own = isOwnReview(user, review);

  const loadReplies = async () => {
    setLoadingReplies(true);
    try {
      const data = await reviewService.listReplies(review._id || review.id);
      setReplies(data?.items || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load replies');
      setReplies([]);
    } finally {
      setLoadingReplies(false);
    }
  };

  const toggleReplies = () => {
    if (repliesOpen) {
      setRepliesOpen(false);
      return;
    }
    setRepliesOpen(true);
    if (replies === null) loadReplies();
  };

  // Used after a reply is edited/deleted, or a new reply is posted, so the
  // list re-fetches without collapsing the thread.
  const refreshReplies = () => {
    setRepliesOpen(true);
    loadReplies();
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await reviewService.update(review._id || review.id, { text: editText.trim() });
      toast.success('Updated');
      setEditing(false);
      onChanged?.();
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await reviewService.remove(review._id || review.id);
      toast.success('Deleted');
      onChanged?.();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  const handleReport = async (reason) => {
    setReporting(true);
    try {
      await reviewService.report(review._id || review.id, { reason });
      toast.success("Thanks — our team will review this.");
      setReportOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
    } finally {
      setReporting(false);
    }
  };

  const handleReplyPosted = () => {
    setShowReplyForm(false);
    refreshReplies();
  };

  return (
    <div className={isReply ? 'border-l-2 border-charcoal-100 pl-4' : ''}>
      <div className="rounded-xl border border-charcoal-100 bg-white p-4">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-charcoal-800">{authorName(review)}</span>
            {review.rating != null && <RatingStars value={review.rating} size="sm" />}
          </div>
          <span className="text-caption text-charcoal-400">
            {formatRelativeTime(review.createdAt)}
            {review.editedAt && ' · edited'}
          </span>
        </div>

        {editing ? (
          <div className="space-y-2">
            <Textarea rows={3} value={editText} onChange={(e) => setEditText(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => { setEditing(false); setEditText(review.text); }}>
                Cancel
              </Button>
              <Button size="sm" loading={saving} onClick={handleSaveEdit}>Save</Button>
            </div>
          </div>
        ) : (
          <p className="text-body text-sm text-charcoal-700">{review.text}</p>
        )}

        {!editing && (
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-charcoal-500">
            {!isReply && isAuthenticated && (
              <button onClick={() => setShowReplyForm((v) => !v)} className="flex items-center gap-1 hover:text-emerald-700">
                <MessageCircle className="h-3.5 w-3.5" /> Reply
              </button>
            )}
            {own && (
              <>
                <button onClick={() => setEditing(true)} className="flex items-center gap-1 hover:text-emerald-700">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </>
            )}
            {isAuthenticated && !own && (
              <button onClick={() => setReportOpen(true)} className="flex items-center gap-1 hover:text-red-600">
                <Flag className="h-3.5 w-3.5" /> Report
              </button>
            )}
            {!isReply && review.replyCount > 0 && (
              <button onClick={toggleReplies} className="ml-auto flex items-center gap-1 hover:text-emerald-700">
                {repliesOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {repliesOpen ? 'Hide' : 'Show'} {review.replyCount} {review.replyCount === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        )}

        {showReplyForm && (
          <div className="mt-3">
            <ReviewForm destinationId={destinationId} parentId={review._id || review.id} onPosted={handleReplyPosted} onCancel={() => setShowReplyForm(false)} />
          </div>
        )}
      </div>

      {repliesOpen && (
        <div className="mt-3 space-y-3">
          {loadingReplies && <p className="text-caption pl-4 text-charcoal-400">Loading replies…</p>}
          {!loadingReplies && replies?.map((reply) => (
            <ReviewItem key={reply._id || reply.id} review={reply} destinationId={destinationId} isReply onChanged={refreshReplies} />
          ))}
        </div>
      )}

      <ReportReviewDialog open={reportOpen} onClose={() => setReportOpen(false)} onSubmit={handleReport} submitting={reporting} />
    </div>
  );
}
