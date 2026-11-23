// Post-build static pre-rendering for SEO.
//
// The app is a client-side React SPA, so Google used to receive an empty
// <div id="root"> with generic head tags on every URL. This script runs after
// `vite build` and writes one static HTML file per public page (dist/<route>/index.html)
// containing the page's real title, description, canonical, Open Graph tags,
// JSON-LD breadcrumbs and a plain-HTML copy of the content with internal links.
// React (createRoot) replaces #root as soon as the JS loads, so users see the normal app.
// Tags are marked data-rh="true" so react-helmet-async replaces them instead of duplicating.
//
// Data comes from the backend API (paginated, max 100/page) at build time.
// It also generates dist/sitemap.xml from the same data.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const APP_NAME = 'Pakistan AI';
const TAGLINE = 'Discover Pakistan. Ask Anything.';
const DEFAULT_DESC =
  'Pakistan AI is an interactive encyclopedia, tourism guide, and AI assistant for everything about Pakistan — history, culture, geography, statistics, and more.';

// ---------- env ----------
async function loadEnv() {
  const fromFiles = {};
  for (const f of ['.env', '.env.production', '.env.local', '.env.production.local']) {
    try {
      const txt = await fs.readFile(path.join(ROOT, f), 'utf8');
      for (const line of txt.split(/\r?\n/)) {
        if (line.trim().startsWith('#')) continue;
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (m) fromFiles[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
      }
    } catch {
      /* file missing */
    }
  }
  return { ...fromFiles, ...process.env };
}

const env = await loadEnv();
const SITE_URL = (env.VITE_SITE_URL || env.VITE_CLIENT_URL || env.VITE_APP_URL || 'https://pakistan-ai.netlify.app').replace(/\/+$/, '');
const API_URL = (env.VITE_API_URL || (env.VITE_SERVER_URL ? `${env.VITE_SERVER_URL.replace(/\/+$/, '')}/api` : '')).replace(/\/+$/, '');
const STRICT = env.PRERENDER_STRICT ? env.PRERENDER_STRICT === 'true' : Boolean(env.NETLIFY);
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// ---------- helpers ----------
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const truncate = (s, n = 160) => {
  const t = clean(s);
  return t.length <= n ? t : `${t.slice(0, n - 1).replace(/\s+\S*$/, '')}…`;
};
const abs = (p) => (/^https?:\/\//.test(p) ? p : `${SITE_URL}${p.startsWith('/') ? p : `/${p}`}`);
const safeSlug = (s) => typeof s === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(s);
const num = (n) => (typeof n === 'number' ? n.toLocaleString('en-US') : n);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fullTitle(title) {
  if (!title) return `${APP_NAME} — ${TAGLINE}`;
  return title.includes(APP_NAME) ? title : `${title} | ${APP_NAME}`;
}

// ---------- API ----------
async function getJson(url) {
  let lastErr;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60000), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      console.warn(`  [retry ${attempt}/6] ${url}: ${err.message}`);
      await sleep(5000 * attempt); // gives a sleeping Render backend time to wake up
    }
  }
  throw lastErr;
}

async function fetchAll(endpoint) {
  const items = [];
  for (let page = 1; page < 200; page += 1) {
    const json = await getJson(`${API_URL}${endpoint}?limit=100&page=${page}`);
    const data = json?.data ?? json;
    const batch = Array.isArray(data) ? data : data?.items ?? [];
    items.push(...batch);
    if (Array.isArray(data) || !data?.hasNextPage || batch.length === 0) break;
  }
  return items;
}

