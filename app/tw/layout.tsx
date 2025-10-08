import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ping234.com - 線上網路檢測工具 | 免費Ping測試 | 網路延遲監測',
  description: '專業的線上網路檢測工具，支援批量檢測國內外100+網站的網路連通性、延遲、抖動和丟包率。即時監控網路品質，支援自訂網域檢測，提供詳細的網路品質報告。',
  keywords: 'ping測試,網路檢測,延遲檢測,網路監控,ping工具,線上ping,網路品質,丟包率,網路診斷,網站監控,網域檢測,網路延遲,網路測速',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/tw/',
    languages: {
      'zh-CN': 'https://ping234.com/cn/',
      'zh-TW': 'https://ping234.com/tw/',
      'en': 'https://ping234.com/en/',
    },
  },
  openGraph: {
    title: 'ping234.com - 線上網路檢測工具 | 免費Ping測試 | 網路延遲監測',
    description: '專業的線上網路檢測工具，支援批量檢測國內外100+網站的網路連通性、延遲、抖動和丟包率。即時監控網路品質，支援自訂網域檢測，提供詳細的網路品質報告。',
    url: 'https://ping234.com/tw/',
    siteName: 'ping234.com',
    locale: 'zh_TW',
    type: 'website',
  },
};

export default function TWLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}