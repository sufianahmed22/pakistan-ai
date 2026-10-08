import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50/50 py-16 px-6 text-center">
      <Icon className="h-8 w-8 text-charcoal-300" aria-hidden="true" />
      <p className="text-h4 text-charcoal-700">{title}</p>
      {description && <p className="text-body max-w-md">{description}</p>}
      {action}
    </div>
  );
}
