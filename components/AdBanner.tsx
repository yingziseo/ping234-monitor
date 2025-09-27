'use client';

import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

export default function AdBanner() {
  const { topAds, language } = useMonitorStore();
  const t = getTranslation(language);

  // 如果没有顶部广告，不显示
  if (!topAds || topAds.length === 0) {
    return null;
  }

  const handleAdClick = (ad: any) => {
    const url = ad.url[language] || ad.url.zh;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // 计算布局类名
  const getLayoutClass = () => {
    const count = topAds.length;
    if (count === 1) {
      return 'justify-center'; // 1个居中
    } else if (count <= 3) {
      return 'justify-center gap-4'; // 2-3个自适应一行
    } else {
      return 'justify-center gap-4'; // 4个及以上需要分行
    }
  };

  // 将广告分组（每行最多3个）
  const getAdRows = () => {
    const rows = [];
    for (let i = 0; i < topAds.length; i += 3) {
      rows.push(topAds.slice(i, i + 3));
    }
    return rows;
  };

  return (
    <div className="mb-4 space-y-4">
      {getAdRows().map((row, rowIndex) => (
        <div key={rowIndex} className={`flex flex-wrap ${getLayoutClass()}`}>
          {row.map((ad) => (
            <div
              key={ad.id}
              className="ad-banner cursor-pointer flex-1 min-w-0 max-w-sm"
              onClick={() => handleAdClick(ad)}
            >
              <span
                className="opacity-80 block truncate font-bold text-terminal-cyan"
              >
                [AD] {ad.text[language] || ad.text.zh}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}