import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import factService from '../../services/factService';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
];

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'category', label: 'Category' },
  { name: 'description', label: 'Fact', type: 'textarea', required: true },
];

export default function AdminFacts() {
  return (
    <AdminEntityListPage
      title="Facts"
      description="Bite-sized facts surfaced on the /facts page and homepage."
      service={factService}
      columns={columns}
      fields={fields}
      entityLabel="fact"
    />
  );
}
