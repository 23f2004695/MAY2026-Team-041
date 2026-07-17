import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';

import { AppearanceButton } from './AppearanceButton';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 whitespace-nowrap text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </span>
          <span className="sm:hidden">{t('brand.short')}</span>
          <span className="hidden sm:inline">{t('brand.name')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <AppearanceButton />
          <ThemeToggle />
          <Button onClick={() => navigate(ROUTES.LOGIN)}>{t('actions.signIn')}</Button>
        </div>
      </div>
    </header>
  );
}
