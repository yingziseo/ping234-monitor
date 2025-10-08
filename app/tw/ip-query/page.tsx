'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import IPQueryPage from '../../ip-query/page';

export default function TWIPQueryPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('tw');
  }, [setLanguage]);

  return <IPQueryPage />;
}
