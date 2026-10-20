'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { mediaSrc, uploadImages } from '@/lib/admin/api';
import { useToast } from './ui';

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp';

function useUpload(folder: string) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const upload = async (files: File[]): Promise<string[]> => {
    const bad = files.find((f) => !ACCEPT.split(',').includes(f.type) || f.size > MAX_BYTES);
    if (bad) {
      toast('error', `"${bad.name}" must be a JPG, PNG or WebP image under 8 MB.`);
      return [];
    }
    setBusy(true);
    try {
      return (await uploadImages(files, folder)).map((f) => f.url);
    } catch (err: any) {
      toast('error', err.message || 'Upload failed');
      return [];
    } finally {
      setBusy(false);
    }
  };
  return { upload, busy };
}

export function ImageField({
  value,
  onChange,
  folder,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  folder: string;
  invalid?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const { upload, busy } = useUpload(folder);

  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    const [url] = await upload([files[0]]);
    if (url) onChange(url);
    if (input.current) input.current.value = '';
  };

  return (
    <div className={`flex flex-wrap items-start gap-4 rounded-xl border p-3 ${invalid ? 'border-rose-300' : 'border-line'}`}>
      <div className="relative flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaSrc(value)} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="size-6 text-ink-subtle" />
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => input.current?.click()}>
            <ImagePlus /> {value ? 'Replace image' : 'Upload image'}
          </button>
          {value && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange('')}>
              <Trash2 /> Remove
            </button>
          )}
        </div>
        <input ref={input} type="file" accept={ACCEPT} className="sr-only" onChange={(e) => pick(e.target.files)} aria-label="Choose image" />
        <input
          type="text"
          className="input !py-2 text-xs"
          placeholder="…or paste an image path / URL"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          aria-label="Image path or URL"
        />
        <p className="text-[11px] text-ink-subtle">JPG, PNG or WebP, up to 8 MB. Large photos are resized and optimised automatically.</p>
      </div>
    </div>
  );
}

export function GalleryField({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder: string }) {
  const input = useRef<HTMLInputElement>(null);
  const { upload, busy } = useUpload(folder);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    const urls = await upload(Array.from(files));
    if (urls.length) onChange([...value, ...urls]);
    if (input.current) input.current.value = '';
  };
  const move = (i: number, d: number) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="rounded-xl border border-line p-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaSrc(src)} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/70 to-transparent p-1.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier" className="rounded-full bg-white/90 p-1 disabled:opacity-40">
                  <ArrowLeft className="size-3.5" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move later" className="rounded-full bg-white/90 p-1 disabled:opacity-40">
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove image" className="rounded-full bg-white/90 p-1 text-rose-600">
                <X className="size-3.5" />
              </button>
            </div>
            {i === 0 && <span className="absolute top-1.5 left-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold">First</span>}
          </div>
        ))}
        <button
          type="button"
          disabled={busy || value.length >= 30}
          onClick={() => input.current?.click()}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-xs font-medium text-ink-muted transition-colors hover:border-ink/30 hover:bg-surface disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          {busy ? 'Uploading…' : 'Add images'}
        </button>
      </div>
      <input ref={input} type="file" multiple accept={ACCEPT} className="sr-only" onChange={(e) => add(e.target.files)} aria-label="Choose gallery images" />
      <p className="mt-2 text-[11px] text-ink-subtle">Up to 30 images. Use the arrows to reorder.</p>
    </div>
  );
}
