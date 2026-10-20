import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return 'Price on Request';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function normalizeImageUrl(
  url: string | null | undefined,
  fallback = '/media/galaxy-heritage-world/destinations/images/1-1.png'
): string {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url
    .replace('Neelam-goa.jpg', 'neelam-goa.jpg')
    .replace('Divan-Clarks-Inn-Goa.jpg', 'divan-clarks-inn-goa.jpg')
    .replace('Untitled-1024-x-674-px.png', 'untitled-1024-x-674-px.png');
}
