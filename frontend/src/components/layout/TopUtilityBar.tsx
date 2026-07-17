import { Globe, Link2, Mail, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from './LanguageSwitcher';

export function TopUtilityBar() {
  const { t } = useTranslation();

  const socialLinks = [
    { label: t('topUtilityBar.website'), href: '#', icon: Globe },
    { label: t('topUtilityBar.communityForum'), href: '#', icon: MessageCircle },
    { label: t('topUtilityBar.newsletter'), href: '#', icon: Link2 },
  ];

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="mailto:hello@communityreadingclub.org"
            className="flex items-center gap-1.5 opacity-90 hover:opacity-100"
          >
            <Mail className="size-3.5" />
            hello@communityreadingclub.org
          </a>
          <span className="flex items-center gap-1.5 opacity-90">
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
              className="opacity-90 hover:opacity-100"
            >
              <social.icon className="size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
