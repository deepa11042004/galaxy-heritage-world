'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Hotel,
  Compass,
  Map as MapIcon,
  Sun,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Inbox,
  Ticket,
} from 'lucide-react';
import { adminFetch, ROLE_LABELS } from '@/lib/admin/api';
import { cn } from '@/lib/utils';
import { Spinner, ToastProvider } from './ui';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthState {
  user: AdminUser;
  can: { delete: boolean; manageUsers: boolean };
  signOut: () => Promise<void>;
  setName: (name: string) => void;
}

const AuthContext = createContext<AuthState | null>(null);
export function useAdmin(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminShell>');
  return ctx;
}

const PANEL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/hotels', label: 'Hotels & Resorts', icon: Hotel },
  { href: '/admin/destinations', label: 'Destinations', icon: Compass },
  { href: '/admin/itineraries', label: 'Itineraries', icon: MapIcon },
  { href: '/admin/day-outings', label: 'Day Outings', icon: Sun },
  { href: '/admin/users', label: 'Users', icon: Users, superOnly: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '/admin';
  const [user, setUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminFetch<{ user: AdminUser }>('/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.user);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        else setError(err.message || 'Could not reach the server');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-center">
        <div className="card max-w-sm p-8">
          <p className="text-sm text-ink">{error}</p>
          <button className="btn btn-dark btn-sm mt-4" onClick={() => location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface">
        <Spinner label="Checking your session…" />
      </div>
    );
  }

  if (!user.roles.some((r) => PANEL_ROLES.includes(r))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-center">
        <div className="card max-w-sm p-8">
          <h1 className="text-lg font-semibold text-ink">No admin access</h1>
          <p className="mt-2 text-sm text-ink-muted">Your account ({user.email}) is not authorised to use the admin panel.</p>
          <Link href="/" className="btn btn-dark btn-sm mt-4">
            Back to website
          </Link>
        </div>
      </div>
    );
  }

  const isSuper = user.roles.includes('SUPER_ADMIN');
  const auth: AuthState = {
    user,
    can: { delete: isSuper || user.roles.includes('ADMIN'), manageUsers: isSuper },
    signOut: async () => {
      await adminFetch('/auth/logout', { method: 'POST' }).catch(() => {});
      try {
        localStorage.removeItem('ghw_token');
        localStorage.removeItem('ghw_user');
      } catch {}
      router.replace('/login');
    },
    setName: (name) => setUser((u) => (u ? { ...u, name } : u)),
  };

  const items = NAV.filter((n) => !n.superOnly || auth.can.manageUsers);
  const roleLabel = ROLE_LABELS[user.roles[0]] ?? user.roles[0];
  const current = items.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)));

  const link = (n: (typeof NAV)[number]) => {
    const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
    return (
      <Link
        key={n.href}
        href={n.href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          active ? 'bg-accent-soft text-ink' : 'text-ink-muted hover:bg-surface hover:text-ink'
        )}
      >
        <n.icon className={cn('size-4.5', active && 'text-accent-strong')} />
        {n.label}
      </Link>
    );
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link href="/admin" className="relative block h-9 w-36">
          <Image src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png" alt="Galaxy Heritage World" fill sizes="144px" className="object-contain object-left" />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        {items.map(link)}
        <p className="px-3 pt-5 pb-1 text-[11px] font-semibold tracking-wide text-ink-subtle uppercase">Existing tools</p>
        <Link href="/admin/enquiries" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink">
          <Inbox className="size-4.5" /> Enquiries
        </Link>
        <Link href="/admin/vouchers" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink">
          <Ticket className="size-4.5" /> Vouchers
        </Link>
      </nav>
      <div className="border-t border-line p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink">
          <ExternalLink className="size-4.5" /> View website
        </Link>
      </div>
    </div>
  );

  return (
    <AuthContext.Provider value={auth}>
      <ToastProvider>
        <div className="min-h-screen bg-surface">
          <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:block">{sidebar}</aside>

          {open && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
              <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-fade-in bg-white shadow-2xl">
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-3 rounded-full p-1.5 text-ink-muted hover:bg-surface">
                  <X className="size-5" />
                </button>
                {sidebar}
              </aside>
            </div>
          )}

          <div className="lg:pl-64">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
              <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-full p-2 text-ink hover:bg-surface lg:hidden">
                <Menu className="size-5" />
              </button>
              <p className="flex-1 truncate text-sm font-semibold text-ink">{current?.label ?? 'Admin'}</p>
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-sm font-semibold text-ink">{user.name}</p>
                <p className="text-[11px] text-ink-muted">{roleLabel}</p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-ink" aria-hidden>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={auth.signOut} className="btn btn-outline btn-sm" title="Sign out">
                <LogOut /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </header>
            <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </ToastProvider>
    </AuthContext.Provider>
  );
}
