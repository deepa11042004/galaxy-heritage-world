'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------- toasts
type Toast = { id: number; kind: 'success' | 'error'; message: string };
const ToastContext = createContext<{ toast: (kind: Toast['kind'], message: string) => void }>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((kind: Toast['kind'], message: string) => {
    const id = nextId.current++;
    setItems((cur) => [...cur, { id, kind, message }]);
    setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), kind === 'error' ? 7000 : 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={cn(
              'pointer-events-auto flex animate-slide-up items-start gap-2.5 rounded-xl border bg-white p-3.5 text-sm shadow-[0_16px_40px_-16px_rgba(14,14,14,0.35)]',
              t.kind === 'error' ? 'border-rose-200' : 'border-emerald-200'
            )}
          >
            {t.kind === 'error' ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            )}
            <p className="flex-1 text-ink">{t.message}</p>
            <button onClick={() => setItems((c) => c.filter((x) => x.id !== t.id))} aria-label="Dismiss" className="text-ink-subtle hover:text-ink">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------- dialogs
export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          'flex max-h-[92vh] w-full animate-slide-up flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl',
          wide ? 'sm:max-w-xl' : 'sm:max-w-md'
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-ink-muted hover:bg-surface hover:text-ink">
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  busy,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-outline btn-sm" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-sm bg-rose-600 text-white hover:bg-rose-700" onClick={onConfirm} disabled={busy}>
            {busy && <Loader2 className="animate-spin" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-ink-muted">{message}</p>
    </Modal>
  );
}

// ---------------------------------------------------------------- small pieces
export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-muted" role="status">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {hint && <p className="max-w-sm text-xs text-ink-muted">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
      <AlertCircle className="size-6 text-rose-500" />
      <p className="text-sm text-ink">{message}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        published ? 'bg-emerald-50 text-emerald-700' : 'bg-surface text-ink-muted'
      )}
    >
      <span className={cn('size-1.5 rounded-full', published ? 'bg-emerald-500' : 'bg-ink-subtle')} />
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-accent' : 'bg-line'
      )}
    >
      <span className={cn('inline-block size-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-5.5' : 'translate-x-0.5')} />
    </button>
  );
}
