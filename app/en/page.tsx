'use client';

import { useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import HomePage from '../page';

export default function EnglishPage() {
  const { setLanguage } = useMonitorStore();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <HomePage />;
}