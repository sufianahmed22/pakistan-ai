import { useState } from 'react';
import Dialog from '../kokonut/Dialog';
import Button from '../kokonut/Button';
import Textarea from '../kokonut/Textarea';

export default function ReportReviewDialog({ open, onClose, onSubmit, submitting }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please give a reason');
      return;
    }
    setError('');
    await onSubmit(reason.trim());
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} title="Report this review" className="max-w-sm">
      <p className="text-body mb-4 text-sm">
        Tell us what's wrong with this review. Our team will review it and decide whether to remove it.
      </p>
      <Textarea
        label="Reason"
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        error={error}
        placeholder="e.g. spam, offensive language, irrelevant content…"
      />
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" className="!bg-red-600 hover:!bg-red-700" onClick={handleSubmit} loading={submitting}>
          Submit Report
        </Button>
      </div>
    </Dialog>
  );
}
