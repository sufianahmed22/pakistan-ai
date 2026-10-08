import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import riverService from '../../services/riverService';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'lengthKm', label: 'Length (km)' },
  { key: 'source', label: 'Source' },
  { key: 'slug', label: 'Slug' },
];

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'slug', label: 'Slug', required: true },
  { name: 'lengthKm', label: 'Length (km)', type: 'number' },
  { name: 'source', label: 'Source' },
  { name: 'route', label: 'Route', type: 'textarea' },
  { name: 'tributaries', label: 'Tributaries (comma-separated)', type: 'textarea', array: true },
  { name: 'regions', label: 'Regions (comma-separated)', type: 'textarea', array: true },
  { name: 'importance', label: 'Importance', type: 'textarea' },
  { name: 'image', label: 'Main Image', type: 'image', folder: 'rivers' },
  { name: 'gallery', label: 'Gallery (optional, up to 3 images)', type: 'image', array: true, max: 3, folder: 'rivers' },
];

export default function AdminRivers() {
  return (
    <AdminEntityListPage
      title="Rivers"
      description="Manage the rivers shown on the Geography and Statistics pages."
      service={riverService}
      columns={columns}
      fields={fields}
      entityLabel="river"
    />
  );
}
