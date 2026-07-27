import { useState } from 'react';
import { toast } from 'sonner';

import { Button, Input, Modal } from '@/components/ui';
import { apiPost, ApiError } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateEventModal({ open, onClose, onCreated }: Props) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    capacity: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in with a real account to create events');
      return;
    }
    setLoading(true);
    try {
      await apiPost(
        '/events',
        {
          title: form.title,
          description: form.description || null,
          location: form.location,
          date: new Date(form.date).toISOString(),
          capacity: Number(form.capacity),
        },
        token,
      );
      toast.success(`Event "${form.title}" created`);
      setForm({ title: '', description: '', location: '', date: '', capacity: '' });
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Event">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Title</label>
          <Input name="title" value={form.title} onChange={handleChange} required placeholder="Event title" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional description"
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Location</label>
          <Input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Main Hall" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Date & Time</label>
          <Input name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Capacity</label>
          <Input name="capacity" type="number" min={1} value={form.capacity} onChange={handleChange} required placeholder="Max attendees" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={loading}>Create Event</Button>
        </div>
      </form>
    </Modal>
  );
}
