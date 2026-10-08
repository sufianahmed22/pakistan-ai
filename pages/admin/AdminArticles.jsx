import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import articleService from '../../services/articleService';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'slug', label: 'Slug' },
  { key: 'published', label: 'Status', render: (row) => (row.published ? 'Published' : 'Draft') },
];

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'slug', label: 'Slug', required: true },
  { name: 'category', label: 'Category', type: 'select', options: [
    { value: 'history', label: 'History' },
    { value: 'culture', label: 'Culture' },
    { value: 'general', label: 'General' },
  ] },
  { name: 'content', label: 'Content', type: 'textarea', required: true },
  { name: 'summary', label: 'Summary', type: 'textarea' },
  { name: 'year', label: 'Year' },
  { name: 'author', label: 'Author' },
  { name: 'tags', label: 'Tags (comma-separated)', type: 'textarea', array: true },
  { name: 'image', label: 'Main Image', type: 'image', folder: 'articles' },
  { name: 'gallery', label: 'Gallery (optional, up to 3 images)', type: 'image', array: true, max: 3, folder: 'articles' },
  { name: 'published', label: 'Published (visible on the public site)', type: 'checkbox' },
];

export default function AdminArticles() {
  return (
    <AdminEntityListPage
      title="Articles"
      description="Long-form content used for History, Culture and general editorial pages."
      service={articleService}
      columns={columns}
      fields={fields}
      entityLabel="article"
      extraParams={{ admin: 'true' }}
    />
  );
}
