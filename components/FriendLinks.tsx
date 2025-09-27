'use client';

import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

export default function FriendLinks() {
  const { friendLinks, language } = useMonitorStore();
  const t = getTranslation(language);

  if (!friendLinks || friendLinks.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="text-center text-xs">
        <span className="text-terminal-fg opacity-60">{t.friendLinks}：</span>
        {friendLinks.map((link, index) => (
          <span key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-cyan hover:text-terminal-fg transition-colors
                       hover:underline cursor-pointer ml-1"
            >
              {link.title}
            </a>
            {index < friendLinks.length - 1 && <span className="text-terminal-fg opacity-60 mx-1">|</span>}
          </span>
        ))}
      </div>
    </div>
  );
}