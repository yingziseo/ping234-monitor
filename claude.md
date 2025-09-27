# ping234.com - 在线网络检测工具

## 项目概述

这是一个基于 Next.js 14 开发的在线网络检测工具，采用终端风格的UI设计，支持批量域名ping检测、实时监控、多语言、明暗主题切换等功能。

### 核心特性
- ✅ 100+ 中国网络节点检测
- ✅ 100+ 国际网络节点检测
- ✅ 自定义域名检测
- ✅ 实时监控和数据更新
- ✅ 明暗主题切换
- ✅ 多语言支持（简体中文/繁体中文/英文）
- ✅ 广告轮播系统
- ✅ 友情链接管理
- ✅ 响应式设计（支持移动端）
- ✅ 管理后台

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **状态管理**: Zustand (含持久化)
- **UI风格**: Terminal/CLI 风格

## 项目结构

```
domain-monitor-nextjs/
├── app/
│   ├── page.tsx               # 主页面
│   ├── admin/
│   │   └── page.tsx           # 管理后台
│   ├── layout.tsx             # 根布局
│   └── globals.css            # 全局样式
├── components/
│   ├── Terminal.tsx           # 终端窗口组件
│   ├── MainMenu.tsx          # 主菜单组件
│   ├── MonitorDisplay.tsx    # 监控显示组件
│   ├── AdBanner.tsx          # 顶部广告横幅
│   ├── FriendLinks.tsx       # 友情链接组件
│   └── ThemeLanguageSwitch.tsx # 主题和语言切换
├── lib/
│   ├── store.ts              # Zustand状态管理
│   ├── domains.ts            # 域名列表配置
│   ├── i18n.ts               # 多语言配置
│   └── utils.ts              # 工具函数
└── public/                    # 静态资源

```

## 功能模块详解

### 1. 域名检测系统

#### 检测类型
- **中国网络**: 100+ 国内主流网站和服务
- **国际网络**: 100+ 国际主流网站和服务
- **自定义检测**: 用户自定义输入域名列表

#### 检测指标
- **延迟(Ping)**: 响应时间（毫秒）
- **状态**: 良好/较慢/超时
- **抖动**: 网络稳定性指标
- **丢包率**: 数据包丢失百分比

#### 实现原理
```typescript
// 使用图片加载方式检测（避免CORS）
async function checkDomain(domain: string): Promise<number> {
  const start = Date.now();
  const img = new Image();
  img.src = `https://${domain}/favicon.ico?t=${Date.now()}`;
  // 计算响应时间
  return Date.now() - start;
}
```

### 2. 广告轮播系统

#### 特点
- 支持多语言广告文本和链接
- 轮播机制：广告池循环显示
- 占位广告：自动填充未售出的广告位

#### 数据结构
```typescript
interface RotatingAd {
  id: string;
  text: {
    zh: string;  // 简体中文
    tw: string;  // 繁体中文
    en: string;  // 英文
  };
  url: {
    zh: string;
    tw: string;
    en: string;
  };
  isPlaceholder?: boolean;
}
```

### 3. 主题系统

#### 暗色主题（默认）
```css
--terminal-bg: #0d1117;
--terminal-fg: #c9d1d9;
--terminal-green: #58a6ff;
--terminal-yellow: #ffd700;
--terminal-red: #ff7b72;
```

#### 亮色主题
```css
--terminal-bg: #f6f8fa;
--terminal-fg: #24292e;
--terminal-green: #22863a;
--terminal-yellow: #b08800;
--terminal-red: #d73a49;
```

### 4. 多语言支持

#### 支持语言
- 简体中文 (zh)
- 繁体中文 (tw)
- 英文 (en)

#### 实现方式
- 使用 i18n 配置文件管理翻译
- Zustand 持久化存储用户语言偏好
- 动态切换界面语言

### 5. 管理后台

#### 功能
- 顶部广告配置
- 轮播广告管理（增删改）
- 友情链接管理
- 预留广告位数量设置

#### 访问控制
- URL: `/admin`
- 默认密码: `admin123`

## 状态管理

### Zustand Store 结构

```typescript
interface MonitorStore {
  // 检测相关
  selectedType: 'domestic' | 'international' | 'custom' | null;
  monitoringDomains: string[];
  isMonitoring: boolean;
  interval: number;
  results: Record<string, number>;
  history: Record<string, number[]>;

