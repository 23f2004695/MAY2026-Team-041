import { Banknote, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { AnimatedNumber, PageHeader } from '@/components/common';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/lib/api';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { useAuth } from '@/providers/AuthProvider';

// Auth is already enforced by the ProtectedRoute this page is nested under
// (see AppRouter.tsx) — no need to re-check isAuthenticated here.
export function PaymentPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { createPayment, postAuthRedirect, clearPostAuthRedirect } = useAuth();

  const amount = Number(params.get('amount')) || 0;
  const label = params.get('label') ?? t('payment.defaultLabel');
  // Set only when this payment is for a membership plan (Register, first-time Google
  // signup, or renewal) — fine payments omit it so they don't get counted as membership.
  const months = Number(params.get('months')) || undefined;
  // Set only by the "Renew" buttons on the member/guardian subscription cards —
  // fine payments and other charges don't offer a plan switch.
  const isRenewal = params.get('renewal') === '1';

  useEffect(() => {
    if (params.get('failed') === '1') {
      toast.error('Payment failed, try again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Consume PublicRoute's post-registration redirect once we've actually landed here, so a
  // later browser-back to /login or /register while still authenticated doesn't bounce back
  // to Payment (see guards.tsx's PublicRoute for why this isn't cleared there instead).
  useEffect(() => {
    if (postAuthRedirect) clearPostAuthRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ponytail: real Razorpay Checkout.js + order-creation endpoint + signature
  // verification isn't built yet — these two buttons stand in for that gateway
  // callback so the rest of the app (payment recorded, redirect on success/failure)
  // can be built and tested now. Swap the bodies for a real Checkout.js call later.
  async function handleSimulateSuccess() {
    try {
      await createPayment({ amount, label, plan_months: months });
      toast.success('Payment successful');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not record payment');
    }
  }

  function handleSimulateFailure() {
    const monthsParam = months ? `&months=${months}` : '';
    navigate(
      `${ROUTES.PAYMENT}?amount=${amount}&label=${encodeURIComponent(label)}${monthsParam}&failed=1`,
      { replace: true },
    );
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

      {isRenewal && (
        <p className="text-center text-sm text-muted-foreground">
          {t('payment.renewingCurrentPlan')}{' '}
          <Link to={ROUTES.PRICING} className="font-medium text-primary hover:underline">
            {t('payment.changePlan')}
          </Link>
        </p>
      )}

      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Temporary testing controls — real Razorpay checkout isn't wired up yet.
        </p>
        <div className="flex gap-2">
          <Button size="lg" className="flex-1 gap-2" onClick={handleSimulateSuccess}>
            <CheckCircle2 className="size-4" />
            Simulate Success
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleSimulateFailure}
          >
            <XCircle className="size-4" />
            Simulate Failure
          </Button>
        </div>
      </div>

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
