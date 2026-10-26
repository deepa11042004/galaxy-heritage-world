'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { API_BASE } from '@/lib/admin/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      // Store token in localStorage for client auth header fallback
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('ghw_token', data.token);
        localStorage.setItem('ghw_user', JSON.stringify(data.user));
      }

      const next = new URLSearchParams(window.location.search).get('next');
      router.push(next && /^\/admin(\/|$)/.test(next) ? next : '/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hero-frame-wrap">
      <div className="flex min-h-[calc(100svh-var(--utility-h)-1.5rem)] items-center justify-center rounded-hero bg-surface px-4 pt-[calc(var(--nav-h)+1.5rem)] pb-12 sm:px-6">
        <div className="card w-full max-w-md p-8 shadow-[0_30px_60px_-36px_rgba(14,14,14,0.3)] sm:p-10">
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-5 h-16 w-48">
              <Image
                src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
                alt="Galaxy Heritage World"
                fill
                className="object-contain"
                sizes="192px"
              />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">Sign In to Portal</h1>
            <p className="mt-2 text-sm text-ink-muted">
              Access staff administration, enquiries management, or guest services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <input
                  type="email"
                  required
                  placeholder="admin@galaxyheritageworld.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11"
                />
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={buttonVariants({ variant: 'dark', size: 'lg', block: true })}
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="text-accent" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
