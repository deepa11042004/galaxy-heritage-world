'use client';

import { use } from 'react';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { RESOURCES } from '@/lib/admin/resources';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ResourceForm config={RESOURCES.packages} id={id} />;
}
