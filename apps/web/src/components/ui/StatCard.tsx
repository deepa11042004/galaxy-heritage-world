import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export function StatCard({ value, title, description, highlight, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-[11rem] flex-col items-center justify-center rounded-card px-4 py-8 text-center transition-transform duration-300 hover:-translate-y-1 sm:px-6',
        highlight ? 'bg-accent text-ink' : 'bg-surface text-ink',
        className
      )}
    >
      <div className="text-[1.75rem] font-medium leading-none tracking-tight whitespace-nowrap sm:text-4xl xl:text-5xl">
        {value}
      </div>
      <h4 className="mt-5 text-sm font-semibold">{title}</h4>
      {description && (
        <p className={cn('mt-1.5 max-w-[15rem] text-xs leading-relaxed', highlight ? 'text-ink/70' : 'text-ink-muted')}>
          {description}
        </p>
      )}
    </div>
  );
}
