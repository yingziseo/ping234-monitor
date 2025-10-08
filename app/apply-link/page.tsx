'use client';

import { useState, useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import Terminal from '@/components/Terminal';
import Toast from '@/components/Toast';
import MarqueeNotice from '@/components/MarqueeNotice';
import Navigation from '@/components/Navigation';

export default function ApplyLinkPage() {
  const { language, theme } = useMonitorStore();
  const t = getTranslation(language);

  const [formData, setFormData] = useState({
    siteName: '',
    siteUrl: '',
    backLinkAdded: false,
    captcha: ''
  });

  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'; isVisible: boolean}>({
    message: '', type: 'info', isVisible: false
  });

  const [captchaQuestion, setCaptchaQuestion] = useState<{a: number; b: number; answer: number}>({
    a: 0, b: 0, answer: 0
  });

  const [mounted, setMounted] = useState(false);

  // 防止水合错误，在客户端挂载后生成验证码
  useEffect(() => {
    setMounted(true);
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ a, b, answer: a + b });
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    if (!formData.siteName || !formData.siteUrl) {
      showToast(
        language === 'en' ? 'Please fill in complete website information' :
        language === 'tw' ? '請填寫完整的網站資訊' :
        '请填写完整的网站信息', 'error');
      return;
    }

    if (formData.siteName.length > 20) {
      showToast(
        language === 'en' ? 'Site name cannot exceed 20 characters' :
        language === 'tw' ? '網站名稱不能超過20個字符' :
        '网站名称不能超过20个字符', 'error');
      return;
    }

    if (!formData.backLinkAdded) {
      showToast(
        language === 'en' ? 'Please add our friend link first' :
        language === 'tw' ? '請先添加我們的友情連結' :
        '请先添加我们的友情链接', 'error');
      return;
    }

    if (!mounted || parseInt(formData.captcha) !== captchaQuestion.answer) {
      showToast(
        language === 'en' ? 'Captcha error' :
        language === 'tw' ? '驗證碼錯誤' :
        '验证码错误', 'error');
      return;
    }

    try {
      const response = await fetch('/api/apply-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteName: formData.siteName,
          siteUrl: formData.siteUrl,
          language: language,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        showToast(
          language === 'en'
            ? 'Application submitted, we will review within 24 hours'
            : '申请已提交，我们将在24小时内审核',
          'success'
        );
        setFormData({ siteName: '', siteUrl: '', backLinkAdded: false, captcha: '' });
        // 重新生成验证码
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        setCaptchaQuestion({ a, b, answer: a + b });
      } else {
        showToast(
          language === 'en' ? 'Submission failed, please try again later' :
          language === 'tw' ? '提交失敗，請稍後重試' :
          '提交失败，请稍后重试',
          'error'
        );
      }
    } catch (error) {
      showToast(
        language === 'en' ? 'Submission failed, please try again later' :
        language === 'tw' ? '提交失敗，請稍後重試' :
        '提交失败，请稍后重试', 'error');
    }
  };

  const getOurLink = () => {
    const baseUrl = 'https://www.ping234.com';
    switch (language) {
      case 'tw': return `${baseUrl}/tw/`;
      case 'en': return `${baseUrl}/en/`;
      default: return `${baseUrl}/cn/`;
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg">
      {/* 走马灯通知 */}
      <MarqueeNotice />

      <div className="p-4">
        {/* 导航栏 */}
        <Navigation />

      <Terminal title={`${t.friendLinkApplication} - ping234.com`}>
        <div className="space-y-6">
          {/* 页面标题 */}
          <div className="text-center space-y-3">
            <h1 className="text-xl md:text-2xl text-terminal-green font-bold">
              {t.friendLinkApplication}
            </h1>
            <p className="text-terminal-gray text-sm">
              {t.welcomeMessage}
            </p>
          </div>

          {/* 申请须知 */}
          <div className="bg-terminal-header-bg border border-terminal-border rounded p-4">
            <h3 className="text-terminal-yellow mb-3">{t.applicationRequirements}</h3>
            <ul className="text-sm space-y-2 text-terminal-fg">
              <li>• {t.req1}</li>
              <li>• {t.req2}</li>
              <li>• {t.req3}</li>
              <li>• {t.req4}</li>
              <li>• {t.req5}</li>
            </ul>
          </div>

          {/* 第一步：添加我们的链接 */}
          <div className="space-y-4">
            <h3 className="text-terminal-cyan">{t.step1}</h3>
            <div className="bg-terminal-button-bg border border-terminal-border rounded p-4">
              <div className="space-y-4">
                <div>
                  <span className="text-terminal-gray">{t.siteName}：</span>
                  <span className="text-terminal-fg">ping234{language === 'en' ? ' Network Detection' : '网络检测'}</span>
                </div>
                <div>
                  <span className="text-terminal-gray">{t.siteAddress}：</span>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-terminal-cyan">简体中文：</span>
                      <span className="text-terminal-fg text-sm">https://www.ping234.com/cn/</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-terminal-cyan">繁體中文：</span>
                      <span className="text-terminal-fg text-sm">https://www.ping234.com/tw/</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-terminal-cyan">English：</span>
                      <span className="text-terminal-fg text-sm">https://www.ping234.com/en/</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 申请表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-terminal-cyan">{t.step2}</h3>

            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">
                {t.yourSiteName} <span className="text-terminal-red">*</span>
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder={language === 'en' ? 'Enter site name (max 20 characters)' : `请输入网站名称（不超过20字符）`}
                maxLength={20}
              />
              <div className="text-xs text-terminal-gray mt-1">
                {formData.siteName.length}/20 {language === 'en' ? 'characters' : '字符'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">
                {t.yourSiteUrl} <span className="text-terminal-red">*</span>
              </label>
              <input
                type="url"
                value={formData.siteUrl}
                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                className="w-full p-3 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.backLinkAdded}
                  onChange={(e) => setFormData({ ...formData, backLinkAdded: e.target.checked })}
                  className="rounded border-terminal-border"
                />
                <span className="text-sm text-terminal-fg">
                  {t.confirmBacklink} <span className="text-terminal-red">*</span>
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-terminal-fg">
                {t.captcha} <span className="text-terminal-red">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="bg-terminal-header-bg border border-terminal-border rounded px-4 py-2 text-terminal-cyan">
                  {mounted ? `${captchaQuestion.a} + ${captchaQuestion.b} = ?` : '- + - = ?'}
                </div>
                <input
                  type="number"
                  value={formData.captcha}
                  onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                  className="w-24 p-2 border border-terminal-border bg-terminal-button-bg text-terminal-fg rounded"
                  placeholder={t.captchaAnswer}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="terminal-button px-6 py-3 text-terminal-green border-terminal-green hover:bg-terminal-green/10"
              >
                {t.submitApplication}
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="terminal-button px-6 py-3 text-terminal-cyan border-terminal-cyan hover:bg-terminal-fg/10"
              >
                {t.backToHome}
              </button>
            </div>
          </form>

        </div>
      </Terminal>

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </div>
  );
}