import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';

export default function NotFound() {
  return (
    <div className="section flex min-h-[70vh] flex-col items-center justify-center text-center">
      <PageSEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <Compass className="h-10 w-10 text-emerald-700 mb-4" />
      <p className="text-eyebrow mb-2">404</p>
      <h1 className="text-h2 mb-3">This page wandered off the map</h1>
      <p className="text-body mb-8 max-w-sm">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
