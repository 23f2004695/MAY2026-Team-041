import { Outlet } from 'react-router-dom';

import { Footer, Navbar } from '@/components/layout';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
