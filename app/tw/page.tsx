'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import HomePage from '../page';

export default function TraditionalChinesePage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('tw');
  }, [setLanguage]);

  return <HomePage />;
}