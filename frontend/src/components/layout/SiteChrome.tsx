'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/** Admin pages that predate the new panel and still rely on the public site header/footer. */
const LEGACY_ADMIN = /^\/admin\/(enquiries|vouchers)(\/|$)/;

/** Renders the public site chrome (navbar, footer, floating desk) everywhere except inside the admin panel. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const inPanel = (pathname === '/admin' || pathname.startsWith('/admin/')) && !LEGACY_ADMIN.test(pathname);
  return inPanel ? null : <>{children}</>;
}
