'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import IPLeakPage from '../../ip-leak/page';

export default function ENIPLeakPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <IPLeakPage />;
}
