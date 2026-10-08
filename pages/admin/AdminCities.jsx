import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import cityService from '../../services/cityService';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'region', label: 'Region', render: (row) => row.region?.name || '—' },
  { key: 'population', label: 'Population' },
  { key: 'slug', label: 'Slug' },
];

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'slug', label: 'Slug', required: true },
  { name: 'region', label: 'Region (Region ID)' },
  { name: 'population', label: 'Population', type: 'number' },
  { name: 'populationYear', label: 'Population Year', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'geography', label: 'Geography', type: 'textarea' },
  { name: 'coordinates.lat', label: 'Latitude', type: 'number' },
  { name: 'coordinates.lng', label: 'Longitude', type: 'number' },
  { name: 'history', label: 'History', type: 'textarea' },
  { name: 'culture', label: 'Culture', type: 'textarea' },
  { name: 'food', label: 'Food', type: 'textarea' },
  { name: 'tourism', label: 'Tourism', type: 'textarea' },
  { name: 'image', label: 'Main Image', type: 'image', folder: 'cities' },
  { name: 'gallery', label: 'Gallery (optional, up to 3 images)', type: 'image', array: true, max: 3, folder: 'cities' },
];

export default function AdminCities() {
  return (
    <AdminEntityListPage
      title="Cities"
      description="Manage city profiles shown across the site."
      service={cityService}
      columns={columns}
      fields={fields}
      entityLabel="city"
    />
  );
}
