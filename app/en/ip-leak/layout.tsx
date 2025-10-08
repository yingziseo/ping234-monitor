import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP Leak Detection - WebRTC Leak Test | VPN Security Check - ping234.com',
  description: 'Professional IP leak detection tool using WebRTC technology to detect if your real IP is exposed. Supports VPN security testing, proxy server detection to protect your network privacy and security.',
  keywords: 'IP leak detection,WebRTC leak,VPN test,IP security,privacy protection,proxy detection,anonymity test,real IP detection,network security,IP privacy',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/en/ip-leak',
    languages: {
      'zh-CN': 'https://ping234.com/cn/ip-leak',
      'zh-TW': 'https://ping234.com/tw/ip-leak',
      'en': 'https://ping234.com/en/ip-leak',
    },
  },
  openGraph: {
    title: 'IP Leak Detection - WebRTC Leak Test | VPN Security Check - ping234.com',
    description: 'Professional IP leak detection tool using WebRTC technology to detect if your real IP is exposed. Supports VPN security testing, proxy server detection to protect your network privacy and security.',
    url: 'https://ping234.com/en/ip-leak',
    siteName: 'ping234.com',
    locale: 'en_US',
    type: 'website',
  },
};

export default function ENIPLeakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
