'use client';

import { ReactNode } from 'react';

interface TerminalProps {
  children: ReactNode;
  title?: string;
}

export default function Terminal({ children, title = 'ping234.com' }: TerminalProps) {
  return (
    <div className="terminal-window w-full max-w-7xl mx-auto">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot bg-red-500"></div>
          <div className="terminal-dot bg-yellow-500"></div>
          <div className="terminal-dot bg-green-500"></div>
        </div>
        <div className="text-terminal-gray text-xs md:text-sm">
          {title}
        </div>
        <div className="text-terminal-gray text-xs">
          UTF-8
        </div>
      </div>
      <div className="terminal-content">
        {children}
      </div>
    </div>
  );
}