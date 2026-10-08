import { Scale, FileCheck, AlertTriangle, BookOpen, Shield, Ban, Gavel, Mail, Sparkles } from 'lucide-react';
import PageSEO from '../../components/layout/PageSEO';
import { Card } from '../../components/kokonut/Card';
import { APP_NAME } from '../../config';
import { placeholderImage, PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function Terms() {
  const lastUpdated = 'October 6, 2026';

  const sections = [
    {
      id: 'acceptance',
      icon: FileCheck,
      title: '1. Acceptance of Terms',
      content: [
        `By accessing, browsing, or using ${APP_NAME} (including web interfaces, conversational AI features, and related Telegram bots), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and our Privacy Policy.`,
        'If you do not agree to these terms, please discontinue use of the platform immediately.',
      ],
    },
    {
      id: 'disclaimer-independence',
      icon: AlertTriangle,
      title: '2. Independent Educational Platform & Non-Affiliation',
      content: [
        `${APP_NAME} is an independent research, cultural encyclopedia, and artificial intelligence exploration project.`,
        `Non-Governmental Status: ${APP_NAME} is NOT an official agency, department, ministry, or authorized representative of the Government of Pakistan or any provincial government administration.`,
        'Official Matters: For official visa processing, consular affairs, passport administration, legal complaints, or official government declarations, users must consult authorized government portals (such as nadra.gov.pk or moiv.gov.pk).',
      ],
    },
    {
      id: 'ai-acceptable-use',
      icon: Sparkles,
      title: '3. AI Assistant & Acceptable Use Guidelines',
      content: [
        'Informational Purposes: Answers provided by Pakistan AI are generated using language models and semantic retrieval. While we strive for accuracy, AI responses may occasionally reflect nuances, estimates, or inaccuracies and should be verified independently.',
        'Prohibited Conduct: You agree not to use the platform to: (a) generate illegal, defamatory, hateful, or harmful content; (b) attempt prompt injection, model extraction, or bypass rate limits; (c) launch automated scrapers or denial-of-service traffic; or (d) misrepresent AI-generated content as official legal, medical, or government advice.',
        'Rate Limits: We maintain reasonable question quotas (e.g. guest limits and session limits) to protect shared server availability. Bypassing rate limits through multi-proxy or automated abuse is strictly prohibited.',
      ],
    },
    {
      id: 'intellectual-property',
      icon: BookOpen,
      title: '4. Intellectual Property & Content',
      content: [
        `Platform Design & Architecture: The software, algorithms, brand trademarks, and interface designs of ${APP_NAME} are the intellectual property of the platform creators and protected under applicable copyright and intellectual property laws.`,
        'Public & Historical Facts: Historical milestones, geographic coordinates, statistics from public data repositories (such as the World Bank and Pakistan Bureau of Statistics), and cultural knowledge are provided for educational and non-commercial public enrichment.',
      ],
    },
    {
      id: 'accounts',
      icon: Shield,
      title: '5. User Accounts & Credentials',
      content: [
        'Security Responsibility: You are responsible for safeguarding your login credentials and preventing unauthorized access to your account.',
        'Accuracy of Information: When creating an account, you agree to provide truthful and accurate email details. Multiple accounts created to circumvent fair usage policies may be terminated without notice.',
      ],
    },
    {
      id: 'liability',
      icon: Ban,
      title: '6. Limitation of Liability',
      content: [
        `"As-Is" Service: ${APP_NAME} is provided on an "as is" and "as available" basis without warranties of any kind, whether express, statutory, or implied.`,
        'No Consequential Damages: To the maximum extent permitted by law, the platform creators and operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use the platform, including travel delays, business decisions, or reliance on AI responses.',
      ],
    },
    {
      id: 'termination',
      icon: Gavel,
      title: '7. Termination & Modifications',
      content: [
        'Right to Suspend: We reserve the right to suspend or terminate accounts that violate these terms, abuse the AI engine, or engage in malicious activity.',
        'Modifications: We may update these Terms of Use periodically to reflect platform updates, regulatory changes, or new AI features. Continued use of the platform after updates constitutes acceptance of the revised terms.',
      ],
    },
    {
      id: 'contact',
      icon: Mail,
      title: '8. Contact & Legal Inquiries',
      content: [
        'For questions or legal inquiries regarding these Terms of Use, please reach out to our team:',
        'Email: hello@pakistan-ai.app',
        'Inquiries: Submit a message through our Contact & Support portal.',
      ],
    },
  ];

  return (
    <div>
      <PageSEO
        title="Terms of Use — Pakistan AI"
        description={`Read the Terms of Use, acceptable use policies, and informational guidelines governing ${APP_NAME}.`}
        canonical="/terms"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Use', url: '/terms' },
        ]}
      />

      {/* Hero Banner */}
      <section className="relative flex min-h-[38vh] items-end overflow-hidden bg-charcoal-950 text-white pb-12 pt-28">
        <img
          src={placeholderImage(PLACEHOLDER_IDS.history, 1920, 1080)}
          alt="Terms of Use and user agreements for Pakistan AI"
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
            <Scale className="h-3.5 w-3.5" />
            Legal & Guidelines
          </span>
          <h1 className="text-3xl font-display font-bold sm:text-5xl text-white">Terms of Use</h1>
          <p className="mt-3 text-sm text-charcoal-300 sm:text-base max-w-2xl mx-auto">
            Please review the terms and conditions that govern your access to the {APP_NAME} encyclopedia, tools, and AI assistant.
          </p>
          <p className="mt-2 text-xs text-charcoal-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-charcoal-50/60 pt-12">
        <div className="container-narrow space-y-8">
          {/* Important Notice Callout */}
          <Card className="p-6 sm:p-8 border-l-4 border-l-emerald-600 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-charcoal-900">Key Summary</h2>
                <p className="text-xs text-charcoal-500">Essential principles of using Pakistan AI</p>
              </div>
            </div>
            <p className="text-charcoal-700 leading-relaxed text-sm sm:text-base">
              {APP_NAME} is an independent, non-governmental informational platform. By using our services, you agree to respectful, lawful interactions with the AI assistant, acknowledge that AI content is for informational and educational enrichment, and agree to abide by community security standards.
            </p>
          </Card>

          {/* Detailed Terms */}
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
                    <p key={idx} className={paragraph.startsWith('Email:') || paragraph.startsWith('Inquiries:') ? 'font-semibold text-emerald-800' : ''}>
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
