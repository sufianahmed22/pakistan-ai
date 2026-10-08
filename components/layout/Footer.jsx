import { Link } from 'react-router-dom';
import { Send, Github, Twitter } from 'lucide-react';
import { FOOTER_LINKS } from '../../constants/nav';
import { APP_NAME, APP_TAGLINE, TELEGRAM_LINK } from '../../config';

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 text-white">
      <div className="container-wide px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-bold">{APP_NAME}</p>
            <p className="mt-2 text-white/60 max-w-xs">{APP_TAGLINE}</p>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
            >
              <Send className="h-4 w-4" /> Chat on Telegram
            </a>
            {/* <div className="mt-5 flex gap-3 text-white/50">
              <a href="#" aria-label="Twitter" className="hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="GitHub" className="hover:text-white"><Github className="h-5 w-5" /></a>
            </div> */}
          </div>
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-sm font-semibold uppercase tracking-wider text-white/40">{group}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white/70 hover:text-white text-sm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-white/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p>
              {APP_NAME} is an independent information platform and is not affiliated with the
              Government of Pakistan.
            </p>
            <p className="mt-1.5">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/60 shrink-0">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
