import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button, Checkbox, Input, Modal, Select } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/lib/api';
import { completeProfileSchema, type CompleteProfileFormValues } from '@/lib/authSchema';
import { PLAN_OPTIONS } from '@/lib/planOptions';
import { useAuth } from '@/providers/AuthProvider';

// Shown once, right after a first-time Google sign-in — Google gives us email/name/avatar
// but not phone/password/plan, so this fills the gap before Register.tsx-equivalent data exists.
export function CompleteProfileModal() {
  const { t } = useTranslation();
  const { needsProfileCompletion, fullName, completeProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    values: {
      fullName: fullName ?? '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      membershipPlan: PLAN_OPTIONS[0].value,
      acceptTerms: false,
    },
  });

  async function onSubmit(values: CompleteProfileFormValues) {
    try {
      await completeProfile({
        full_name: values.fullName,
        phone: values.phoneNumber,
        password: values.password,
      });
      const plan = PLAN_OPTIONS.find((option) => option.value === values.membershipPlan);
      navigate(
        `${ROUTES.PAYMENT}?amount=${plan?.price ?? 0}&label=${encodeURIComponent(plan?.label ?? '')}&months=${plan?.months ?? ''}`,
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not save your details');
    }
  }

  return (
    <Modal open={needsProfileCompletion} onClose={() => {}}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Complete your account</h2>
          <p className="text-sm text-muted-foreground">
            A few more details before you get started.
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Full name"
            autoComplete="name"
            error={errors.fullName?.message ? t(errors.fullName.message) : undefined}
            {...register('fullName')}
          />
          <Input
            label="Phone number"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            error={errors.phoneNumber?.message ? t(errors.phoneNumber.message) : undefined}
            {...register('phoneNumber')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message ? t(errors.password.message) : undefined}
            {...register('password')}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
            {...register('confirmPassword')}
          />
          <Select
            label="Membership plan"
            error={errors.membershipPlan?.message ? t(errors.membershipPlan.message) : undefined}
            options={PLAN_OPTIONS.map(({ value, label }) => ({ value, label }))}
            {...register('membershipPlan')}
          />
          <Checkbox
            label="I agree to the terms of service"
            error={errors.acceptTerms?.message ? t(errors.acceptTerms.message) : undefined}
            {...register('acceptTerms')}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Continue to payment
          </Button>
        </form>
      </div>
    </Modal>
  );
}
