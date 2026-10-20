import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  icon?: LucideIcon;
  eyebrow?: React.ReactNode;
  /** ReactNode so a trailing <span className="text-ink-muted"> can create the two-tone look. */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-hand slot: filters, "view all" links, carousel controls. */
  actions?: React.ReactNode;
  align?: 'split' | 'center';
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  align = 'split',
  className,
}: SectionHeaderProps) {
  const eyebrowEl = eyebrow ? (
    <div className="eyebrow mb-4">
      {Icon && <Icon />}
      <span>{eyebrow}</span>
    </div>
  ) : null;

  if (align === 'center') {
    return (
      <div className={cn('mx-auto mb-10 max-w-3xl text-center md:mb-14', className)}>
        {eyebrowEl}
        <h2 className="heading-section">{title}</h2>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
            {description}
          </p>
        )}
        {actions && <div className="mt-6 flex justify-center">{actions}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-12',
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrowEl}
        <h2 className="heading-section">{title}</h2>
      </div>
      {(description || actions) && (
        <div className="flex flex-col items-start gap-5 md:max-w-sm md:items-end">
          {description && (
            <p className="text-sm leading-relaxed text-ink-muted md:text-right">{description}</p>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}
