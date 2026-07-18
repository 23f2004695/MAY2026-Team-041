import { Outlet } from 'react-router-dom';

import { Footer, Header, TopUtilityBar } from '@/components/layout';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopUtilityBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
