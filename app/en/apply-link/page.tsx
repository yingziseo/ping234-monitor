'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import ApplyLinkPage from '@/app/apply-link/page';

export default function ENApplyLinkPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <ApplyLinkPage />;
}