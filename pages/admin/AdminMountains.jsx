import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import mountainService from '../../services/mountainService';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'range', label: 'Range' },
  { key: 'elevationMeters', label: 'Elevation (m)' },
  { key: 'slug', label: 'Slug' },
];

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'slug', label: 'Slug', required: true },
  { name: 'elevationMeters', label: 'Elevation (meters)', type: 'number', required: true },
  { name: 'range', label: 'Mountain Range' },
  { name: 'region', label: 'Region' },
  { name: 'firstAscent', label: 'First Ascent' },
  { name: 'image', label: 'Main Image', type: 'image', folder: 'mountains' },
  { name: 'gallery', label: 'Gallery (optional, up to 3 images)', type: 'image', array: true, max: 3, folder: 'mountains' },
];

export default function AdminMountains() {
  return (
    <AdminEntityListPage
      title="Mountains"
      description="Manage the peaks shown on the Geography and Statistics pages."
      service={mountainService}
      columns={columns}
      fields={fields}
      entityLabel="mountain"
    />
  );
}
