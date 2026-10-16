'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Compass,
  Palmtree,
  Package,
  Ticket,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  LogOut,
  FolderOpen,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    enquiriesCount: 0,
    destinationsCount: 0,
    packagesCount: 0,
    hotelsCount: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local auth
    const savedUser = localStorage.getItem('ghw_user');
    const token = localStorage.getItem('ghw_token');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Fetch stats & enquiries from API
    Promise.allSettled([
      fetch('http://localhost:4000/api/v1/enquiries', { credentials: 'include', headers }).then((r) => r.json()),
      fetch('http://localhost:4000/api/v1/destinations').then((r) => r.json()),
      fetch('http://localhost:4000/api/v1/packages').then((r) => r.json()),
      fetch('http://localhost:4000/api/v1/hotels').then((r) => r.json()),
    ])
      .then(([enqRes, destRes, pkgRes, hotRes]) => {
        const enqData = enqRes.status === 'fulfilled' ? enqRes.value : {};
        const destData = destRes.status === 'fulfilled' ? destRes.value : {};
        const pkgData = pkgRes.status === 'fulfilled' ? pkgRes.value : {};
        const hotData = hotRes.status === 'fulfilled' ? hotRes.value : {};

        setStats({
          enquiriesCount: enqData.total || enqData.count || (enqData.data ? enqData.data.length : 0),
          destinationsCount: destData.count || (destData.data ? destData.data.length : 0),
          packagesCount: pkgData.count || (pkgData.data ? pkgData.data.length : 0),
          hotelsCount: hotData.count || (hotData.data ? hotData.data.length : 0),
        });

        if (enqData.data) {
          setRecentEnquiries(enqData.data.slice(0, 5));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    localStorage.removeItem('ghw_token');
    localStorage.removeItem('ghw_user');
    router.push('/login');
  };

  return (
    <div className="page-offset min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-line">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative w-48 sm:w-56 h-16 shrink-0">
              <Image
                src="/media/galaxy-heritage-world/shared/logos/ghw-logo-transparent.png"
                alt="Galaxy Heritage World"
                fill
                className="object-contain object-left scale-105"
                sizes="224px"
              />
            </Link>
            <div className="h-10 w-px bg-gray-200 hidden sm:block" />
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-strong mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administrative Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">
                Galaxy Heritage World Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Logged in as: <strong className="text-ink">{user?.email || 'admin@galaxyheritageworld.com'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="btn btn-outline btn-sm"
            >
              View Live Website &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-dark btn-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white rounded-card border border-line shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Total Leads</span>
            </div>
            <div className="text-3xl font-bold text-ink">
              {stats.enquiriesCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">Enquiries & Contact Leads</div>
          </div>

          <div className="p-6 bg-white rounded-card border border-line shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Palmtree className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Properties</span>
            </div>
            <div className="text-3xl font-bold text-ink">
              {stats.hotelsCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">Associated 43+ Resorts</div>
          </div>

          <div className="p-6 bg-white rounded-card border border-line shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Destinations</span>
            </div>
            <div className="text-3xl font-bold text-ink">
              {stats.destinationsCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">Domestic & International</div>
          </div>

          <div className="p-6 bg-white rounded-card border border-line shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Packages</span>
            </div>
            <div className="text-3xl font-bold text-ink">
              {stats.packagesCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">Published Vacation Tours</div>
          </div>
        </div>

        {/* Quick Navigation Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            href="/admin/enquiries"
            className="p-6 bg-white rounded-card border border-accent shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-accent-strong mb-1">
                Leads Management
              </div>
              <h3 className="text-lg font-bold text-ink group-hover:text-accent-strong transition-colors">
                Customer Enquiries & Grievances
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                View submitted leads, update status, add notes
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent-strong group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/vouchers"
            className="p-6 bg-white rounded-card border border-line shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                Vouchers
              </div>
              <h3 className="text-lg font-bold text-ink group-hover:text-accent-strong transition-colors">
                Voucher Redemptions
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Verify voucher codes, beneficiary check-in dates
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent-strong group-hover:translate-x-1 transition-all" />
          </Link>

          <a
            href="http://localhost:4000/api/v1/docs"
            target="_blank"
            rel="noreferrer"
            className="p-6 bg-white rounded-card border border-line shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                OpenAPI Docs
              </div>
              <h3 className="text-lg font-bold text-ink group-hover:text-accent-strong transition-colors">
                Swagger REST API Docs
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Inspect endpoints at /api/v1/docs
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent-strong group-hover:translate-x-1 transition-all" />
          </a>
        </div>

        {/* Recent Enquiries Table */}
        <div className="bg-white rounded-card p-6 sm:p-8 border border-line shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink">
              Recent Customer Enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-accent-strong hover:underline"
            >
              View All Enquiries &rarr;
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Customer Name</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Interest / City</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-surface transition-colors">
                      <td className="py-3 font-mono font-bold text-ink">
                        {enq.referenceNumber}
                      </td>
                      <td className="py-3 font-semibold text-ink">
                        {enq.name}
                      </td>
                      <td className="py-3 text-gray-600">
                        <div>{enq.phone}</div>
                        <div className="text-[11px] text-gray-400">{enq.email}</div>
                      </td>
                      <td className="py-3 text-gray-600">
                        <div>{enq.destinationInterest || 'General'}</div>
                        <div className="text-[11px] text-gray-400">{enq.city}</div>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-500">
              No enquiries logged yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
