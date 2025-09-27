'use client';

import { useState, useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import Toast from '@/components/Toast';

export default function SimpleAdminPage() {
  const [activeTab, setActiveTab] = useState('ads');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'; isVisible: boolean}>({message: '', type: 'info', isVisible: false});
  const { theme } = useMonitorStore();

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      showToast('密码错误', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded p-6">
          <h1 className="text-xl font-bold text-white mb-4 text-center">管理后台</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded"
              placeholder="输入密码"
            />
            <button
              onClick={handleLogin}
              className="w-full p-3 bg-terminal-green text-white rounded hover:opacity-80"
            >
              登录
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-terminal-bg text-terminal-fg">
      <div className="bg-terminal-window-bg shadow border-b border-terminal-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-terminal-fg">ping234 管理后台</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-terminal-red text-white rounded hover:opacity-80"
            >
              退出
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 简单的标签导航 */}
        <div className="flex space-x-1 bg-terminal-header-bg p-1 rounded-lg mb-6 border border-terminal-border">
          {[
            { id: 'ads', label: '广告管理' },
            { id: 'routes', label: '线路管理' },
            { id: 'links', label: '友情链接' },
            { id: 'seo', label: 'SEO设置' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-terminal-button-bg text-terminal-fg border border-terminal-green'
                  : 'text-terminal-gray hover:text-terminal-fg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="bg-terminal-window-bg rounded-lg shadow border border-terminal-border p-6">
          {activeTab === 'ads' && <AdsModule showToast={showToast} />}
          {activeTab === 'routes' && <RoutesModule showToast={showToast} />}
          {activeTab === 'links' && <LinksModule showToast={showToast} />}
          {activeTab === 'seo' && <SeoModule showToast={showToast} />}
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </main>
  );
}

// 广告管理模块
function AdsModule({ showToast }: { showToast: (message: string, type: 'success' | 'error' | 'info') => void }) {
  const { topAds, addTopAd, removeTopAd, updateTopAd, rotatingAds, addRotatingAd, removeRotatingAd, updateRotatingAd, saveToServer } = useMonitorStore();
  const [activeAdTab, setActiveAdTab] = useState('top');
  const [newTopAd, setNewTopAd] = useState({
    textZh: '', textTw: '', textEn: '',
    urlZh: '', urlTw: '', urlEn: ''
  });
  const [editingTopAd, setEditingTopAd] = useState<any>(null);
  const [editingRotatingAd, setEditingRotatingAd] = useState<any>(null);
  const [newAd, setNewAd] = useState({
    textZh: '', textTw: '', textEn: '',
    urlZh: '', urlTw: '', urlEn: ''
  });

  const handleAddTopAd = async () => {
    if (!newTopAd.textZh || !newTopAd.urlZh) {
      showToast('请至少填写简体中文的内容', 'error');
      return;
    }
    addTopAd({
      id: Date.now().toString(),
      text: {
        zh: newTopAd.textZh,
        tw: newTopAd.textTw || newTopAd.textZh,
        en: newTopAd.textEn || newTopAd.textZh
      },
      url: {
        zh: newTopAd.urlZh,
        tw: newTopAd.urlTw || newTopAd.urlZh,
        en: newTopAd.urlEn || newTopAd.urlZh
      },
    });
    await saveToServer();
    setNewTopAd({ textZh: '', textTw: '', textEn: '', urlZh: '', urlTw: '', urlEn: '' });
    showToast('顶部广告已添加', 'success');
  };

  const handleUpdateTopAd = async () => {
    if (!editingTopAd || !editingTopAd.textZh || !editingTopAd.urlZh) {
      showToast('请至少填写简体中文的内容', 'error');
      return;
    }
    updateTopAd(editingTopAd.id, {
      text: {
        zh: editingTopAd.textZh,
        tw: editingTopAd.textTw || editingTopAd.textZh,
        en: editingTopAd.textEn || editingTopAd.textZh
      },
      url: {
        zh: editingTopAd.urlZh,
        tw: editingTopAd.urlTw || editingTopAd.urlZh,
        en: editingTopAd.urlEn || editingTopAd.urlZh
      },
    });
    await saveToServer();
    setEditingTopAd(null);
    showToast('顶部广告已更新', 'success');
  };

  const handleAddAd = async () => {
    if (!newAd.textZh || !newAd.urlZh) {
      showToast('请至少填写简体中文的内容', 'error');
      return;
    }
    addRotatingAd({
      id: Date.now().toString(),
      text: {
        zh: newAd.textZh,
        tw: newAd.textTw || newAd.textZh,
        en: newAd.textEn || newAd.textZh
      },
      url: {
        zh: newAd.urlZh,
        tw: newAd.urlTw || newAd.urlZh,
        en: newAd.urlEn || newAd.urlZh
      },
    });
    await saveToServer();
    setNewAd({ textZh: '', textTw: '', textEn: '', urlZh: '', urlTw: '', urlEn: '' });
    showToast('广告已添加', 'success');
  };

  const handleUpdateRotatingAd = async () => {
    if (!editingRotatingAd || !editingRotatingAd.textZh || !editingRotatingAd.urlZh) {
      showToast('请至少填写简体中文的内容', 'error');
      return;
    }
    updateRotatingAd(editingRotatingAd.id, {
      text: {
        zh: editingRotatingAd.textZh,
        tw: editingRotatingAd.textTw || editingRotatingAd.textZh,
        en: editingRotatingAd.textEn || editingRotatingAd.textZh
      },
      url: {
        zh: editingRotatingAd.urlZh,
        tw: editingRotatingAd.urlTw || editingRotatingAd.urlZh,
        en: editingRotatingAd.urlEn || editingRotatingAd.urlZh
      },
    });
    await saveToServer();
    setEditingRotatingAd(null);
    showToast('广告已更新', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-terminal-fg mb-4">顶部广告管理（多语言）</h3>

        {/* 添加新的顶部广告 */}
        <div className="space-y-6 mb-6 p-4 border border-terminal-border rounded">
          <h4 className="text-md font-medium text-terminal-cyan">添加新的顶部广告</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">简体中文 *</label>
              <input
                type="text"
                value={newTopAd.textZh}
                onChange={(e) => setNewTopAd({ ...newTopAd, textZh: e.target.value })}
                className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="广告文字"
              />
              <input
                type="text"
                value={newTopAd.urlZh}
                onChange={(e) => setNewTopAd({ ...newTopAd, urlZh: e.target.value })}
                className="w-full p-3 mt-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="跳转链接"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">繁体中文</label>
              <input
                type="text"
                value={newTopAd.textTw}
                onChange={(e) => setNewTopAd({ ...newTopAd, textTw: e.target.value })}
                className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="廣告文字"
              />
              <input
                type="text"
                value={newTopAd.urlTw}
                onChange={(e) => setNewTopAd({ ...newTopAd, urlTw: e.target.value })}
                className="w-full p-3 mt-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="跳轉鏈接"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">English</label>
              <input
                type="text"
                value={newTopAd.textEn}
                onChange={(e) => setNewTopAd({ ...newTopAd, textEn: e.target.value })}
                className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="Ad Text"
              />
              <input
                type="text"
                value={newTopAd.urlEn}
                onChange={(e) => setNewTopAd({ ...newTopAd, urlEn: e.target.value })}
                className="w-full p-3 mt-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="Jump Link"
              />
            </div>
          </div>
          <button
            onClick={handleAddTopAd}
            className="px-6 py-2 bg-terminal-green text-white rounded hover:opacity-80"
          >
            添加顶部广告
          </button>
        </div>

        {/* 现有顶部广告列表 */}
        <div className="space-y-3">
          <h4 className="text-md font-medium text-terminal-cyan">现有顶部广告 ({topAds.length})</h4>
          {topAds.map((ad) => (
            <div key={ad.id} className="p-4 bg-terminal-header-bg border border-terminal-border rounded">
              {editingTopAd && editingTopAd.id === ad.id ? (
                // 编辑模式
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-terminal-gray">简体中文</label>
                      <input
                        type="text"
                        value={editingTopAd.textZh}
                        onChange={(e) => setEditingTopAd({ ...editingTopAd, textZh: e.target.value })}
                        className="w-full p-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editingTopAd.urlZh}
                        onChange={(e) => setEditingTopAd({ ...editingTopAd, urlZh: e.target.value })}
                        className="w-full p-2 mt-1 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-terminal-gray">繁体中文</label>
                      <input
                        type="text"
                        value={editingTopAd.textTw}
                        onChange={(e) => setEditingTopAd({ ...editingTopAd, textTw: e.target.value })}
                        className="w-full p-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editingTopAd.urlTw}
                        onChange={(e) => setEditingTopAd({ ...editingTopAd, urlTw: e.target.value })}
                        className="w-full p-2 mt-1 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-terminal-gray">English</label>
                      <input
                        type="text"
                        value={editingTopAd.textEn}
                        onChange={(e) => setEditingTopAd({ ...editingTopAd, textEn: e.target.value })}
                        className="w-full p-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editingTopAd.urlEn}
                        onChange={(e) => setEditingTopAd({ ...editingTopAd, urlEn: e.target.value })}
                        className="w-full p-2 mt-1 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateTopAd}
                      className="px-4 py-1 bg-terminal-green text-white rounded hover:opacity-80 text-sm"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingTopAd(null)}
                      className="px-4 py-1 bg-terminal-gray text-white rounded hover:opacity-80 text-sm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                // 显示模式
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-terminal-gray">简体中文</p>
                      <p className="font-medium text-terminal-fg">{ad.text?.zh}</p>
                      <p className="text-sm text-terminal-cyan">{ad.url?.zh}</p>
                    </div>
                    <div>
                      <p className="text-xs text-terminal-gray">繁体中文</p>
                      <p className="font-medium text-terminal-fg">{ad.text?.tw || '-'}</p>
                      <p className="text-sm text-terminal-cyan">{ad.url?.tw || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-terminal-gray">English</p>
                      <p className="font-medium text-terminal-fg">{ad.text?.en || '-'}</p>
                      <p className="text-sm text-terminal-cyan">{ad.url?.en || '-'}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => setEditingTopAd({
                        id: ad.id,
                        textZh: ad.text.zh,
                        textTw: ad.text.tw,
                        textEn: ad.text.en,
                        urlZh: ad.url.zh,
                        urlTw: ad.url.tw,
                        urlEn: ad.url.en
                      })}
                      className="px-3 py-1 bg-terminal-yellow text-black rounded hover:opacity-80 text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={async () => {
                        removeTopAd(ad.id);
                        await saveToServer();
                      }}
                      className="px-3 py-1 bg-terminal-red text-white rounded hover:opacity-80 text-sm"
                    >
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {topAds.length === 0 && (
            <div className="text-center text-terminal-gray py-8">
              暂无顶部广告，点击上方添加新广告
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-terminal-fg mb-4">轮播广告（多语言）</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">简体中文 *</label>
              <input
                type="text"
                value={newAd.textZh}
                onChange={(e) => setNewAd({ ...newAd, textZh: e.target.value })}
                className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="广告文字"
              />
              <input
                type="text"
                value={newAd.urlZh}
                onChange={(e) => setNewAd({ ...newAd, urlZh: e.target.value })}
                className="w-full p-3 mt-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="跳转链接"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">繁体中文</label>
              <input
                type="text"
                value={newAd.textTw}
                onChange={(e) => setNewAd({ ...newAd, textTw: e.target.value })}
                className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="廣告文字"
              />
              <input
                type="text"
                value={newAd.urlTw}
                onChange={(e) => setNewAd({ ...newAd, urlTw: e.target.value })}
                className="w-full p-3 mt-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="跳轉鏈接"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">English</label>
              <input
                type="text"
                value={newAd.textEn}
                onChange={(e) => setNewAd({ ...newAd, textEn: e.target.value })}
                className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="Ad Text"
              />
              <input
                type="text"
                value={newAd.urlEn}
                onChange={(e) => setNewAd({ ...newAd, urlEn: e.target.value })}
                className="w-full p-3 mt-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="Jump Link"
              />
            </div>
          </div>
          <button
            onClick={handleAddAd}
            className="px-6 py-2 bg-terminal-green text-white rounded hover:opacity-80"
          >
            添加广告
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <h4 className="text-md font-medium text-terminal-cyan">现有轮播广告 ({rotatingAds.length})</h4>
          {rotatingAds.map((ad) => (
            <div key={ad.id} className="p-4 bg-terminal-header-bg border border-terminal-border rounded">
              {editingRotatingAd && editingRotatingAd.id === ad.id ? (
                // 编辑模式
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-terminal-gray">简体中文</label>
                      <input
                        type="text"
                        value={editingRotatingAd.textZh}
                        onChange={(e) => setEditingRotatingAd({ ...editingRotatingAd, textZh: e.target.value })}
                        className="w-full p-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editingRotatingAd.urlZh}
                        onChange={(e) => setEditingRotatingAd({ ...editingRotatingAd, urlZh: e.target.value })}
                        className="w-full p-2 mt-1 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-terminal-gray">繁体中文</label>
                      <input
                        type="text"
                        value={editingRotatingAd.textTw}
                        onChange={(e) => setEditingRotatingAd({ ...editingRotatingAd, textTw: e.target.value })}
                        className="w-full p-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editingRotatingAd.urlTw}
                        onChange={(e) => setEditingRotatingAd({ ...editingRotatingAd, urlTw: e.target.value })}
                        className="w-full p-2 mt-1 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-terminal-gray">English</label>
                      <input
                        type="text"
                        value={editingRotatingAd.textEn}
                        onChange={(e) => setEditingRotatingAd({ ...editingRotatingAd, textEn: e.target.value })}
                        className="w-full p-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editingRotatingAd.urlEn}
                        onChange={(e) => setEditingRotatingAd({ ...editingRotatingAd, urlEn: e.target.value })}
                        className="w-full p-2 mt-1 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateRotatingAd}
                      className="px-4 py-1 bg-terminal-green text-white rounded hover:opacity-80 text-sm"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingRotatingAd(null)}
                      className="px-4 py-1 bg-terminal-gray text-white rounded hover:opacity-80 text-sm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                // 显示模式
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-terminal-gray">简体中文</p>
                      <p className="font-medium text-terminal-fg">{ad.text?.zh}</p>
                      <p className="text-sm text-terminal-cyan">{ad.url?.zh}</p>
                    </div>
                    <div>
                      <p className="text-xs text-terminal-gray">繁体中文</p>
                      <p className="font-medium text-terminal-fg">{ad.text?.tw || '-'}</p>
                      <p className="text-sm text-terminal-cyan">{ad.url?.tw || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-terminal-gray">English</p>
                      <p className="font-medium text-terminal-fg">{ad.text?.en || '-'}</p>
                      <p className="text-sm text-terminal-cyan">{ad.url?.en || '-'}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => setEditingRotatingAd({
                        id: ad.id,
                        textZh: ad.text.zh,
                        textTw: ad.text.tw,
                        textEn: ad.text.en,
                        urlZh: ad.url.zh,
                        urlTw: ad.url.tw,
                        urlEn: ad.url.en
                      })}
                      className="px-3 py-1 bg-terminal-yellow text-black rounded hover:opacity-80 text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={async () => {
                        removeRotatingAd(ad.id);
                        await saveToServer();
                      }}
                      className="px-3 py-1 bg-terminal-red text-white rounded hover:opacity-80 text-sm"
                    >
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {rotatingAds.length === 0 && (
            <div className="text-center text-terminal-gray py-8">
              暂无轮播广告，点击上方添加新广告
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 线路管理模块
function RoutesModule({ showToast }: { showToast: (message: string, type: 'success' | 'error' | 'info') => void }) {
  const { routeConfig, updateDomesticRoutes, updateInternationalRoutes } = useMonitorStore();
  const [activeRouteTab, setActiveRouteTab] = useState('domestic');
  const [newDomain, setNewDomain] = useState('');

  const currentRoutes = activeRouteTab === 'domestic' ? routeConfig.domestic : routeConfig.international;
  const updateRoutes = activeRouteTab === 'domestic' ? updateDomesticRoutes : updateInternationalRoutes;

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    updateRoutes([...currentRoutes, newDomain.trim()]);
    setNewDomain('');
  };

  const handleRemoveDomain = (domain: string) => {
    updateRoutes(currentRoutes.filter(d => d !== domain));
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveRouteTab('domestic')}
          className={`px-4 py-2 rounded ${
            activeRouteTab === 'domestic'
              ? 'bg-terminal-green text-white'
              : 'bg-terminal-button-bg text-terminal-gray border border-terminal-border'
          }`}
        >
          国内线路 ({routeConfig.domestic.length})
        </button>
        <button
          onClick={() => setActiveRouteTab('international')}
          className={`px-4 py-2 rounded ${
            activeRouteTab === 'international'
              ? 'bg-terminal-green text-white'
              : 'bg-terminal-button-bg text-terminal-gray border border-terminal-border'
          }`}
        >
          国际线路 ({routeConfig.international.length})
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
          className="flex-1 p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
          placeholder="输入域名，如: baidu.com"
        />
        <button
          onClick={handleAddDomain}
          className="px-6 py-3 bg-terminal-green text-white rounded hover:opacity-80"
        >
          添加
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {currentRoutes.map((domain, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-terminal-header-bg border border-terminal-border rounded">
            <span className="text-terminal-fg">{domain}</span>
            <button
              onClick={() => handleRemoveDomain(domain)}
              className="px-2 py-1 bg-terminal-red text-white rounded hover:opacity-80 text-sm"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 友情链接模块
function LinksModule({ showToast }: { showToast: (message: string, type: 'success' | 'error' | 'info') => void }) {
  const { friendLinks, addFriendLink, removeFriendLink } = useMonitorStore();
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('links');

  // 加载申请数据
  const loadApplications = async () => {
    try {
      const response = await fetch('/api/apply-link');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  // 组件加载时获取申请数据
  useEffect(() => {
    loadApplications();
  }, []);

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) {
      showToast('请填写链接名称和地址', 'error');
      return;
    }
    addFriendLink({ ...newLink, id: Date.now().toString() });
    setNewLink({ title: '', url: '' });
    showToast('友链已添加', 'success');
  };

  // 审核申请
  const handleReviewApplication = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/apply-link', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });

      if (response.ok) {
        if (action === 'approve') {
          // 找到被批准的申请
          const approvedApp = applications.find(app => app.id === id);
          if (approvedApp) {
            // 自动添加到友情链接
            addFriendLink({
              id: approvedApp.id,
              title: approvedApp.siteName,
              url: approvedApp.siteUrl
            });
          }
        }

        showToast(`申请已${action === 'approve' ? '通过' : '拒绝'}`, 'success');
        loadApplications(); // 重新加载申请列表
      } else {
        showToast('操作失败', 'error');
      }
    } catch (error) {
      showToast('操作失败', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 标签页导航 */}
      <div className="flex space-x-1 bg-terminal-header-bg p-1 rounded-lg border border-terminal-border">
        <button
          onClick={() => setActiveTab('links')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'links'
              ? 'bg-terminal-button-bg text-terminal-fg border border-terminal-green'
              : 'text-terminal-gray hover:text-terminal-fg'
          }`}
        >
          友情链接管理 ({friendLinks.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'applications'
              ? 'bg-terminal-button-bg text-terminal-fg border border-terminal-green'
              : 'text-terminal-gray hover:text-terminal-fg'
          }`}
        >
          申请审核 ({applications.length})
        </button>
      </div>

      {/* 友情链接管理 */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              className="p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
              placeholder="链接名称"
            />
            <input
              type="text"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
              placeholder="链接地址"
            />
          </div>
          <button
            onClick={handleAddLink}
            className="px-6 py-2 bg-terminal-green text-white rounded hover:opacity-80"
          >
            添加友链
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friendLinks.map((link) => (
              <div key={link.id} className="p-4 bg-terminal-header-bg border border-terminal-border rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-terminal-fg">{link.title}</h4>
                    <p className="text-sm text-terminal-cyan">{link.url}</p>
                  </div>
                  <button
                    onClick={() => removeFriendLink(link.id)}
                    className="ml-2 px-2 py-1 bg-terminal-red text-white rounded hover:opacity-80 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 申请审核 */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center text-terminal-gray py-8">
              暂无友情链接申请
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="p-4 bg-terminal-header-bg border border-terminal-border rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-terminal-gray">网站名称:</span>
                      <p className="font-medium text-terminal-fg">{app.siteName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-terminal-gray">网站地址:</span>
                      <p className="text-sm text-terminal-cyan break-all">{app.siteUrl}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-terminal-gray">申请语言:</span>
                      <p className="text-sm text-terminal-fg">{app.language === 'zh' ? '简体中文' : app.language === 'tw' ? '繁体中文' : '英文'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-terminal-gray">申请时间:</span>
                      <p className="text-sm text-terminal-fg">{new Date(app.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleReviewApplication(app.id, 'approve')}
                    className="px-4 py-2 bg-terminal-green text-white rounded hover:opacity-80 text-sm"
                  >
                    通过
                  </button>
                  <button
                    onClick={() => handleReviewApplication(app.id, 'reject')}
                    className="px-4 py-2 bg-terminal-red text-white rounded hover:opacity-80 text-sm"
                  >
                    拒绝
                  </button>
                  <button
                    onClick={() => window.open(app.siteUrl, '_blank')}
                    className="px-4 py-2 bg-terminal-cyan text-white rounded hover:opacity-80 text-sm"
                  >
                    访问网站
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// SEO设置模块
function SeoModule({ showToast }: { showToast: (message: string, type: 'success' | 'error' | 'info') => void }) {
  const { seoConfig, setSeoConfig } = useMonitorStore();
  const [seo, setSeo] = useState(seoConfig);

  const handleSave = () => {
    setSeoConfig(seo);
    showToast('SEO设置已保存', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-terminal-header-bg border border-terminal-yellow rounded p-4 mb-6">
        <h4 className="font-medium text-terminal-yellow mb-2">SEO多语言路径配置</h4>
        <p className="text-sm text-terminal-yellow">
          路径结构：ping234.com/cn/ (简体中文) | ping234.com/tw/ (繁体中文) | ping234.com/en/ (英语)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 简体中文 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-terminal-fg border-b border-terminal-border pb-2">简体中文 (/cn/)</h3>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">网站标题</label>
            <input
              type="text"
              value={seo.zh.title}
              onChange={(e) => setSeo({ ...seo, zh: { ...seo.zh, title: e.target.value } })}
              className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">网站描述</label>
            <textarea
              value={seo.zh.description}
              onChange={(e) => setSeo({ ...seo, zh: { ...seo.zh, description: e.target.value } })}
              className="w-full p-3 h-24 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">关键词</label>
            <input
              type="text"
              value={seo.zh.keywords}
              onChange={(e) => setSeo({ ...seo, zh: { ...seo.zh, keywords: e.target.value } })}
              className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
        </div>

        {/* 繁体中文 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-terminal-fg border-b border-terminal-border pb-2">繁體中文 (/tw/)</h3>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">網站標題</label>
            <input
              type="text"
              value={seo.tw.title}
              onChange={(e) => setSeo({ ...seo, tw: { ...seo.tw, title: e.target.value } })}
              className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">網站描述</label>
            <textarea
              value={seo.tw.description}
              onChange={(e) => setSeo({ ...seo, tw: { ...seo.tw, description: e.target.value } })}
              className="w-full p-3 h-24 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">關鍵詞</label>
            <input
              type="text"
              value={seo.tw.keywords}
              onChange={(e) => setSeo({ ...seo, tw: { ...seo.tw, keywords: e.target.value } })}
              className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
        </div>

        {/* 英文 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-terminal-fg border-b border-terminal-border pb-2">English (/en/)</h3>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">Site Title</label>
            <input
              type="text"
              value={seo.en.title}
              onChange={(e) => setSeo({ ...seo, en: { ...seo.en, title: e.target.value } })}
              className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">Site Description</label>
            <textarea
              value={seo.en.description}
              onChange={(e) => setSeo({ ...seo, en: { ...seo.en, description: e.target.value } })}
              className="w-full p-3 h-24 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">Keywords</label>
            <input
              type="text"
              value={seo.en.keywords}
              onChange={(e) => setSeo({ ...seo, en: { ...seo.en, keywords: e.target.value } })}
              className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-terminal-fg mb-2">作者</label>
            <input
              type="text"
              value={seo.author}
              onChange={(e) => setSeo({ ...seo, author: e.target.value })}
              className="p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
            />
          </div>
          <div className="pt-6">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-terminal-green text-white rounded hover:opacity-80"
            >
              保存所有设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}