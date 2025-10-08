'use client';

import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import FriendLinks from '@/components/FriendLinks';

export default function Footer() {
  const { language } = useMonitorStore();
  const t = getTranslation(language);

  return (
    <div className="mt-8 pt-4 border-t border-terminal-gray border-opacity-30 text-center text-xs text-terminal-fg opacity-70">
      {/* 申请友链按钮 */}
      <div className="mb-2">
        <button
          onClick={() => {
            const applyUrl = language === 'zh' ? '/cn/apply-link' :
                            language === 'tw' ? '/tw/apply-link' :
                            '/en/apply-link';
            window.open(applyUrl, '_blank');
          }}
          className="terminal-button px-3 py-1 text-xs text-terminal-cyan border-terminal-cyan hover:bg-terminal-fg/10"
        >
          {t.applyLink}
        </button>
      </div>

      <div>ping234.com | {t.onlineNetworkTool}</div>
      <div className="mt-1">
        {t.tips}: {' '}
        <a href="/cn" className="text-terminal-cyan hover:text-terminal-fg transition-colors">中文简体</a>
        {' | '}
        <a href="/tw" className="text-terminal-cyan hover:text-terminal-fg transition-colors">中文繁體</a>
        {' | '}
        <a href="/en" className="text-terminal-cyan hover:text-terminal-fg transition-colors">English</a>
      </div>
      <div className="mt-2">
        <span className="text-terminal-fg opacity-60">{t.copyright}</span>
      </div>

      {/* 联系我们 */}
      <div className="mt-2 text-xs">
        <span className="text-terminal-fg opacity-60">{t.contactUs}：</span>
        <a
          href="mailto:support@ping234.com"
          className="text-terminal-cyan hover:text-terminal-fg transition-colors mx-1"
        >
          {t.email}: support@ping234.com
        </a>
        <span className="text-terminal-fg opacity-60 mx-1">|</span>
        <a
          href="https://t.me/tgping234"
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-cyan hover:text-terminal-fg transition-colors mx-1"
        >
          {t.telegram}: @tgping234
        </a>
      </div>

      <FriendLinks />
    </div>
  );
}
