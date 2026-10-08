import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Globe, Mail, Code2, Sparkles, ExternalLink, Terminal } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import adminService from '../../services/adminService';

const DEFAULT_DEVELOPER = {
  name: 'Sufian Ahmed',
  title: 'Full-Stack AI Developer & Architect',
  bio: 'Passionate software engineer and AI builder dedicated to showcasing the rich cultural heritage, geography, history, and technological progress of Pakistan.',
  avatar: '',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  website: 'https://pakistan.techniiva.stream',
  email: 'contact@techniiva.stream',
  skills: ['Full-Stack Development', 'React & Tailwind', 'Node.js & Express', 'Vector Search AI', 'Cloud & DevOps'],
};

export default function DeveloperSection({ className = '', bgLight = true }) {
  const [developer, setDeveloper] = useState(DEFAULT_DEVELOPER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    adminService
      .developerInfo()
      .then((data) => {
        if (mounted && data && typeof data === 'object') {
          setDeveloper({
            name: data.name || DEFAULT_DEVELOPER.name,
            title: data.title || DEFAULT_DEVELOPER.title,
            bio: data.bio || DEFAULT_DEVELOPER.bio,
            avatar: data.avatar || DEFAULT_DEVELOPER.avatar,
            github: data.github || DEFAULT_DEVELOPER.github,
            linkedin: data.linkedin || DEFAULT_DEVELOPER.linkedin,
            website: data.website || DEFAULT_DEVELOPER.website,
            email: data.email || DEFAULT_DEVELOPER.email,
            skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : DEFAULT_DEVELOPER.skills,
          });
        }
      })
      .catch((err) => {
        // Silently use defaults on failure or offline
        console.debug('Failed to fetch developer info, using defaults', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className={`section relative overflow-hidden ${bgLight ? 'bg-gradient-to-b from-charcoal-50/60 to-white' : 'bg-charcoal-950 text-white'} ${className}`}>
      <div className="container-wide relative z-10">
        <SectionHeading
          eyebrow="Behind The Platform"
          title="Meet the Developer"
          subtitle="The engineering and vision powering Pakistan AI's conversational intelligence, encyclopedia, and interactive maps."
          align="center"
          dark={!bgLight}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-charcoal-200/80 bg-white/90 p-8 shadow-xl shadow-charcoal-900/5 backdrop-blur-md md:p-10 dark:border-white/10 dark:bg-charcoal-900/80">
            {/* Ambient decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
              {/* Avatar / Portrait */}
              <div className="relative flex-shrink-0">
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-emerald-600/30 bg-gradient-to-tr from-emerald-800 to-emerald-600 shadow-lg shadow-emerald-900/20 md:h-36 md:w-36">
                  {developer.avatar ? (
                    <img
                      src={developer.avatar}
                      alt={developer.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-white">
                      <Terminal className="h-10 w-10 text-emerald-200" />
                      <span className="mt-1 text-xs font-semibold tracking-wider text-emerald-100 uppercase">Creator</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white shadow-md ring-4 ring-white dark:ring-charcoal-900">
                  <Sparkles className="h-4 w-4 text-gold-300" />
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-charcoal-950 md:text-3xl dark:text-white">
                      {developer.name}
                    </h3>
                    <p className="mt-1 font-mono text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      {developer.title}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Verified Creator
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-charcoal-700 md:text-base dark:text-charcoal-300">
                  {developer.bio}
                </p>

                {/* Skills Chips */}
                {developer.skills && developer.skills.length > 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                    {developer.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-md border border-charcoal-200 bg-charcoal-50/80 px-2.5 py-1 text-xs font-medium text-charcoal-800 dark:border-white/10 dark:bg-white/5 dark:text-charcoal-200"
                      >
                        <Code2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links / Contact */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-charcoal-100 pt-5 md:justify-start dark:border-white/10">
                  {developer.github && (
                    <a
                      href={developer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-charcoal-200 bg-white px-3 py-1.5 text-xs font-medium text-charcoal-800 transition-colors hover:border-charcoal-400 hover:bg-charcoal-50 dark:border-white/10 dark:bg-charcoal-800 dark:text-charcoal-200 dark:hover:bg-charcoal-700"
                      title="GitHub Profile"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {developer.linkedin && (
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-charcoal-200 bg-white px-3 py-1.5 text-xs font-medium text-charcoal-800 transition-colors hover:border-charcoal-400 hover:bg-charcoal-50 dark:border-white/10 dark:bg-charcoal-800 dark:text-charcoal-200 dark:hover:bg-charcoal-700"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {developer.website && (
                    <a
                      href={developer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-charcoal-200 bg-white px-3 py-1.5 text-xs font-medium text-charcoal-800 transition-colors hover:border-charcoal-400 hover:bg-charcoal-50 dark:border-white/10 dark:bg-charcoal-800 dark:text-charcoal-200 dark:hover:bg-charcoal-700"
                      title="Portfolio / Website"
                    >
                      <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Portfolio</span>
                      <ExternalLink className="h-3 w-3 text-charcoal-400" />
                    </a>
                  )}

                  {developer.email && (
                    <a
                      href={`mailto:${developer.email}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-700/40 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                      title="Contact Email"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>{developer.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
