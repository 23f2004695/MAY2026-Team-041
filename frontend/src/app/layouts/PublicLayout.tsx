import { Outlet, useLocation } from 'react-router-dom';

import { Footer as LandingFooter } from '@/features/landing/components/Footer';
import { Footer, Header } from '@/components/layout';
import { ROUTES } from '@/constants/routes';

const largeFooterRoutes = [
  ROUTES.PRICING,
  ROUTES.CONTACT_US,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
] as const;

export function PublicLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const isLandingPage = pathname === ROUTES.HOME;
  const isLargeFooterPage = largeFooterRoutes.includes(pathname as typeof largeFooterRoutes[number]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* pb-24 reserves space under the fixed ChatbotWidget (size-14 button + margin),
          matching AppShellLayout's reserve, so it never sits on top of page/footer content. */}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      {isLandingPage ? null : isLargeFooterPage ? <LandingFooter /> : <Footer minimal />}
    </div>
  );
}
