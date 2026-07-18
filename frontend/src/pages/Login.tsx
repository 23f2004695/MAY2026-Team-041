import { Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input } from '@/components/ui';
import { useAuth, type Role } from '@/providers/AuthProvider';

const ROLES: Role[] = ['admin', 'librarian', 'member', 'manager', 'it-head', 'guardian'];

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

interface PasswordFormState {
  email: string;
  password: string;
}

interface PasswordFormErrors {
  email?: string;
  password?: string;
}

function validatePasswordForm(form: PasswordFormState): PasswordFormErrors {
  const errors: PasswordFormErrors = {};
  if (!EMAIL_PATTERN.test(form.email)) errors.email = 'auth.register.errors.email';
  if (!form.password) errors.password = 'auth.login.errors.password';
  return errors;
}

// ponytail: no real auth form yet (Milestone 3); the password form and Gmail button both
// just sign the visitor in as a member, and the role buttons below exist only to
// demonstrate the ProtectedRoute/RoleRoute guards until real login lands.
// Redirecting is left entirely to PublicRoute (guards.tsx) reacting to the auth-state
// change — navigating here too would race PublicRoute's own redirect.
export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({ email: '', password: '' });
  const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({});

  function signInAs(role: Role) {
    login(role);
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validatePasswordForm(passwordForm);
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) login('member');
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

      <form className="flex flex-col gap-3" onSubmit={handlePasswordSubmit} noValidate>
        <Input
          label={t('auth.login.email')}
          type="email"
          autoComplete="email"
          value={passwordForm.email}
          onChange={(e) => setPasswordForm((prev) => ({ ...prev, email: e.target.value }))}
          error={passwordErrors.email && t(passwordErrors.email)}
        />
        <Input
          label={t('auth.login.password')}
          type="password"
          autoComplete="current-password"
          value={passwordForm.password}
          onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
          error={passwordErrors.password && t(passwordErrors.password)}
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
