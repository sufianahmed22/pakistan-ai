import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { RefreshCcw, Save } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AsyncState from '../../components/ui/AsyncState';
import { Card } from '../../components/kokonut/Card';
import Textarea from '../../components/kokonut/Textarea';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import Badge from '../../components/kokonut/Badge';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import knowledgeService from '../../services/knowledgeService';

// Matches spec §46-48: current answer, metadata, Refresh Answer button, edit form,
// version history list.
export default function AdminKnowledgeDetail() {
  const { id } = useParams();
  const { data: entry, loading, error, reload } = useFetch(() => knowledgeService.get(id), [id]);
  const { data: versions } = useFetch(() => knowledgeService.versions(id), [id]);
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await knowledgeService.update(id, { answer, question });
      toast.success('Entry updated');
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to update entry');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await knowledgeService.refresh(id);
      toast.success('Refresh requested — the answer will regenerate shortly');
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to request refresh');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Knowledge Entry" description={`ID: ${id}`} />
      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && !entry} onRetry={reload}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-h4 mb-4">Current Answer</h3>
              <Input label="Question" defaultValue={entry?.question} onChange={(e) => setQuestion(e.target.value)} className="mb-4" />
              <Textarea label="Answer" rows={8} defaultValue={entry?.answer} onChange={(e) => setAnswer(e.target.value)} />
              <div className="mt-4 flex gap-3">
                <Button onClick={handleSave} loading={saving}><Save className="h-4 w-4" /> Save Changes</Button>
                <Button variant="secondary" onClick={handleRefresh} loading={refreshing}><RefreshCcw className="h-4 w-4" /> Refresh Answer</Button>
              </div>
            </Card>
            <Card>
              <h3 className="text-h4 mb-4">Version History</h3>
              {versions?.length ? (
                <ul className="space-y-3">
                  {versions.map((v, i) => (
                    <li key={v._id || i} className="rounded-xl border border-charcoal-100 p-3">
                      <p className="text-caption mb-1">{formatDate(v.updatedAt || v.createdAt)}</p>
                      <p className="text-sm text-charcoal-700 line-clamp-3">{v.answer}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-body">No prior versions recorded.</p>
              )}
            </Card>
          </div>
          <Card className="h-fit">
            <h3 className="text-h4 mb-4">Metadata</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-charcoal-400">Category</dt><dd><Badge tone="charcoal">{entry?.category || 'General'}</Badge></dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-400">Status</dt><dd><Badge tone={entry?.status === 'active' ? 'emerald' : entry?.status === 'flagged' ? 'amber' : 'red'}>{entry?.status ? entry.status.charAt(0).toUpperCase() + entry.status.slice(1) : 'Active'}</Badge></dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-400">Hit Count</dt><dd>{entry?.usageCount ?? 0}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-400">Created</dt><dd>{entry?.createdAt ? formatDate(entry.createdAt) : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-400">Last Updated</dt><dd>{entry?.updatedAt ? formatDate(entry.updatedAt) : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-400">Refresh Interval</dt><dd>{entry?.refreshIntervalDays ? `${entry.refreshIntervalDays} days` : '—'}</dd></div>
            </dl>
          </Card>
        </div>
      </AsyncState>
    </div>
  );
}
