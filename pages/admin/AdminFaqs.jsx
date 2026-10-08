import AdminEntityListPage from '../../components/admin/AdminEntityListPage';
import faqService from '../../services/faqService';

const columns = [
  { key: 'question', label: 'Question' },
  { key: 'category', label: 'Category' },
];

const fields = [
  { name: 'question', label: 'Question', required: true },
  { name: 'answer', label: 'Answer', type: 'textarea', required: true },
  { name: 'category', label: 'Category' },
];

export default function AdminFaqs() {
  return (
    <AdminEntityListPage
      title="FAQs"
      description="Frequently asked questions shown on /faq and homepage prompts."
      service={faqService}
      columns={columns}
      fields={fields}
      entityLabel="FAQ"
    />
  );
}
