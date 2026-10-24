'use client';

import { API_BASE } from '@/lib/admin/api';

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Search,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVouchers = () => {
    setLoading(true);
    const token = localStorage.getItem('ghw_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const query = new URLSearchParams();
    if (search) query.set('search', search);

    fetch(`${API_BASE}/enquiries/vouchers/list?${query.toString()}`, {
      credentials: 'include',
      headers,
    })
      .then((r) => r.json())
      .then((res) => {
        setVouchers(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-ink">
                Holiday Voucher Redemptions
              </h1>
              <p className="text-xs text-gray-500">
                Track customer submitted voucher codes, preferred destinations, and verification status.
              </p>
            </div>
          </div>

          <button
            onClick={fetchVouchers}
            className="px-4 py-2 bg-white rounded-xl border border-line text-xs font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-line shadow-sm mb-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by voucher code, customer name, phone, or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchVouchers()}
              className="w-full pl-9 pr-4 py-2 text-xs border border-line rounded-xl focus:outline-none focus:border-ink/30 focus:ring-4 focus:ring-accent/35"
            />
          </div>
        </div>

        {/* Vouchers Table */}
        <div className="bg-white rounded-card border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-line text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Ref Number</th>
                  <th className="py-3.5 px-4">Voucher Code</th>
                  <th className="py-3.5 px-4">Beneficiary</th>
                  <th className="py-3.5 px-4">Destination & Dates</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {vouchers.length > 0 ? (
                  vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-ink">
                        {v.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-accent-strong">
                        {v.voucherCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink">{v.name}</div>
                        <div className="text-[11px] text-gray-500">{v.phone}</div>
                        <div className="text-[11px] text-gray-400">{v.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink">{v.preferredDestination}</div>
                        <div className="text-[11px] text-gray-500">{v.preferredDates || 'Dates open'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      {loading ? 'Loading vouchers...' : 'No voucher redemptions registered.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
