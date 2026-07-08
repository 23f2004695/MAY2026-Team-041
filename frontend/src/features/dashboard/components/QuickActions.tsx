import { BookOpen, CalendarCheck, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          leadingIcon={<BookOpen className="size-4" />}
          onClick={() => navigate(ROUTES.BOOKS)}
        >
          Browse Books
        </Button>
        <Button
          variant="outline"
          leadingIcon={<CalendarCheck className="size-4" />}
          onClick={() => navigate(ROUTES.SEAT_BOOKING)}
        >
          Book a Seat
        </Button>
        <Button
          variant="outline"
          leadingIcon={<Ticket className="size-4" />}
          onClick={() => navigate(ROUTES.RESERVATIONS)}
        >
          View Reservations
        </Button>
      </CardContent>
    </Card>
  );
}
