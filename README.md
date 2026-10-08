# 🇵🇰 Pakistan AI — Web Frontend

The official React client application for **Pakistan AI**. A modern, responsive web portal providing interactive AI conversations, cultural and geographical exploration, user bookmarks, support tickets, and an administrative management dashboard.

---

## 📋 Table of Contents

- [Overview & Experience](#overview--experience)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Installation & Local Development](#installation--local-development)
- [Building for Production](#building-for-production)
- [Deployment on Netlify](#deployment-on-netlify)
- [User & Admin Roles](#user--admin-roles)
- [PWA & Service Worker](#pwa--service-worker)

---

## 🎨 Overview & Experience

The Pakistan AI frontend is crafted with a Pakistan-inspired aesthetic featuring deep emerald greens, warm gold accents, clean typography, dark/light theme switching, and smooth Framer Motion micro-interactions.

Designed to be mobile-first, high-performance, and accessible, the application connects directly to the Express backend API.

---

## ✨ Key Features

1. **AI Chat Experience (`/ask`)**:
   - Interactive chat interface powered by the backend RAG knowledge engine.
   - Categorized query suggestions (History, Culture, Tourism, Geography, Governance, Economy).
   - Source citations and verified knowledge references attached to AI answers.
   - Support for guest access (3 questions) and authenticated tier (10 questions).

2. **Exploration & Discovery**:
   - **Destinations & Cities**: Detailed travel guides, regional tags, best visiting seasons, and photo galleries.
   - **Geography & Natural Wonders**: Dedicated indexes for mountain peaks (K2, Broad Peak) and rivers with interactive details.
   - **History Timeline**: Chronological era cards from Indus Valley and Gandhara to the Mughal era and modern Pakistan.
   - **Live Data**: Real-time weather, air quality indexes, currency exchange calculators, and national holiday calendars.

3. **User Dashboard (`/dashboard`)**:
   - **Overview**: Recent activity, saved places count, and shortcut actions.
   - **Profile**: Name, avatar, and contact email.
   - **Saved Places**: Bookmarked destinations and cities with 1-click toggling.
   - **Chat History**: Browse and resume past AI conversations.
   - **Support & Messages**: View status of support tickets and reply directly to admin inquiry threads.
   - **Security Settings**: Set or change passwords (including setting a backup password for accounts created via Google login).

4. **Admin Dashboard (`/admin`)**:
   - Full CRUD management of Destinations, Cities, Regions, Mountains, Rivers, Historical Eras, and Facts.
   - Knowledge Base inspector with vector status and manual refresh triggering.
   - Review moderation workflows (approve, reject, or flag community reviews).
   - Support ticket handling with Telegram forwarding and threaded staff replies.
   - Telegram user tracking and message quota monitoring.
   - Traffic metrics, popular search query charts, and system settings editor.

5. **SEO & Structured Data**:
   - Dynamic meta tags, OpenGraph previews, JSON-LD Schema.org structured data, and auto-linked sitemap/robots directives.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Motion & Transitions**: [Framer Motion](https://www.framer.com/motion/)
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Markdown Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Form Utilities**: React Hook Form
- **Authentication**: Native JWT Cookie / Bearer integration + Google Identity Services

---

## 📁 Project Structure

```text
Frontend/
├── components/          # Reusable UI components (Navbar, Footer, Modals, Cards)
│   ├── admin/           # Admin-specific tables, forms, and metric widgets
│   ├── chat/            # Chat bubbles, input box, suggested prompts
│   ├── common/          # Buttons, Badges, Tabs, Dialogs, Spinners
│   ├── layout/          # Page headers, navigation wrappers, sidebars
│   └── user/            # User profile forms and account widgets
├── config/              # App constants and environment bindings
├── constants/           # Pakistan categories, provinces, and navigation links
├── context/             # Global providers (AuthContext, ThemeContext, ToastContext)
├── hooks/               # Custom React hooks (useAuth, useToast, useDebounce)
├── layouts/             # MainLayout, DashboardLayout, AdminLayout
├── pages/               # Top-level page views (Public, User, Admin)
│   ├── admin/           # 15+ Admin views (Overview, Knowledge, Cities, Tickets...)
│   ├── public/          # Home, Ask, Destinations, Cities, History, Stats, etc.
│   └── user/            # Dashboard Overview, Profile, Saved, Settings
├── public/              # Static assets, favicon, robots.txt, sitemap, sw.js
│   └── _redirects       # Netlify Single-Page-App redirect rule
├── routes/              # App router (Protected routes, Admin routes, Lazy-loaded views)
├── services/            # Axios/Fetch API callers matching Backend endpoints
├── utils/               # Formatting, image placeholders, class mergers (clsx/tailwind-merge)
├── index.html           # HTML entrypoint with metadata and fonts
├── main.jsx             # React DOM root initialization
├── tailwind.config.js   # Custom colors (emerald, amber, slate) and animations
└── vite.config.js       # Vite bundle configuration with vendor code-splitting
```

---

## 📦 Prerequisites

- **Node.js**: v18.18.0 or higher
- **npm** or **yarn** / **pnpm**
- **Running Backend API**: The backend server running locally (`http://localhost:5000`) or deployed on Render.

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` in the `Frontend/` folder:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_SITE_URL` | Public frontend URL | `http://localhost:5173` |
| `VITE_API_URL` | Base URL of backend API | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your-id.apps.googleusercontent.com` |
| `VITE_TELEGRAM_BOT_USERNAME` | Telegram bot username (without @) | `pakistan_ai_bot` |

---

## 🚀 Installation & Local Development

1. **Navigate to the Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```text
   http://localhost:5173
   ```

---

## 🏗️ Building for Production

Compile and optimize assets with vendor chunk splitting:

```bash
npm run build
```

The production bundles will be written to the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## ☁️ Deployment on Netlify

### Method 1: Git Integration (Recommended)

1. Push your project to GitHub / GitLab / Bitbucket.
2. In [Netlify](https://www.netlify.com/), click **Add new site** > **Import an existing project**.
3. Select your repository and configure:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. In **Site Configuration > Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
   - `VITE_SITE_URL`: `https://your-site.netlify.app`
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `VITE_TELEGRAM_BOT_USERNAME`: Your bot username
5. Click **Deploy Site**.

### Single Page App (SPA) Routing
The file `Frontend/public/_redirects` is already included:
```text
/*    /index.html   200
```
This ensures direct URLs (e.g., `/destinations`, `/dashboard/settings`, `/ask`) load seamlessly without Netlify 404 errors on page refresh.

---

## 👥 User & Admin Roles

- **Guest**: Access public pages and send up to 3 AI questions.
- **Registered User**: Log in with Email or Google, send up to 10 questions per window, bookmark places, view conversation history, and submit reviews.
- **Admin / Staff**: Full access to the `/admin` portal to edit entities, manage tickets, refresh AI knowledge, and configure system settings. Default seeded credentials:
  - **Email**: `admin@pakistan-ai.app`
  - **Password**: `123456`

---

## 📱 PWA & Service Worker

A service worker (`public/sw.js`) is bundled to support caching static assets and handling background push notifications (configured in the Admin Notification center).
