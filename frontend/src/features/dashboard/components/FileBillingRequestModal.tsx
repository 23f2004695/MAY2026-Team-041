import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button, Input, Modal, Select } from '@/components/ui';
import { ApiError } from '@/lib/api';
import { useAuth, type MemberSummary } from '@/providers/AuthProvider';

const AMOUNT_PATTERN = /^[1-9]\d*$/;
const SEARCH_DEBOUNCE_MS = 300;

const billingRequestSchema = z.object({
  type: z.enum(['refund', 'fee_waiver']),
  amount: z.string().regex(AMOUNT_PATTERN, { message: 'Enter a whole number greater than 0' }),
  reason: z.string().trim().min(1, { message: 'Enter a reason for this request' }),
});

type BillingRequestFormValues = z.infer<typeof billingRequestSchema>;

export interface FileBillingRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export function FileBillingRequestModal({ open, onClose }: FileBillingRequestModalProps) {
  const { t } = useTranslation();
  const { createBillingRequest, searchMembers } = useAuth();
  const [selectedMember, setSelectedMember] = useState<MemberSummary | null>(null);
  const [memberQuery, setMemberQuery] = useState('');
  const [memberResults, setMemberResults] = useState<MemberSummary[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BillingRequestFormValues>({
    resolver: zodResolver(billingRequestSchema),
    values: { type: 'refund', amount: '', reason: '' },
  });

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setSelectedMember(null);
      setMemberQuery('');
      setMemberResults([]);
    }
  }

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      searchMembers(memberQuery)
        .then((members) => !cancelled && setMemberResults(members))
        .catch(() => !cancelled && setMemberResults([]));
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberQuery]);

  async function onSubmit(values: BillingRequestFormValues) {
    if (!selectedMember) return;
    try {
      await createBillingRequest({
        member_id: selectedMember.id,
        type: values.type,
        amount: Number(values.amount),
        reason: values.reason,
      });
      toast.success(
        t('managerDashboard.billingRequest.successToast', { name: selectedMember.full_name }),
      );
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.errors.generic'));
    }
  }

  const canSubmit = selectedMember !== null;

  return (
    <Modal open={open} onClose={onClose} title={t('managerDashboard.billingRequest.title')}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-foreground">
            {t('managerDashboard.billingRequest.memberLabel')}
          </p>
          {selectedMember ? (
            <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{selectedMember.full_name}</p>
                <p className="text-xs text-muted-foreground">{selectedMember.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {t('managerDashboard.billingRequest.changeMember')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Input
                value={memberQuery}
                onChange={(event) => setMemberQuery(event.target.value)}
                placeholder={t('managerDashboard.billingRequest.memberSearchPlaceholder')}
                autoFocus
              />
              {memberResults.length > 0 && (
                <ul className="flex flex-col gap-1 rounded-md border border-border bg-surface p-1 shadow-panel">
                  {memberResults.map((member) => (
                    <li key={member.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMember(member);
                          setMemberQuery('');
                          setMemberResults([]);
                        }}
                        className="flex w-full flex-col items-start rounded-md px-2 py-1.5 text-left hover:bg-secondary"
                      >
                        <span className="text-sm font-medium text-foreground">{member.full_name}</span>
                        <span className="text-xs text-muted-foreground">{member.email}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {memberQuery.trim().length > 0 && memberResults.length === 0 && (
                <p className="px-1 text-xs text-muted-foreground">
                  {t('managerDashboard.billingRequest.noMembersFound')}
                </p>
              )}
            </div>
          )}
        </div>

        <Select
          label={t('managerDashboard.billingRequest.typeLabel')}
          options={[
            { value: 'refund', label: t('admin.pendingRequests.types.refundRequest') },
            { value: 'fee_waiver', label: t('admin.pendingRequests.types.feeWaiverRequest') },
          ]}
          {...register('type')}
        />

        <Input
          label={t('managerDashboard.billingRequest.amountLabel')}
          inputMode="numeric"
          pattern="[0-9]*"
          error={errors.amount?.message}
          {...register('amount')}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="billing-request-reason" className="text-sm font-medium text-foreground">
            {t('managerDashboard.billingRequest.reasonLabel')}
          </label>
          <textarea
            id="billing-request-reason"
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            {...register('reason')}
          />
          {errors.reason?.message && <p className="text-sm text-danger">{errors.reason.message}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit}>
            {t('managerDashboard.billingRequest.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
