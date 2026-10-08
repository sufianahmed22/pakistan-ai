import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import {
  Globe,
  RefreshCw,
  ExternalLink,
  Layers,
  Map,
  Building2,
  MapPin,
  Mountain,
  Waves,
  Newspaper,
  CheckCircle2,
} from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Tabs from '../../components/kokonut/Tabs';
import { Card } from '../../components/kokonut/Card';
import Input from '../../components/kokonut/Input';
import Button from '../../components/kokonut/Button';
import ImageInput from '../../components/forms/ImageInput';
import AsyncState from '../../components/ui/AsyncState';
import { useFetch } from '../../hooks/useFetch';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';

const TABS = [
  { value: 'general', label: 'General' },
  { value: 'developer', label: 'Developer Profile' },
  { value: 'seo', label: 'Sitemap & SEO' },
  { value: 'logs', label: 'Logs' },
];

export default function AdminSettings() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'general';

  const { data, loading, error, reload } = useFetch(() => adminService.settings(), []);
  const {
    data: logs,
    loading: logsLoading,
    error: logsError,
    reload: reloadLogs,
  } = useFetch(
    () => (tab === 'logs' ? adminService.logs({ limit: 30 }) : Promise.resolve([])),
    [tab]
  );
  const {
    data: seoData,
    loading: seoLoading,
    error: seoError,
    reload: reloadSeo,
  } = useFetch(
    () => (tab === 'seo' ? adminService.seoStatus() : Promise.resolve(null)),
    [tab]
  );

  const [form, setForm] = useState({});
  const [skillsInput, setSkillsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [updatingSeo, setUpdatingSeo] = useState(false);

  useEffect(() => {
    setForm(data || {});
    if (data?.developerInfo?.skills) {
      setSkillsInput(
        Array.isArray(data.developerInfo.skills)
          ? data.developerInfo.skills.join(', ')
          : String(data.developerInfo.skills)
      );
    } else {
      setSkillsInput('');
    }
  }, [data]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        developerInfo: {
          ...(form.developerInfo || {}),
          skills: skillsArray,
        },
      };

      await adminService.updateSettings(payload);
      toast.success('Settings saved');
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSeo = async () => {
    setUpdatingSeo(true);
    try {
      const res = await adminService.rebuildSeo();
      toast.success(res.message || 'Sitemap & SEO updated successfully!');
      reloadSeo();
      reload();
    } catch (err) {
      toast.error(err.message || 'Failed to update sitemap & SEO');
    } finally {
      setUpdatingSeo(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="System Settings"
        description="Platform-wide configuration, search engine indexing, and audit logs."
      />
      <Tabs tabs={TABS} value={tab} defaultTab={tab} onChange={(v) => setParams({ tab: v })} className="mb-6" />

      {tab === 'general' && (
        <AsyncState loading={loading} error={error} isEmpty={false} onRetry={reload}>
          <Card className="max-w-xl">
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Knowledge Similarity Threshold"
                type="number"
                step="0.01"
                value={form.knowledgeSimilarityThreshold ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, knowledgeSimilarityThreshold: e.target.value }))}
              />
              <Input
                label="Default Refresh Interval (days)"
                type="number"
                value={form.defaultRefreshDays ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, defaultRefreshDays: e.target.value }))}
              />
              <Input
                label="Chat Rate Limit (per window)"
                type="number"
                value={form.chatRateLimit ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, chatRateLimit: e.target.value }))}
              />
              <Button type="submit" loading={saving}>
                Save Settings
              </Button>
            </form>
          </Card>
        </AsyncState>
      )}

      {tab === 'developer' && (
        <AsyncState loading={loading} error={error} isEmpty={false} onRetry={reload}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="border-b border-charcoal-100 pb-3">
                  <h3 className="font-bold text-base text-charcoal-900">Developer & Platform Creator</h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    This profile is showcased publicly in the Creator section on both the Home and About pages.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={form.developerInfo?.name ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        developerInfo: { ...(f.developerInfo || {}), name: e.target.value },
                      }))
                    }
                    placeholder="e.g. Sufian Ahmed"
                    required
                  />
                  <Input
                    label="Professional Title"
                    value={form.developerInfo?.title ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        developerInfo: { ...(f.developerInfo || {}), title: e.target.value },
                      }))
                    }
                    placeholder="e.g. Full-Stack AI Engineer & Architect"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1">Bio / Summary</label>
                  <textarea
                    rows={4}
                    value={form.developerInfo?.bio ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        developerInfo: { ...(f.developerInfo || {}), bio: e.target.value },
                      }))
                    }
                    placeholder="Write a brief intro about the creator..."
                    className="w-full text-sm rounded-xl border border-charcoal-200 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageInput
                    label="Avatar Photo (Upload file or URL)"
                    value={form.developerInfo?.avatar ?? ''}
                    onChange={(url) =>
                      setForm((f) => ({
                        ...f,
                        developerInfo: { ...(f.developerInfo || {}), avatar: url },
                      }))
                    }
                    folder="developer"
                  />
                  <Input
                    label="Contact Email"
                    type="email"
                    value={form.developerInfo?.email ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        developerInfo: { ...(f.developerInfo || {}), email: e.target.value },
                      }))
                    }
                    placeholder="contact@techniiva.stream"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Portfolio / Website"
                    value={form.developerInfo?.website ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        developerInfo: { ...(f.developerInfo || {}), website: e.target.value },
                      }))
                    }
                    placeholder="https://pakistan.techniiva.stream"
                  />
                  <Input
                    label="GitHub Profile"
                    value={form.developerInfo?.github ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        developerInfo: { ...(f.developerInfo || {}), github: e.target.value },
                      }))
                    }
                    placeholder="https://github.com/..."
                  />
                  <Input
                    label="LinkedIn Profile"
                    value={form.developerInfo?.linkedin ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        developerInfo: { ...(f.developerInfo || {}), linkedin: e.target.value },
                      }))
                    }
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <Input
                  label="Key Skills / Specialties (comma separated)"
                  value={skillsInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSkillsInput(val);
                    const skillsArray = val
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setForm((f) => ({
                      ...f,
                      developerInfo: { ...(f.developerInfo || {}), skills: skillsArray },
                    }));
                  }}
                  placeholder="Full-Stack, React, Node.js, AI & Embeddings, Cloud"
                />

                <Button type="submit" loading={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                  Save Developer Profile
                </Button>
              </form>
            </Card>

            {/* Public Live Preview Card */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2">Public Preview</p>
              <div className="rounded-2xl border border-emerald-900/20 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-emerald-950 text-white p-5 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-emerald-800 flex items-center justify-center font-bold text-xl text-gold-400 ring-2 ring-gold-400/40">
                    {form.developerInfo?.avatar ? (
                      <img src={form.developerInfo.avatar} alt="Dev avatar" className="h-full w-full object-cover" />
                    ) : (
                      (form.developerInfo?.name || 'S')[0]
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">
                      {form.developerInfo?.name || 'Sufian Ahmed'}
                    </h4>
                    <p className="text-xs text-gold-300 font-medium mt-0.5">
                      {form.developerInfo?.title || 'Full-Stack AI Developer'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/80 line-clamp-4 leading-relaxed">
                  {form.developerInfo?.bio || 'Passionate software engineer and AI builder dedicated to showcasing Pakistan.'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(Array.isArray(form.developerInfo?.skills) ? form.developerInfo.skills : ['React', 'Node.js', 'AI']).slice(0, 4).map((s, idx) => (
                    <span key={idx} className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-white/90 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AsyncState>
      )}

      {tab === 'seo' && (
        <AsyncState loading={seoLoading} error={seoError} isEmpty={false} onRetry={reloadSeo}>
          <div className="space-y-6 max-w-4xl">
            {/* Action & Overview Banner */}
            <Card className="p-6 border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Dynamic Sitemap & SEO Engine
                    </span>
                    {seoData?.data?.lastRebuild && (
                      <span className="text-xs text-charcoal-400">
                        Last rebuilt: {formatDate(seoData.data.lastRebuild)}
                      </span>
                    )}
                    {seoData?.data?.baseUrl && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-charcoal-100/90 text-charcoal-800 border border-charcoal-200" title="Active Base URL used for sitemap indexing">
                        Base URL: {seoData.data.baseUrl}
                      </span>
                    )}
                  </div>
                  <h2 className="text-h4 mt-2 font-display">Search Engine Indexing & Sitemap</h2>
                  <p className="text-body text-sm mt-1 max-w-xl">
                    Click the button to scan all public routes and live database entities (provinces, cities, places to visit, mountains, rivers, and culture articles) and rebuild the compliant <code className="text-emerald-800 bg-emerald-100/70 px-1 py-0.5 rounded font-mono text-xs">sitemap.xml</code> for search engines.
                  </p>
                </div>
                <Button
                  onClick={handleUpdateSeo}
                  loading={updatingSeo}
                  className="shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm flex items-center gap-2"
                >
                  <RefreshCw className={cn("h-4 w-4", updatingSeo && "animate-spin")} />
                  Update Sitemap & SEO
                </Button>
              </div>
            </Card>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-xs font-medium text-charcoal-500 uppercase tracking-wider">Total URLs Indexed</p>
                <p className="text-2xl font-bold font-display text-emerald-800 mt-1">
                  {seoData?.data?.cachedStats?.counts?.total ?? seoData?.data?.liveEntityCounts?.estimatedTotalUrls ?? 0}
                </p>
                <p className="text-xs text-charcoal-400 mt-0.5">In current sitemap.xml</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-charcoal-500 uppercase tracking-wider">Dynamic Pages</p>
                <p className="text-2xl font-bold font-display text-charcoal-900 mt-1">
                  {(seoData?.data?.liveEntityCounts?.regions || 0) +
                    (seoData?.data?.liveEntityCounts?.cities || 0) +
                    (seoData?.data?.liveEntityCounts?.destinations || 0) +
                    (seoData?.data?.liveEntityCounts?.mountains || 0) +
                    (seoData?.data?.liveEntityCounts?.rivers || 0) +
                    (seoData?.data?.liveEntityCounts?.articles || 0)}
                </p>
                <p className="text-xs text-charcoal-400 mt-0.5">Live from MongoDB</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-charcoal-500 uppercase tracking-wider">Static Routes</p>
                <p className="text-2xl font-bold font-display text-charcoal-900 mt-1">
                  {seoData?.data?.liveEntityCounts?.staticRoutes || 17}
                </p>
                <p className="text-xs text-charcoal-400 mt-0.5">Public sections</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-charcoal-500 uppercase tracking-wider">Payload Size</p>
                <p className="text-2xl font-bold font-display text-charcoal-900 mt-1">
                  {seoData?.data?.fileStatus?.fileSizeKb || seoData?.data?.cachedStats?.fileSizeKb || '0'} KB
                </p>
                <p className="text-xs text-charcoal-400 mt-0.5">XML document size</p>
              </Card>
            </div>

            {/* Indexed Entity Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-700" />
                Indexed Content Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 bg-charcoal-50/50">
                  <div className="flex items-center gap-2.5">
                    <Map className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">Regions</p>
                      <p className="text-xs text-charcoal-500">/regions/:slug</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-charcoal-800">
                    {seoData?.data?.cachedStats?.counts?.regions ?? seoData?.data?.liveEntityCounts?.regions ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 bg-charcoal-50/50">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">Cities</p>
                      <p className="text-xs text-charcoal-500">/cities/:slug</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-charcoal-800">
                    {seoData?.data?.cachedStats?.counts?.cities ?? seoData?.data?.liveEntityCounts?.cities ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 bg-charcoal-50/50">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">Places to Visit</p>
                      <p className="text-xs text-charcoal-500">/places/:slug</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-charcoal-800">
                    {seoData?.data?.cachedStats?.counts?.destinations ?? seoData?.data?.liveEntityCounts?.destinations ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 bg-charcoal-50/50">
                  <div className="flex items-center gap-2.5">
                    <Mountain className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">Mountains</p>
                      <p className="text-xs text-charcoal-500">/mountains/:slug</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-charcoal-800">
                    {seoData?.data?.cachedStats?.counts?.mountains ?? seoData?.data?.liveEntityCounts?.mountains ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 bg-charcoal-50/50">
                  <div className="flex items-center gap-2.5">
                    <Waves className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">Rivers</p>
                      <p className="text-xs text-charcoal-500">/rivers/:slug</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-charcoal-800">
                    {seoData?.data?.cachedStats?.counts?.rivers ?? seoData?.data?.liveEntityCounts?.rivers ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 bg-charcoal-50/50">
                  <div className="flex items-center gap-2.5">
                    <Newspaper className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">Articles & Culture</p>
                      <p className="text-xs text-charcoal-500">/articles/:slug</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-charcoal-800">
                    {seoData?.data?.cachedStats?.counts?.articles ?? seoData?.data?.liveEntityCounts?.articles ?? 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Links & File Endpoints */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal-900 mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-700" />
                Live SEO Endpoints
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 bg-white">
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">XML Sitemap</p>
                    <p className="text-xs text-charcoal-500">Standard XML sitemap protocol for crawlers</p>
                  </div>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    View /sitemap.xml <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-charcoal-100 bg-white">
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">Robots.txt Directive</p>
                    <p className="text-xs text-charcoal-500">Directs search engines to crawl public pages and discover sitemap</p>
                  </div>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    View /robots.txt <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </Card>

            {/* SEO Health Checklist */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                SEO Health & Readiness
              </h3>
              <div className="space-y-2.5 text-sm text-charcoal-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dynamic XML Sitemap configured with change frequencies and priorities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Robots.txt actively referencing canonical sitemap location</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Canonical URLs and PageSEO tags generated on every public route</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>OpenGraph & Twitter Card social meta tags active for high click-through</span>
                </div>
              </div>
            </Card>
          </div>
        </AsyncState>
      )}

      {tab === 'logs' && (
        <AsyncState loading={logsLoading} error={logsError} isEmpty={!logsLoading && !logs?.length} onRetry={reloadLogs} emptyProps={{ title: 'No logs recorded' }}>
          <Card>
            <ul className="divide-y divide-charcoal-100 text-sm">
              {logs?.map((log, i) => (
                <li key={log._id || i} className="py-3 flex justify-between gap-4">
                  <span className="text-charcoal-700">{log.message || log.action}</span>
                  <span className="text-charcoal-400 shrink-0">{formatDate(log.createdAt)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </AsyncState>
      )}
    </div>
  );
}
