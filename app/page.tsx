'use client';

import { useState, useEffect } from 'react';
import Terminal from '@/components/Terminal';
import MainMenu from '@/components/MainMenu';
import MonitorDisplay from '@/components/MonitorDisplay';
import AdBanner from '@/components/AdBanner';
import FriendLinks from '@/components/FriendLinks';
import ThemeLanguageSwitch from '@/components/ThemeLanguageSwitch';
import MarqueeNotice from '@/components/MarqueeNotice';
import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

export default function Home() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const {
    selectedType,
    monitoringDomains,
    isMonitoring,
    setIsMonitoring,
    interval,
    reset,
    language,
    theme,
    setLanguage,
    loadFromServer,
    isLoaded,
  } = useMonitorStore();

  useEffect(() => {
    if (!language || language === 'zh') {
      setLanguage('zh');
    }
  }, [language, setLanguage]);

  useEffect(() => {
    if (!isLoaded) {
      loadFromServer();
    }
  }, [isLoaded, loadFromServer]);

  const t = getTranslation(language);

  useEffect(() => {
    if (!isMonitoring || countdown === null) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          return interval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMonitoring, interval, countdown]);

  useEffect(() => {
    // 应用主题
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const handleStart = () => {
    if (monitoringDomains.length === 0) {
      alert(t.fillInfo);
      return;
    }
    setIsMonitoring(true);
    setShowResults(true);
    setCountdown(interval);
  };

  const handleStop = () => {
    setIsMonitoring(false);
    setCountdown(null);
    // 保留结果显示，不立即返回
  };

  const handleReset = () => {
    handleStop();
    setShowResults(false);
    reset();
  };

  return (
    <main className="min-h-screen">
      {/* 走马灯通知 */}
      <MarqueeNotice />

      <div className="p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <div className="mb-4 flex justify-end">
            <ThemeLanguageSwitch />
          </div>
          <Terminal>
          {/* 广告位 */}
          <AdBanner />

          {/* 主菜单 - 只在未显示结果时显示 */}
          {!showResults && <MainMenu />}

          {/* 控制按钮 - 在选择类型后但未开始检测时显示 */}
          {selectedType && !showResults && (
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={handleStart}
                className="terminal-button px-6 py-2 text-terminal-green border-terminal-green"
              >
                [{t.startDetection}]
              </button>
              <button
                onClick={handleReset}
                className="terminal-button px-6 py-2 text-terminal-red border-terminal-red"
              >
                [{t.reset}]
              </button>
            </div>
          )}

          {/* 监控显示 */}
          {showResults && (
            <>
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <div className="text-terminal-green">
                  <span className="terminal-prompt">$ </span>
                  <span>
                    {isMonitoring
                      ? `${t.detecting} ${monitoringDomains.length} ${t.sites}...`
                      : `${t.detectionStopped} - ${monitoringDomains.length} ${t.sites}`}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {isMonitoring && countdown !== null && (
                    <span className="text-terminal-cyan text-sm">
                      {t.nextCheck}: {countdown}s
                    </span>
                  )}
                  {isMonitoring ? (
                    <button
                      onClick={handleStop}
                      className="terminal-button px-4 py-1 text-terminal-yellow border-terminal-yellow text-sm"
                    >
                      [{t.stopDetection}]
                    </button>
                  ) : (
                    <button
                      onClick={handleStart}
                      className="terminal-button px-4 py-1 text-terminal-green border-terminal-green text-sm"
                    >
                      [{t.continueDetection}]
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="terminal-button px-4 py-1 text-terminal-red border-terminal-red text-sm"
                  >
                    [{t.backToHome}]
                  </button>
                </div>
              </div>

              <MonitorDisplay
                onStop={handleStop}
                onStart={handleStart}
                onReset={handleReset}
              />

              {/* 停止检测后的提示 */}
              {!isMonitoring && (
                <div className="mt-6 p-4 bg-terminal-gray bg-opacity-10 border border-terminal-gray border-opacity-30 rounded">
                  <div className="text-terminal-yellow text-sm">
                    💡 {t.tip}: {t.detectionStoppedTip}
                  </div>
                  <div className="text-terminal-fg text-sm mt-2 space-y-1">
                    <div>• {t.viewResults}</div>
                    <div>• {t.clickContinue}</div>
                    <div>• {t.clickBack}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 底部信息 */}
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
          </Terminal>

          {/* 移动端底部固定按钮 */}
          {showResults && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-terminal-bg border-t border-terminal-gray border-opacity-30">
              <div className="flex gap-2">
                {isMonitoring ? (
                  <button
                    onClick={handleStop}
                    className="flex-1 terminal-button py-3 text-terminal-yellow border-terminal-yellow"
                  >
                    {t.stopDetection}
                  </button>
                ) : (
                  <button
                    onClick={handleStart}
                    className="flex-1 terminal-button py-3 text-terminal-green border-terminal-green"
                  >
                    {t.continueDetection}
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex-1 terminal-button py-3 text-terminal-red border-terminal-red"
                >
                  {t.backToHome}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}