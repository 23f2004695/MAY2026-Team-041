import { Globe, Link2, Mail, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { label: t('topUtilityBar.website'), href: '#', icon: Globe },
    { label: t('topUtilityBar.communityForum'), href: '#', icon: MessageCircle },
    { label: t('topUtilityBar.newsletter'), href: '#', icon: Link2 },
  ];

  return (
    <footer className="border-t border-border bg-surface px-6 py-4 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:hello@communityreadingclub.org"
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <Mail className="size-3.5" />
              hello@communityreadingclub.org
            </a>
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5" />
              +1 (555) 010-1234
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="hover:text-foreground"
              >
                <social.icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
        <p className="border-t border-border pt-3">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
