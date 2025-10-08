import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP Address Lookup - IP Geolocation | IP Location | IP Risk Detection - ping234.com',
  description: 'Professional IP address lookup tool providing accurate IP geolocation, location tracking, and security risk detection. Query IP geographic location, ISP information, ASN details, threat analysis and more.',
  keywords: 'IP lookup,IP address query,IP geolocation,IP location,IP risk detection,IP geographic location,IP security check,IP threat analysis,ASN query,ISP information,IP information',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/en/ip-query',
    languages: {
      'zh-CN': 'https://ping234.com/cn/ip-query',
      'zh-TW': 'https://ping234.com/tw/ip-query',
      'en': 'https://ping234.com/en/ip-query',
    },
  },
  openGraph: {
    title: 'IP Address Lookup - IP Geolocation | IP Location | IP Risk Detection - ping234.com',
    description: 'Professional IP address lookup tool providing accurate IP geolocation, location tracking, and security risk detection. Query IP geographic location, ISP information, ASN details, threat analysis and more.',
    url: 'https://ping234.com/en/ip-query',
    siteName: 'ping234.com',
    locale: 'en_US',
    type: 'website',
  },
};

export default function ENIPQueryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
