import { useTranslation } from 'react-i18next';

export interface WelcomeSectionProps {
  name: string;
  membershipPlan: string;
}

export function WelcomeSection({ name, membershipPlan }: WelcomeSectionProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        {t('welcome.greeting', { name: name.split(' ')[0] })}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {membershipPlan} · {t('welcome.subtitle')}
      </p>
    </div>
  );
}
