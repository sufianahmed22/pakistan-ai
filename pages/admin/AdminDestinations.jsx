import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import destinationService from '../../services/destinationService';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'region', label: 'Region', render: (row) => row.region?.name || '—' },
  { key: 'category', label: 'Category' },
  { key: 'slug', label: 'Slug' },
];

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'slug', label: 'Slug', required: true },
  { name: 'region', label: 'Region (Region ID)' },
  { name: 'category', label: 'Category' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'location', label: 'Location' },
  { name: 'coordinates.lat', label: 'Latitude', type: 'number' },
  { name: 'coordinates.lng', label: 'Longitude', type: 'number' },
  { name: 'bestTime', label: 'Best Time to Visit' },
  { name: 'travelInfo', label: 'Travel Info', type: 'textarea' },
  { name: 'history', label: 'History', type: 'textarea' },
  { name: 'highlights', label: 'Highlights (comma-separated)', type: 'textarea', array: true },
  { name: 'image', label: 'Main Image', type: 'image', folder: 'destinations' },
  { name: 'gallery', label: 'Gallery (optional, up to 3 images)', type: 'image', array: true, max: 3, folder: 'destinations' },
];

export default function AdminDestinations() {
  return (
    <AdminEntityListPage
      title="Destinations"
      description="Manage places to visit featured in the Tourism and Places sections."
      service={destinationService}
      columns={columns}
      fields={fields}
      entityLabel="destination"
    />
  );
}
