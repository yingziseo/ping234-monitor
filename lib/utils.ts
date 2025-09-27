import { getTranslation, type Language } from './i18n';

export function getStatusClass(ping: number): string {
  if (ping < 0) return 'status-offline';
  if (ping < 100) return 'status-excellent';
  if (ping < 300) return 'status-good';
  if (ping < 500) return 'status-medium';
  return 'status-poor';
}

export function getStatusText(ping: number, language: Language = 'zh'): string {
  const t = getTranslation(language);
  if (ping < 0) return t.offline;
  if (ping < 100) return t.excellent;
  if (ping < 300) return t.good;
  if (ping < 500) return t.moderate;
  return t.slow;
}

export function calculateStats(history: number[]) {
  const validPings = history.filter(p => p > 0);
  if (validPings.length === 0) return null;

  const avg = validPings.reduce((a, b) => a + b, 0) / validPings.length;
  const min = Math.min(...validPings);
  const max = Math.max(...validPings);

  // 计算标准差（抖动）
  const variance = validPings.reduce((sum, val) =>
    sum + Math.pow(val - avg, 2), 0) / validPings.length;
  const stdev = Math.sqrt(variance);

  const packetLoss = ((history.length - validPings.length) / history.length) * 100;

  return {
    avg,
    min,
    max,
    stdev,
    packetLoss,
    samples: history.length,
  };
}

export function getJitterLevel(stdev: number, language: Language = 'zh'): string {
  const t = getTranslation(language);
  if (stdev < 10) return t.stable;
  if (stdev < 30) return t.stable; // 轻微使用稳定
  if (stdev < 50) return t.moderate;
  return t.unstable;
}

export function formatTime(ms: number): string {
  if (ms < 0) return 'N/A';
  return `${ms.toFixed(0)}ms`;
}