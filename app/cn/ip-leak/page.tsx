'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import IPLeakPage from '../../ip-leak/page';

export default function CNIPLeakPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('zh');
  }, [setLanguage]);

  return <IPLeakPage />;
}
