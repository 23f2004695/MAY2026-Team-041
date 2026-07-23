import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button, Checkbox, Input, Select } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { registerSchema, type RegisterFormValues } from '@/lib/authSchema';
import { useAuth } from '@/providers/AuthProvider';

// ponytail: no backend yet (Milestone 3); submitting the form just signs the visitor
// in as a member, mirroring the mock role-switcher in Login until real registration lands.
export function Register() {
  const { t } = useTranslation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      membershipPlan: 'basic',
      acceptTerms: false,
    },
  });

  function onSubmit() {
    login('member');
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('auth.register.title')}</h1>
        <p className="text-muted-foreground">{t('auth.register.subtitle')}</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={t('auth.register.fullName')}
          autoComplete="name"
          error={errors.name?.message ? t(errors.name.message) : undefined}
          {...register('name')}
        />
        <Input
          label={t('auth.register.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register('email')}
        />
        <Input
          label={t('auth.register.phoneNumber')}
          type="tel"
          autoComplete="tel"
          placeholder={t('auth.register.phoneNumberPlaceholder')}
          error={errors.phoneNumber?.message ? t(errors.phoneNumber.message) : undefined}
          {...register('phoneNumber')}
        />
        <Input
          label={t('auth.register.password')}
          type="password"
          autoComplete="new-password"
          error={errors.password?.message ? t(errors.password.message) : undefined}
          {...register('password')}
        />
        <Input
          label={t('auth.register.confirmPassword')}
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
          {...register('confirmPassword')}
        />
        <Select
          label={t('auth.register.membershipPlan')}
          error={errors.membershipPlan?.message ? t(errors.membershipPlan.message) : undefined}
          options={[
            { value: 'basic', label: t('dashboard.membershipPlans.basic') },
            { value: 'standard', label: t('dashboard.membershipPlans.standard') },
            { value: 'premium', label: t('dashboard.membershipPlans.premium') },
          ]}
          {...register('membershipPlan')}
        />
        <Checkbox
          label={t('auth.register.terms')}
          error={errors.acceptTerms?.message ? t(errors.acceptTerms.message) : undefined}
          {...register('acceptTerms')}
        />
        <Button type="submit" isLoading={isSubmitting}>
          {t('auth.register.createAccount')}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        {t('auth.register.alreadyHaveAccount')}{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
          {t('auth.register.logIn')}
        </Link>
      </p>
    </div>
  );
}
