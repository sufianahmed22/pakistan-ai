import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import LoadingState from '../components/ui/LoadingState';

// Public pages are eager (they need to be crawlable/fast on first paint).
import Home from '../pages/public/Home';
import Explore from '../pages/public/Explore';
import Regions from '../pages/public/Regions';
import RegionDetail from '../pages/public/RegionDetail';
import Cities from '../pages/public/Cities';
import CityDetail from '../pages/public/CityDetail';
import History from '../pages/public/History';
import Culture from '../pages/public/Culture';
import Tourism from '../pages/public/Tourism';
import Places from '../pages/public/Places';
import PlaceDetail from '../pages/public/PlaceDetail';
import Geography from '../pages/public/Geography';
import Mountains from '../pages/public/Mountains';
import MountainDetail from '../pages/public/MountainDetail';
import Rivers from '../pages/public/Rivers';
import RiverDetail from '../pages/public/RiverDetail';
import Articles from '../pages/public/Articles';
import ArticleDetail from '../pages/public/ArticleDetail';
import StatisticsPage from '../pages/public/Statistics';
import Facts from '../pages/public/Facts';
import Ask from '../pages/public/Ask';
import About from '../pages/public/About';
import FAQ from '../pages/public/FAQ';
import Contact from '../pages/public/Contact';
import Privacy from '../pages/public/Privacy';
import Terms from '../pages/public/Terms';
import NotFound from '../pages/public/NotFound';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Dashboard & Admin sections are route-level code-split — they're behind auth so
// there's no SEO/first-paint cost to lazy-loading them.
const DashboardOverview = lazy(() => import('../pages/user/DashboardOverview'));
const DashboardConversations = lazy(() => import('../pages/user/DashboardConversations'));
const DashboardSaved = lazy(() => import('../pages/user/DashboardSaved'));
const DashboardMessages = lazy(() => import('../pages/user/DashboardMessages'));
const DashboardProfile = lazy(() => import('../pages/user/DashboardProfile'));
const DashboardSettings = lazy(() => import('../pages/user/DashboardSettings'));

const AdminOverview = lazy(() => import('../pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminConversations = lazy(() => import('../pages/admin/AdminConversations'));
const AdminKnowledge = lazy(() => import('../pages/admin/AdminKnowledge'));
const AdminKnowledgeDetail = lazy(() => import('../pages/admin/AdminKnowledgeDetail'));
const AdminKnowledgeRefresh = lazy(() => import('../pages/admin/AdminKnowledgeRefresh'));
const AdminStatistics = lazy(() => import('../pages/admin/AdminStatistics'));
const AdminCities = lazy(() => import('../pages/admin/AdminCities'));
const AdminRegions = lazy(() => import('../pages/admin/AdminRegions'));
const AdminDestinations = lazy(() => import('../pages/admin/AdminDestinations'));
const AdminArticles = lazy(() => import('../pages/admin/AdminArticles'));
const AdminFacts = lazy(() => import('../pages/admin/AdminFacts'));
const AdminFaqs = lazy(() => import('../pages/admin/AdminFaqs'));
const AdminMountains = lazy(() => import('../pages/admin/AdminMountains'));
const AdminRivers = lazy(() => import('../pages/admin/AdminRivers'));
const AdminHistory = lazy(() => import('../pages/admin/AdminHistory'));
const AdminTickets = lazy(() => import('../pages/admin/AdminTickets'));
const AdminTelegram = lazy(() => import('../pages/admin/AdminTelegram'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminTraffic = lazy(() => import('../pages/admin/AdminTraffic'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminReviewReports = lazy(() => import('../pages/admin/AdminReviewReports'));

function Fallback() {
  return <LoadingState label="Loading…" className="min-h-[60vh]" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/regions/:slug" element={<RegionDetail />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/cities/:slug" element={<CityDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/:slug" element={<PlaceDetail />} />
        <Route path="/geography" element={<Geography />} />
        <Route path="/mountains" element={<Mountains />} />
        <Route path="/mountains/:slug" element={<MountainDetail />} />
        <Route path="/rivers" element={<Rivers />} />
        <Route path="/rivers/:slug" element={<RiverDetail />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/culture/:slug" element={<ArticleDetail />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/facts" element={<Facts />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Fallback />}>
              <DashboardOverview />
            </Suspense>
          }
        />
        <Route
          path="conversations"
          element={
            <Suspense fallback={<Fallback />}>
              <DashboardConversations />
            </Suspense>
          }
        />
        <Route
          path="saved"
          element={
            <Suspense fallback={<Fallback />}>
              <DashboardSaved />
            </Suspense>
          }
        />
        <Route
          path="messages"
          element={
            <Suspense fallback={<Fallback />}>
              <DashboardMessages />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<Fallback />}>
              <DashboardProfile />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<Fallback />}>
              <DashboardSettings />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Suspense fallback={<Fallback />}><AdminOverview /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<Fallback />}><AdminUsers /></Suspense>} />
        <Route path="conversations" element={<Suspense fallback={<Fallback />}><AdminConversations /></Suspense>} />
        <Route path="knowledge" element={<Suspense fallback={<Fallback />}><AdminKnowledge /></Suspense>} />
        <Route path="knowledge/:id" element={<Suspense fallback={<Fallback />}><AdminKnowledgeDetail /></Suspense>} />
        <Route path="knowledge-refresh" element={<Suspense fallback={<Fallback />}><AdminKnowledgeRefresh /></Suspense>} />
        <Route path="statistics" element={<Suspense fallback={<Fallback />}><AdminStatistics /></Suspense>} />
        <Route path="cities" element={<Suspense fallback={<Fallback />}><AdminCities /></Suspense>} />
        <Route path="regions" element={<Suspense fallback={<Fallback />}><AdminRegions /></Suspense>} />
        <Route path="destinations" element={<Suspense fallback={<Fallback />}><AdminDestinations /></Suspense>} />
        <Route path="articles" element={<Suspense fallback={<Fallback />}><AdminArticles /></Suspense>} />
        <Route path="facts" element={<Suspense fallback={<Fallback />}><AdminFacts /></Suspense>} />
        <Route path="faqs" element={<Suspense fallback={<Fallback />}><AdminFaqs /></Suspense>} />
        <Route path="mountains" element={<Suspense fallback={<Fallback />}><AdminMountains /></Suspense>} />
        <Route path="rivers" element={<Suspense fallback={<Fallback />}><AdminRivers /></Suspense>} />
        <Route path="history" element={<Suspense fallback={<Fallback />}><AdminHistory /></Suspense>} />
        <Route path="tickets" element={<Suspense fallback={<Fallback />}><AdminTickets /></Suspense>} />
        <Route path="telegram" element={<Suspense fallback={<Fallback />}><AdminTelegram /></Suspense>} />
        <Route path="analytics" element={<Suspense fallback={<Fallback />}><AdminAnalytics /></Suspense>} />
        <Route path="traffic" element={<Suspense fallback={<Fallback />}><AdminTraffic /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<Fallback />}><AdminSettings /></Suspense>} />
        <Route path="review-reports" element={<Suspense fallback={<Fallback />}><AdminReviewReports /></Suspense>} />
      </Route>
    </Routes>
  );
}
