'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMonitorStore } from '@/lib/store';
import { getTranslation, Language } from '@/lib/i18n';

export default function Navigation() {
  const pathname = usePathname();
  const { language, theme, setTheme, setLanguage } = useMonitorStore();
  const t = getTranslation(language);

  // 获取语言前缀
  const getLangPrefix = () => {
    if (pathname.startsWith('/cn')) return '/cn';
    if (pathname.startsWith('/tw')) return '/tw';
    if (pathname.startsWith('/en')) return '/en';
    return '/cn';
  };

  const langPrefix = getLangPrefix();

  const navItems = [
    { name: t.networkDetection, path: `${langPrefix}`, icon: '>' },
    { name: t.ipQuery, path: `${langPrefix}/ip-query`, icon: '?' },
    { name: t.ipLeakDetection, path: `${langPrefix}/ip-leak`, icon: '!' },
  ];

  const isActive = (path: string) => {
    if (path === langPrefix) {
      return pathname === langPrefix || pathname === langPrefix + '/';
    }
    return pathname.startsWith(path);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <nav className="w-full max-w-7xl mx-auto mb-4">
      <div className="bg-terminal-window-bg border border-terminal-border rounded overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-2.5">
          {/* 左侧：导航项 */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  group relative
                  flex items-center gap-1.5
                  px-3 py-1.5
                  text-sm
                  font-bold
                  transition-all duration-200
                  border border-terminal-border
                  rounded
                  ${isActive(item.path)
                    ? 'text-terminal-green border-terminal-green bg-terminal-green/5'
                    : 'text-terminal-fg hover:text-terminal-green hover:border-terminal-green/50'
                  }
                `}
              >
                <span className={`text-xs font-bold ${isActive(item.path) ? 'text-terminal-yellow' : 'text-terminal-gray'}`}>
                  [{item.icon}]
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* 右侧：主题和语言切换 */}
          <div className="flex items-center gap-3 border-l border-terminal-border pl-3 md:pl-4">
            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="terminal-button p-2 text-xs hover:text-terminal-green"
              title={theme === 'dark' ? '切换到亮色' : '切换到暗色'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* 语言切换 */}
            <div className="flex gap-1">
              <button
                onClick={() => handleLanguageChange('zh')}
                className={`terminal-button px-2 py-1 text-xs transition-all ${
                  language === 'zh' ? 'text-terminal-green border-terminal-green bg-terminal-green/10' : 'hover:text-terminal-green'
                }`}
              >
                简
              </button>
              <button
                onClick={() => handleLanguageChange('tw')}
                className={`terminal-button px-2 py-1 text-xs transition-all ${
                  language === 'tw' ? 'text-terminal-green border-terminal-green bg-terminal-green/10' : 'hover:text-terminal-green'
                }`}
              >
                繁
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`terminal-button px-2 py-1 text-xs transition-all ${
                  language === 'en' ? 'text-terminal-green border-terminal-green bg-terminal-green/10' : 'hover:text-terminal-green'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
