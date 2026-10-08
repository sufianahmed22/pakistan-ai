import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/layout/Footer';
import { usePageViewTracking } from '../hooks/usePageViewTracking';

export default function PublicLayout() {
  usePageViewTracking();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