  // 广告系统
  adConfig: AdConfig;
  rotatingAds: RotatingAd[];
  placeholderCount: number;

  // 友情链接
  friendLinks: FriendLink[];

  // 主题和语言
  theme: 'light' | 'dark';
  language: 'zh' | 'tw' | 'en';
}
```

### 持久化配置
```typescript
persist(
  (set) => ({ ... }),
  {
    name: 'monitor-storage',
    partialize: (state) => ({
      theme: state.theme,
      language: state.language,
      friendLinks: state.friendLinks,
      rotatingAds: state.rotatingAds,
      placeholderCount: state.placeholderCount,
      adConfig: state.adConfig,
    })
  }
)
```

## 样式系统

### Terminal 风格设计
- 等宽字体 (SF Mono, Monaco, Fira Code)
- 终端窗口样式（标题栏、三色按钮）
- 终端提示符 `$ `
- ASCII 艺术标题

### 响应式设计
- 移动端优化的表格显示
- 底部固定控制栏（移动端）
- 自适应字体大小

### CSS 变量系统
- 支持明暗主题切换
- 使用 CSS 变量实现主题色彩
- TailwindCSS 配置引用 CSS 变量

## 开发指南

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
npm run start
```

### 环境变量
无需特殊环境变量配置

## 部署说明

### Vercel 部署（推荐）
1. 连接 GitHub 仓库
2. 自动检测 Next.js 项目
3. 一键部署

### 自托管部署
```bash
# 构建
npm run build

# 启动
npm run start

# 或使用 PM2
pm2 start npm --name "ping234" -- start
```

## 注意事项

### 跨域问题
- 使用图片加载方式规避 CORS 限制
- 检测 favicon.ico 文件存在性

### 性能优化
- 批量检测使用异步并发
- 历史数据限制为最近 100 条
- 使用 React.memo 优化组件渲染

### 浏览器兼容性
- 支持所有现代浏览器
- 需要 JavaScript 启用
- 建议使用 Chrome/Firefox/Safari 最新版本

## 维护与更新

### 添加新域名
编辑 `lib/domains.ts`：
```typescript
export const domesticDomains = [
  // 添加新域名
  'newdomain.com',
  ...
];
```

### 修改广告配置
1. 访问 `/admin`
2. 输入密码 `admin123`
3. 在轮播广告配置中添加/编辑广告

### 更改主题颜色
编辑 `app/globals.css` 中的 CSS 变量

### 添加新语言
1. 在 `lib/i18n.ts` 添加翻译
2. 更新 Language 类型定义
3. 在切换组件中添加按钮

## 常见问题

### Q: 为什么某些域名检测失败？
A: 可能原因：
- 网站没有 favicon.ico
- 网站设置了严格的 CORS 策略
- 网站在某些地区被屏蔽

### Q: 如何修改检测间隔？
A: 在主界面选择不同的间隔时间（3s/5s/10s/15s/30s/60s）

### Q: 如何修改管理员密码？
A: 编辑 `app/admin/page.tsx` 中的密码验证逻辑

### Q: 广告如何计费？
A: 项目本身不包含计费系统，需要线下协商广告投放

## 版本历史

### v1.0.0 (2024-01)
- 初始版本发布
- 基础检测功能
- 终端UI设计

### v1.1.0 (2024-01)
- 添加多语言支持
- 添加明暗主题切换
- 广告系统多语言化
- 管理后台功能完善

## 联系方式

- 项目网址: https://ping234.com
- 广告合作: ad@ping234.com

## 许可证

MIT License

---

*最后更新: 2024年1月*