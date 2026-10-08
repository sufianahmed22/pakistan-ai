import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import regionService from '../../services/regionService';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'capital', label: 'Capital' },
  { key: 'population', label: 'Population' },
  { key: 'slug', label: 'Slug' },
];

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'slug', label: 'Slug', required: true },
  { name: 'capital', label: 'Capital' },
  { name: 'population', label: 'Population', type: 'number' },
  { name: 'populationYear', label: 'Population Year', type: 'number' },
  { name: 'areaKm2', label: 'Area (km²)', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'geography', label: 'Geography', type: 'textarea' },
  { name: 'history', label: 'History', type: 'textarea' },
  { name: 'culture', label: 'Culture', type: 'textarea' },
  { name: 'food', label: 'Food & Cuisine', type: 'textarea' },
  { name: 'tourism', label: 'Tourism', type: 'textarea' },
  { name: 'image', label: 'Main Image', type: 'image', folder: 'regions' },
  { name: 'gallery', label: 'Gallery (optional, up to 3 images)', type: 'image', array: true, max: 3, folder: 'regions' },
];

export default function AdminRegions() {
  return (
    <AdminEntityListPage
      title="Regions"
      description="Manage the provinces & territories shown on the interactive map."
      service={regionService}
      columns={columns}
      fields={fields}
      entityLabel="region"
    />
  );
}
