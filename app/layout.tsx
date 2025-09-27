import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ping234.com - 在线网络检测工具',
  description: '专业的在线网络延迟检测服务，实时监测网络连接质量',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-terminal-bg">
        {children}
      </body>
    </html>
  )
}