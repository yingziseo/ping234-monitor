import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ping234.com - Online Network Detection Tool',
  description: 'Professional network latency detection tool, supports batch testing of domestic and international website connectivity, latency, jitter and packet loss',
  keywords: 'ping,network detection,latency test,network monitoring,ping tool,online ping,network quality',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/en/',
    languages: {
      'zh-CN': 'https://ping234.com/cn/',
      'zh-TW': 'https://ping234.com/tw/',
      'en': 'https://ping234.com/en/',
    },
  },
  openGraph: {
    title: 'ping234.com - Online Network Detection Tool',
    description: 'Professional network latency detection tool, supports batch testing of domestic and international website connectivity, latency, jitter and packet loss',
    url: 'https://ping234.com/en/',
    siteName: 'ping234.com',
    locale: 'en_US',
    type: 'website',
  },
};

export default function ENLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}