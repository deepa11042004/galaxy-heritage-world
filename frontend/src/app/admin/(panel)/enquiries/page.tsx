'use client';

import { API_BASE } from '@/lib/admin/api';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  Clock,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

const FORMS: { label: string; path: string }[] = [
  { label: 'Home page enquiry', path: '/' },
  { label: 'Contact page', path: '/contact' },
  { label: 'Travel Desk', path: '/travel-desk' },
  { label: 'Complaints & feedback', path: '/reviews-and-complaints' },
];
const formName = (src?: string | null) => FORMS.find((f) => (f.path === '/' ? src === '/' : src?.startsWith(f.path)))?.label ?? (src || 'Website');

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchEnquiries = () => {
    setLoading(true);
    const token = localStorage.getItem('ghw_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const query = new URLSearchParams();
    if (statusFilter) query.set('status', statusFilter);
    if (sourceFilter) query.set('source', sourceFilter);
    if (search) query.set('search', search);

    fetch(`${API_BASE}/enquiries?${query.toString()}`, {
      credentials: 'include',
      headers,
    })
      .then((r) => r.json())
      .then((res) => {
        setEnquiries(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, sourceFilter]);

  const handleUpdateStatus = async (id: string) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('ghw_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/enquiries/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers,
        body: JSON.stringify({ status: newStatus || undefined, notes }),
      });

      if (res.ok) {
        fetchEnquiries();
        setSelectedEnquiry(null);
      }
    } catch {} finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-ink">
                Customer Enquiries & Leads Management
              </h1>
              <p className="text-xs text-gray-500">
                Review submitted holiday booking requests, calls, and grievance reports.
              </p>
            </div>
          </div>

          <button
            onClick={fetchEnquiries}
            className="px-4 py-2 bg-white rounded-xl border border-line text-xs font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-line shadow-sm flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, email, or reference number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchEnquiries()}
              className="w-full pl-9 pr-4 py-2 text-xs border border-line rounded-xl focus:outline-none focus:border-ink/30 focus:ring-4 focus:ring-accent/35"
            />
          </div>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-line rounded-xl bg-white focus:outline-none text-gray-700"
          >
            <option value="">All forms</option>
            {FORMS.map((f) => (
              <option key={f.path} value={f.path}>{f.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-line rounded-xl bg-white focus:outline-none text-gray-700"
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="CONVERTED">CONVERTED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-card border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-line text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Destination / Requirement</th>
                  <th className="py-3.5 px-4">Form</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {enquiries.length > 0 ? (
                  enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-ink">
                        {enq.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink">{enq.name}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{enq.phone}</span>
                        </div>
                        <div className="text-[11px] text-gray-400">{enq.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-ink">
                          {enq.destinationInterest || enq.packageInterest || 'General'}
                        </div>
                        {enq.message && (
                          <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            {enq.message}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">{formName(enq.sourcePage)}</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {enq.city}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            enq.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : enq.status === 'CONTACTED'
                              ? 'bg-blue-100 text-blue-800'
                              : enq.status === 'CONVERTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setNewStatus(enq.status);
                            setNotes(enq.notes || '');
                          }}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-ink hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      {loading ? 'Loading enquiries...' : 'No enquiries found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Managing Status */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-card p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-line space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="text-lg font-bold text-ink">
                  Update Lead [ {selectedEnquiry.referenceNumber} ]
                </h3>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-gray-400 hover:text-gray-700 text-xs font-bold"
                >
                  Close
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <strong className="text-gray-700">Name:</strong> {selectedEnquiry.name}
                </div>
                <div>
                  <strong className="text-gray-700">Form:</strong> {formName(selectedEnquiry.sourcePage)} |{' '}
                  <strong className="text-gray-700">Email:</strong> {selectedEnquiry.email}
                </div>
                <div>
                  <strong className="text-gray-700">Phone:</strong> {selectedEnquiry.phone} |{' '}
                  <strong className="text-gray-700">City:</strong> {selectedEnquiry.city}
                </div>
                {selectedEnquiry.message && (
                  <div className="p-3 bg-surface rounded-xl text-gray-700 my-2">
                    &ldquo;{selectedEnquiry.message}&rdquo;
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Change Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-line rounded-xl"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record consultant call notes, customer preferences..."
                  className="w-full px-3 py-2 text-xs border border-line rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleUpdateStatus(selectedEnquiry.id)}
                  disabled={updating}
                  className="btn btn-dark btn-sm flex-1"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
