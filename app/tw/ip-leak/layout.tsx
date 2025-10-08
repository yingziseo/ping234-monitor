import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP洩露檢測 - WebRTC洩露測試 | VPN安全檢測 - ping234.com',
  description: '專業的IP洩露檢測工具，通過WebRTC技術檢測您的真實IP是否洩露。支援VPN安全檢測、代理伺服器檢測，保護您的網路隱私和安全。',
  keywords: 'IP洩露檢測,WebRTC洩露,VPN檢測,IP安全,隱私保護,代理檢測,匿名檢測,真實IP檢測,網路安全,IP隱私',
  authors: [{ name: 'ping234.com' }],
  alternates: {
    canonical: 'https://ping234.com/tw/ip-leak',
    languages: {
      'zh-CN': 'https://ping234.com/cn/ip-leak',
      'zh-TW': 'https://ping234.com/tw/ip-leak',
      'en': 'https://ping234.com/en/ip-leak',
    },
  },
  openGraph: {
    title: 'IP洩露檢測 - WebRTC洩露測試 | VPN安全檢測 - ping234.com',
    description: '專業的IP洩露檢測工具，通過WebRTC技術檢測您的真實IP是否洩露。支援VPN安全檢測、代理伺服器檢測，保護您的網路隱私和安全。',
    url: 'https://ping234.com/tw/ip-leak',
    siteName: 'ping234.com',
    locale: 'zh_TW',
    type: 'website',
  },
};

export default function TWIPLeakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
