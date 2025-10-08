'use client';

import { useState, useEffect } from 'react';
import { useMonitorStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import MarqueeNotice from '@/components/MarqueeNotice';
import Navigation from '@/components/Navigation';
import Terminal from '@/components/Terminal';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import {
  Globe, MapPin, Building2, Shield, Search, Locate,
  AlertTriangle, Skull, Ban, Network, Shuffle, Eye,
  Clock, Phone, Coins, Languages, Map, Flag,
  Hash, Server, Route, Wifi, CheckCircle, XCircle,
  TrendingUp, Activity, Info
} from 'lucide-react';

// 动态导入地图组件，避免SSR问题
const MapComponent = dynamic(() => import('@/components/IPMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600">加载地图中...</span>
      </div>
    </div>
  )
});

interface IPData {
  ip: string;
  city?: string;
  region?: string;
  region_code?: string;
  country_name?: string;
  country_code?: string;
  continent_name?: string;
  continent_code?: string;
  latitude?: number;
  longitude?: number;
  postal?: string;
  calling_code?: string;
  flag?: string;
  emoji_flag?: string;
  asn?: {
    asn?: string;
    name?: string;
    domain?: string;
    route?: string;
    type?: string;
  };
  languages?: Array<{
    name?: string;
    native?: string;
  }>;
  currency?: {
    name?: string;
    code?: string;
    symbol?: string;
  };
  time_zone?: {
    name?: string;
    abbr?: string;
    offset?: string;
    is_dst?: boolean;
    current_time?: string;
  };
  threat?: {
    is_tor?: boolean;
    is_proxy?: boolean;
    is_datacenter?: boolean;
    is_anonymous?: boolean;
    is_known_attacker?: boolean;
    is_known_abuser?: boolean;
    is_threat?: boolean;
    is_bogon?: boolean;
  };
  carrier?: {
    name?: string;
    mcc?: string;
    mnc?: string;
  };
  is_eu?: boolean;
}

