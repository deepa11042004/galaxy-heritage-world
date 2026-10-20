'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Loader2, Save, Trash2 } from 'lucide-react';
import { adminFetch, ApiError, jsonBody } from '@/lib/admin/api';
import type { FieldDef, ResourceConfig, Row } from '@/lib/admin/resources';
import { cn } from '@/lib/utils';
import { useAdmin } from './AdminShell';
import { GalleryField, ImageField } from './ImageFields';
import { ConfirmDialog, ErrorState, PageHeader, Spinner, StatusBadge, Switch, useToast } from './ui';

type Values = Record<string, any>;
type Errors = Record<string, string>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 150);

const allFields = (config: ResourceConfig): FieldDef[] => config.sections.flatMap((s) => s.fields);

/** API row -> form state (lists become one-per-line text, numbers become strings, nulls become ''). */
function toForm(config: ResourceConfig, row: Row): Values {
  const out: Values = {};
  for (const f of allFields(config)) {
    const v = row[f.name];
    if (f.kind === 'list') out[f.name] = Array.isArray(v) ? v.join('\n') : '';
    else if (f.kind === 'gallery') out[f.name] = Array.isArray(v) ? v : [];
    else if (f.kind === 'switch') out[f.name] = Boolean(v);
    else out[f.name] = v === null || v === undefined ? '' : String(v);
  }
  return out;
}

