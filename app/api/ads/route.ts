import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'ads.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      topAds: [],
      rotatingAds: [],
      friendLinks: [],
      seoConfig: {
        zh: {
          title: "ping234.com - 在线网络检测工具",
          description: "专业的网络延迟检测工具，支持批量检测国内外网站的网络连通性、延迟、抖动和丢包率",
          keywords: "ping,网络检测,延迟检测,网络监控,ping工具,在线ping,网络质量"
        },
        tw: {
          title: "ping234.com - 線上網路檢測工具",
          description: "專業的網路延遲檢測工具，支援批次檢測國內外網站的網路連通性、延遲、抖動和掉包率",
          keywords: "ping,網路檢測,延遲檢測,網路監控,ping工具,線上ping,網路品質"
        },
        en: {
          title: "ping234.com - Online Network Detection Tool",
          description: "Professional network latency detection tool, supports batch testing of domestic and international website connectivity, latency, jitter and packet loss",
          keywords: "ping,network detection,latency test,network monitoring,ping tool,online ping,network quality"
        },
        author: "ping234.com"
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}