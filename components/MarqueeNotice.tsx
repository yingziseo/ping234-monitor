'use client';

import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

export default function MarqueeNotice() {
  const { language } = useMonitorStore();
  const t = getTranslation(language);

  return (
    <div className="bg-terminal-header-bg border-b border-terminal-border py-1 overflow-hidden">
      <div className="marquee text-center">
        <span className="text-xs text-terminal-cyan opacity-80">
          ⚡ {t.marqueeNotice}
        </span>
      </div>
      <style jsx>{`
        .marquee {
          white-space: nowrap;
          animation: marquee 25s linear infinite;
          display: inline-block;
          width: 100%;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}