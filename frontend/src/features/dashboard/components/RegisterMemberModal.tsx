import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button, Input, Modal, Select } from '@/components/ui';
import { isValidEmail } from '@/lib/email';

// Same shape as ContactUsPage's phone validation: optional leading +, 7-20 digits/spaces/dashes/parens.
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

const registerMemberSchema = z.object({
  name: z.string().trim().min(1, { message: 'managerDashboard.registerMember.errors.name' }),
  email: z.string().refine(isValidEmail, { message: 'managerDashboard.registerMember.errors.email' }),
  phoneNumber: z
    .string()
    .regex(PHONE_PATTERN, { message: 'managerDashboard.registerMember.errors.phoneNumber' }),
  membershipPlan: z.enum(['basic', 'standard', 'premium']),
});

export type RegisterMemberFormValues = z.infer<typeof registerMemberSchema>;

export interface RegisterMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (member: RegisterMemberFormValues) => void;
  /** Pre-fills from a pending online registration request being completed at the counter. */
  initialValues?: { name: string; email: string };
}

export function RegisterMemberModal({
  open,
  onClose,
  onSubmit,
  initialValues,
}: RegisterMemberModalProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterMemberFormValues>({
    resolver: zodResolver(registerMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      membershipPlan: 'basic',
    },
  });

  // Re-seed the form every time the modal opens, so a request's name/email
  // pre-fill it when provided and a blank form starts clean otherwise.
  useEffect(() => {
    if (!open) return;
    reset({
      name: initialValues?.name ?? '',
      email: initialValues?.email ?? '',
      phoneNumber: '',
      membershipPlan: 'basic',
    });
  }, [open, initialValues, reset]);

  function onValid(values: RegisterMemberFormValues) {
    onSubmit(values);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={t('managerDashboard.registerMember.title')}>
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4">
        <Input
          label={t('managerDashboard.registerMember.nameLabel')}
          placeholder={t('managerDashboard.registerMember.namePlaceholder')}
          error={errors.name?.message ? t(errors.name.message) : undefined}
          {...register('name')}
        />
        <Input
          type="email"
          label={t('managerDashboard.registerMember.emailLabel')}
          placeholder={t('managerDashboard.registerMember.emailPlaceholder')}
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register('email')}
        />
        <Input
          type="tel"
          label={t('managerDashboard.registerMember.phoneLabel')}
          placeholder={t('managerDashboard.registerMember.phonePlaceholder')}
          error={errors.phoneNumber?.message ? t(errors.phoneNumber.message) : undefined}
          {...register('phoneNumber')}
        />
        <Select
          label={t('managerDashboard.registerMember.planLabel')}
          error={errors.membershipPlan?.message ? t(errors.membershipPlan.message) : undefined}
          options={[
            { value: 'basic', label: t('dashboard.membershipPlans.basic') },
            { value: 'standard', label: t('dashboard.membershipPlans.standard') },
            { value: 'premium', label: t('dashboard.membershipPlans.premium') },
          ]}
          {...register('membershipPlan')}
        />
        <Button type="submit" isLoading={isSubmitting}>
          {t('managerDashboard.registerMember.submit')}
        </Button>
      </form>
    </Modal>
  );
}