export default function IPQueryPage() {
  const { language, theme } = useMonitorStore();
  const t = getTranslation(language);

  const [ipInput, setIpInput] = useState('');
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async (ip?: string) => {
    setLoading(true);
    setError('');

    try {
      const queryIp = ip || ipInput;
      const url = queryIp
        ? `/api/ip-query?ip=${encodeURIComponent(queryIp)}`
        : '/api/ip-query';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Query failed');
      }

      const data = await response.json();
      setIpData(data);
    } catch (err) {
      setError('查询失败，请检查IP地址格式');
      setIpData(null);
    } finally {
      setLoading(false);
    }
  };

  // 计算风险评分
  const calculateRiskScore = (threat: IPData['threat']): number => {
    if (!threat) return 0;
    let score = 0;
    if (threat.is_threat) score += 35;
    if (threat.is_known_attacker) score += 30;
    if (threat.is_known_abuser) score += 20;
    if (threat.is_tor) score += 10;
    if (threat.is_proxy) score += 8;
    if (threat.is_anonymous) score += 7;
    return Math.min(score, 100);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 50) return {
      level: t.highRisk,
      color: 'text-terminal-red',
      bgColor: 'bg-terminal-red/10',
      borderColor: 'border-terminal-red/30',
      iconColor: 'text-terminal-red'
    };
    if (score >= 20) return {
      level: t.mediumRisk,
      color: 'text-terminal-yellow',
      bgColor: 'bg-terminal-yellow/10',
      borderColor: 'border-terminal-yellow/30',
      iconColor: 'text-terminal-yellow'
    };
    return {
      level: t.safe,
      color: 'text-terminal-green',
      bgColor: 'bg-terminal-green/10',
      borderColor: 'border-terminal-green/30',
      iconColor: 'text-terminal-green'
    };
  };

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

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    highlight = false
  }: {
    icon?: any;
    label: string;
    value?: string | number | boolean | React.ReactNode;
    highlight?: boolean;
  }) => {
    if (value === undefined || value === null || value === '') return null;

    const displayValue = typeof value === 'boolean' ? (value ? '是' : '否') : value;

    return (
      <div className="flex items-center justify-between py-2.5 px-3 rounded-md transition-colors hover:bg-terminal-green/5">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-terminal-gray" />}
          <span className="text-sm font-medium text-terminal-gray">
            {label}
          </span>
        </div>
        <div className={`text-sm font-semibold ${highlight ? 'text-terminal-green' : 'text-terminal-fg'}`}>
          {displayValue}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg">
      <MarqueeNotice />

      <div className="p-4 md:p-8">
        <Navigation />

        <Terminal title={`${t.ipQueryTitle} - ping234.com`}>
          <AdBanner />

          {/* 页面标题 */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-terminal-green">
              {t.ipQueryTitle}
            </h1>
            <p className="text-sm md:text-base text-terminal-gray">
              {t.ipQuerySubtitle}
            </p>
          </div>

          {/* 查询输入区域 */}
          <div className="bg-terminal-button-bg border border-terminal-border rounded-lg p-5 mb-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-terminal-gray" />
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && handleQuery()}
                    placeholder={t.inputIpAddress}
                    className="w-full pl-12 pr-4 py-3 bg-terminal-bg border border-terminal-border text-terminal-fg placeholder-terminal-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-terminal-green/50 focus:border-terminal-green transition-all"
                  />
                </div>
                <button
                  onClick={() => handleQuery()}
                  disabled={loading}
                  className="terminal-button px-6 py-3 text-terminal-green border-terminal-green font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-terminal-green border-t-transparent rounded-full animate-spin"></div>
                      {t.queryingIp}
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      {t.queryIp}
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => handleQuery('')}
                  disabled={loading}
                  className="terminal-button text-terminal-cyan flex items-center gap-2 disabled:opacity-50"
                >
                  <Locate className="w-4 h-4" />
                  {t.queryYourIp}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-terminal-red/10 border border-terminal-red/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-terminal-red" />
                    <span className="font-medium text-terminal-red">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 查询结果 */}
          {ipData && (
            <div className="space-y-5">
              {/* IP概览 */}
              <div className="bg-terminal-green/10 border-2 border-terminal-green rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-terminal-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-terminal-green" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-terminal-gray mb-1">{t.ipAddress}</div>
                      <div className="text-xl font-bold text-terminal-green truncate">{ipData.ip}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-terminal-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {ipData.flag ? (
                        <img src={ipData.flag} alt="" className="w-8 h-6 object-cover rounded shadow" />
                      ) : (
                        <MapPin className="w-6 h-6 text-terminal-green" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-terminal-gray mb-1">{t.location}</div>
                      <div className="text-lg font-semibold text-terminal-cyan truncate">{ipData.country_name || '-'}</div>
                      <div className="text-sm text-terminal-gray truncate">{ipData.city || ''}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-terminal-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-terminal-green" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-terminal-gray mb-1">{t.networkType}</div>
                      <div className="text-lg font-semibold text-terminal-cyan truncate">
                        {ipData.asn?.type || t.unknown}
                      </div>
                      {ipData.threat?.is_datacenter !== undefined && (
                        <div className="text-sm text-terminal-gray truncate">
                          {ipData.threat.is_datacenter ? t.idcDatacenter : t.homeEnterprise}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      getRiskLevel(calculateRiskScore(ipData.threat)).bgColor
                    }`}>
                      <Shield className={`w-6 h-6 ${
                        getRiskLevel(calculateRiskScore(ipData.threat)).iconColor
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-terminal-gray mb-1">{t.securityScore}</div>
                      <div className={`text-xl font-bold ${
                        getRiskLevel(calculateRiskScore(ipData.threat)).color
                      }`}>
                        {100 - calculateRiskScore(ipData.threat)}/100
                      </div>
                      <div className={`text-sm ${
                        getRiskLevel(calculateRiskScore(ipData.threat)).color
                      }`}>
                        {getRiskLevel(calculateRiskScore(ipData.threat)).level}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 地图定位 */}
              {ipData.latitude && ipData.longitude && (
                <InfoCard title={t.geolocation} icon={Map}>
                  <div className="rounded-lg overflow-hidden border border-terminal-border">
                    <MapComponent
                      latitude={ipData.latitude}
                      longitude={ipData.longitude}
                      city={ipData.city}
                      country={ipData.country_name}
                    />
                  </div>
                </InfoCard>
              )}

            {/* 安全风险评估 */}
            {ipData.threat && (
              <InfoCard title={t.securityRiskAssessment} icon={Shield}>
                <div className="space-y-5">
                  {/* 风险评分 */}
                  <div className={`p-5 rounded-lg border-2 ${
                    getRiskLevel(calculateRiskScore(ipData.threat)).borderColor
                  } ${getRiskLevel(calculateRiskScore(ipData.threat)).bgColor}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm mb-1 text-terminal-gray">
                          {t.riskLevel}
                        </div>
                        <div className={`text-2xl font-bold ${getRiskLevel(calculateRiskScore(ipData.threat)).color}`}>
                          {getRiskLevel(calculateRiskScore(ipData.threat)).level}
                        </div>
                      </div>
                      <div className={getRiskLevel(calculateRiskScore(ipData.threat)).iconColor}>
                        {calculateRiskScore(ipData.threat) >= 50 ? (
                          <XCircle className="w-12 h-12" />
                        ) : calculateRiskScore(ipData.threat) >= 20 ? (
                          <AlertTriangle className="w-12 h-12" />
                        ) : (
                          <CheckCircle className="w-12 h-12" />
                        )}
                      </div>
                    </div>

                    {/* 风险评分条 */}
                    <div className="relative h-3 rounded-full overflow-hidden bg-terminal-button-bg">
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                          calculateRiskScore(ipData.threat) >= 50 ? 'bg-terminal-red' :
                          calculateRiskScore(ipData.threat) >= 20 ? 'bg-terminal-yellow' :
                          'bg-terminal-green'
                        }`}
                        style={{ width: `${calculateRiskScore(ipData.threat)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-2 text-terminal-gray">
                      <span>{t.safeLevel}</span>
                      <span className="font-semibold text-terminal-fg">{t.riskScore}: {calculateRiskScore(ipData.threat)}</span>
                      <span>{t.dangerLevel}</span>
                    </div>
                  </div>

                  {/* 详细检测项 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'is_threat', label: t.threatIp, icon: AlertTriangle, value: ipData.threat.is_threat },
                      { key: 'is_known_attacker', label: t.knownAttacker, icon: Skull, value: ipData.threat.is_known_attacker },
                      { key: 'is_known_abuser', label: t.knownAbuser, icon: Ban, value: ipData.threat.is_known_abuser },
                      { key: 'is_tor', label: t.torNode, icon: Network, value: ipData.threat.is_tor },
                      { key: 'is_proxy', label: t.proxyServer, icon: Shuffle, value: ipData.threat.is_proxy },
                      { key: 'is_anonymous', label: t.anonymousVpn, icon: Eye, value: ipData.threat.is_anonymous },
                    ].map(item => (
                      <div key={item.key} className={`p-3.5 rounded-lg border ${
                        item.value
                          ? 'bg-terminal-red/10 border-terminal-red/30'
                          : 'bg-terminal-green/10 border-terminal-green/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <item.icon className={`w-4 h-4 ${
                              item.value ? 'text-terminal-red' : 'text-terminal-green'
                            }`} />
                            <span className="text-sm font-medium text-terminal-fg">
                              {item.label}
                            </span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            item.value
                              ? 'bg-terminal-red text-white'
                              : 'bg-terminal-green text-white'
                          }`}>
                            {item.value ? t.yes : t.no}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </InfoCard>
            )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 地理信息 */}
                <InfoCard title={t.geoInfo} icon={MapPin}>
                  <div className="space-y-1">
                    <InfoRow icon={Globe} label={t.continent} value={ipData.continent_name} />
                    <InfoRow icon={Flag} label={t.country} value={ipData.country_name} highlight />
                    <InfoRow icon={MapPin} label={t.region} value={ipData.region} />
                    <InfoRow icon={Building2} label={t.city} value={ipData.city} highlight />
                    <InfoRow icon={Hash} label={t.postalCode} value={ipData.postal} />
                    <InfoRow icon={TrendingUp} label={t.latitude} value={ipData.latitude} />
                    <InfoRow icon={Activity} label={t.longitude} value={ipData.longitude} />
                  </div>
                </InfoCard>

                {/* 网络信息 */}
                <InfoCard title={t.networkInfo} icon={Network}>
                  <div className="space-y-1">
                    <InfoRow icon={Hash} label={t.asn} value={ipData.asn?.asn} highlight />
                    <InfoRow icon={Building2} label={t.organization} value={ipData.asn?.name} highlight />
                    <InfoRow icon={Globe} label={t.domain} value={ipData.asn?.domain} />
                    <InfoRow icon={Route} label={t.route} value={ipData.asn?.route} />
                    {ipData.carrier?.name && (
                      <InfoRow icon={Wifi} label={t.carrier} value={ipData.carrier.name} highlight />
                    )}
                  </div>
                </InfoCard>

                {/* 时区信息 */}
                <InfoCard title={`${t.timezone} ${t.otherInfo}`} icon={Clock}>
                  <div className="space-y-1">
                    <InfoRow icon={Clock} label={t.timezone} value={ipData.time_zone?.name} />
                    <InfoRow icon={Activity} label={t.currentTime} value={ipData.time_zone?.current_time} highlight />
                    <InfoRow icon={Phone} label={t.internationalCode} value={ipData.calling_code ? `+${ipData.calling_code}` : undefined} />
                    <InfoRow icon={Coins} label={t.currency} value={ipData.currency?.name ? `${ipData.currency.name} (${ipData.currency.code}) ${ipData.currency.symbol}` : undefined} />
                  </div>
                </InfoCard>

                {/* 其他信息 */}
                <InfoCard title={t.otherInfo} icon={Info}>
                  <div className="space-y-1">
                    {ipData.languages && ipData.languages.length > 0 && (
                      <InfoRow
                        icon={Languages}
                        label={t.languages}
                        value={ipData.languages.map(lang => lang.name).join(', ')}
                      />
                    )}
                    {ipData.is_eu !== undefined && (
                      <InfoRow icon={Flag} label={t.euMember} value={ipData.is_eu} />
                    )}
                  </div>
                </InfoCard>
              </div>
            </div>
          )}

          {/* 底部信息 */}
          <Footer />
        </Terminal>
      </div>
    </div>
  );
}
