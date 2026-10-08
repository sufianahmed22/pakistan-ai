# 🇵🇰 Pakistan AI — Backend API & Services

The official Node.js / Express backend service powering the **Pakistan AI** ecosystem. Provides a high-performance REST API, Retrieval-Augmented Generation (RAG) AI assistant, Telegram bot integration, support ticketing, entity content management, and scheduled background workers.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Installation & Local Setup](#installation--local-setup)
- [Database Seeding](#database-seeding)
- [Deployment on Render](#deployment-on-render)
- [Telegram Bot & Webhook Configuration](#telegram-bot--webhook-configuration)
- [API Route Directory](#api-route-directory)
- [Health Check & Monitoring](#health-check--monitoring)
- [Security & Rate Limiting](#security--rate-limiting)

---

## 🏛️ Architecture Overview

The backend is built around a modular MVC/Service pattern:
- **`routes/`**: Express route definitions with input validation and rate limiting.
- **`controllers/`**: HTTP request unwrapping, response formatting, and status code assignment.
- **`services/`**: Core business logic, OpenAI integration, database interactions, and Telegram bot routines.
- **`models/`**: Mongoose schemas enforcing relational-like indexes and data validation.
- **`jobs/`**: Node-cron scheduled workers for knowledge base refresh, analytics aggregation, and data cleanup.
- **`validators/`**: Zod schemas validating all incoming request payloads before reaching controllers.

---

## ✨ Key Features

1. **AI Knowledge Engine (RAG)**:
   - Uses OpenAI (`gpt-4o-mini` and `text-embedding-3-small`) to answer queries regarding Pakistan's history, culture, tourism, economy, geography, and current affairs.
   - Vector and keyword matching for fast, accurate context retrieval.
   - Tiered rate-limiting: Guests (3 questions), Logged-in users (10 questions), Admins (configurable).

2. **Authentication & Multi-Factor Access**:
   - JWT-based authentication stored in secure HTTP-only cookies or Bearer headers.
   - Google OAuth integration with automatic account linking.
   - Backup password setting for Google accounts (allowing login even if Google services are unavailable).
   - Atomic password hashing via `bcryptjs` (12 salt rounds).

3. **Telegram Bot Service**:
   - 1-on-1 private chat support directly through Telegram.
   - Strict, atomic 5-message free trial per Telegram user (concurrency race-condition protected).
   - Secure webhook receiver with `X-Telegram-Bot-Api-Secret-Token` validation.
   - Automatic referral link back to the web application for unlimited chat.

4. **Content & Discovery Engine**:
   - Full CRUD APIs for Destinations, Cities, Provinces/Regions, Mountains, Rivers, Historical Eras, Facts, and FAQs.
   - Community reviews with user submission, reporting, and admin moderation workflows.
   - User bookmarks/saved places and synchronized search/view history.

5. **Support & Inquiries**:
   - Auto-escalating support tickets when users request human assistance in chat.
   - Threaded contact inquiry messaging between clients and admins.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (>= 18.18)
- **Framework**: Express 4.19 (ES Modules)
- **Database**: MongoDB with Mongoose ODM (MongoDB Atlas recommended)
- **AI & Embeddings**: OpenAI API (`openai@^4.56.0`)
- **Telegram Bot**: Telegraf 4.16
- **Validation**: Zod 3.23
- **Security**: Helmet, express-mongo-sanitize, express-rate-limit, bcryptjs, jsonwebtoken
- **Scheduling**: node-cron

---

## 📦 Prerequisites

- **Node.js**: v18.18.0 or higher
- **MongoDB**: Connection URI (Local instance or free MongoDB Atlas cluster)
- **OpenAI API Key**: For AI question answering (optional in local development)
- **Telegram Bot Token**: From [@BotFather](https://t.me/BotFather) (optional if not using the bot)

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` in the `Backend/` folder:

```bash
cp .env.example .env
```

### Essential Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Local server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `min-32-chars-random-string` |
| `COOKIE_SECRET` | Cookie signing secret | `random-cookie-secret` |
| `SITE_URL` | Frontend client URL (for CORS & bot links) | `http://localhost:5173` |
| `CORS_ORIGIN` | Comma-separated allowed origins | `http://localhost:5173,https://your-site.netlify.app` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `TELEGRAM_BOT_TOKEN` | Token provided by @BotFather | `123456789:ABC...` |
| `TELEGRAM_WEBHOOK_URL`| Public HTTPS URL of backend (for webhooks) | `https://your-backend.onrender.com` |
| `TELEGRAM_WEBHOOK_SECRET` | Secret token verified on webhook delivery | `random-secure-secret-token` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your-id.apps.googleusercontent.com` |

---

## 🚀 Installation & Local Setup

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server with live reload**:
   ```bash
   npm run dev
   ```

4. **Start in production mode**:
   ```bash
   npm run start
   ```

The server will initialize on `http://localhost:5000`.

---

## 🗄️ Database Seeding

Run predefined seed scripts to populate initial data and create the default admin account:

```bash
# Seed initial admin user (admin@pakistan-ai.app / 123456)
npm run seed:admin

# Populate all knowledge, cities, destinations, history, and facts
npm run seed

# Synchronize economic and demographic statistics from World Bank API
npm run sync:worldbank

# Synchronize country metadata from REST Countries
npm run sync:restcountries
```

---

## ☁️ Deployment on Render

1. Create a **New Web Service** on [Render](https://render.com).
2. Connect your repository and configure the settings:
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/health`
3. Add the **Environment Variables** matching your `.env` configuration.
4. **Keeping Free Instances Active**:
   - Render's free tier spins down web services after 15 minutes of inactivity.
   - Use a free uptime monitor (e.g., [Cron-Job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com)) to send a `GET` request every 10–14 minutes to:
     ```text
     https://your-backend.onrender.com/health
     ```

---

## 🤖 Telegram Bot & Webhook Configuration

When hosting on Render or any public HTTPS server:

1. Obtain your Bot Token from [@BotFather](https://t.me/BotFather).
2. Set `TELEGRAM_BOT_TOKEN` in your environment.
3. Set `TELEGRAM_WEBHOOK_URL=https://your-backend.onrender.com`.
4. *(Recommended)* Set `TELEGRAM_WEBHOOK_SECRET` to any random 32-character string.
5. On boot, the server registers the webhook automatically at:
   ```text
   https://your-backend.onrender.com/api/telegram/webhook
   ```
6. The bot allows any user to send up to **5 free questions** in private chat before presenting a friendly link to the website for unlimited chatting.

---

## 🛣️ API Route Directory

All API endpoints are mounted under `/api`:

| Base Path | Description | Access |
| :--- | :--- | :--- |
| `/health` | Server & Database Health status | Public |
| `/api/auth` | Register, login, Google OAuth, set/change password | Mixed |
| `/api/chat` | AI knowledge conversation pipeline | Guest / User / Admin |
| `/api/destinations` | Tourist destinations & attractions | Public / Admin |
| `/api/cities` | Major cities of Pakistan | Public / Admin |
| `/api/regions` | Provinces and territories | Public / Admin |
| `/api/mountains` | Peaks and mountain ranges (K2, Nanga Parbat, etc.) | Public / Admin |
| `/api/rivers` | Major rivers and waterways | Public / Admin |
| `/api/history` | Historical timeline and eras | Public / Admin |
| `/api/facts` | General facts and trivia | Public / Admin |
| `/api/faqs` | Frequently asked questions | Public / Admin |
| `/api/statistics` | Economic, demographic, and geographical stats | Public / Admin |
| `/api/reviews` | Community reviews, ratings, and reports | Authenticated |
| `/api/saved` | Bookmarked / saved places and cities | Authenticated |
| `/api/contact` | Contact form inquiries and threaded messaging | Public / User / Admin |
| `/api/tickets` | Support tickets with human agent routing | Public / User / Admin |
| `/api/telegram/webhook` | Incoming Telegram Bot API updates | Telegram only (Secret verified) |
| `/api/admin/*` | Administrative dashboards, settings, and metrics | Admin / Staff only |

---

## 💓 Health Check & Monitoring

The backend exposes an informative health endpoint at `/health` and `/api/health`:

```bash
curl https://your-backend.onrender.com/health
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-08T17:30:00.000Z",
    "uptime": "12h 45m 10s",
    "uptimeSeconds": 45910,
    "environment": "production",
    "database": {
      "status": "connected",
      "readyState": 1
    },
    "system": {
      "heapUsedMB": 68.4,
      "heapTotalMB": 95.2,
      "rssMB": 124.8
    }
  }
}
```

---

## 🛡️ Security & Rate Limiting

- **Rate Limits**:
  - `authLimiter`: Max 20 attempts per 15 minutes on password/login endpoints in production.
  - `chatLimiter`: Tiered access per 15-minute window (Guests: 3, Logged-in: 10, Admin: 30+).
  - `reviewLimiter`: Max 10 reviews/contacts/tickets per minute.
  - `generalLimiter`: 300 requests per 15 minutes across all general API routes.
- **Sanitization**: All MongoDB queries are sanitized with `express-mongo-sanitize` against NoSQL injection.
- **Headers**: Secured with `helmet` and custom `CORS` origin verification.
