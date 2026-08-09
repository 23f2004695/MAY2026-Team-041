import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { PageTitle, SeatCard } from '@/components/common';
import { Modal } from '@/components/ui';
import { getErrorMessage } from '@/lib/api';
import { useAuth, type SeatBookingRecord, type SeatSlot } from '@/providers/AuthProvider';

import { BookingSummary } from '../components/BookingSummary';
import { DateSlider } from '../components/DateSlider';
import { SeatLegend } from '../components/SeatLegend';

const SEAT_ROWS = ['A', 'B', 'C', 'D'];
const SEATS_PER_ROW = 8;
const SEAT_LABELS = SEAT_ROWS.flatMap((row) =>
  Array.from({ length: SEATS_PER_ROW }, (_, index) => `${row}${index + 1}`),
);

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatHourLabel(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
}

function slotKey(seatLabel: string, date: string, hour: number): string {
  return `${seatLabel}|${date}|${hour}`;
}

const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

export function SeatBookingPage() {
  const { t } = useTranslation();
  const {
    getSeatSchedule,
    bookSeat,
    getMySeatBookings,
    cancelSeatBooking,
    requestSeatNotify,
  } = useAuth();

  const dateOptions = useMemo(() => {
    const today = new Date();
    return [0, 1, 2].map((offset) => {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return {
        value: toDateInputValue(date),
        label: offset === 0 ? t('seatBooking.today') : dayFormatter.format(date),
      };
    });
  }, [t]);

  const todayValue = dateOptions[0].value;
  const [selectedDate, setSelectedDate] = useState(todayValue);
  const [selectedHour, setSelectedHour] = useState(() => new Date().getHours());
  const [seats, setSeats] = useState<SeatSlot[] | null>(null);
  const [selectedSeatLabel, setSelectedSeatLabel] = useState<string | null>(null);
  const [myBookings, setMyBookings] = useState<SeatBookingRecord[]>([]);
  const [notifiedSlots, setNotifiedSlots] = useState<Set<string>>(new Set());
  const [isBusy, setIsBusy] = useState(false);
  // Picking a date is now direct (see selectDate below) — the grid updates immediately
  // for whatever hour is currently selected. This modal is only for the secondary
  // "change time" action: choosing a specific hour within the already-selected date.
  const [slotModalDate, setSlotModalDate] = useState<string | null>(null);

  const isHourPast = (hour: number, date: string = selectedDate) =>
    date === todayValue && hour < new Date().getHours();
  // If the raw selection is a hour that's since slipped into the past for "Today"
  // (e.g. picked while browsing tomorrow, then switched back), fall back to the
  // current hour rather than fetching/booking a slot the backend will reject anyway.
  const effectiveHour = isHourPast(selectedHour) ? new Date().getHours() : selectedHour;

  function selectDate(date: string) {
    setSelectedDate(date);
    setSelectedSeatLabel(null);
  }

  function openSlotModal(date: string) {
    setSlotModalDate(date);
  }

  function chooseSlot(hour: number) {
    if (!slotModalDate || isHourPast(hour, slotModalDate)) return;
    setSelectedDate(slotModalDate);
    setSelectedHour(hour);
    setSelectedSeatLabel(null);
    setSlotModalDate(null);
  }

  const selectedSeat = seats?.find((seat) => seat.seat_label === selectedSeatLabel) ?? null;
  // A "booked_by_me" seat already reflects this for the currently selected seat, but a
  // member could have booked a *different* seat in this same slot and then selected an
  // available one — this catches that case so Confirm doesn't round-trip to a 409.
  const hasOtherBookingThisSlot =
    selectedSeat?.status !== 'booked_by_me' &&
    myBookings.some((booking) => booking.date === selectedDate && booking.hour === effectiveHour);

  // Selection deliberately persists across date/hour changes — flipping through
  // slots to see when a specific seat frees up is a reasonable thing to want.
  useEffect(() => {
    let cancelled = false;
    getSeatSchedule(selectedDate, effectiveHour)
      .then((schedule) => {
        if (!cancelled) setSeats(schedule.seats);
      })
      .catch(() => {
        if (!cancelled) setSeats(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, effectiveHour, getSeatSchedule]);

  useEffect(() => {
    getMySeatBookings().then(setMyBookings);
  }, [getMySeatBookings]);

  function reportError(error: unknown) {
    toast.error(getErrorMessage(error, t('common.errors.generic')));
  }

  async function refreshSchedule() {
    const schedule = await getSeatSchedule(selectedDate, effectiveHour);
    setSeats(schedule.seats);
  }

  async function confirmBooking() {
    if (
      !selectedSeat ||
      selectedSeat.status !== 'available' ||
      isHourPast(effectiveHour) ||
      hasOtherBookingThisSlot
    )
      return;
    setIsBusy(true);
    try {
      await bookSeat({ seat_label: selectedSeat.seat_label, date: selectedDate, hour: effectiveHour });
      await refreshSchedule();
      setMyBookings(await getMySeatBookings());
      toast.success(t('seatBooking.confirmToast', { seatId: selectedSeat.seat_label }));
    } catch (error) {
      reportError(error);
    } finally {
      setIsBusy(false);
    }
  }

  async function cancelBooking(bookingId: string) {
    setIsBusy(true);
    try {
      await cancelSeatBooking(bookingId);
      await refreshSchedule();
      setMyBookings(await getMySeatBookings());
    } catch (error) {
      reportError(error);
    } finally {
      setIsBusy(false);
    }
  }

  async function requestNotify() {
    if (!selectedSeat) return;
    setIsBusy(true);
    try {
      await requestSeatNotify({
        seat_label: selectedSeat.seat_label,
        date: selectedDate,
        hour: effectiveHour,
      });
      setNotifiedSlots((prev) =>
        new Set(prev).add(slotKey(selectedSeat.seat_label, selectedDate, effectiveHour)),
      );
      toast.success(t('seatBooking.bookingSummary.notifyToast', { seatId: selectedSeat.seat_label }));
    } catch (error) {
      reportError(error);
    } finally {
      setIsBusy(false);
    }
  }

  const isNotified = selectedSeat
    ? notifiedSlots.has(slotKey(selectedSeat.seat_label, selectedDate, effectiveHour))
    : false;

  // Every booking is a fixed 1-hour slot (hour:00 -> hour+1:00). When the slot currently
  // selected is the one happening right now, show a live-ish countdown to when it frees
  // up; for a future slot there's nothing counting down yet, just the fixed end time.
  const slotEndHourLabel = formatHourLabel((effectiveHour + 1) % 24);
  const isSlotInProgress = selectedDate === todayValue && effectiveHour === new Date().getHours();
  const minutesUntilFree = isSlotInProgress ? 60 - new Date().getMinutes() : null;

  return (
    <div className="flex flex-col gap-6">
      <PageTitle title={t('seatBooking.pageTitle')} description={t('seatBooking.pageDescription')} />

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        <DateSlider
          options={dateOptions.map((option) => ({
            value: option.value,
            label: option.label,
            subLabel: dayFormatter.format(new Date(`${option.value}T00:00:00`)),
          }))}
          active={selectedDate}
          ariaLabel={t('seatBooking.dateSliderAriaLabel')}
          onChange={selectDate}
        />
        <p className="text-sm text-muted-foreground">
          {t('seatBooking.selectedSlot', {
            date: dateOptions.find((option) => option.value === selectedDate)?.label ?? selectedDate,
            hour: formatHourLabel(effectiveHour),
          })}{' '}
          <button
            type="button"
            onClick={() => openSlotModal(selectedDate)}
            className="font-medium text-primary hover:underline"
          >
            {t('seatBooking.changeTime')}
          </button>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
          <SeatLegend />
          <div className="flex flex-col gap-4">
            {SEAT_ROWS.map((row) => (
              <div key={row} className="flex items-center gap-3">
                <span className="w-6 text-sm font-semibold text-muted-foreground">{row}</span>
                <div className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-8">
                  {SEAT_LABELS.filter((label) => label.startsWith(row)).map((label) => {
                    const seat = seats?.find((s) => s.seat_label === label);
                    // Own bookings get their own distinct visual ('mine') instead of being
                    // lumped in with "reserved" — avatars alone aren't always enough to tell
                    // your seat apart from someone else's at a glance.
                    const visualStatus =
                      !seat || seat.status === 'available'
                        ? 'available'
                        : seat.status === 'booked_by_me'
                          ? 'mine'
                          : 'reserved';
                    return (
                      <SeatCard
                        key={label}
                        label={label}
                        status={visualStatus}
                        avatarUrl={seat?.booked_by_avatar_url}
                        selected={selectedSeatLabel === label}
                        onSelect={() => setSelectedSeatLabel(label)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <BookingSummary
          selectedSeat={selectedSeat}
          dateLabel={dateOptions.find((option) => option.value === selectedDate)?.label ?? selectedDate}
          hourLabel={formatHourLabel(effectiveHour)}
          slotEndHourLabel={slotEndHourLabel}
          minutesUntilFree={minutesUntilFree}
          isNotified={isNotified}
          hasOtherBookingThisSlot={hasOtherBookingThisSlot}
          isBusy={isBusy}
          myBookings={myBookings}
          onConfirm={confirmBooking}
          onCancelBooking={cancelBooking}
          onRequestNotify={requestNotify}
        />
      </div>

      <Modal
        open={slotModalDate !== null}
        onClose={() => setSlotModalDate(null)}
        title={
          slotModalDate
            ? t('seatBooking.pickTimeTitle', {
                date: dateOptions.find((option) => option.value === slotModalDate)?.label ?? slotModalDate,
              })
            : undefined
        }
      >
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {HOURS.map((hour) => {
            const disabled = slotModalDate ? isHourPast(hour, slotModalDate) : false;
            const isCurrent = slotModalDate === selectedDate && effectiveHour === hour;
            return (
              <button
                key={hour}
                type="button"
                disabled={disabled}
                onClick={() => chooseSlot(hour)}
                className={
                  'rounded-md px-2.5 py-2 text-sm font-medium transition-colors ' +
                  (disabled
                    ? 'cursor-not-allowed bg-secondary/20 text-muted-foreground/50'
                    : isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/60 text-foreground hover:bg-secondary')
                }
              >
                {formatHourLabel(hour)}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