async function loadData() {
  const data = { cities: [], places: [], regions: [], mountains: [], rivers: [], articles: [], history: [], facts: [], faqs: [] };
  if (!API_URL) {
    const msg = 'VITE_API_URL is not set - cannot fetch content for pre-rendering.';
    if (STRICT) throw new Error(msg);
    console.warn(`! ${msg} Only static pages will be pre-rendered.`);
    return data;
  }
  const endpoints = {
    cities: '/cities',
    places: '/destinations',
    regions: '/regions',
    mountains: '/mountains',
    rivers: '/rivers',
    articles: '/articles',
    history: '/history',
    facts: '/facts',
    faqs: '/faqs',
  };
  for (const [key, endpoint] of Object.entries(endpoints)) {
    try {
      data[key] = await fetchAll(endpoint);
      console.log(`  ${key}: ${data[key].length}`);
    } catch (err) {
      if (STRICT) throw new Error(`Could not fetch ${endpoint}: ${err.message}`);
      console.warn(`! Could not fetch ${endpoint} (${err.message}) - skipping.`);
    }
  }
  if (STRICT && data.cities.length + data.places.length + data.regions.length === 0) {
    throw new Error('API returned no cities/places/regions - refusing to deploy empty pages.');
  }
  return data;
}

// ---------- HTML fragments ----------
function mdToHtml(md) {
  const lines = String(md ?? '').replace(/\r/g, '').split('\n');
  const out = [];
  let list = [];
  let para = [];
  const inline = (t) =>
    esc(t.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]{1,3}/g, ''));
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list.length) out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join('')}</ul>`);
    list = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const h = line.match(/^#{1,6}\s+(.*)$/);
    const li = line.match(/^[-*+]\s+(.*)$/) || line.match(/^\d+\.\s+(.*)$/);
    if (h) {
      flushPara();
      flushList();
      out.push(`<h2>${inline(h[1])}</h2>`);
    } else if (li) {
      flushPara();
      list.push(li[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return out.join('\n');
}

const section = (heading, text) => (clean(text) ? `<section><h2>${esc(heading)}</h2>${mdToHtml(text)}</section>` : '');
const bullets = (heading, arr) =>
  Array.isArray(arr) && arr.length ? `<section><h2>${esc(heading)}</h2><ul>${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>` : '';
const fact = (label, value) => (value || value === 0 ? `<li><strong>${esc(label)}:</strong> ${esc(value)}</li>` : '');

const NAV_LINKS = [
  ['/', 'Home'],
  ['/explore', 'Explore'],
  ['/regions', 'Regions'],
  ['/cities', 'Cities'],
  ['/places', 'Places to Visit'],
  ['/tourism', 'Tourism'],
  ['/mountains', 'Mountains'],
  ['/rivers', 'Rivers'],
  ['/history', 'History'],
  ['/culture', 'Culture'],
  ['/geography', 'Geography'],
  ['/statistics', 'Statistics'],
  ['/facts', 'Fast Facts'],
  ['/articles', 'Articles'],
  ['/faq', 'FAQ'],
  ['/about', 'About'],
];
const navHtml = () =>
  `<nav aria-label="Main">${NAV_LINKS.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join(' · ')}</nav>`;

const linkList = (items, basePath, nameKey = 'name', descKey = 'description') =>
  `<ul>${items
    .filter((i) => safeSlug(i.slug))
    .map((i) => {
      const d = truncate(i[descKey] || i.summary, 140);
      return `<li><a href="${basePath}/${encodeURIComponent(i.slug)}">${esc(i[nameKey] || i.title)}</a>${d ? ` — ${esc(d)}` : ''}</li>`;
    })
    .join('')}</ul>`;

// ---------- page definitions ----------
function buildPages(d) {
  const pages = [];
  const add = (p) => pages.push({ type: 'website', priority: '0.7', changefreq: 'monthly', lastmod: BUILD_DATE, indexable: true, ...p });
  const crumbs = (name, route) => [{ name: 'Home', url: '/' }, ...(route === '/' ? [] : [{ name, url: route }])];
  const upd = (i) => (i.updatedAt ? String(i.updatedAt).slice(0, 10) : BUILD_DATE);

  const S = (route, title, description, extra = {}) =>
    add({ route, title, description, h1: extra.h1 || title, breadcrumbs: crumbs(extra.h1 || title, route), ...extra });

  const publishedArticles = d.articles.filter((a) => a.published !== false);

  add({
    route: '/',
    title: undefined,
    description: DEFAULT_DESC,
    h1: `${APP_NAME} — ${TAGLINE}`,
    priority: '1.0',
    changefreq: 'daily',
    breadcrumbs: [],
    body: () => `
      <p>${esc(DEFAULT_DESC)}</p>
      <section><h2>Regions of Pakistan</h2>${linkList(d.regions, '/regions')}</section>
      <section><h2>Cities</h2>${linkList(d.cities, '/cities')}</section>
      <section><h2>Places to visit</h2>${linkList(d.places, '/places')}</section>
      <section><h2>Mountains</h2>${linkList(d.mountains, '/mountains')}</section>
      <section><h2>Rivers</h2>${linkList(d.rivers, '/rivers')}</section>
      <section><h2>Articles</h2>${linkList(publishedArticles, '/articles', 'title', 'summary')}</section>`,
  });

  S('/explore', 'Explore Pakistan', "Explore Pakistan's regions, cities, destinations, mountains, rivers and statistics.", {
    priority: '0.9',
    changefreq: 'weekly',
  });
  S('/regions', 'Regions', "Pakistan's four provinces and three territories, each with a distinct geography and culture.", {
    priority: '0.9',
    changefreq: 'weekly',
    body: () => linkList(d.regions, '/regions'),
  });
  S('/cities', 'Cities', 'From the megacity of Karachi to the historic streets of Lahore and the planned capital, Islamabad.', {
    priority: '0.9',
    changefreq: 'weekly',
    body: () => linkList(d.cities, '/cities'),
  });
  S('/places', 'Places to Visit', 'Curated destinations across Pakistan — valleys, deserts, coastlines and ancient cities.', {
    priority: '0.9',
    changefreq: 'weekly',
    body: () => linkList(d.places, '/places'),
  });
  S('/tourism', 'Tourism in Pakistan — Destinations & Travel Guide', "Plan your journey through Pakistan's mountains, valleys, deserts, and historic cities with curated travel insights.", {
    h1: 'Tourism in Pakistan',
    priority: '0.9',
    changefreq: 'weekly',
    body: () => linkList(d.places.slice(0, 40), '/places'),
  });
  S('/mountains', 'Mountains of Pakistan — Peaks & Ranges', "Pakistan is home to K2 and five of the world's fourteen 8,000-metre peaks across the Karakoram, Himalaya, and Hindu Kush.", {
    h1: 'Mountains of Pakistan',
    priority: '0.8',
    changefreq: 'weekly',
    body: () => linkList(d.mountains, '/mountains'),
  });
  S('/rivers', 'Rivers of Pakistan — Indus Basin System', "The Indus River and its tributaries form the backbone of Pakistan's agriculture, irrigation, and civilization.", {
    h1: 'Rivers of Pakistan',
    priority: '0.8',
    changefreq: 'weekly',
    body: () => linkList(d.rivers, '/rivers'),
  });
  S(
    '/history',
    'History of Pakistan — Interactive Timeline (1947 to 2025 & Ancient Eras)',
    "Explore an interactive chronological chronicle of Pakistan's history: from the Indus Valley Civilization to 1947 Independence, key modern milestones, and 2025 technological advancements.",
    {
      h1: 'History of Pakistan',
      priority: '0.8',
      body: () =>
        `<ol>${[...d.history]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((e) => `<li><strong>${esc(e.title)}</strong> (${esc(e.yearRange)})${e.description ? ` — ${esc(truncate(e.description, 300))}` : ''}</li>`)
          .join('')}</ol>`,
    }
  );
  S('/culture', 'Culture of Pakistan — Arts, Languages & Heritage', 'Explore the languages, festivals, music, truck art, and living traditions that shape Pakistani culture.', {
    h1: 'Culture of Pakistan',
    priority: '0.8',
    changefreq: 'weekly',
    body: () =>
      linkList(
        publishedArticles.filter((a) => /cultur|food|art|music|festival|language|tradition/i.test(`${a.category} ${(a.tags || []).join(' ')}`)),
        '/articles',
        'title',
        'summary'
      ),
  });
  S('/geography', 'Geography of Pakistan', "Pakistan's geography — mountain ranges, river systems, plains, plateaus and coastline.", { priority: '0.8' });
  S('/statistics', 'Statistics & National Indicators', 'Comprehensive statistics for Pakistan — population, provinces, geography, and economy, sourced from official World Bank and PBS census data.', {
    priority: '0.8',
    changefreq: 'weekly',
  });
  S('/facts', 'Fast Facts about Pakistan', "Bite-sized, sourced facts about Pakistan's geography, world records, culture, and history.", {
    priority: '0.7',
    body: () => `<ul>${d.facts.map((f) => `<li><strong>${esc(f.title)}</strong> — ${esc(truncate(f.description, 300))}</li>`).join('')}</ul>`,
  });
  S('/articles', 'Articles, Guides & Stories — Pakistan AI Encyclopedia', 'Explore in-depth articles, travel chronicles, cultural essays, and historical accounts celebrating Pakistan.', {
    h1: 'Articles, Guides & Stories',
    priority: '0.8',
    changefreq: 'weekly',
    body: () => linkList(publishedArticles, '/articles', 'title', 'summary'),
  });
  S('/faq', 'Frequently Asked Questions', 'Answers to common questions about Pakistan AI, verified data sources, and encyclopedia features.', {
    priority: '0.6',
    body: () => `<dl>${d.faqs.map((f) => `<dt>${esc(f.question)}</dt><dd>${esc(truncate(f.answer, 500))}</dd>`).join('')}</dl>`,
  });
  S('/ask', 'Ask Pakistan AI', "Ask Pakistan AI anything about Pakistan's history, culture, geography, and more.", { priority: '0.7' });
  S('/about', 'About Us — Pakistan AI', `About ${APP_NAME} — an independent AI-powered encyclopedia and tourism guide exploring Pakistan.`, { h1: 'About Pakistan AI', priority: '0.6' });
  S('/contact', 'Contact & Support', 'Get in touch with the Pakistan AI team for questions, feedback, or knowledge contributions.', { priority: '0.5' });
  S('/privacy', 'Privacy Policy — Pakistan AI', `Learn how ${APP_NAME} collects, protects, and handles your personal information, AI chat queries, and account data.`, {
    h1: 'Privacy Policy',
    priority: '0.3',
    changefreq: 'yearly',
  });
  S('/terms', 'Terms of Use — Pakistan AI', `Read the Terms of Use, acceptable use policies, and informational guidelines governing ${APP_NAME}.`, {
    h1: 'Terms of Use',
    priority: '0.3',
    changefreq: 'yearly',
  });

  // Detail pages
  for (const c of d.cities.filter((x) => safeSlug(x.slug))) {
    const route = `/cities/${c.slug}`;
    add({
      route,
      title: `${c.name} — City Guide & Highlights`,
      description: truncate(c.description) || `Explore ${c.name}, Pakistan — history, geography, attractions, and cultural highlights.`,
      h1: c.name,
      image: c.image,
      lastmod: upd(c),
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Cities', url: '/cities' }, { name: c.name, url: route }],
      body: () => `
        ${c.region?.name ? `<p>Region: ${safeSlug(c.region.slug) ? `<a href="/regions/${c.region.slug}">${esc(c.region.name)}</a>` : esc(c.region.name)}</p>` : ''}
        ${c.description ? `<p>${esc(c.description)}</p>` : ''}
        <ul>${fact('Population', num(c.population))}${fact('Elevation (m)', c.elevation)}</ul>
        ${section('History', c.history)}${section('Geography', c.geography)}${section('Culture', c.culture)}${section('Food', c.food)}${section('Tourism', c.tourism)}`,
    });
  }
  for (const p of d.places.filter((x) => safeSlug(x.slug))) {
    const route = `/places/${p.slug}`;
    add({
      route,
      title: `${p.name} — Places to Visit in Pakistan`,
      description: truncate(p.description) || `Plan your visit to ${p.name}, Pakistan — highlights, travel guide, history, and directions.`,
      h1: p.name,
      image: p.image,
      lastmod: upd(p),
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Places', url: '/places' }, { name: p.name, url: route }],
      body: () => `
        ${p.description ? `<p>${esc(p.description)}</p>` : ''}
        <ul>${fact('Location', p.location)}${fact('Category', p.category)}${fact('Best time to visit', p.bestTime)}</ul>
        ${bullets('Highlights', p.highlights)}${section('History', p.history)}${section('Travel information', p.travelInfo)}`,
    });
  }
  for (const r of d.regions.filter((x) => safeSlug(x.slug))) {
    const route = `/regions/${r.slug}`;
    const regionCities = d.cities.filter((c) => (c.region?.slug || c.region) === r.slug);
    add({
      route,
      title: `${r.name} — Provinces & Territories of Pakistan`,
      description: truncate(r.description) || `Discover ${r.name}, Pakistan — history, geography, major cities, and culture.`,
      h1: r.name,
      image: r.image,
      lastmod: upd(r),
      priority: '0.8',
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Regions', url: '/regions' }, { name: r.name, url: route }],
      body: () => `
        ${r.description ? `<p>${esc(r.description)}</p>` : ''}
        <ul>${fact('Capital', r.capital)}${fact('Population', num(r.population))}</ul>
        ${section('History', r.history)}${section('Geography', r.geography)}${section('Culture', r.culture)}${section('Food', r.food)}${section('Tourism', r.tourism)}
        ${regionCities.length ? `<section><h2>Cities in ${esc(r.name)}</h2>${linkList(regionCities, '/cities')}</section>` : ''}`,
    });
  }
  for (const m of d.mountains.filter((x) => safeSlug(x.slug))) {
    const route = `/mountains/${m.slug}`;
    add({
      route,
      title: `${m.name} (${num(m.elevationMeters)}m) - Peak & Climbing Guide`,
      description: truncate(m.description) || `${m.name} rises to an elevation of ${m.elevationMeters} meters in the ${m.range} range of Pakistan.`,
      h1: m.name,
      image: m.image,
      lastmod: upd(m),
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Mountains', url: '/mountains' }, { name: m.name, url: route }],
      body: () => `
        ${m.description ? `<p>${esc(m.description)}</p>` : ''}
        <ul>${fact('Elevation (m)', num(m.elevationMeters))}${fact('Range', m.range)}${fact('Region', m.region)}${fact('First ascent', m.firstAscent)}</ul>
        ${section('History', m.history)}${bullets('Climbing routes', m.climbingRoutes)}${bullets('Facts', m.facts)}`,
    });
  }
  for (const r of d.rivers.filter((x) => safeSlug(x.slug))) {
    const route = `/rivers/${r.slug}`;
    add({
      route,
      title: `${r.name} (${num(r.lengthKm)} km) - Rivers of Pakistan`,
      description: truncate(r.importance || r.description) || `${r.name} is one of Pakistan's vital waterways spanning ${r.lengthKm} kilometers.`,
      h1: r.name,
      image: r.image,
      lastmod: upd(r),
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Rivers', url: '/rivers' }, { name: r.name, url: route }],
      body: () => `
        ${r.description ? `<p>${esc(r.description)}</p>` : ''}
        <ul>${fact('Length (km)', num(r.lengthKm))}${fact('Source', r.source)}${fact('Route', r.route)}${fact('Regions', (r.regions || []).join(', '))}${fact('Tributaries', (r.tributaries || []).join(', '))}</ul>
        ${section('Importance', r.importance)}${bullets('Facts', r.facts)}`,
    });
  }
  for (const a of publishedArticles.filter((x) => safeSlug(x.slug))) {
    const route = `/articles/${a.slug}`;
    add({
      route,
      title: `${a.title} — Pakistan AI Encyclopedia`,
      description: truncate(a.summary || a.content) || 'Explore articles on Pakistani culture, history, and traditions.',
      h1: a.title,
      type: 'article',
      image: a.image,
      lastmod: upd(a),
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Articles', url: '/articles' }, { name: a.title, url: route }],
      body: () => `
        ${a.author ? `<p>By ${esc(a.author)}${a.year ? ` · ${esc(a.year)}` : ''}</p>` : ''}
        ${a.summary ? `<p><em>${esc(a.summary)}</em></p>` : ''}
        ${mdToHtml(a.content)}`,
    });
  }
  return pages;
}

