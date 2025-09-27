'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-terminal-green bg-terminal-green/10 text-terminal-green';
      case 'error':
        return 'border-terminal-red bg-terminal-red/10 text-terminal-red';
      case 'info':
        return 'border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'info':
        return 'ℹ';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        backdrop-blur-sm ${getTypeStyles()}
        max-w-sm
      `}>
        <span className="text-lg">{getIcon()}</span>
        <span className="font-medium text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
}