import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import historyService from '../../services/historyService';

const HISTORICAL_ERAS = [
  'IndusValleyCivilization',
  'Gandhara',
  'EarlyMuslimHistory',
  'DelhiSultanate',
  'MughalEra',
  'BritishPeriod',
  'PakistanMovement',
  'Independence1947',
  'ModernPakistan',
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'era', label: 'Era' },
  { key: 'yearRange', label: 'Year Range' },
  { key: 'order', label: 'Order' },
];

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'era', label: 'Era', type: 'select', required: true, options: HISTORICAL_ERAS.map((e) => ({ value: e, label: e })) },
  { name: 'yearRange', label: 'Year Range (e.g. "2500 BCE - 1900 BCE")', required: true },
  { name: 'order', label: 'Timeline Order', type: 'number', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image', label: 'Main Image', type: 'image', folder: 'history' },
  { name: 'gallery', label: 'Gallery (optional, up to 3 images)', type: 'image', array: true, max: 3, folder: 'history' },
];

export default function AdminHistory() {
  return (
    <AdminEntityListPage
      title="Historical Events"
      description="Manage the entries shown on the History timeline."
      service={historyService}
      columns={columns}
      fields={fields}
      entityLabel="historical event"
    />
  );
}
