import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ping234.com - 線上網路檢測工具',
  description: '專業的網路延遲檢測工具，支援批次檢測國內外網站的網路連通性、延遲、抖動和掉包率',
  keywords: 'ping,網路檢測,延遲檢測,網路監控,ping工具,線上ping,網路品質',
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
    title: 'ping234.com - 線上網路檢測工具',
    description: '專業的網路延遲檢測工具，支援批次檢測國內外網站的網路連通性、延遲、抖動和掉包率',
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