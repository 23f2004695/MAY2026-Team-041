import { BookPlus, QrCode, RotateCcw } from 'lucide-react';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { librarianStats, overdueLoans, pendingReservationQueue } from '@/mocks/librarian';

import { OverdueBooks } from '../components/OverdueBooks';
import { PendingReservationQueue } from '../components/PendingReservationQueue';

export function LibrarianDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Librarian Dashboard"
        description="Catalogue, borrowing, and fines at a glance"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {librarianStats.map((stat) => (
          <StatisticCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OverdueBooks loans={overdueLoans} />
        <PendingReservationQueue reservations={pendingReservationQueue} />
      </div>

      <QuickActionsCard
        actions={[
          { label: 'Issue Book', icon: BookPlus, onClick: () => comingSoonToast('Issuing a book') },
          {
            label: 'Return Book',
            icon: RotateCcw,
            onClick: () => comingSoonToast('Returning a book'),
          },
          { label: 'Scan QR', icon: QrCode, onClick: () => comingSoonToast('Scanning a QR code') },
        ]}
      />
    </div>
  );
}
