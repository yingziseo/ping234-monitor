import { NextRequest, NextResponse } from 'next/server';

// 使用ip2location.io API专门用于IP泄露检测
const IP2LOCATION_API_KEY = '5617458807E70FC1D0BC1E10B6876CBB';
const IP2LOCATION_API_URL = 'https://api.ip2location.io';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ip = searchParams.get('ip');

  try {
    // 如果没有提供IP，查询请求者的IP
    const url = ip
      ? `${IP2LOCATION_API_URL}/?key=${IP2LOCATION_API_KEY}&ip=${ip}&format=json`
      : `${IP2LOCATION_API_URL}/?key=${IP2LOCATION_API_KEY}&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch IP data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 转换ip2location.io的响应格式为兼容格式
    const transformedData = {
      ip: data.ip,
      country: data.country_name,
      city: data.city_name,
      region: data.region_name,
      asn: {
        asn: data.asn,
        name: data.as
      },
      type: data.is_proxy === true || data.proxy_type !== '-' ? 'IDC' : 'Home/Enterprise'
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('IP Leak Query Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
