import { BookOpen, CalendarCheck, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export function QuickActions() {
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quickActions.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          leadingIcon={<BookOpen className="size-4" />}
          onClick={() => navigate(ROUTES.BOOKS)}
        >
          {t('quickActions.browseBooks')}
        </Button>
        <Button
          variant="outline"
          leadingIcon={<CalendarCheck className="size-4" />}
          onClick={() => navigate(ROUTES.SEAT_BOOKING)}
        >
          {t('quickActions.bookSeat')}
        </Button>
        <Button
          variant="outline"
          leadingIcon={<Ticket className="size-4" />}
          onClick={() => navigate(ROUTES.RESERVATIONS)}
        >
          {t('quickActions.viewReservations')}
        </Button>
      </CardContent>
    </Card>
  );
}
