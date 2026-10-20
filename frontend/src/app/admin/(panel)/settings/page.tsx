'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Monitor } from 'lucide-react';
import { adminFetch, ApiError, jsonBody, ROLE_LABELS } from '@/lib/admin/api';
import { useAdmin } from '@/components/admin/AdminShell';
import { PageHeader, Spinner, useToast } from '@/components/admin/ui';

interface Account {
  name: string;
  email: string;
  phone: string | null;
  roles: string[];
}
interface SessionRow {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  current: boolean;
}

const PASSWORD_HINT = 'At least 10 characters with upper-case, lower-case and a number.';

function deviceName(ua: string | null): string {
  if (!ua) return 'Unknown device';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : '';
  return os ? `${browser} on ${os}` : browser;
}

function ProfileCard({ account, onSaved }: { account: Account; onSaved: (a: Account) => void }) {
  const { toast } = useToast();
  const { setName: updateShellName } = useAdmin();
  const [name, setName] = useState(account.name);
  const [phone, setPhone] = useState(account.phone ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await adminFetch<{ data: Account }>('/admin/account', { method: 'PUT', ...jsonBody({ name, phone: phone || null }) });
      onSaved(res.data);
      updateShellName(res.data.name);
      toast('success', 'Profile saved.');
    } catch (err) {
      setError(err instanceof ApiError && err.issues[0] ? err.issues[0].message : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="card p-5 sm:p-6" noValidate>
      <h2 className="text-base font-semibold text-ink">Profile</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="p-name">Full name</label>
          <input id="p-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="p-phone">Phone</label>
          <input id="p-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="p-email">Email</label>
          <input id="p-email" className="input" value={account.email} disabled />
        </div>
        <div>
          <label className="label" htmlFor="p-role">Role</label>
          <input id="p-role" className="input" value={account.roles.map((r) => ROLE_LABELS[r] ?? r).join(', ')} disabled />
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-xs text-rose-600">{error}</p>}
      <div className="mt-5 flex justify-end">
        <button className="btn btn-primary btn-sm" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />} Save profile
        </button>
      </div>
    </form>
  );
}

function PasswordCard({ onChanged }: { onChanged: () => void }) {
  const { toast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next !== confirm) return setError('The new passwords do not match.');
    setBusy(true);
    try {
      await adminFetch('/admin/account/password', { method: 'POST', ...jsonBody({ currentPassword: current, newPassword: next }) });
      toast('success', 'Password changed. Other devices were signed out.');
      setCurrent('');
      setNext('');
      setConfirm('');
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError && err.issues[0] ? err.issues[0].message : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="card p-5 sm:p-6" noValidate>
      <h2 className="text-base font-semibold text-ink">Change password</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="pw-cur">Current password</label>
          <input id="pw-cur" type="password" autoComplete="current-password" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="pw-new">New password</label>
          <input id="pw-new" type="password" autoComplete="new-password" className="input" value={next} onChange={(e) => setNext(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="pw-conf">Confirm new password</label>
          <input id="pw-conf" type="password" autoComplete="new-password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-ink-subtle">{PASSWORD_HINT}</p>
      {error && <p role="alert" className="mt-3 text-xs text-rose-600">{error}</p>}
      <div className="mt-5 flex justify-end">
        <button className="btn btn-primary btn-sm" disabled={busy || !current || !next}>
          {busy && <Loader2 className="animate-spin" />} Update password
        </button>
      </div>
    </form>
  );
}

function SessionsCard({ refreshKey }: { refreshKey: number }) {
  const { toast } = useToast();
  const [rows, setRows] = useState<SessionRow[] | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    adminFetch<{ data: SessionRow[] }>('/admin/account/sessions')
      .then((r) => setRows(r.data))
      .catch(() => setRows([]));
  }, []);
  useEffect(load, [load, refreshKey]);

  const revoke = async () => {
    setBusy(true);
    try {
      const res = await adminFetch<{ message: string }>('/admin/account/sessions', { method: 'DELETE' });
      toast('success', res.message);
      load();
    } catch (err: any) {
      toast('error', err.message);
    } finally {
      setBusy(false);
    }
  };

  const others = rows?.filter((r) => !r.current).length ?? 0;

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Signed-in devices</h2>
          <p className="text-xs text-ink-muted">Sessions stay active for up to 7 days.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={revoke} disabled={busy || others === 0}>
          {busy && <Loader2 className="animate-spin" />} Sign out other devices
        </button>
      </div>
      {rows === null ? (
        <Spinner />
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {rows.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3">
              <Monitor className="size-5 shrink-0 text-ink-subtle" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {deviceName(s.userAgent)} {s.current && <span className="ml-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent-strong">This device</span>}
                </p>
                <p className="text-xs text-ink-muted">
                  {s.ipAddress ?? 'Unknown IP'} · signed in {new Date(s.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function SettingsPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionsKey, setSessionsKey] = useState(0);

  useEffect(() => {
    adminFetch<{ data: Account }>('/admin/account')
      .then((r) => setAccount(r.data))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p role="alert" className="text-sm text-rose-600">{error}</p>;
  if (!account) return <Spinner />;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Your account and sign-in security." />
      <div className="mx-auto max-w-3xl space-y-5">
        <ProfileCard account={account} onSaved={setAccount} />
        <PasswordCard onChanged={() => setSessionsKey((k) => k + 1)} />
        <SessionsCard refreshKey={sessionsKey} />
      </div>
    </div>
  );
}
