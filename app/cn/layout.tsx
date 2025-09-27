import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ping234.com - 在线网络检测工具',
  description: '专业的网络延迟检测工具，支持批量检测国内外网站的网络连通性、延迟、抖动和丢包率',
  keywords: 'ping,网络检测,延迟检测,网络监控,ping工具,在线ping,网络质量',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/cn/',
    languages: {
      'zh-CN': 'https://ping234.com/cn/',
      'zh-TW': 'https://ping234.com/tw/',
      'en': 'https://ping234.com/en/',
    },
  },
  openGraph: {
    title: 'ping234.com - 在线网络检测工具',
    description: '专业的网络延迟检测工具，支持批量检测国内外网站的网络连通性、延迟、抖动和丢包率',
    url: 'https://ping234.com/cn/',
    siteName: 'ping234.com',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function CNLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}