'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import IPQueryPage from '../../ip-query/page';

export default function CNIPQueryPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('zh');
  }, [setLanguage]);

  return <IPQueryPage />;
}
