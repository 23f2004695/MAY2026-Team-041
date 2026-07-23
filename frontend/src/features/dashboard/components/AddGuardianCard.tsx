import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { isValidEmail } from '@/lib/email';

const addGuardianSchema = z.object({
  studentEmail: z
    .string()
    .refine(isValidEmail, { message: 'managerDashboard.addGuardian.errors.studentEmail' }),
  guardianEmail: z
    .string()
    .refine(isValidEmail, { message: 'managerDashboard.addGuardian.errors.guardianEmail' }),
});

type AddGuardianFormValues = z.infer<typeof addGuardianSchema>;

export interface AddGuardianCardProps {
  onAddGuardian: (values: AddGuardianFormValues) => void;
}

// Manager-side counterpart to the member's own "link a guardian" settings card —
// here the manager links an already-registered student to an already-registered
// guardian account by the email each of them registered with.
export function AddGuardianCard({ onAddGuardian }: AddGuardianCardProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddGuardianFormValues>({
    resolver: zodResolver(addGuardianSchema),
    defaultValues: { studentEmail: '', guardianEmail: '' },
  });

  function onValid(values: AddGuardianFormValues) {
    onAddGuardian(values);
    reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('managerDashboard.addGuardian.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{t('managerDashboard.addGuardian.description')}</p>
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <Input
            label={t('managerDashboard.addGuardian.studentEmailLabel')}
            type="email"
            placeholder={t('managerDashboard.addGuardian.studentEmailPlaceholder')}
            error={errors.studentEmail?.message ? t(errors.studentEmail.message) : undefined}
            className="flex-1"
            {...register('studentEmail')}
          />
          <Input
            label={t('managerDashboard.addGuardian.guardianEmailLabel')}
            type="email"
            placeholder={t('managerDashboard.addGuardian.guardianEmailPlaceholder')}
            error={errors.guardianEmail?.message ? t(errors.guardianEmail.message) : undefined}
            className="flex-1"
            {...register('guardianEmail')}
          />
          <Button type="submit" isLoading={isSubmitting} className="w-fit">
            {t('managerDashboard.addGuardian.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
