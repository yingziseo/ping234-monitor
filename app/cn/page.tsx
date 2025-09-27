'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import HomePage from '../page';

export default function ChinesePage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('zh');
  }, [setLanguage]);

  return <HomePage />;
}