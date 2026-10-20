'use client';

import { ResourceForm } from '@/components/admin/ResourceForm';
import { RESOURCES } from '@/lib/admin/resources';

export default function Page() {
  return <ResourceForm config={RESOURCES.activities} />;
}
