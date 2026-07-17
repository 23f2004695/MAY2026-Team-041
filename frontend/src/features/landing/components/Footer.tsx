import { Globe, Link2, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

const navLinks = [
  { labelKey: 'footer.links.home', to: ROUTES.HOME },
  { labelKey: 'footer.links.login', to: ROUTES.LOGIN },
  { labelKey: 'footer.links.register', to: ROUTES.REGISTER },
];

const quickLinks = [
  { labelKey: 'footer.links.books', to: ROUTES.BOOKS },
  { labelKey: 'footer.links.community', to: ROUTES.COMMUNITY },
  { labelKey: 'footer.links.events', to: ROUTES.EVENTS },
];

const socialLinks = [
  { labelKey: 'footer.social.website', href: '#', icon: Globe },
  { labelKey: 'footer.social.forum', href: '#', icon: MessageCircle },
  { labelKey: 'footer.social.newsletter', href: '#', icon: Link2 },
];

export function Footer() {
  const { t } = useTranslation('common');
  return (
    <section aria-labelledby="footer-heading" className="bg-surface">
      <h2 id="footer-heading" className="sr-only">
        {t('footer.siteLinks')}
      </h2>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-foreground">{t('footer.brand')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('footer.tagline')}</p>
        </div>

        <nav aria-label={t('footer.navigation')}>
          <p className="text-sm font-semibold text-foreground">{t('footer.navigation')}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('footer.quickLinks')}>
          <p className="text-sm font-semibold text-foreground">{t('footer.quickLinks')}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-foreground">{t('footer.contact')}</p>
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
                key={social.labelKey}
                href={social.href}
                aria-label={t(social.labelKey)}
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
