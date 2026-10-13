'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

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

      const res = await fetch('http://localhost:4000/api/v1/auth/login', {
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

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#D4AF37]/20">
        <div className="text-center mb-8">
          <div className="relative w-56 h-18 mx-auto mb-4">
            <Image
              src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
              alt="Galaxy Heritage World"
              fill
              className="object-contain"
              sizes="224px"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Sign In to Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Access staff administration, enquiries management, or member services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@galaxyheritageworld.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0B1320] hover:bg-gray-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <div>Default Admin Access:</div>
          <div className="font-mono text-gray-700 mt-1">
            admin@galaxyheritageworld.com
          </div>
        </div>
      </div>
    </div>
  );
}
