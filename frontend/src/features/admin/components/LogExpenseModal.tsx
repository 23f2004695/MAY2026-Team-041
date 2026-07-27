import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button, Input, Modal } from '@/components/ui';
import { ApiError } from '@/lib/api';
import { useAuth, type ExpenseCategory } from '@/providers/AuthProvider';

const AMOUNT_PATTERN = /^[1-9]\d*$/;

const expenseSchema = z.object({
  amount: z.string().regex(AMOUNT_PATTERN, { message: 'Enter a whole number greater than 0' }),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export interface LogExpenseModalProps {
  open: boolean;
  onClose: () => void;
  category: ExpenseCategory | null;
  categoryLabel: string;
  onLogged: () => void;
}

export function LogExpenseModal({
  open,
  onClose,
  category,
  categoryLabel,
  onLogged,
}: LogExpenseModalProps) {
  const { t } = useTranslation();
  const { logExpense } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({ resolver: zodResolver(expenseSchema), values: { amount: '' } });

  async function onSubmit(values: ExpenseFormValues) {
    if (!category) return;
    try {
      await logExpense({ category, amount: Number(values.amount) });
      toast.success(t('admin.budget.logExpenseToast', { category: categoryLabel }));
      reset();
      onLogged();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.errors.generic'));
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('admin.budget.logExpense')}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={categoryLabel}
          inputMode="numeric"
          pattern="[0-9]*"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.actions.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {t('admin.budget.logExpense')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
