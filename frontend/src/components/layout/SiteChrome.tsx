'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/** Renders the public site chrome (navbar, footer, floating desk) everywhere except inside the admin panel. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const inPanel = (pathname === '/admin' || pathname.startsWith('/admin/'));
  return inPanel ? null : <>{children}</>;
}
