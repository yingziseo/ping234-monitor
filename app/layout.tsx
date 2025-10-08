import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ping234.com - 在线网络检测工具 | 免费Ping测试 | 网络延迟监测',
  description: '专业的在线网络检测工具，支持批量检测国内外100+网站的网络连通性、延迟、抖动和丢包率。实时监控网络质量，支持自定义域名检测，提供详细的网络质量报告。',
  keywords: 'ping测试,网络检测,延迟检测,网络监控,ping工具,在线ping,网络质量,丢包率,网络诊断,网站监控,域名检测,网络延迟,网络测速',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('monitor-storage');
                if (theme) {
                  const data = JSON.parse(theme);
                  if (data.state && data.state.theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } else {
                  // 默认明亮主题
                  document.documentElement.classList.add('light');
                }
              } catch (e) {
                // 出错时默认明亮主题
                document.documentElement.classList.add('light');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-terminal-bg">
        {children}
      </body>
    </html>
  )
}