'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import IPLeakPage from '../../ip-leak/page';

export default function TWIPLeakPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('tw');
  }, [setLanguage]);

  return <IPLeakPage />;
}
