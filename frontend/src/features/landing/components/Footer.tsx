import { Globe, Link2, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

const navLinks = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Log in', to: ROUTES.LOGIN },
  { label: 'Register', to: ROUTES.REGISTER },
];

const quickLinks = [
  { label: 'Books', to: ROUTES.BOOKS },
  { label: 'Community', to: ROUTES.COMMUNITY },
  { label: 'Events', to: ROUTES.EVENTS },
];

const socialLinks = [
  { label: 'Website', href: '#', icon: Globe },
  { label: 'Community Forum', href: '#', icon: MessageCircle },
  { label: 'Newsletter', href: '#', icon: Link2 },
];

export function Footer() {
  return (
    <section aria-labelledby="footer-heading" className="bg-surface">
      <h2 id="footer-heading" className="sr-only">
        Site links
      </h2>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-foreground">Community Reading Club</p>
          <p className="mt-2 text-sm text-muted-foreground">
            A modern library platform for borrowing, reading clubs, and community events.
          </p>
        </div>

        <nav aria-label="Navigation">
          <p className="text-sm font-semibold text-foreground">Navigation</p>
          <ul className="mt-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Quick links">
          <p className="text-sm font-semibold text-foreground">Quick Links</p>
          <ul className="mt-3 flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-foreground">Contact</p>
          <a
            href="mailto:hello@communityreadingclub.org"
            className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail className="size-4" />
            hello@communityreadingclub.org
          </a>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
