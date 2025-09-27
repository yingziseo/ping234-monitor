'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import ApplyLinkPage from '@/app/apply-link/page';

export default function CNApplyLinkPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('zh');
  }, [setLanguage]);

  return <ApplyLinkPage />;
}