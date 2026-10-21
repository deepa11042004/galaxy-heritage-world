'use client';

import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

export interface DayRow {
  title: string;
  description: string;
  meals: string;
  stayLocation: string;
}

export const emptyDay = (): DayRow => ({ title: '', description: '', meals: '', stayLocation: '' });

/** Editor for an itinerary's day-by-day schedule. Days are numbered automatically by their order. */
export function DaysField({ value, onChange, invalid }: { value: DayRow[]; onChange: (v: DayRow[]) => void; invalid?: boolean }) {
  const update = (i: number, patch: Partial<DayRow>) => onChange(value.map((d, k) => (k === i ? { ...d, ...patch } : d)));
  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-muted">
          No days yet. Add the first day of the itinerary.
        </p>
      )}

      {value.map((d, i) => (
        <div key={i} className={`rounded-xl border p-4 ${invalid && (!d.title.trim() || d.description.trim().length < 5) ? 'border-rose-300' : 'border-line'}`}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-bold">{i + 1}</span>
              Day {i + 1}
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move day ${i + 1} up`} className="rounded-full p-2 text-ink-muted hover:bg-surface hover:text-ink disabled:opacity-30">
                <ArrowUp className="size-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Move day ${i + 1} down`} className="rounded-full p-2 text-ink-muted hover:bg-surface hover:text-ink disabled:opacity-30">
                <ArrowDown className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label={`Remove day ${i + 1}`} className="rounded-full p-2 text-ink-muted hover:bg-rose-50 hover:text-rose-600">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor={`day-title-${i}`}>
                Title <span className="text-rose-600">*</span>
              </label>
              <input id={`day-title-${i}`} className="input" value={d.title} maxLength={255} onChange={(e) => update(i, { title: e.target.value })} placeholder="Arrival & sunset at the beach" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor={`day-desc-${i}`}>
                Description <span className="text-rose-600">*</span>
              </label>
              <textarea id={`day-desc-${i}`} className="input" rows={3} value={d.description} onChange={(e) => update(i, { description: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor={`day-meals-${i}`}>Meals</label>
              <input id={`day-meals-${i}`} className="input" value={d.meals} maxLength={150} onChange={(e) => update(i, { meals: e.target.value })} placeholder="Breakfast, Dinner" />
            </div>
            <div>
              <label className="label" htmlFor={`day-stay-${i}`}>Stay</label>
              <input id={`day-stay-${i}`} className="input" value={d.stayLocation} maxLength={150} onChange={(e) => update(i, { stayLocation: e.target.value })} placeholder="Resort name / city" />
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...value, emptyDay()])}>
        <Plus /> Add day
      </button>
    </div>
  );
}
