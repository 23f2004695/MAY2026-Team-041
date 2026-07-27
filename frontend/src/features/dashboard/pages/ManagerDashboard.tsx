import { Armchair, BookPlus, ReceiptText, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { CreateEventModal } from '@/features/events/components/CreateEventModal';
import {
  managerStats,
  pendingPayments,
  registrationRequests as initialRegistrationRequests,
  walkInRequests,
  type RegistrationRequest,
} from '@/mocks/manager';

import { AddGuardianCard } from '../components/AddGuardianCard';
import { FileBillingRequestModal } from '../components/FileBillingRequestModal';
import { NewRegistrations } from '../components/NewRegistrations';
import { PendingPayments } from '../components/PendingPayments';
import { type RegisterMemberFormValues, RegisterMemberModal } from '../components/RegisterMemberModal';
import { WalkInAssistance } from '../components/WalkInAssistance';

// Manager duties: assist walk-in members with seat/book counter service
// (taking their email and booking/issuing on their behalf) and help new
// visitors register — no event management.
export function ManagerDashboard() {
  const { t } = useTranslation();
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(
    initialRegistrationRequests,
  );
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [fulfillingRequest, setFulfillingRequest] = useState<RegistrationRequest | null>(null);
  const [isBillingRequestOpen, setIsBillingRequestOpen] = useState(false);

  function openRegisterForNewVisitor() {
    setFulfillingRequest(null);
    setIsRegisterOpen(true);
  }

  function openRegisterForRequest(request: RegistrationRequest) {
    setFulfillingRequest(request);
    setIsRegisterOpen(true);
  }

  function closeRegisterModal() {
    setIsRegisterOpen(false);
    setFulfillingRequest(null);
  }

  function handleRegisterMember(member: RegisterMemberFormValues) {
    if (fulfillingRequest) {
      setRegistrationRequests((prev) => prev.filter((request) => request.id !== fulfillingRequest.id));
      toast.success(
        t('managerDashboard.registrations.registerToast', { name: member.name }),
      );
    } else {
      toast.success(t('managerDashboard.registerMember.successToast', { name: member.name }));
    }
  }

  function handleAddGuardian(values: { studentEmail: string; guardianEmail: string }) {
    toast.success(
      t('managerDashboard.addGuardian.successToast', {
        studentEmail: values.studentEmail,
        guardianEmail: values.guardianEmail,
      }),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('managerDashboard.pageTitle')}
        description={t('managerDashboard.pageDescription')}
      />

      <h2 className="sr-only">{t('common.dashboardSectionsHeading')}</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {managerStats.map((stat) => (
          <StatisticCard key={stat.labelKey} icon={stat.icon} label={t(stat.labelKey)} value={stat.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WalkInAssistance requests={walkInRequests} />
        <NewRegistrations requests={registrationRequests} onRegister={openRegisterForRequest} />
      </div>

      <PendingPayments payments={pendingPayments} />

      <AddGuardianCard onAddGuardian={handleAddGuardian} />

      <QuickActionsCard
        actions={[
          {
            label: 'Create Event',
            icon: CalendarPlus,
            onClick: () => setCreateEventOpen(true),
          },
          {
            label: t('managerDashboard.quickActions.bookSeatForMember'),
            icon: Armchair,
            onClick: () => comingSoonToast(t('managerDashboard.quickActions.toasts.bookingSeat')),
          },
          {
            label: t('managerDashboard.quickActions.issueBookForMember'),
            icon: BookPlus,
            onClick: () => comingSoonToast(t('managerDashboard.quickActions.toasts.issuingBook')),
          },
          {
            label: t('managerDashboard.quickActions.registerNewMember'),
            icon: UserPlus,
            onClick: openRegisterForNewVisitor,
          },
          {
            label: t('managerDashboard.quickActions.fileBillingRequest'),
            icon: ReceiptText,
            onClick: () => setIsBillingRequestOpen(true),
          },
        ]}
      />

      <RegisterMemberModal
        open={isRegisterOpen}
        onClose={closeRegisterModal}
        onSubmit={handleRegisterMember}
        initialValues={fulfillingRequest ?? undefined}
      />

      <FileBillingRequestModal
        open={isBillingRequestOpen}
        onClose={() => setIsBillingRequestOpen(false)}
      />
    </div>
  );
}
