import { useTranslation } from 'react-i18next';

import { ProgressBar } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { formatCurrency, type ExpenseCategory } from '@/mocks/admin';

export function BudgetExpenses({ categories }: { categories: ExpenseCategory[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.budget.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {categories.map((category) => (
          <div key={category.labelKey} className="flex flex-col gap-1.5">
            <ProgressBar
              percent={Math.round((category.spent / category.budgeted) * 100)}
              label={t(category.labelKey)}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {t('admin.budget.spentOfBudgeted', {
                  spent: formatCurrency(category.spent),
                  budgeted: formatCurrency(category.budgeted),
                })}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => comingSoonToast(t('admin.budget.logExpenseToast', { category: t(category.labelKey) }))}
              >
                {t('admin.budget.logExpense')}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
