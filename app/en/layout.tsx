import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ping234.com - Online Network Detection Tool | Free Ping Test | Network Latency Monitor',
  description: 'Professional online network detection tool supporting batch testing of 100+ domestic and international websites for connectivity, latency, jitter and packet loss. Real-time network quality monitoring with custom domain detection and detailed network reports.',
  keywords: 'ping test,network detection,latency test,network monitor,ping tool,online ping,network quality,packet loss,network diagnostics,website monitor,domain test,network latency,speed test',
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
    title: 'ping234.com - Online Network Detection Tool | Free Ping Test | Network Latency Monitor',
    description: 'Professional online network detection tool supporting batch testing of 100+ domestic and international websites for connectivity, latency, jitter and packet loss. Real-time network quality monitoring with custom domain detection and detailed network reports.',
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