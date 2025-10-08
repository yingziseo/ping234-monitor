import { NextRequest, NextResponse } from 'next/server';

// 使用ipdata.co API进行IP查询
const IPDATA_API_KEY = '5d21b61c0c479cd13f765645c787599fab0405397969151b82207441';
const IPDATA_API_URL = 'https://api.ipdata.co';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ip = searchParams.get('ip');

  try {
    // 如果没有提供IP，查询请求者的IP
    const url = ip
      ? `${IPDATA_API_URL}/${ip}?api-key=${IPDATA_API_KEY}`
      : `${IPDATA_API_URL}?api-key=${IPDATA_API_KEY}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch IP data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('IP Query Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
