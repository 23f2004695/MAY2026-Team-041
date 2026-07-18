import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { buttonVariants } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';

export interface HeaderNavLink {
  label: string;
  to: string;
  end: boolean;
}

// Translated nav links shared by the desktop bar and the mobile drawer.
export function useHeaderNavLinks(): HeaderNavLink[] {
  const { t } = useTranslation();

  return [
    { label: t('landing.footer.home'), to: ROUTES.HOME, end: true },
    { label: t('nav.pricing'), to: ROUTES.PRICING, end: false },
    { label: t('nav.books'), to: ROUTES.BOOKS, end: false },
    { label: t('nav.events'), to: ROUTES.EVENTS, end: false },
    { label: t('landing.footer.community'), to: ROUTES.COMMUNITY, end: false },
  ];
}

export interface NavigationLinksProps {
  links: HeaderNavLink[];
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}

export function NavigationLinks({ links, variant = 'desktop', onNavigate }: NavigationLinksProps) {
  const isMobile = variant === 'mobile';

  return (
    <>
      {links.map(({ label, to, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: 'ghost', size: isMobile ? 'md' : 'sm' }),
              isMobile && 'justify-start',
              isActive && 'text-primary',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </>
  );
}
