import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP地址查询 - IP归属地查询 | IP定位 | IP风险检测 - ping234.com',
  description: '专业的IP地址查询工具，提供精准的IP归属地查询、IP定位、安全风险检测。支持查询IP地理位置、运营商信息、ASN信息、威胁分析等，帮助您全面了解IP地址信息。',
  keywords: 'IP查询,IP地址查询,IP归属地,IP定位,IP风险检测,IP地理位置,IP安全检测,IP威胁分析,ASN查询,IP运营商,IP信息查询',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/cn/ip-query',
    languages: {
      'zh-CN': 'https://ping234.com/cn/ip-query',
      'zh-TW': 'https://ping234.com/tw/ip-query',
      'en': 'https://ping234.com/en/ip-query',
    },
  },
  openGraph: {
    title: 'IP地址查询 - IP归属地查询 | IP定位 | IP风险检测 - ping234.com',
    description: '专业的IP地址查询工具，提供精准的IP归属地查询、IP定位、安全风险检测。支持查询IP地理位置、运营商信息、ASN信息、威胁分析等，帮助您全面了解IP地址信息。',
    url: 'https://ping234.com/cn/ip-query',
    siteName: 'ping234.com',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function CNIPQueryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