// ---------- render ----------
function headTags(p) {
  const canonical = p.route === '/' ? SITE_URL : abs(p.route);
  const t = fullTitle(p.title);
  const image = p.image ? abs(p.image) : '';
  const tags = [
    `<title>${esc(t)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(p.description)}" />`,
    `<link data-rh="true" rel="canonical" href="${esc(canonical)}" />`,
    `<meta data-rh="true" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<meta data-rh="true" property="og:site_name" content="${APP_NAME}" />`,
    `<meta data-rh="true" property="og:title" content="${esc(t)}" />`,
    `<meta data-rh="true" property="og:description" content="${esc(p.description)}" />`,
    `<meta data-rh="true" property="og:url" content="${esc(canonical)}" />`,
    `<meta data-rh="true" property="og:type" content="${p.type}" />`,
    image ? `<meta data-rh="true" property="og:image" content="${esc(image)}" />` : '',
    `<meta data-rh="true" name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta data-rh="true" name="twitter:title" content="${esc(t)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${esc(p.description)}" />`,
    image ? `<meta data-rh="true" name="twitter:image" content="${esc(image)}" />` : '',
  ];
  if (p.breadcrumbs?.length) {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: p.breadcrumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: abs(b.url) })),
    };
    tags.push(`<script data-rh="true" type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.filter(Boolean).join('\n    ');
}

function render(shell, p) {
  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta[^>]+name="description"[^>]*>\s*/i, '')
    .replace(/<meta[^>]+name="robots"[^>]*>\s*/i, '');
  html = html.replace('</head>', `    ${headTags(p)}\n  </head>`);
  const body = `<main id="prerendered-content"><h1>${esc(p.h1)}</h1>${p.body ? p.body() : p.description ? `<p>${esc(p.description)}</p>` : ''}${navHtml()}</main>`;
  if (!/<div id="root"><\/div>/.test(html)) throw new Error('Could not find <div id="root"></div> in the built index.html');
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function sitemapXml(pages) {
  const rows = pages
    .filter((p) => p.indexable)
    .map(
      (p) => `  <url>
    <loc>${esc(p.route === '/' ? `${SITE_URL}/` : abs(p.route))}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`;
}

// ---------- main ----------
console.log(`Pre-rendering (site: ${SITE_URL}, api: ${API_URL || 'n/a'}, strict: ${STRICT})`);
try {
  await fs.access(path.join(DIST, 'index.html'));
} catch {
  console.error('dist/index.html not found - run `vite build` first.');
  process.exit(1);
}

// Keep a clean copy of the SPA shell: used by Netlify for dynamic/private routes.
const shellPath = path.join(DIST, 'app-shell.html');
let shell;
try {
  shell = await fs.readFile(shellPath, 'utf8');
} catch {
  shell = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
  await fs.writeFile(shellPath, shell);
}

let data;
try {
  data = await loadData();
} catch (err) {
  console.error(`Pre-render failed: ${err.message}`);
  process.exit(1); // fail the deploy rather than publishing empty pages
}

const pages = buildPages(data);
let written = 0;
for (const p of pages) {
  const file = p.route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, p.route.replace(/^\//, ''), 'index.html');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, render(shell, p));
  written += 1;
}
await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(pages));
console.log(`Pre-rendered ${written} pages and wrote sitemap.xml (${pages.filter((p) => p.indexable).length} URLs).`);
