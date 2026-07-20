import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PageTitle } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle, Select, Switch } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { LANGUAGES } from '@/i18n/languages';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { profileOverview } from '@/mocks/profile';
import { useAuth } from '@/providers/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTheme, type Theme } from '@/providers/ThemeProvider';

const THEME_OPTIONS: Theme[] = ['light', 'dark', 'system'];

interface NotificationPref {
  id: string;
  labelKey: string;
  enabled: boolean;
}

const initialNotificationPrefs: NotificationPref[] = [
  { id: 'dueDateReminders', labelKey: 'settings.notifications.items.dueDateReminders', enabled: true },
  { id: 'reservationReady', labelKey: 'settings.notifications.items.reservationReady', enabled: true },
  { id: 'eventAnnouncements', labelKey: 'settings.notifications.items.eventAnnouncements', enabled: false },
  { id: 'achievementBadges', labelKey: 'settings.notifications.items.achievementBadges', enabled: true },
];

export function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const [notificationPrefs, setNotificationPrefs] = useState(initialNotificationPrefs);

  function toggleNotificationPref(id: string) {
    setNotificationPrefs((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref)),
    );
  }

  function handleLogOut() {
    logout();
    navigate(ROUTES.HOME);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle title={t('settings.pageTitle')} description={t('settings.pageDescription')} />

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.appearance.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm font-medium text-foreground">{t('settings.appearance.theme')}</p>
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
        <CardContent className="flex flex-col gap-3">
          {notificationPrefs.map((pref) => (
            <Switch
              key={pref.id}
              id={pref.id}
              checked={pref.enabled}
              onCheckedChange={() => toggleNotificationPref(pref.id)}
              label={t(pref.labelKey)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.account.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">{profileOverview.name}</p>
            <p className="text-sm text-muted-foreground">{profileOverview.email}</p>
          </div>

          <Button variant="outline" className="w-fit" onClick={handleLogOut}>
            {t('settings.account.logOut')}
          </Button>

          <div className="flex flex-col gap-2 rounded-md border border-danger/30 bg-danger/5 p-4">
            <p className="text-sm font-medium text-danger">{t('settings.account.dangerZone')}</p>
            <p className="text-sm text-muted-foreground">{t('settings.account.deleteAccountHint')}</p>
            <Button
              variant="danger"
              size="sm"
              className="w-fit"
              onClick={() => comingSoonToast(t('settings.account.deleteAccount'))}
            >
              {t('settings.account.deleteAccount')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
