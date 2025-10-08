import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP泄露检测 - WebRTC泄露测试 | VPN安全检测 - ping234.com',
  description: '专业的IP泄露检测工具，通过WebRTC技术检测您的真实IP是否泄露。支持VPN安全检测、代理服务器检测，保护您的网络隐私和安全。',
  keywords: 'IP泄露检测,WebRTC泄露,VPN检测,IP安全,隐私保护,代理检测,匿名检测,真实IP检测,网络安全,IP隐私',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/cn/ip-leak',
    languages: {
      'zh-CN': 'https://ping234.com/cn/ip-leak',
      'zh-TW': 'https://ping234.com/tw/ip-leak',
      'en': 'https://ping234.com/en/ip-leak',
    },
  },
  openGraph: {
    title: 'IP泄露检测 - WebRTC泄露测试 | VPN安全检测 - ping234.com',
    description: '专业的IP泄露检测工具，通过WebRTC技术检测您的真实IP是否泄露。支持VPN安全检测、代理服务器检测，保护您的网络隐私和安全。',
    url: 'https://ping234.com/cn/ip-leak',
    siteName: 'ping234.com',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function CNIPLeakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
