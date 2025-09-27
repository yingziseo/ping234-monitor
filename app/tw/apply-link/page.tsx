'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import ApplyLinkPage from '@/app/apply-link/page';

export default function TWApplyLinkPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('tw');
  }, [setLanguage]);

  return <ApplyLinkPage />;
}