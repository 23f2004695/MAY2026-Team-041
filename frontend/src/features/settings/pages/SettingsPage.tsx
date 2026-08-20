import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageTitle } from '@/components/common';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  Input,
  Select,
} from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { LANGUAGES } from '@/i18n/languages';
import { getErrorMessage } from '@/lib/api';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/lib/authSchema';
import { useAuth, type GuardianContact } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/languageContext';
import { useTheme, type Theme } from '@/providers/ThemeProvider';

const THEME_OPTIONS: Theme[] = ['light', 'dark', 'system'];

export function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { role, fullName, email, logout, deleteAccount, updateProfile, getMyGuardian } = useAuth();
  const hasStaffAccount =
    role === 'admin' || role === 'manager' || role === 'librarian' || role === 'it-head';
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const isMember = role === 'member';
  const [guardian, setGuardian] = useState<GuardianContact | null>(null);
  const [hasLoadedGuardian, setHasLoadedGuardian] = useState(false);
  // Derived rather than a third state field, so the effect never has to setState
  // synchronously in its body for the staff case (it just doesn't run).
  const isLoadingGuardian = isMember && !hasLoadedGuardian;

  // Members only — staff accounts never have a guardian, so don't spend a request on them.
  useEffect(() => {
    if (!isMember) return;
    let cancelled = false;
    getMyGuardian()
      .then((data) => {
        if (!cancelled) setGuardian(data);
      })
      .catch(() => {
        if (!cancelled) setGuardian(null);
      })
      .finally(() => {
        if (!cancelled) setHasLoadedGuardian(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isMember, getMyGuardian]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onChangePasswordSubmit(values: ChangePasswordFormValues) {
    try {
      await updateProfile({
        password: values.password,
        current_password: values.currentPassword,
      });
      toast.success(t('settings.changePassword.successToast', 'Password updated successfully'));
      resetPasswordForm();
    } catch (err) {
      toast.error(getErrorMessage(err, t('common.errors.generic')));
    }
  }

  function handleLogOut() {
    logout();
    navigate(ROUTES.HOME);
  }

  async function handleDeleteAccount() {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success(t('settings.account.deleteAccountSuccess'));
      navigate(ROUTES.HOME);
    } catch (err) {
      toast.error(getErrorMessage(err, t('common.errors.generic')));
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle title={t('settings.pageTitle')} description={t('settings.pageDescription')} />

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.appearance.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm font-medium text-foreground">
            {t('settings.appearance.theme')}
          </p>
          <div className="flex gap-2" role="group" aria-label={t('settings.appearance.theme')}>
            {THEME_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={theme === option ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTheme(option)}
              >
                {t(`settings.appearance.themeOptions.${option}`)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.language.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            label={t('settings.language.label')}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            options={LANGUAGES.map((option) => ({ value: option.code, label: option.nativeName }))}
            className="max-w-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.notifications.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notification preferences are not configurable yet. Important account and library
            notifications remain enabled.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.changePassword.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handlePasswordSubmit(onChangePasswordSubmit)}
            className="flex max-w-md flex-col gap-4"
            noValidate
          >
            <Input
              label={t('settings.changePassword.currentPassword', 'Current password')}
              type="password"
              autoComplete="current-password"
              error={
                passwordErrors.currentPassword?.message
                  ? t(passwordErrors.currentPassword.message)
                  : undefined
              }
              {...registerPassword('currentPassword')}
            />
            <Input
              label={t('settings.changePassword.newPassword')}
              type="password"
              autoComplete="new-password"
              error={
                passwordErrors.password?.message ? t(passwordErrors.password.message) : undefined
              }
              {...registerPassword('password')}
            />
            <Input
              label={t('settings.changePassword.confirmPassword')}
              type="password"
              autoComplete="new-password"
              error={
                passwordErrors.confirmPassword?.message
                  ? t(passwordErrors.confirmPassword.message)
                  : undefined
              }
              {...registerPassword('confirmPassword')}
            />
            <Button type="submit" isLoading={isSubmittingPassword} className="w-fit">
              {t('settings.changePassword.updateButton')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {role === 'member' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.guardianLink.title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {isLoadingGuardian ? null : guardian ? (
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">{guardian.full_name}</p>
                <p className="text-sm text-muted-foreground">{guardian.email}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('settings.guardianLink.noneLinked')}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {t('settings.guardianLink.managedByStaff')}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.account.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {hasStaffAccount ? (
            <p className="text-sm font-medium text-foreground">{t(`auth.login.roles.${role}`)}</p>
          ) : (
            <div>
              <p className="text-sm font-medium text-foreground">{fullName}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="w-fit" onClick={() => navigate(ROUTES.PROFILE)}>
              {t('userMenu.profile')}
            </Button>
            <Button variant="outline" className="w-fit" onClick={handleLogOut}>
              {t('settings.account.logOut')}
            </Button>
          </div>

          {!hasStaffAccount && (
            <div className="flex flex-col gap-2 rounded-md border border-danger/30 bg-danger/5 p-4">
              <p className="text-sm text-muted-foreground">
                {t('settings.account.deleteAccountHint')}
              </p>
              <Button
                variant="danger"
                size="sm"
                className="w-fit"
                onClick={() => setDeleteConfirmationOpen(true)}
              >
                {t('settings.account.deleteAccount')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteConfirmationOpen}
        title={t('settings.account.deleteAccountTitle')}
        description={t('settings.account.deleteAccountConfirm')}
        confirmLabel={t('settings.account.deleteAccount')}
        cancelLabel={t('common.actions.cancel')}
        onCancel={() => setDeleteConfirmationOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
        destructive
      />
    </div>
  );
}
