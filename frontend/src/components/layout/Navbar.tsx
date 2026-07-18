import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { Button, buttonVariants, MenuToggleIcon } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';
import { useScroll } from '@/lib/useScroll';
import { useAuth } from '@/providers/AuthProvider';

import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(10);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function handleLogout() {
    logout();
    navigate(ROUTES.HOME);
    setOpen(false);
  }

  const navLinks = [
    { label: t('landing.footer.home'), to: ROUTES.HOME, end: true },
    { label: t('nav.pricing'), to: ROUTES.PRICING, end: false },
    { label: t('nav.books'), to: ROUTES.BOOKS, end: false },
    { label: t('nav.events'), to: ROUTES.EVENTS, end: false },
    { label: t('landing.footer.community'), to: ROUTES.COMMUNITY, end: false },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-20 mx-auto w-full max-w-6xl border-b border-transparent',
        'md:rounded-2xl md:border md:transition-all md:duration-300 md:ease-out',
        scrolled && !open &&
          'border-border bg-surface/90 shadow-panel backdrop-blur-lg supports-backdrop-filter:bg-surface/70 md:top-3 md:max-w-5xl',
        open && 'bg-surface',
      )}
    >
      <nav
        className={cn(
          'flex h-16 items-center justify-between px-4 transition-all duration-300 ease-out sm:px-6',
          scrolled && 'md:h-14',
        )}
      >
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 whitespace-nowrap text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </span>
          <span className="sm:hidden">{t('common.brandShort')}</span>
          <span className="hidden sm:inline">{t('common.brandFull')}</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(buttonVariants({ variant: 'ghost', size: 'sm' }), isActive && 'text-primary')
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated && role ? (
            <>
              <Link
                to={role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                {t(`auth.login.roles.${role}`)}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {t('userMenu.logOut')}
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                {t('auth.login.title')}
              </Link>
              <Link to={ROUTES.REGISTER} className={buttonVariants({ size: 'sm' })}>
                {t('common.getStarted')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen((value) => !value)}
            aria-label={t('topBar.openNavigation')}
          >
            <MenuToggleIcon open={open} duration={300} />
          </Button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-x-0 top-16 bottom-0 z-20 flex flex-col border-t border-border bg-surface',
          'transition-opacity duration-300 ease-out md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex h-full flex-col justify-between gap-6 p-4">
          <div className="grid gap-1">
            {navLinks.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: 'ghost' }),
                    'justify-start',
                    isActive && 'text-primary',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {isAuthenticated && role ? (
              <>
                <Link
                  to={role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: 'ghost' }), 'justify-start')}
                >
                  {t(`auth.login.roles.${role}`)}
                </Link>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  {t('userMenu.logOut')}
                </Button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  {t('auth.login.title')}
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), 'w-full')}
                >
                  {t('common.getStarted')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
