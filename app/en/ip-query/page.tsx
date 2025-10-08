'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import IPQueryPage from '../../ip-query/page';

export default function ENIPQueryPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <IPQueryPage />;
}
