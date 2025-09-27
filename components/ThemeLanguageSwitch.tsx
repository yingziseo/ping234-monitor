'use client';

import { useMonitorStore } from '@/lib/store';
import { Language } from '@/lib/i18n';

export default function ThemeLanguageSwitch() {
  const { theme, language, setTheme, setLanguage } = useMonitorStore();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-3">
      {/* 主题切换 */}
      <button
        onClick={toggleTheme}
        className="terminal-button p-2 text-xs"
        title={theme === 'dark' ? '切换到亮色' : '切换到暗色'}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>

      {/* 语言切换 */}
      <div className="flex gap-1">
        <button
          onClick={() => handleLanguageChange('zh')}
          className={`terminal-button px-2 py-1 text-xs ${
            language === 'zh' ? 'text-terminal-green border-terminal-green' : ''
          }`}
        >
          简
        </button>
        <button
          onClick={() => handleLanguageChange('tw')}
          className={`terminal-button px-2 py-1 text-xs ${
            language === 'tw' ? 'text-terminal-green border-terminal-green' : ''
          }`}
        >
          繁
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`terminal-button px-2 py-1 text-xs ${
            language === 'en' ? 'text-terminal-green border-terminal-green' : ''
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}