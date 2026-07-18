import { Globe, Link2, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { label: t('landing.footer.home'), to: ROUTES.HOME },
    { label: t('landing.footer.login'), to: ROUTES.LOGIN },
    { label: t('landing.footer.register'), to: ROUTES.REGISTER },
  ];

  const quickLinks = [
    { label: t('nav.pricing'), to: ROUTES.PRICING },
    { label: t('landing.footer.books'), to: ROUTES.BOOKS },
    { label: t('landing.footer.community'), to: ROUTES.COMMUNITY },
    { label: t('landing.footer.events'), to: ROUTES.EVENTS },
  ];

  const socialLinks = [
    { label: t('landing.footer.website'), href: '#', icon: Globe },
    { label: t('landing.footer.communityForum'), href: '#', icon: MessageCircle },
    { label: t('landing.footer.newsletter'), href: '#', icon: Link2 },
  ];

  return (
    <section aria-labelledby="footer-heading" className="bg-surface">
      <h2 id="footer-heading" className="sr-only">
        {t('landing.footer.heading')}
      </h2>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-foreground">{t('landing.footer.brand')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('landing.footer.description')}</p>
        </div>

        <nav aria-label={t('landing.footer.navigation')}>
          <p className="text-sm font-semibold text-foreground">{t('landing.footer.navigation')}</p>
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

        <nav aria-label={t('landing.footer.quickLinks')}>
          <p className="text-sm font-semibold text-foreground">{t('landing.footer.quickLinks')}</p>
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
          <p className="text-sm font-semibold text-foreground">{t('landing.footer.contact')}</p>
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
