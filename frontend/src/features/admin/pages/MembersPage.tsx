import { useEffect, useRef, useState } from 'react';
import { Search, ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/common';
import { Badge, Button, Input } from '@/components/ui';
import { apiGet, apiPut, ApiError } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface Role { id: string; name: string; }
interface Member {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: Role;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}
interface MemberListResponse {
  items: Member[];
  total: number;
  page: number;
  page_size: number;
}

const ROLES = ['member', 'librarian', 'manager', 'it-head', 'guardian', 'admin'];
const PAGE_SIZE = 20;

export function MembersPage() {
  const { token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function fetchMembers(q: string, p: number) {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), page_size: String(PAGE_SIZE) });
      if (q) params.set('search', q);
      const data = await apiGet<MemberListResponse>(`/members?${params}`, token);
      setMembers(data.items);
      setTotal(data.total);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchMembers(search, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void fetchMembers(value, 1), 400);
  }

  async function toggleActive(member: Member) {
    if (!token) return;
    setUpdatingId(member.id);
    try {
      await apiPut(`/members/${member.id}`, { is_active: !member.is_active }, token);
      toast.success(`${member.full_name} ${member.is_active ? 'deactivated' : 'activated'}`);
      void fetchMembers(search, page);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  }

  async function changeRole(member: Member, role_name: string) {
    if (!token) return;
    setUpdatingId(member.id);
    try {
      await apiPut(`/members/${member.id}`, { role_name }, token);
      toast.success(`${member.full_name} is now ${role_name}`);
      void fetchMembers(search, page);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Members"
        description={`${total} total members`}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No members found.
                </td>
              </tr>
            )}
            {!loading && members.map((m) => (
              <tr key={m.id} className="bg-surface hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{m.full_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.phone ?? '—'}</td>
                <td className="px-4 py-3">
                  <select
                    className="rounded border border-border bg-surface px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={m.role.name}
                    disabled={updatingId === m.id}
                    onChange={(e) => void changeRole(m, e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={m.is_active ? 'success' : 'danger'}>
                    {m.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {m.last_login_at ? new Date(m.last_login_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant={m.is_active ? 'danger' : 'success'}
                    isLoading={updatingId === m.id}
                    leadingIcon={m.is_active ? <ShieldOff className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                    onClick={() => void toggleActive(m)}
                  >
                    {m.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
