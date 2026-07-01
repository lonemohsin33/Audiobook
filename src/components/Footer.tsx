import { FaGithub, FaLinkedin, FaEnvelope, FaPodcast } from 'react-icons/fa';

const SOCIALS = [
  { href: 'https://github.com/lonemohsin33', icon: FaGithub, label: 'GitHub' },
  { href: 'https://linkedin.com/in/lone-mohsin', icon: FaLinkedin, label: 'LinkedIn' },
  { href: 'mailto:lonemohsin4@gmail.com', icon: FaEnvelope, label: 'Email' },
  { href: 'https://lonemohsin.netlify.app', icon:FaPodcast, label: 'Portfolio'}
];

const Footer = () => (
  <footer className="shrink-0 h-16 bg-slate-800 text-slate-300 border-t border-slate-700">
    <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Mohsin Bashir Lone. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        {SOCIALS.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
