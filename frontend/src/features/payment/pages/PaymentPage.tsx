import { Banknote, ShieldCheck, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { AnimatedNumber, PageHeader } from '@/components/common';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';

// Auth is already enforced by the ProtectedRoute this page is nested under
// (see AppRouter.tsx) — no need to re-check isAuthenticated here.
export function PaymentPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();

  const amount = Number(params.get('amount')) || 0;
  const label = params.get('label') ?? t('payment.defaultLabel');

  // ponytail: no backend yet to create a Razorpay order / verify the payment
  // signature, so this mocks the flow like every other write action in the
  // app. Swap in real Razorpay Checkout.js once an order-creation endpoint
  // exists — it just needs a key + order_id from the server.
  function handleRazorpayPay() {
    comingSoonToast(t('payment.payOnlineToast', { amount }));
  }

  function handlePayAtLibrary() {
    comingSoonToast(t('payment.payAtLibraryToast'));
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <PageHeader title={t('payment.pageTitle')} description={label} />

      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <p className="text-sm text-muted-foreground">{t('payment.amountDue')}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-foreground">₹</span>
            <AnimatedNumber value={amount} className="text-4xl font-extrabold text-foreground" />
          </div>
          <Badge variant="outline">{label}</Badge>
        </CardContent>
      </Card>

      <Button size="lg" className="gap-2" onClick={handleRazorpayPay}>
        <Wallet className="size-4" />
        {t('payment.payWithRazorpay')}
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        {t('auth.login.or')}
        <div className="h-px flex-1 bg-border" />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 py-6">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Banknote className="size-4" />
            {t('payment.payAtLibraryTitle')}
          </p>
          <p className="text-sm text-muted-foreground">{t('payment.payAtLibraryDescription')}</p>
          <Button variant="outline" onClick={handlePayAtLibrary}>
            {t('payment.contactManager')}
          </Button>
        </CardContent>
      </Card>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        {t('payment.secureNotice')}
      </p>
    </div>
  );
}
