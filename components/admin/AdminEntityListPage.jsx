import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminPageHeader from './AdminPageHeader';
import DataTable from './DataTable';
import SearchBar from './SearchBar';
import Button from '../kokonut/Button';
import EntityFormDialog from '../forms/EntityFormDialog';
import ConfirmDialog from '../forms/ConfirmDialog';
import { useAdminList } from '../../hooks/useAdminList';

// Fully generic admin CRUD page used by Cities / Regions / Destinations / Articles /
// Facts / FAQs — all share the same list -> search -> paginate -> create/edit/delete
// shape against a REST service, so this single component drives all of them.
export default function AdminEntityListPage({ title, description, service, columns, fields, entityLabel = 'item', extraParams = {} }) {
  const { items, page, setPage, totalPages, total, search, setSearch, loading, error, reload } = useAdminList(service, extraParams);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setBusy(true);
    try {
      if (editing) {
        await service.update(editing._id || editing.id, values);
        toast.success(`${entityLabel} updated`);
      } else {
        await service.create(values);
        toast.success(`${entityLabel} created`);
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      toast.error(err.message || `Failed to save ${entityLabel}`);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await service.remove(deleting._id || deleting.id);
      toast.success(`${entityLabel} deleted`);
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err.message || `Failed to delete ${entityLabel}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={total ? `${title} (${total})` : title}
        description={description}
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New {entityLabel}
          </Button>
        }
      />
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${title.toLowerCase()}…`} />
      </div>
      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={reload}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyProps={{ title: `No ${title.toLowerCase()} yet`, description: `Create the first ${entityLabel} to get started.` }}
        rowActions={(row) => (
          <div className="flex justify-end gap-1">
            <button className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100" onClick={() => openEdit(row)} aria-label={`Edit ${row.name || row.title}`}>
              <Pencil className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => setDeleting(row)} aria-label={`Delete ${row.name || row.title}`}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />
      <EntityFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${entityLabel}` : `New ${entityLabel}`}
        fields={fields}
        initialValues={editing}
        onSubmit={handleSubmit}
        submitting={busy}
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete this ${entityLabel}?`}
        description="This action cannot be undone."
        confirming={busy}
      />
    </div>
  );
}
