'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { KeyRound, Loader2, Pencil, Plus, Search } from 'lucide-react';
import { adminFetch, ApiError, jsonBody, ROLE_LABELS } from '@/lib/admin/api';
import { useAdmin } from '@/components/admin/AdminShell';
import { EmptyState, ErrorState, Modal, PageHeader, Spinner, Switch, useToast } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

const ROLES = [
  { value: 'EDITOR', label: 'Editor', hint: 'Create, edit and publish content' },
  { value: 'ADMIN', label: 'Admin', hint: 'Editor + delete content' },
  { value: 'SUPER_ADMIN', label: 'Super Admin', hint: 'Admin + manage users' },
];

const PASSWORD_HINT = 'At least 10 characters with upper-case, lower-case and a number.';

function FieldError({ message }: { message?: string }) {
  return message ? <p role="alert" className="mt-1.5 text-xs text-rose-600">{message}</p> : null;
}

function UserModal({ user, onClose, onSaved }: { user: UserRow | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const isNew = !user;
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [role, setRole] = useState(user?.roles[0] && ROLES.some((r) => r.value === user.roles[0]) ? user.roles[0] : 'EDITOR');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(user?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      if (isNew) await adminFetch('/admin/users', { method: 'POST', ...jsonBody({ name, email, phone: phone || null, password, role }) });
      else await adminFetch(`/admin/users/${user.id}`, { method: 'PUT', ...jsonBody({ name, phone: phone || null, role, isActive: active }) });
      toast('success', isNew ? 'User created.' : 'User updated.');
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.issues.length) setErrors(Object.fromEntries(err.issues.map((i) => [i.path, i.message])));
      else toast('error', (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={isNew ? 'Add user' : `Edit ${user.name}`}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" form="user-form" className="btn btn-primary btn-sm" disabled={busy}>
            {busy && <Loader2 className="animate-spin" />} {isNew ? 'Create user' : 'Save'}
          </button>
        </>
      }
    >
      <form id="user-form" onSubmit={save} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="u-name">Full name</label>
          <input id="u-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          <FieldError message={errors.name} />
        </div>
        <div>
          <label className="label" htmlFor="u-email">Email</label>
          <input id="u-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isNew} required />
          <FieldError message={errors.email} />
        </div>
        <div>
          <label className="label" htmlFor="u-phone">Phone (optional)</label>
          <input id="u-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        {isNew && (
          <div>
            <label className="label" htmlFor="u-pass">Password</label>
            <input id="u-pass" type="password" autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <p className="mt-1.5 text-[11px] text-ink-subtle">{PASSWORD_HINT}</p>
            <FieldError message={errors.password} />
          </div>
        )}
        <fieldset>
          <legend className="label">Role</legend>
          <div className="space-y-2">
            {ROLES.map((r) => (
              <label key={r.value} className={cn('flex cursor-pointer items-start gap-3 rounded-xl border p-3', role === r.value ? 'border-accent bg-accent-soft' : 'border-line')}>
                <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} className="mt-1 accent-[#fcba02]" />
                <span>
                  <span className="block text-sm font-semibold text-ink">{r.label}</span>
                  <span className="block text-xs text-ink-muted">{r.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <FieldError message={errors.role} />
        </fieldset>
        {!isNew && (
          <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink">Account active</p>
              <p className="text-xs text-ink-muted">Inactive users are signed out and cannot sign in.</p>
            </div>
            <Switch checked={active} onChange={setActive} label="Account active" />
          </div>
        )}
      </form>
    </Modal>
  );
}

function PasswordModal({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminFetch(`/admin/users/${user.id}/password`, { method: 'POST', ...jsonBody({ password }) });
      toast('success', `Password reset for ${user.name}.`);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError && err.issues[0] ? err.issues[0].message : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={`Reset password for ${user.name}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" form="pw-form" className="btn btn-primary btn-sm" disabled={busy}>
            {busy && <Loader2 className="animate-spin" />} Set password
          </button>
        </>
      }
    >
      <form id="pw-form" onSubmit={save} noValidate>
        <label className="label" htmlFor="pw-new">New password</label>
        <input id="pw-new" type="password" autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <p className="mt-1.5 text-[11px] text-ink-subtle">{PASSWORD_HINT} The user will be signed out everywhere.</p>
        <FieldError message={error} />
      </form>
    </Modal>
  );
}

export default function UsersPage() {
  const { can, user: me } = useAdmin();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserRow | 'new' | null>(null);
  const [resetting, setResetting] = useState<UserRow | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    if (!can.manageUsers) return;
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams({ page: String(page), limit: '20' });
    if (query) qs.set('search', query);
    if (status) qs.set('status', status);
    try {
      const res = await adminFetch<{ data: UserRow[]; total: number; pages: number }>(`/admin/users?${qs}`);
      setRows(res.data);
      setTotal(res.total);
      setPages(res.pages);
    } catch (e: any) {
      setError(e.message || 'Could not load users');
    } finally {
      setLoading(false);
    }
  }, [can.manageUsers, page, query, status]);
  useEffect(() => {
    load();
  }, [load]);

  if (!can.manageUsers) {
    return (
      <div className="card">
        <EmptyState title="Super Admin only" hint="Only Super Admins can manage who has access to the panel." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${total} ${total === 1 ? 'person has' : 'people have'} access to this panel.`}
        actions={<button className="btn btn-primary" onClick={() => setEditing('new')}><Plus /> Add user</button>}
      />
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle" />
            <input type="search" className="input !py-2.5 pl-10" placeholder="Search by name or email…" aria-label="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input !w-auto !py-2.5" aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : loading && !rows.length ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState title="No users found" hint="Try a different search." />
        ) : (
          <div className={cn('overflow-x-auto', loading && 'opacity-60')}>
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="hidden px-4 py-3 md:table-cell">Added</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((u) => (
                  <tr key={u.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{u.name}{u.id === me.id && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent-strong">You</span>}</p>
                      <p className="text-xs text-ink-muted">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{u.roles.map((r) => ROLE_LABELS[r] ?? r).join(', ') || '—'}</td>
                    <td className="hidden px-4 py-3 text-ink-muted md:table-cell">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-surface text-ink-muted')}>
                        <span className={cn('size-1.5 rounded-full', u.isActive ? 'bg-emerald-500' : 'bg-ink-subtle')} />
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing(u)} className="rounded-full p-2 text-ink-muted hover:bg-surface hover:text-ink" title="Edit" aria-label={`Edit ${u.name}`}><Pencil className="size-4" /></button>
                        <button onClick={() => setResetting(u)} className="rounded-full p-2 text-ink-muted hover:bg-surface hover:text-ink" title="Reset password" aria-label={`Reset password for ${u.name}`}><KeyRound className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && !error && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-ink-muted">
            <span>Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <button className="btn btn-outline btn-sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <UserModal
          user={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
      {resetting && <PasswordModal user={resetting} onClose={() => setResetting(null)} />}
    </div>
  );
}
