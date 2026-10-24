'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Hotel, Map as MapIcon, Plus, Sun, Users } from 'lucide-react';
import { adminFetch } from '@/lib/admin/api';
import { useAdmin } from '@/components/admin/AdminShell';
import { EmptyState, ErrorState, PageHeader, Spinner } from '@/components/admin/ui';

interface ModuleStat {
  total: number;
  published: number;
  draft: number;
}
interface Stats {
  destinations: ModuleStat;
  hotels: ModuleStat;
  activities: ModuleStat;
  itineraries: ModuleStat;
  destinationsByType: { domestic: number; international: number };
  activeUsers: number;
  recentActivity: { id: string; action: string; entityType: string; userName: string | null; createdAt: string }[];
}

const MODULES = [
  { key: 'hotels', label: 'Hotels & Resorts', href: '/admin/hotels', icon: Hotel },
  { key: 'destinations', label: 'Destinations', href: '/admin/destinations', icon: Compass },
  { key: 'itineraries', label: 'Itineraries', href: '/admin/itineraries', icon: MapIcon },
  { key: 'activities', label: 'Day Outings', href: '/admin/day-outings', icon: Sun },
] as const;

const ENTITY_LABEL: Record<string, string> = { Destination: 'destination', Hotel: 'hotel', Package: 'package', Activity: 'day outing', Itinerary: 'itinerary', User: 'user', MediaAsset: 'images' };
const VERB: Record<string, string> = { CREATE: 'created', UPDATE: 'updated', DELETE: 'deleted', PUBLISH: 'published', UNPUBLISH: 'unpublished', UPLOAD: 'uploaded', USER: 'signed in', RESET: 'reset password for', CHANGE: 'changed password', REVOKE: 'signed out devices' };

function describe(a: Stats['recentActivity'][number]): string {
  if (a.action === 'USER_LOGIN') return 'signed in';
  const verb = VERB[a.action.split('_')[0]] ?? a.action.toLowerCase().replace(/_/g, ' ');
  return `${verb} a ${ENTITY_LABEL[a.entityType] ?? a.entityType.toLowerCase()}`;
}

function ago(iso: string): string {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function DashboardPage() {
  const { user, can } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    adminFetch<{ data: Stats }>('/admin/stats')
      .then((r) => setStats(r.data))
      .catch((e) => setError(e.message || 'Could not load the dashboard'));
  }, []);
  useEffect(load, [load]);

  if (error) return <div className="card"><ErrorState message={error} onRetry={load} /></div>;
  if (!stats) return <Spinner />;

  const { domestic, international } = stats.destinationsByType;
  const destTotal = Math.max(domestic + international, 1);

  return (
    <div>
      <PageHeader title={`Welcome back, ${user.name.split(' ')[0]}`} subtitle="Live counts from the website database." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {MODULES.map((m) => {
          const s = stats[m.key];
          const pct = s.total ? Math.round((s.published / s.total) * 100) : 0;
          return (
            <div key={m.key} className="card flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-ink text-accent">
                  <m.icon className="size-5" />
                </div>
                <Link href={`${m.href}/new`} className="rounded-full p-2 text-ink-muted hover:bg-surface hover:text-ink" aria-label={`Add to ${m.label}`} title="Add new">
                  <Plus className="size-4" />
                </Link>
              </div>
              <Link href={m.href} className="mt-4 block">
                <p className="text-3xl font-semibold tracking-tight text-ink">{s.total.toLocaleString('en-IN')}</p>
                <p className="text-sm text-ink-muted">{m.label}</p>
              </Link>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface" role="img" aria-label={`${pct}% published`}>
                <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                <span className="font-semibold text-emerald-700">{s.published} published</span> · {s.draft} draft{s.draft === 1 ? '' : 's'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-ink">Recent activity</h2>
          {stats.recentActivity.length === 0 ? (
            <EmptyState title="No activity yet" hint="Changes made in the panel will appear here." />
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {stats.recentActivity.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <p className="min-w-0 truncate text-ink">
                    <span className="font-semibold">{a.userName ?? 'Someone'}</span> <span className="text-ink-muted">{describe(a)}</span>
                  </p>
                  <time className="shrink-0 text-xs text-ink-subtle" dateTime={a.createdAt}>
                    {ago(a.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-4">
          <section className="card p-5">
            <h2 className="text-base font-semibold text-ink">Destinations</h2>
            <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-surface" role="img" aria-label={`${domestic} domestic, ${international} international`}>
              <div className="bg-accent" style={{ width: `${(domestic / destTotal) * 100}%` }} />
              <div className="bg-ink" style={{ width: `${(international / destTotal) * 100}%` }} />
            </div>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-ink-muted"><span className="size-2.5 rounded-full bg-accent" />Domestic</dt><dd className="font-semibold text-ink">{domestic}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-ink-muted"><span className="size-2.5 rounded-full bg-ink" />International</dt><dd className="font-semibold text-ink">{international}</dd></div>
            </dl>
          </section>

          {can.manageUsers && (
            <Link href="/admin/users" className="card card-hover flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Active users</p>
                  <p className="text-xs text-ink-muted">Manage who can sign in</p>
                </div>
              </div>
              <p className="text-2xl font-semibold text-ink">{stats.activeUsers}</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
