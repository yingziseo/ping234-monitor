'use client';

import { useEffect, useState, useRef } from 'react';
import { useMonitorStore } from '@/lib/store';
import { getStatusClass, getStatusText, formatTime, calculateStats, getJitterLevel } from '@/lib/utils';
import { getTranslation } from '@/lib/i18n';

export default function MonitorDisplay() {
  const {
    monitoringDomains,
    isMonitoring,
    interval,
    results,
    history,
    rotatingAds,
    updateResult,
    updateHistory,
    language,
  } = useMonitorStore();

  const t = getTranslation(language);

  const [checkCount, setCheckCount] = useState(0);
  const [sessionStart] = useState(new Date());
  const monitoringRef = useRef(isMonitoring);

  // 同步ref值
  useEffect(() => {
    monitoringRef.current = isMonitoring;
  }, [isMonitoring]);

  useEffect(() => {
    if (!isMonitoring) return;

    const checkDomains = async () => {
      // 使用ref检查状态
      if (!monitoringRef.current) return;

      setCheckCount(prev => prev + 1);

      for (const domain of monitoringDomains) {
        // 在每个域名检测前再次检查状态
        if (!monitoringRef.current) break;

        try {
          // 模拟检测（实际环境中需要通过API）
          const ping = await checkDomain(domain);

          // 检测完成后再次检查状态
          if (!monitoringRef.current) break;

          updateResult(domain, ping);
          updateHistory(domain, ping);
        } catch (error) {
          // 如果检测被中断，直接退出
          if (!monitoringRef.current) break;
        }
      }
    };

    checkDomains();
    const intervalId = setInterval(checkDomains, interval * 1000);

    return () => clearInterval(intervalId);
  }, [isMonitoring, interval, monitoringDomains, updateResult, updateHistory]);

  async function checkDomain(domain: string): Promise<number> {
    const start = Date.now();

    try {
      // 使用图片加载测试（避免CORS）
      await new Promise((resolve, reject) => {
        const img = new Image();
        const timeout = setTimeout(() => {
          img.src = '';
          reject(new Error('Timeout'));
        }, 3000); // 缩短超时时间到3秒

        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          // 即使失败也可能是成功的（404但服务器响应了）
          resolve(false);
        };

        img.src = `https://${domain}/favicon.ico?t=${Date.now()}`;
      });

      const elapsed = Date.now() - start;
      return elapsed < 3000 ? elapsed : -1;
    } catch {
      return -1;
    }
  }

  const getSessionTime = () => {
    const now = new Date();
    const diff = now.getTime() - sessionStart.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getOverallStats = () => {
    const allResults = Object.values(results);
    const online = allResults.filter(p => p > 0).length;
    const offline = allResults.filter(p => p <= 0).length;
    const avgPing = online > 0 ?
      allResults.filter(p => p > 0).reduce((a, b) => a + b, 0) / online : 0;

    return { online, offline, avgPing };
  };

  const handleDomainClick = (domain: string) => {
    window.open(`https://${domain}`, '_blank', 'noopener,noreferrer');
  };

  // Generate ads pool without placeholders
  const getAdsPool = () => {
    const pool: any[] = [...rotatingAds];
    // Remove placeholder generation - no more placeholder ads
    return pool;
  };

  // Get ad for specific index (rotating through pool)
  const getAdForIndex = (index: number) => {
    const pool = getAdsPool();
    if (pool.length === 0) return null;
    return pool[index % pool.length];
  };

  // 生成报告数据
  const generateReportData = () => {
    return monitoringDomains.map((domain, index) => {
      const ping = results[domain] || -1;
      const domainHistory = history[domain] || [];
      const domainStats = calculateStats(domainHistory);

      return {
        序号: index + 1,
        检测地址: domain,
        状态: getStatusText(ping, language),
        延迟: formatTime(ping),
        抖动: domainStats ? getJitterLevel(domainStats.stdev, language) : '-',
        丢包率: domainStats ? `${domainStats.packetLoss.toFixed(1)}%` : '-',
        最小延迟: domainStats ? `${domainStats.min.toFixed(0)}ms` : '-',
        最大延迟: domainStats ? `${domainStats.max.toFixed(0)}ms` : '-',
        平均延迟: domainStats ? `${domainStats.avg.toFixed(0)}ms` : '-',
        检测次数: domainStats ? domainStats.samples : 0,
      };
    });
  };

  // 下载CSV文件
  const downloadCSV = () => {
    const data = generateReportData();
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ping234-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // 下载JSON文件
  const downloadJSON = () => {
    const data = {
      检测时间: new Date().toISOString(),
      运行时长: getSessionTime(),
      检测次数: checkCount,
      总体统计: stats,
      详细数据: generateReportData()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ping234-report-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* 状态栏 */}
      <div className="flex flex-wrap gap-4 text-xs md:text-sm text-terminal-gray">
        <span>{t.runningTime}: <span className="text-terminal-green">{getSessionTime()}</span></span>
        <span>{t.checkCount}: <span className="text-terminal-cyan">{checkCount}</span></span>
        <span>{t.online}: <span className="text-terminal-green">{stats.online}</span></span>
        <span>{t.offline}: <span className="text-terminal-red">{stats.offline}</span></span>
        <span>{t.avgDelay}: <span className="text-terminal-yellow">{stats.avgPing.toFixed(0)}ms</span></span>
      </div>

      {/* 结果表格 */}
      <div className="overflow-x-auto">
        <table className="domain-table">
          <thead>
            <tr>
              <th className="w-12">{t.number}</th>
              <th>{t.checkAddress}</th>
              <th className="text-center">{t.status}</th>
              <th className="text-center">{t.delay}</th>
              <th className="text-center hide-mobile">{t.jitter}</th>
              <th className="text-center hide-mobile">{t.packetLoss}</th>
              <th className="hide-mobile">{t.adSponsor}</th>
            </tr>
          </thead>
          <tbody>
            {monitoringDomains.map((domain, index) => {
              const ping = results[domain] || -1;
              const domainHistory = history[domain] || [];
              const domainStats = calculateStats(domainHistory);
              const ad = getAdForIndex(index);

              return (
                <tr key={domain} className="hover:bg-terminal-gray/10 transition-colors">
                  <td className="text-terminal-gray">{index + 1}</td>
                  <td>
                    <button
                      onClick={() => handleDomainClick(domain)}
                      className="text-terminal-cyan hover:text-terminal-green hover:underline
                               transition-colors cursor-pointer text-left"
                    >
                      <span className="truncate block max-w-[200px] md:max-w-none">
                        {domain}
                      </span>
                    </button>
                  </td>
                  <td className={`text-center ${getStatusClass(ping)}`}>
                    {getStatusText(ping, language)}
                  </td>
                  <td className={`text-center ${getStatusClass(ping)}`}>
                    {formatTime(ping)}
                  </td>
                  <td className="text-center hide-mobile">
                    {domainStats ? (
                      <span className={domainStats.stdev < 30 ? 'text-terminal-green' : 'text-terminal-yellow'}>
                        {getJitterLevel(domainStats.stdev, language)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="text-center hide-mobile">
                    {domainStats ? (
                      <span className={domainStats.packetLoss < 10 ? 'text-terminal-green' : 'text-terminal-red'}>
                        {domainStats.packetLoss.toFixed(1)}%
                      </span>
                    ) : '-'}
                  </td>
                  <td className="hide-mobile">
                    {ad ? (
                      <button
                        onClick={() => {
                          if (ad.isPlaceholder) {
                            alert(t.contactAd);
                          } else {
                            const url = typeof ad.url === 'object' ? (ad.url[language] || ad.url.zh || ad.url.en) : ad.url;
                            window.open(url, '_blank');
                          }
                        }}
                        className={`text-xs hover:underline transition-colors cursor-pointer font-bold ${
                          ad.isPlaceholder
                            ? 'text-terminal-gray opacity-60 hover:text-terminal-cyan hover:opacity-100'
                            : 'text-terminal-cyan hover:text-terminal-green'
                        }`}
                      >
                        {typeof ad.text === 'object' ? (ad.text[language] || ad.text.zh || ad.text.en) : ad.text}
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(t.contactAd)}
                        className="text-xs text-terminal-gray opacity-60 hover:text-terminal-cyan hover:opacity-100
                                 hover:underline transition-colors cursor-pointer font-bold"
                      >
                        {t.placeAd}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 移动端广告显示 */}
      <div className="md:hidden space-y-2">
        {[0, 1, 2].map(index => {
          const ad = getAdForIndex(index);
          if (!ad) return null;

          return (
            <div
              key={ad.id}
              onClick={() => {
                if (ad.isPlaceholder) {
                  alert(t.contactAd);
                } else {
                  const url = typeof ad.url === 'object' ? (ad.url[language] || ad.url.zh || ad.url.en) : ad.url;
                  window.open(url, '_blank');
                }
              }}
              className={`bg-terminal-gray bg-opacity-10 border border-terminal-gray border-opacity-30 p-2 rounded
                       text-center text-xs cursor-pointer font-bold hover:bg-terminal-gray/20 transition-colors ${
                ad.isPlaceholder
                  ? 'text-terminal-gray opacity-60'
                  : 'text-terminal-cyan'
              }`}
            >
              [AD] {typeof ad.text === 'object' ? (ad.text[language] || ad.text.zh || ad.text.en) : ad.text}
            </div>
          );
        })}
      </div>

      {/* 详细网络统计（每10次检测显示或检测停止后显示） */}
      {checkCount > 0 && (checkCount % 10 === 0 || !isMonitoring) && (
        <div className="border-t border-terminal-gray border-opacity-30 pt-4">
          <div className="text-terminal-yellow mb-3">{t.networkQualityReport}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs md:text-sm">
            {monitoringDomains.slice(0, 6).map(domain => {
              const domainHistory = history[domain] || [];
              const domainStats = calculateStats(domainHistory);

              if (!domainStats) return null;

              return (
                <div key={domain} className="space-y-1 text-terminal-gray">
                  <div className="text-terminal-cyan font-medium truncate">{domain}</div>
                  <div>{t.min}: {domainStats.min.toFixed(0)}ms</div>
                  <div>{t.max}: {domainStats.max.toFixed(0)}ms</div>
                  <div>{t.avg}: {domainStats.avg.toFixed(0)}ms</div>
                  <div>{t.jitter}: {domainStats.stdev.toFixed(1)}ms</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 检测报告下载区域（仅在检测停止后显示） */}
      {!isMonitoring && checkCount > 0 && (
        <div className="border-t border-terminal-gray border-opacity-30 pt-4">
          <div className="text-terminal-yellow mb-3">{t.detectionReport}</div>
          <div className="flex flex-wrap gap-3 text-xs md:text-sm">
            <button
              onClick={downloadCSV}
              className="terminal-button px-4 py-2 text-terminal-green border-terminal-green hover:bg-terminal-green hover:bg-opacity-10"
            >
              📊 {t.downloadCSV}
            </button>
            <button
              onClick={downloadJSON}
              className="terminal-button px-4 py-2 text-terminal-cyan border-terminal-cyan hover:bg-terminal-cyan hover:bg-opacity-10"
            >
              📄 {t.downloadJSON}
            </button>
          </div>
          <div className="mt-3 text-xs text-terminal-gray">
            💾 {t.generateReport}：包含完整检测数据、统计信息和时间戳
          </div>
        </div>
      )}
    </div>
  );
}