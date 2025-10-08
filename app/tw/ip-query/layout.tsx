import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP位址查詢 - IP歸屬地查詢 | IP定位 | IP風險檢測 - ping234.com',
  description: '專業的IP位址查詢工具，提供精準的IP歸屬地查詢、IP定位、安全風險檢測。支援查詢IP地理位置、營運商資訊、ASN資訊、威脅分析等，幫助您全面了解IP位址資訊。',
  keywords: 'IP查詢,IP位址查詢,IP歸屬地,IP定位,IP風險檢測,IP地理位置,IP安全檢測,IP威脅分析,ASN查詢,IP營運商,IP資訊查詢',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/tw/ip-query',
    languages: {
      'zh-CN': 'https://ping234.com/cn/ip-query',
      'zh-TW': 'https://ping234.com/tw/ip-query',
      'en': 'https://ping234.com/en/ip-query',
    },
  },
  openGraph: {
    title: 'IP位址查詢 - IP歸屬地查詢 | IP定位 | IP風險檢測 - ping234.com',
    description: '專業的IP位址查詢工具，提供精準的IP歸屬地查詢、IP定位、安全風險檢測。支援查詢IP地理位置、營運商資訊、ASN資訊、威脅分析等，幫助您全面了解IP位址資訊。',
    url: 'https://ping234.com/tw/ip-query',
    siteName: 'ping234.com',
    locale: 'zh_TW',
    type: 'website',
  },
};

export default function TWIPQueryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
