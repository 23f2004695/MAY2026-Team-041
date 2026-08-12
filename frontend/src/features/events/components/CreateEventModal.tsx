import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button, Checkbox, Input, Modal, Textarea } from '@/components/ui';
import { apiPost, apiPut, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

import type { Event } from '../pages/EventsPage';

interface Props {
  open: boolean;
  /** Present => editing this event instead of creating a new one. */
  event?: Event | null;
  onClose: () => void;
  onSaved: () => void;
}

interface ManagerOption {
  id: string;
  full_name: string;
  email: string;
}

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const EMPTY_FORM = { title: '', description: '', location: '', date: '', capacity: '' };

export function CreateEventModal({ open, event, onClose, onSaved }: Props) {
  const { token, getMembers } = useAuth();
  const isEditing = event != null;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [managers, setManagers] = useState<ManagerOption[]>([]);
  const [selectedManagerIds, setSelectedManagerIds] = useState<string[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [managerLoadError, setManagerLoadError] = useState<unknown>(null);

  const loadManagers = useCallback(() => {
    if (!open) return;
    setIsLoadingManagers(true);
    setManagerLoadError(null);
    getMembers({ active_only: true, role: 'manager', page_size: 100 })
      .then((data) => setManagers(data.items))
      .catch(setManagerLoadError)
      .finally(() => setIsLoadingManagers(false));
  }, [open, getMembers]);

  // The API enforces this invariant too; filter the picker so invalid accounts
  // are never presented as assignable choices in the first place.
  useEffect(() => {
    const timer = setTimeout(loadManagers, 0);
    return () => clearTimeout(timer);
  }, [loadManagers]);

  // Reset the form when the modal transitions closed -> open, prefilling from `event`
  // in edit mode. A render-time conditional (not an effect) — see WaiveFineModal for
  // the same pattern elsewhere in this codebase.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      if (event) {
        setForm({
          title: event.title,
          description: event.description ?? '',
          location: event.location,
          date: toDatetimeLocalValue(event.date),
          capacity: String(event.capacity),
        });
        setSelectedManagerIds(event.assigned_managers.map((manager) => manager.id));
      } else {
        setForm(EMPTY_FORM);
        setSelectedManagerIds([]);
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleManager(id: string) {
    setSelectedManagerIds((prev) =>
      prev.includes(id) ? prev.filter((managerId) => managerId !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in with a real account to manage events');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        location: form.location,
        date: new Date(form.date).toISOString(),
        capacity: Number(form.capacity),
        manager_ids: selectedManagerIds,
      };
      if (isEditing && event) {
        await apiPut(`/events/${event.id}`, payload, token);
        toast.success(`Event "${form.title}" updated`);
      } else {
        await apiPost('/events', payload, token);
        toast.success(`Event "${form.title}" created`);
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(
        getErrorMessage(err, `Failed to ${isEditing ? 'update' : 'create'} event`,
      ));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Event' : 'Create Event'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Title" name="title" value={form.title} onChange={handleChange} required placeholder="Event title" />

        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
          rows={3}
        />

        <Input label="Location" name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Main Hall" />

        <Input
          label="Date & Time"
          name="date"
          type="datetime-local"
          min={isEditing ? undefined : toDatetimeLocalValue(new Date().toISOString())}
          value={form.date}
          onChange={handleChange}
          required
        />

        <Input label="Capacity" name="capacity" type="number" min={1} value={form.capacity} onChange={handleChange} required placeholder="Max attendees" />

        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-medium text-foreground">Manager Assign</legend>
          {isLoadingManagers ? (
            <p className="text-sm text-muted-foreground" role="status">Loading assignable managers…</p>
          ) : managerLoadError ? (
            <div role="alert" className="flex items-center justify-between gap-3 rounded-md border border-danger/30 p-2 text-sm text-danger">
              <span>{getErrorMessage(managerLoadError, 'Unable to load assignable managers.')}</span>
              <Button type="button" size="sm" variant="outline" onClick={loadManagers}>Try again</Button>
            </div>
          ) : managers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No managers available to assign.</p>
          ) : (
            <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto rounded-md border border-border p-2">
              {managers.map((manager) => (
                <Checkbox
                  key={manager.id}
                  label={manager.full_name}
                  checked={selectedManagerIds.includes(manager.id)}
                  onChange={() => toggleManager(manager.id)}
                />
              ))}
            </div>
          )}
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={loading}>
            {isEditing ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
