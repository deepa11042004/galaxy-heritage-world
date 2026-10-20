'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { adminFetch, jsonBody, mediaSrc } from '@/lib/admin/api';
import type { ResourceConfig, Row } from '@/lib/admin/resources';
import { cn } from '@/lib/utils';
import { useAdmin } from './AdminShell';
import { ConfirmDialog, EmptyState, ErrorState, PageHeader, Spinner, StatusBadge, Switch, useToast } from './ui';

const PAGE_SIZE = 20;
const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
];

export function ResourceList({ config }: { config: ResourceConfig }) {
  const { can } = useAdmin();
  const { toast } = useToast();
  const base = `/admin/${config.route}`;

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (query) qs.set('search', query);
    if (status) qs.set('status', status);
    for (const [k, v] of Object.entries(filters)) if (v) qs.set(k, v);
    try {
      const res = await adminFetch<{ data: Row[]; total: number; pages: number }>(`/admin/${config.key}?${qs}`);
      setRows(res.data);
      setTotal(res.total);
      setPages(res.pages);
    } catch (err: any) {
      setError(err.message || 'Could not load records');
    } finally {
      setLoading(false);
    }
  }, [config.key, page, query, status, filters]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (row: Row) => {
    setToggling(row.id);
    try {
      await adminFetch(`/admin/${config.key}/${row.id}/publish`, { method: 'PATCH', ...jsonBody({ isPublished: !row.isPublished }) });
      setRows((cur) => cur.map((r) => (r.id === row.id ? { ...r, isPublished: !row.isPublished } : r)));
      toast('success', `${row[config.titleField]} ${row.isPublished ? 'unpublished' : 'published'}.`);
    } catch (err: any) {
      toast('error', err.message || 'Could not update status');
    } finally {
      setToggling(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminFetch(`/admin/${config.key}/${toDelete.id}`, { method: 'DELETE' });
      toast('success', `${toDelete[config.titleField]} deleted.`);
      setToDelete(null);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err: any) {
      toast('error', err.message || 'Could not delete');
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = Boolean(query || status || Object.values(filters).some(Boolean));

  return (
    <div>
      <PageHeader
        title={config.plural}
        subtitle={loading && !rows.length ? undefined : `${total.toLocaleString('en-IN')} ${total === 1 ? 'record' : 'records'}${hasFilters ? ' match your filters' : ''}`}
        actions={
          <Link href={`/admin/${config.route}/new`} className="btn btn-primary">
            <Plus /> Add {config.singular.toLowerCase()}
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${config.plural.toLowerCase()}…`}
              aria-label={`Search ${config.plural}`}
              className="input !py-2.5 pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {config.filters.map((f) => (
              <select
                key={f.param}
                aria-label={f.label}
                value={filters[f.param] ?? ''}
                onChange={(e) => {
                  setFilters((cur) => ({ ...cur, [f.param]: e.target.value }));
                  setPage(1);
                }}
                className="input !w-auto !py-2.5"
              >
                <option value="">{f.label}</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ))}
            <div className="segmented" role="tablist" aria-label="Status">
              {STATUS_TABS.map((t) => (
                <button
                  key={t.value}
                  role="tab"
                  aria-selected={status === t.value}
                  data-active={status === t.value}
                  className="segmented-item"
                  onClick={() => {
                    setStatus(t.value);
                    setPage(1);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : loading && !rows.length ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'Nothing matches your filters' : `No ${config.plural.toLowerCase()} yet`}
            hint={hasFilters ? 'Try a different search or clear the filters.' : `Create the first ${config.singular.toLowerCase()} to get started.`}
            action={
              hasFilters ? (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSearch('');
                    setStatus('');
                    setFilters({});
                  }}
                >
                  Clear filters
                </button>
              ) : (
                <Link href={`/admin/${config.route}/new`} className="btn btn-primary btn-sm">
                  <Plus /> Add {config.singular.toLowerCase()}
                </Link>
              )
            }
          />
        ) : (
          <div className={cn('overflow-x-auto transition-opacity', loading && 'opacity-60')}>
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
                <tr>
                  <th className="w-20 px-4 py-3">Image</th>
                  {config.columns.map((c) => (
                    <th key={c.label} className={cn('px-4 py-3', c.className)}>
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => {
                  const img = config.imageOf(row);
                  return (
                    <tr key={row.id} className="hover:bg-surface/60">
                      <td className="px-4 py-3">
                        <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-lg bg-surface">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={mediaSrc(img)} alt="" loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="size-4 text-ink-subtle" />
                          )}
                        </div>
                      </td>
                      {config.columns.map((c) => (
                        <td key={c.label} className={cn('px-4 py-3', c.className)}>
                          {c.render(row)}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={row.isPublished}
                            disabled={toggling === row.id}
                            onChange={() => togglePublish(row)}
                            label={`${row.isPublished ? 'Unpublish' : 'Publish'} ${row[config.titleField]}`}
                          />
                          <span className="hidden sm:inline">
                            <StatusBadge published={row.isPublished} />
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {row.isPublished && (
                            <a href={config.publicPath(row)} target="_blank" rel="noreferrer" className="rounded-full p-2 text-ink-muted hover:bg-surface hover:text-ink" title="View on website" aria-label="View on website">
                              <ExternalLink className="size-4" />
                            </a>
                          )}
                          <Link href={`/admin/${config.route}/${row.id}`} className="rounded-full p-2 text-ink-muted hover:bg-surface hover:text-ink" title="Edit" aria-label={`Edit ${row[config.titleField]}`}>
                            <Pencil className="size-4" />
                          </Link>
                          {can.delete && (
                            <button onClick={() => setToDelete(row)} className="rounded-full p-2 text-ink-muted hover:bg-rose-50 hover:text-rose-600" title="Delete" aria-label={`Delete ${row[config.titleField]}`}>
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && !error && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-ink-muted">
            <span>
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}>
                <ChevronLeft /> Previous
              </button>
              <button className="btn btn-outline btn-sm" disabled={page >= pages || loading} onClick={() => setPage(page + 1)}>
                Next <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {toDelete && (
        <ConfirmDialog
          title={`Delete ${config.singular.toLowerCase()}?`}
          message={
            <>
              <strong className="text-ink">{toDelete[config.titleField]}</strong> will be removed from the website and this list. This cannot be undone from the panel.
            </>
          }
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
