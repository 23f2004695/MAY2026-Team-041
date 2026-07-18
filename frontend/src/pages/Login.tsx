import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Input } from '@/components/ui';
import { loginSchema, type LoginFormValues } from '@/lib/authSchema';
import { useAuth, type Role } from '@/providers/AuthProvider';

const ROLES: Role[] = ['admin', 'librarian', 'member', 'manager', 'it-head', 'guardian'];

// ponytail: no real auth form yet (Milestone 3); the password form and Gmail button both
// just sign the visitor in as a member, and the role buttons below exist only to
// demonstrate the ProtectedRoute/RoleRoute guards until real login lands.
// Redirecting is left entirely to PublicRoute (guards.tsx) reacting to the auth-state
// change — navigating here too would race PublicRoute's own redirect.
export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  function signInAs(role: Role) {
    login(role);
  }

  function onSubmit() {
    login('member');
  }

  function handleGmailLogin() {
    login('member');
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('auth.login.title')}</h1>
        <p className="text-muted-foreground">{t('auth.login.subtitle')}</p>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={t('auth.login.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register('email')}
        />
        <Input
          label={t('auth.login.password')}
          type="password"
          autoComplete="current-password"
          error={errors.password?.message ? t(errors.password.message) : undefined}
          {...register('password')}
        />
        <Button type="submit">{t('auth.login.logInWithPassword')}</Button>
      </form>

      <div className="flex items-center gap-3 py-1 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        {t('auth.login.or')}
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" className="justify-center gap-2" onClick={handleGmailLogin}>
        <Mail className="size-4" />
        {t('auth.login.continueWithGmail')}
      </Button>

      <div className="flex items-center gap-3 py-1 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        {t('auth.login.orPreviewRole')}
        <div className="h-px flex-1 bg-border" />
      </div>

      {ROLES.map((role) => (
        <Button
          key={role}
          variant="outline"
          className="justify-start capitalize"
          onClick={() => signInAs(role)}
        >
          {t('auth.login.continueAs', { role: t(`auth.login.roles.${role}`) })}
        </Button>
      ))}
    </div>
  );
}
