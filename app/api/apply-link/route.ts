import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'link-applications.json');

// 确保数据文件存在
async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    // 文件不存在，创建默认数据
    const defaultData = {
      applications: [],
      approved: []
    };
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
  }
}

export async function GET() {
  try {
    await ensureDataFile();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading link applications:', error);
    return NextResponse.json({ error: 'Failed to read applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile();
    const body = await request.json();
    const { siteName, siteUrl, language, timestamp } = body;

    // 验证数据
    if (!siteName || !siteUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (siteName.length > 20) {
      return NextResponse.json({ error: 'Site name too long' }, { status: 400 });
    }

    // 读取现有数据
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    // 检查是否已存在相同的申请
    const existingApplication = data.applications.find((app: any) =>
      app.siteUrl === siteUrl || app.siteName === siteName
    );

    if (existingApplication) {
      return NextResponse.json({ error: 'Application already exists' }, { status: 409 });
    }

    // 添加新申请
    const newApplication = {
      id: Date.now().toString(),
      siteName,
      siteUrl,
      language,
      timestamp,
      status: 'pending' // pending, approved, rejected
    };

    data.applications.push(newApplication);

    // 保存数据
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error saving link application:', error);
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureDataFile();
    const body = await request.json();
    const { id, action } = body; // action: 'approve' or 'reject'

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 读取现有数据
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    // 找到申请
    const applicationIndex = data.applications.findIndex((app: any) => app.id === id);
    if (applicationIndex === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const application = data.applications[applicationIndex];

    if (action === 'approve') {
      // 批准申请，移动到已批准列表
      application.status = 'approved';
      application.approvedAt = new Date().toISOString();

      // 添加到已批准的友情链接
      data.approved.push({
        id: application.id,
        title: application.siteName,
        url: application.siteUrl,
        language: application.language
      });

      // 从申请列表中移除
      data.applications.splice(applicationIndex, 1);
    } else if (action === 'reject') {
      // 拒绝申请
      application.status = 'rejected';
      application.rejectedAt = new Date().toISOString();
    }

    // 保存数据
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, message: `Application ${action}d successfully` });
  } catch (error) {
    console.error('Error updating link application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}