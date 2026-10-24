'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Mail, RefreshCw, Search } from 'lucide-react';
import { adminFetch } from '@/lib/admin/api';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  subscribedAt: string;
}

export default function AdminNewsletterPage() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const qs = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
    adminFetch<{ data: Subscriber[] }>(`/enquiries/newsletter/list${qs}`)
      .then((r) => setRows(r.data || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Newsletter Subscribers</h1>
          <p className="text-xs text-gray-500">Email addresses collected from the sign-up box in the website footer.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            className="w-full rounded-xl border border-line py-2 pr-4 pl-9 text-xs focus:border-ink/30 focus:ring-4 focus:ring-accent/35 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface text-[10px] tracking-wider text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.length > 0 ? (
                rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-4 py-3.5 font-semibold text-ink">
                      <span className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {r.email}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          r.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {r.isActive ? 'ACTIVE' : 'UNSUBSCRIBED'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400">{new Date(r.subscribedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">
                    {loading ? 'Loading subscribers...' : 'No subscribers yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
