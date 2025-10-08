'use client';

import { useState, useEffect, useRef } from 'react';
import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import MarqueeNotice from '@/components/MarqueeNotice';
import Navigation from '@/components/Navigation';
import Terminal from '@/components/Terminal';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import {
  Shield, AlertTriangle, CheckCircle, XCircle,
  Globe, Server, Wifi, Video, Mic, Eye, EyeOff,
  MapPin, Network, Activity, Locate
} from 'lucide-react';

interface IPInfo {
  ip: string;
  country?: string;
  city?: string;
  region?: string;
  asn?: string;
  org?: string;
  type?: string;
}

interface WebRTCResult {
  server: string;
  localIPs: string[];
  publicIPs: string[];
  status: 'success' | 'disabled' | 'testing';
  sdpLog?: string;
}

interface MediaPermission {
  audio: 'prompt' | 'granted' | 'denied' | 'unsupported';
  video: 'prompt' | 'granted' | 'denied' | 'unsupported';
}

export default function IPLeakPage() {
  const { language } = useMonitorStore();
  const t = getTranslation(language);

  const [detecting, setDetecting] = useState(false);
  const [detectionComplete, setDetectionComplete] = useState(false);
  const [currentIP, setCurrentIP] = useState<IPInfo | null>(null);
  const [webrtcIP, setWebrtcIP] = useState<IPInfo | null>(null);
  const [webrtcResults, setWebrtcResults] = useState<WebRTCResult[]>([]);
  const [mediaPermissions, setMediaPermissions] = useState<MediaPermission>({
    audio: 'prompt',
    video: 'prompt'
  });
  const [isLeaked, setIsLeaked] = useState(false);

  // STUN服务器列表 - 7个线路（3个Google + 1个Cloudflare + 3个其他可靠线路）
  const stunServers = [
    // 谷歌STUN服务器（3个不同线路）
    { name: 'Google 1', url: 'stun:stun.l.google.com:19302' },
    { name: 'Google 2', url: 'stun:stun1.l.google.com:19302' },
    { name: 'Google 3', url: 'stun:stun2.l.google.com:19302' },

    // Cloudflare（1个）
    { name: 'Cloudflare', url: 'stun:stun.cloudflare.com:3478' },

    // 其他可靠的STUN服务器（3个）
    { name: 'Twilio', url: 'stun:global.stun.twilio.com:3478' },
    { name: 'Ekiga', url: 'stun:stun.ekiga.net:3478' },
    { name: 'Voipbuster', url: 'stun:stun.voipbuster.com:3478' }
  ];

  // 获取当前IP
  const fetchCurrentIP = async () => {
    try {
      const response = await fetch('/api/ip-leak-query');
      const data = await response.json();
      setCurrentIP({
        ip: data.ip,
        country: data.country,
        city: data.city,
        region: data.region,
        asn: data.asn?.asn,
        org: data.asn?.name,
        type: data.type
      });
    } catch (error) {
      console.error('Failed to fetch current IP:', error);
    }
  };

  // WebRTC检测
  const testWebRTC = async (stunServer: { name: string; url: string }) => {
    return new Promise<WebRTCResult>((resolve) => {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: stunServer.url }]
        });

        const localIPs = new Set<string>();
        const publicIPs = new Set<string>();
        let sdpLog = '';

        pc.createDataChannel('');

        pc.onicecandidate = (event) => {
          if (!event.candidate) {
            pc.close();
            resolve({
              server: stunServer.name,
              localIPs: Array.from(localIPs),
              publicIPs: Array.from(publicIPs),
              status: 'success',
              sdpLog
            });
            return;
          }

          const candidate = event.candidate.candidate;
          sdpLog += candidate + '\n';

          // 提取IP地址
          const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
          const match = candidate.match(ipRegex);

          if (match) {
            const ip = match[0];
            // 判断是否为内网IP
            if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')) {
              localIPs.add(ip);
            } else if (!ip.startsWith('0.') && ip !== '0.0.0.0') {
              publicIPs.add(ip);
            }
          }
        };

        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(() => {
            pc.close();
            resolve({
              server: stunServer.name,
              localIPs: [],
              publicIPs: [],
              status: 'disabled'
            });
          });

        // 超时处理
        setTimeout(() => {
          pc.close();
          resolve({
            server: stunServer.name,
            localIPs: Array.from(localIPs),
            publicIPs: Array.from(publicIPs),
            status: publicIPs.size > 0 ? 'success' : 'disabled',
            sdpLog
          });
        }, 5000);

      } catch (error) {
        resolve({
          server: stunServer.name,
          localIPs: [],
          publicIPs: [],
          status: 'disabled'
        });
      }
    });
  };

  // 检测媒体设备权限
  const checkMediaPermissions = async () => {
    try {
      // 检查音频权限
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getTracks().forEach(track => track.stop());
      setMediaPermissions(prev => ({ ...prev, audio: 'granted' }));
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        setMediaPermissions(prev => ({ ...prev, audio: 'denied' }));
      } else {
        setMediaPermissions(prev => ({ ...prev, audio: 'unsupported' }));
      }
    }

    try {
      // 检查视频权限
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStream.getTracks().forEach(track => track.stop());
      setMediaPermissions(prev => ({ ...prev, video: 'granted' }));
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        setMediaPermissions(prev => ({ ...prev, video: 'denied' }));
      } else {
        setMediaPermissions(prev => ({ ...prev, video: 'unsupported' }));
      }
    }
  };

  // 开始检测
  const startDetection = async () => {
    setDetecting(true);
    setDetectionComplete(false);
    setWebrtcResults([]);
    setWebrtcIP(null);
    setIsLeaked(false);

    // 获取当前IP
    const currentIPData = await fetchCurrentIP();

    // WebRTC并发检测 - 所有STUN服务器同时检测
    let detectedWebRTCIP: IPInfo | null = null;

    const testPromises = stunServers.map(server => testWebRTC(server));
    const results = await Promise.all(testPromises);

    setWebrtcResults(results);

    // 提取WebRTC检测到的公网IP
    for (const result of results) {
      if (result.publicIPs.length > 0 && !detectedWebRTCIP) {
        detectedWebRTCIP = {
          ip: result.publicIPs[0],
          type: 'WebRTC Detected'
        };
        break;
      }
    }

    // 检测媒体设备权限
    await checkMediaPermissions();

    // 所有检测完成后，统一设置最终结果
    if (detectedWebRTCIP) {
      setWebrtcIP(detectedWebRTCIP);
    }

    setDetecting(false);
    setDetectionComplete(true);
  };

  // 检查是否泄露
  useEffect(() => {
    if (currentIP && webrtcIP) {
      setIsLeaked(currentIP.ip !== webrtcIP.ip);
    }
  }, [currentIP, webrtcIP]);

  const InfoCard = ({
    title,
    icon: Icon,
    children,
    className = ''
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`bg-terminal-button-bg/50 border border-terminal-border rounded-lg overflow-hidden transition-all hover:bg-terminal-button-hover-bg/50 ${className}`}>
      <div className="px-5 py-3 border-b border-terminal-border bg-terminal-header-bg/30">
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5 text-terminal-green" />
          <h3 className="text-base font-semibold text-terminal-cyan">
            {title}
          </h3>
        </div>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'granted': return <CheckCircle className="w-4 h-4 text-terminal-green" />;
      case 'denied': return <XCircle className="w-4 h-4 text-terminal-red" />;
      case 'prompt': return <AlertTriangle className="w-4 h-4 text-terminal-yellow" />;
      default: return <XCircle className="w-4 h-4 text-terminal-gray" />;
    }
  };

  const getPermissionText = (permission: string) => {
    switch (permission) {
      case 'granted': return t.granted;
      case 'denied': return t.denied;
      case 'prompt': return t.prompt;
      default: return t.notSupported;
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg">
      <MarqueeNotice />

      <div className="p-4 md:p-8">
        <Navigation />

        <Terminal title={`${t.ipLeakTitle} - ping234.com`}>
          <AdBanner />

          {/* 页面标题 */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-terminal-green">
              {t.ipLeakTitle}
            </h1>
            <p className="text-sm md:text-base text-terminal-gray">
              {t.ipLeakSubtitle}
            </p>
          </div>

          {/* 检测我的IP按钮 */}
          <div className="flex justify-center mb-6">
            <button
              onClick={startDetection}
              disabled={detecting}
              className="terminal-button text-terminal-cyan flex items-center gap-2 disabled:opacity-50"
            >
              {detecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin"></div>
                  {t.detecting}
                </>
              ) : (
                <>
                  <Locate className="w-4 h-4" />
                  {t.detectMyIp}
                </>
              )}
            </button>
          </div>

          {/* 检测结果概览 - 只在检测完成后显示 */}
          {currentIP && detectionComplete && (
            <div className={`mb-6 p-6 rounded-lg border-2 ${
              isLeaked
                ? 'bg-terminal-red/10 border-terminal-red'
                : 'bg-terminal-green/10 border-terminal-green'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                {isLeaked ? (
                  <XCircle className="w-12 h-12 text-terminal-red flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-12 h-12 text-terminal-green flex-shrink-0" />
                )}
                <div>
                  <h2 className={`text-xl font-bold mb-1 ${
                    isLeaked ? 'text-terminal-red' : 'text-terminal-green'
                  }`}>
                    {isLeaked ? t.ipLeaked : t.ipNotLeaked}
                  </h2>
                  <p className="text-sm text-terminal-gray">
                    {isLeaked ? t.warningLeaked : t.congratsNoLeak}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 当前IP信息 */}
          {currentIP && (
            <InfoCard title={t.yourCurrentIp} icon={Globe} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-terminal-gray" />
                  <div>
                    <div className="text-xs text-terminal-gray">{t.ipAddress}</div>
                    <div className="text-lg font-bold text-terminal-green">{currentIP.ip}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-terminal-gray" />
                  <div>
                    <div className="text-xs text-terminal-gray">{t.location}</div>
                    <div className="text-sm font-semibold text-terminal-cyan">
                      {currentIP.country} {currentIP.city}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-terminal-gray" />
                  <div>
                    <div className="text-xs text-terminal-gray">{t.asn}</div>
                    <div className="text-sm font-semibold text-terminal-fg">{currentIP.asn}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Network className="w-5 h-5 text-terminal-gray" />
                  <div>
                    <div className="text-xs text-terminal-gray">{t.organization}</div>
                    <div className="text-sm font-semibold text-terminal-fg">{currentIP.org}</div>
                  </div>
                </div>
              </div>
            </InfoCard>
          )}

          {/* WebRTC泄露测试 */}
          {webrtcResults.length > 0 && (
            <InfoCard title={t.webrtcLeakTest} icon={Wifi} className="mb-6">
              <div className="space-y-4">
                {/* WebRTC说明 */}
                <div className="p-4 bg-terminal-yellow/10 border border-terminal-yellow/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-terminal-yellow flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-terminal-fg">
                      <p className="font-semibold mb-1">{t.webrtcWarning}</p>
                      <p className="text-terminal-gray">{t.webrtcDescription}</p>
                    </div>
                  </div>
                </div>

                {/* WebRTC测试结果 */}
                <div className="space-y-3">
                  {webrtcResults.map((result, index) => (
                    <div key={index} className="p-4 bg-terminal-button-bg rounded-lg border border-terminal-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-terminal-cyan" />
                          <span className="font-semibold text-terminal-cyan">{result.server}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          result.status === 'success'
                            ? 'bg-terminal-green/20 text-terminal-green'
                            : 'bg-terminal-gray/20 text-terminal-gray'
                        }`}>
                          {result.status === 'success' ? t.leaked : t.disabled}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-terminal-gray mb-1">{t.localIp}:</div>
                          <div className="font-mono text-terminal-fg">
                            {result.localIPs.length > 0 ? result.localIPs.join(', ') : '-'}
                          </div>
                        </div>
                        <div>
                          <div className="text-terminal-gray mb-1">{t.publicIp}:</div>
                          <div className="font-mono text-terminal-green font-bold">
                            {result.publicIPs.length > 0 ? result.publicIPs.join(', ') : t.disabled}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </InfoCard>
          )}

          {/* 媒体设备权限 */}
          {(mediaPermissions.audio !== 'prompt' || mediaPermissions.video !== 'prompt') && (
            <InfoCard title={t.mediaDeviceTest} icon={Video} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-terminal-button-bg rounded-lg border border-terminal-border">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-terminal-cyan" />
                    <span className="font-semibold text-terminal-fg">{t.audioPermission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPermissionIcon(mediaPermissions.audio)}
                    <span className="text-sm font-semibold text-terminal-fg">
                      {getPermissionText(mediaPermissions.audio)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-terminal-button-bg rounded-lg border border-terminal-border">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-terminal-cyan" />
                    <span className="font-semibold text-terminal-fg">{t.videoPermission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPermissionIcon(mediaPermissions.video)}
                    <span className="text-sm font-semibold text-terminal-fg">
                      {getPermissionText(mediaPermissions.video)}
                    </span>
                  </div>
                </div>
              </div>
            </InfoCard>
          )}

          {/* 如何禁用WebRTC */}
          {webrtcResults.some(r => r.status === 'success') && (
            <InfoCard title={t.howToDisableWebrtc} icon={Eye} className="mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-terminal-cyan mb-2">{t.disableInFirefox}:</h4>
                  <p className="text-sm text-terminal-gray">{t.firefoxSteps}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-terminal-cyan mb-2">{t.disableInChrome}:</h4>
                  <p className="text-sm text-terminal-gray">{t.chromeSteps}</p>
                </div>
              </div>
            </InfoCard>
          )}

          {/* 底部信息 */}
          <Footer />
        </Terminal>
      </div>
    </div>
  );
}
