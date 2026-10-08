import Dialog from '../kokonut/Dialog';
import Button from '../kokonut/Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description, confirming }) {
  return (
    <Dialog open={open} onClose={onClose} title={title} className="max-w-sm">
      {description && <p className="text-body mb-6">{description}</p>}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" className="!bg-red-600 hover:!bg-red-700" onClick={onConfirm} loading={confirming}>
          Delete
        </Button>
      </div>
    </Dialog>
  );
}
