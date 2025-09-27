import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const start = Date.now();

    try {
      // 尝试fetch请求
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      const elapsed = Date.now() - start;

      return NextResponse.json({
        domain,
        ping: elapsed,
        status: response.ok ? 'online' : 'error',
      });
    } catch (error) {
      // 如果失败，返回离线状态
      return NextResponse.json({
        domain,
        ping: -1,
        status: 'offline',
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Domain check API' });
}