import { useTranslation } from 'react-i18next';

import { ProgressBar } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { BudgetCategory, ExpenseCategory } from '@/providers/AuthProvider';

export interface BudgetExpensesProps {
  categories: BudgetCategory[];
  onLogExpense: (category: ExpenseCategory) => void;
}

export function BudgetExpenses({ categories, onLogExpense }: BudgetExpensesProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.budget.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {categories.map((category) => (
          <div key={category.category} className="flex flex-col gap-1.5">
            <ProgressBar
              percent={Math.round((category.spent / category.budgeted) * 100)}
              label={t(`admin.budget.categories.${category.category}`)}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {t('admin.budget.spentOfBudgeted', {
                  spent: formatCurrency(category.spent),
                  budgeted: formatCurrency(category.budgeted),
                })}
              </span>
              <Button size="sm" variant="ghost" onClick={() => onLogExpense(category.category)}>
                {t('admin.budget.logExpense')}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