/** Form state -> API payload. */
function toPayload(config: ResourceConfig, values: Values, isNew: boolean): Row {
  const out: Row = {};
  for (const f of allFields(config)) {
    const v = values[f.name];
    switch (f.kind) {
      case 'list':
        out[f.name] = String(v ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
        break;
      case 'gallery':
      case 'switch':
        out[f.name] = v;
        break;
      case 'number':
        out[f.name] = v === '' ? null : Number(v);
        break;
      case 'select':
        out[f.name] = v === '' ? null : f.name === 'ratingStars' ? Number(v) : v;
        break;
      case 'image':
        out[f.name] = String(v ?? '').trim();
        break;
      case 'slug':
        if (String(v).trim() || !isNew) out[f.name] = String(v).trim();
        break;
      case 'combo':
        out[f.name] = String(v ?? '').trim();
        break;
      default:
        out[f.name] = f.required ? String(v ?? '').trim() : String(v ?? '').trim() || null;
    }
  }
  return out;
}

function validate(config: ResourceConfig, values: Values): Errors {
  const errors: Errors = {};
  for (const f of allFields(config)) {
    const v = values[f.name];
    const required = 'required' in f && f.required;
    if (required && (v === undefined || v === null || String(v).trim() === '')) {
      errors[f.name] = `${f.label} is required`;
      continue;
    }
    if (f.kind === 'number' && v !== '' && Number.isNaN(Number(v))) errors[f.name] = `${f.label} must be a number`;
    if (f.kind === 'number' && v !== '' && f.min !== undefined && Number(v) < f.min) errors[f.name] = `${f.label} must be at least ${f.min}`;
    if (f.kind === 'slug' && v && !/^[a-z0-9-]+$/.test(v)) errors[f.name] = 'Use lowercase letters, numbers and hyphens only';
    if (f.kind === 'image' && v && !/^(\/(?!\/)|https?:\/\/)/.test(v)) errors[f.name] = 'Upload an image or enter a path starting with / or https://';
    if (f.kind === 'text' && f.name === 'videoId' && v && !/^[\w-]{6,30}$/.test(v)) errors[f.name] = 'Enter just the YouTube video id';
  }
  return errors;
}

export function ResourceForm({ config, id }: { config: ResourceConfig; id?: string }) {
  const isNew = !id;
  const router = useRouter();
  const { can } = useAdmin();
  const { toast } = useToast();
  const [values, setValues] = useState<Values>(() => toForm(config, config.defaults));
  const [row, setRow] = useState<Row | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const needsDestinations = useMemo(() => allFields(config).some((f) => f.kind === 'select' && f.options === 'destinations'), [config]);

  useEffect(() => {
    if (!needsDestinations) return;
    adminFetch<{ data: { id: string; name: string }[] }>('/admin/options/destinations')
      .then((r) => setOptions(r.data))
      .catch(() => toast('error', 'Could not load the destinations list'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsDestinations]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const res = await adminFetch<{ data: Row }>(`/admin/${config.key}/${id}`);
      setRow(res.data);
      setValues(toForm(config, res.data));
    } catch (err: any) {
      setLoadError(err.status === 404 ? `This ${config.singular.toLowerCase()} no longer exists.` : err.message || 'Could not load the record');
    } finally {
      setLoading(false);
    }
  }, [config, id]);

  useEffect(() => {
    load();
  }, [load]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const set = (name: string, value: any) => {
    setDirty(true);
    setErrors((e) => {
      if (!e[name]) return e;
      const { [name]: _removed, ...rest } = e;
      return rest;
    });
    setValues((cur) => {
      const next = { ...cur, [name]: value };
      const slugField = allFields(config).find((f) => f.kind === 'slug') as Extract<FieldDef, { kind: 'slug' }> | undefined;
      if (slugField && name === slugField.from && !slugTouched) next[slugField.name] = slugify(String(value));
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(config, values);
    if (Object.keys(found).length) {
      setErrors(found);
      toast('error', 'Please fix the highlighted fields.');
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    setSaving(true);
    try {
      const payload = toPayload(config, values, isNew);
      const res = isNew
        ? await adminFetch<{ data: Row }>(`/admin/${config.key}`, { method: 'POST', ...jsonBody(payload) })
        : await adminFetch<{ data: Row }>(`/admin/${config.key}/${id}`, { method: 'PUT', ...jsonBody(payload) });
      setDirty(false);
      toast('success', `${config.singular} ${isNew ? 'created' : 'saved'}.`);
      if (isNew) router.push(`/admin/${config.route}`);
      else {
        setRow((r) => ({ ...(r ?? {}), ...res.data }));
        setValues(toForm(config, { ...row, ...res.data }));
      }
    } catch (err) {
      if (err instanceof ApiError && err.issues.length) {
        const mapped: Errors = {};
        for (const i of err.issues) mapped[i.path.split('.')[0]] = i.message;
        setErrors(mapped);
        toast('error', 'Some fields are not valid.');
      } else {
        toast('error', (err as Error).message || 'Could not save');
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await adminFetch(`/admin/${config.key}/${id}`, { method: 'DELETE' });
      setDirty(false);
      toast('success', `${config.singular} deleted.`);
      router.push(`/admin/${config.route}`);
    } catch (err: any) {
      toast('error', err.message || 'Could not delete');
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const back = (
    <Link href={`/admin/${config.route}`} className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink">
      <ArrowLeft className="size-3.5" /> {config.plural}
    </Link>
  );

  if (loading) return <Spinner />;
  if (loadError) {
    return (
      <div>
        {back}
        <div className="card">
          <ErrorState message={loadError} onRetry={isNew ? undefined : load} />
        </div>
      </div>
    );
  }

  const title = isNew ? `New ${config.singular.toLowerCase()}` : String(row?.[config.titleField] ?? config.singular);

  const renderField = (f: FieldDef) => {
    const err = errors[f.name];
    const common = { id: `f-${f.name}`, 'aria-invalid': err ? true : undefined, 'aria-describedby': err ? `e-${f.name}` : undefined } as const;
    const cls = cn('input', err && '!border-rose-300 !bg-rose-50/40');
    const wrap = (control: React.ReactNode, help?: string) => (
      <div key={f.name} className={cn('half' in f && f.half ? 'sm:col-span-1' : 'sm:col-span-2')}>
        {f.kind !== 'switch' && (
          <label htmlFor={common.id} className="label">
            {f.label}
            {'required' in f && f.required && <span className="text-rose-600"> *</span>}
          </label>
        )}
        {control}
        {err && (
          <p id={`e-${f.name}`} role="alert" className="mt-1.5 text-xs text-rose-600">
            {err}
          </p>
        )}
        {help && !err && <p className="mt-1.5 text-[11px] text-ink-subtle">{help}</p>}
      </div>
    );

    switch (f.kind) {
      case 'text':
        return wrap(<input {...common} className={cls} type="text" maxLength={f.maxLength} placeholder={f.placeholder} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />, f.help);
      case 'number':
        return wrap(<input {...common} className={cls} type="number" inputMode="decimal" min={f.min} max={f.max} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />, f.help);
      case 'textarea':
        return wrap(<textarea {...common} className={cls} rows={f.rows ?? 4} maxLength={f.maxLength} placeholder={f.placeholder} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />, f.help);
      case 'list':
        return wrap(<textarea {...common} className={cn(cls, 'font-mono text-[13px]')} rows={5} placeholder={f.placeholder} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />, f.help);
      case 'slug':
        return wrap(
          <input
            {...common}
            className={cn(cls, 'font-mono text-[13px]')}
            type="text"
            value={values[f.name] ?? ''}
            placeholder="generated from the name"
            onChange={(e) => {
              setSlugTouched(true);
              set(f.name, e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
            }}
          />,
          f.help
        );
      case 'select': {
        const opts = f.options === 'destinations' ? options.map((o) => ({ value: o.id, label: o.name })) : f.options;
        return wrap(
          <select {...common} className={cls} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)}>
            {(!f.required || f.emptyLabel) && <option value="">{f.emptyLabel ?? 'Select…'}</option>}
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      }
      case 'combo': {
        const listId = `dl-${f.name}`;
        return wrap(
          <>
            <input {...common} className={cls} type="text" list={listId} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />
            <datalist id={listId}>
              {f.suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </>,
          f.help
        );
      }
      case 'switch':
        return (
          <div key={f.name} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 sm:col-span-2">
            <div>
              <p className="text-sm font-semibold text-ink">{f.label}</p>
              {f.help && <p className="text-xs text-ink-muted">{f.help}</p>}
            </div>
            <Switch checked={Boolean(values[f.name])} onChange={(v) => set(f.name, v)} label={f.label} />
          </div>
        );
      case 'image':
        return wrap(<ImageField value={values[f.name] ?? ''} onChange={(v) => set(f.name, v)} folder={config.folder} invalid={Boolean(err)} />, f.help);
      case 'gallery':
        return wrap(<GalleryField value={values[f.name] ?? []} onChange={(v) => set(f.name, v)} folder={config.folder} />, f.help);
    }
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate>
      {back}
      <PageHeader
        title={title}
        subtitle={isNew ? `Fill in the details below. ${config.singular}s stay hidden until published.` : undefined}
        actions={
          !isNew && row ? (
            <>
              <StatusBadge published={Boolean(row.isPublished)} />
              {row.isPublished && (
                <a href={config.publicPath(row)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                  <ExternalLink /> View on website
                </a>
              )}
            </>
          ) : undefined
        }
      />

      <div className="space-y-5 pb-28">
        {config.sections.map((s) => (
          <section key={s.title} className="card p-5 sm:p-6">
            <h2 className="text-base font-semibold text-ink">{s.title}</h2>
            {s.description && <p className="mt-0.5 text-xs text-ink-muted">{s.description}</p>}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{s.fields.map(renderField)}</div>
          </section>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:px-4 lg:px-8">
          <div>
            {!isNew && can.delete && (
              <button type="button" className="btn btn-outline btn-sm text-rose-600" onClick={() => setConfirmDelete(true)}>
                <Trash2 /> <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {dirty && <span className="hidden text-xs text-ink-muted sm:inline">Unsaved changes</span>}
            <Link href={`/admin/${config.route}`} className="btn btn-outline btn-sm">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />} {isNew ? `Create ${config.singular.toLowerCase()}` : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete ${config.singular.toLowerCase()}?`}
          message={
            <>
              <strong className="text-ink">{title}</strong> will be removed from the website and the admin lists.
            </>
          }
          busy={deleting}
          onConfirm={remove}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </form>
  );
}
