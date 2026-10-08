import { Shield, Lock, Cpu, Eye, Database, Globe, UserCheck, Mail, Sparkles } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import { Card } from '../../components/kokonut/Card';
import { APP_NAME } from '../../config';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function Privacy() {
  const lastUpdated = 'October 6, 2026';

  const sections = [
    {
      id: 'collection',
      icon: Eye,
      title: '1. Information We Collect',
      content: [
        'Account Information: When you create an account, we collect your name, email address, and encrypted credentials. You may also provide profile preferences.',
        'Chat & Query Data: Questions submitted to Pakistan AI are processed to generate conversational responses. For registered users, conversation history is stored to enable chat continuity and review. For guest users, session counters are maintained locally.',
        'Technical & Analytics Data: We collect standard technical signals including browser type, operating system, IP address, page views, and referring URLs to optimize service performance and defend against denial-of-service attempts.',
        'Contact & Feedback Submissions: If you submit an inquiry through our contact form or support tickets, we collect your message content and contact email to provide direct assistance.',
      ],
    },
    {
      id: 'ai-processing',
      icon: Cpu,
      title: '2. AI Processing & Third-Party LLMs',
      content: [
        'Query Inference: Questions submitted to the conversational assistant are processed using secure OpenAI API models (such as GPT-4o-mini and OpenAI text-embedding models) and our proprietary MongoDB vector search index.',
        'Data Boundary: Your queries are transmitted over encrypted HTTPS connections directly to AI inference pipelines. We do not sell your personal data or query history to third-party data brokers or advertising networks.',
        'Vector Embeddings: Factual responses and knowledge base entries are pre-computed as mathematical vector representations to retrieve verified encyclopedia facts with maximum accuracy.',
      ],
    },
    {
      id: 'cookies',
      icon: Database,
      title: '3. Cookies & Local Storage',
      content: [
        'Essential Cookies: We use secure HTTP-only cookies and JWT tokens to preserve authentication sessions when you log in.',
        'Session Storage & Local Preferences: Non-sensitive preferences, such as guest question counts and theme settings, are maintained locally in your browser storage.',
        'No Third-Party Ad Trackers: Pakistan AI does not deploy third-party advertising trackers or behavioral targeting pixels.',
      ],
    },
    {
      id: 'security',
      icon: Lock,
      title: '4. Data Security & Retention',
      content: [
        'Encryption & Protection: All network communications are secured using TLS/HTTPS. Passwords are cryptographically hashed using salted bcrypt before storage in MongoDB Atlas.',
        'Access Controls: Administrative privileges and database access are strictly partitioned using role-based access controls and monitored with automated audit logs.',
        'Retention Periods: Account data is retained as long as your account remains active. You may delete conversations or request complete account erasure at any time.',
      ],
    },
    {
      id: 'third-parties',
      icon: Globe,
      title: '5. Third-Party Infrastructure',
      content: [
        'OpenAI: Used strictly for real-time generative completions and semantic query embeddings under enterprise confidentiality standards.',
        'MongoDB Atlas & Supabase: Used for database hosting, vector indexing, and media asset storage.',
        'Telegram Bot: If you interact with our official Telegram bot, Telegram user IDs and chat timestamps are processed solely to deliver bot responses.',
      ],
    },
    {
      id: 'rights',
      icon: UserCheck,
      title: '6. Your Rights & Choices',
      content: [
        'Access & Review: You have the right to inspect all personal information and saved conversations associated with your account.',
        'Data Deletion: You can delete individual conversation threads directly from your user dashboard or request complete deletion of your account and associated records.',
        'Opt-out of Notifications: You can toggle web push notifications and Telegram alerts on or off at any time.',
      ],
    },
    {
      id: 'contact',
      icon: Mail,
      title: '7. Contact Us Regarding Privacy',
      content: [
        'If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact our privacy team:',
        'Email: hello@pakistan-ai.app',
        'Website: Submit an inquiry through our Contact & Support page.',
      ],
    },
  ];

  return (
    <div>
      <PageSEO
        title="Privacy Policy — Pakistan AI"
        description={`Learn how ${APP_NAME} collects, protects, and handles your personal information, AI chat queries, and account data.`}
        canonical="/privacy"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
        ]}
      />

      {/* Hero Banner */}
      <section className="relative flex min-h-[38vh] items-end overflow-hidden bg-charcoal-950 text-white pb-12 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.hero, 1920, 1080)}
          alt="Privacy and data protection in Pakistan AI"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-transparent" />
        <div className="container-wide relative z-10 px-6 sm:px-10 lg:px-16 text-center mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur-sm mb-3">
            <Shield className="h-3.5 w-3.5" />
            Security & Trust
          </span>
          <h1 className="text-3xl font-display font-bold sm:text-5xl text-white">Privacy Policy</h1>
          <p className="mt-3 text-sm text-charcoal-300 sm:text-base max-w-2xl mx-auto">
            Your trust is our highest priority. We are committed to transparency in how your data and queries are handled across {APP_NAME}.
          </p>
          <p className="mt-2 text-xs text-charcoal-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-charcoal-50/60 pt-12">
        <div className="container-narrow space-y-8">
          {/* Introduction Card */}
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold font-display text-charcoal-900">Our Commitment</h2>
                <p className="text-xs text-charcoal-500">Transparent, private, and user-first architecture</p>
              </div>
            </div>
            <p className="text-charcoal-700 leading-relaxed text-sm sm:text-base">
              {APP_NAME} provides an educational encyclopedia, tourism guide, and AI-assisted platform dedicated to Pakistan. This policy describes what data we collect, how it is processed to deliver accurate AI responses, and how your privacy rights are safeguarded at all times.
            </p>
          </Card>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map(({ id, icon: Icon, title, content }) => (
              <Card key={id} id={id} className="p-6 sm:p-8 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal-100 text-emerald-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-charcoal-900">{title}</h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-charcoal-700 leading-relaxed">
                  {content.map((paragraph, idx) => (
                    <p key={idx} className={paragraph.startsWith('Email:') || paragraph.startsWith('Website:') ? 'font-semibold text-emerald-800' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
