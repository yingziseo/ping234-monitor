'use client';

import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

export default function FriendLinks() {
  const { friendLinks, language } = useMonitorStore();
  const t = getTranslation(language);

  if (!friendLinks || friendLinks.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-terminal-gray border-opacity-30">
      <div className="text-center mb-4">
        <h3 className="text-terminal-cyan text-sm font-medium">{t.friendLinks}</h3>
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm">
        {friendLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-gray hover:text-terminal-green transition-colors
                     hover:underline cursor-pointer"
          >
            {link.title}
          </a>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => window.open('/admin', '_blank')}
          className="text-xs text-terminal-gray opacity-50 hover:text-terminal-cyan hover:opacity-100
                   transition-colors cursor-pointer"
        >
          {t.applyLink}
        </button>
      </div>
    </div>
  );
}