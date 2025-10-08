'use client';

import { useState, useEffect } from 'react';
import Terminal from '@/components/Terminal';
import MainMenu from '@/components/MainMenu';
import MonitorDisplay from '@/components/MonitorDisplay';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import MarqueeNotice from '@/components/MarqueeNotice';
import Navigation from '@/components/Navigation';
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
          {/* 导航栏 */}
          <Navigation />
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
                <div className="mt-6 p-4 bg-terminal-gray bg-opacity-10 border border-terminal-yellow border-opacity-30 rounded">
                  <div className="text-terminal-yellow text-sm">
                    💡 {t.tip}: {t.detectionStoppedTip}
                  </div>
                  <div className="text-terminal-yellow text-sm mt-2 space-y-1">
                    <div>• {t.viewResults}</div>
                    <div>• {t.clickContinue}</div>
                    <div>• {t.clickBack}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 底部信息 */}
          <Footer />
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