import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button, Checkbox, Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/providers/AuthProvider';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'auth.register.errors.name';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'auth.register.errors.email';
  if (form.password.length < 8) errors.password = 'auth.register.errors.password';
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'auth.register.errors.confirmPassword';
  }
  if (!form.acceptTerms) errors.acceptTerms = 'auth.register.errors.terms';
  return errors;
}

// ponytail: no backend yet (Milestone 3); submitting the form just signs the visitor
// in as a member, mirroring the mock role-switcher in Login until real registration lands.
export function Register() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      login('member');
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('auth.register.title')}</h1>
        <p className="text-muted-foreground">{t('auth.register.subtitle')}</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label={t('auth.register.fullName')}
          autoComplete="name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name && t(errors.name)}
        />
        <Input
          label={t('auth.register.email')}
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email && t(errors.email)}
        />
        <Input
          label={t('auth.register.password')}
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password && t(errors.password)}
        />
        <Input
          label={t('auth.register.confirmPassword')}
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword && t(errors.confirmPassword)}
        />
        <Checkbox
          label={t('auth.register.terms')}
          checked={form.acceptTerms}
          onChange={(e) => handleChange('acceptTerms', e.target.checked)}
        />
        {errors.acceptTerms && <p className="text-sm text-danger">{t(errors.acceptTerms)}</p>}
        <Button type="submit">{t('auth.register.createAccount')}</Button>
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
