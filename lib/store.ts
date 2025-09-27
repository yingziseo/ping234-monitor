import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from './i18n';
import * as domains from './domains';

interface TopAd {
  id: string;
  text: {
    zh: string;
    tw: string;
    en: string;
  };
  url: {
    zh: string;
    tw: string;
    en: string;
  };
}

interface RotatingAd {
  id: string;
  text: {
    zh: string;
    tw: string;
    en: string;
  };
  url: {
    zh: string;
    tw: string;
    en: string;
  };
  isPlaceholder?: boolean;
}

interface FriendLink {
  id: string;
  title: string;
  url: string;
}

interface SeoConfig {
  zh: {
    title: string;
    description: string;
    keywords: string;
  };
  tw: {
    title: string;
    description: string;
    keywords: string;
  };
  en: {
    title: string;
    description: string;
    keywords: string;
  };
  author: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  wechat: string;
  qq: string;
}

interface RouteConfig {
  domestic: string[];
  international: string[];
}

interface MonitorStore {
  selectedType: 'domestic' | 'international' | 'custom' | null;
  customDomains: string[];
  monitoringDomains: string[];
  isMonitoring: boolean;
  interval: number;
  results: Record<string, number>;
  history: Record<string, number[]>;
  topAds: TopAd[];
  rotatingAds: RotatingAd[];
  friendLinks: FriendLink[];
  theme: 'light' | 'dark';
  language: Language;
  seoConfig: SeoConfig;
  contactInfo: ContactInfo;
  routeConfig: RouteConfig;
  isLoaded: boolean;

  setSelectedType: (type: 'domestic' | 'international' | 'custom' | null) => void;
  setCustomDomains: (domains: string[]) => void;
  setMonitoringDomains: (domains: string[]) => void;
  setIsMonitoring: (monitoring: boolean) => void;
  setInterval: (interval: number) => void;
  updateResult: (domain: string, ping: number) => void;
  updateHistory: (domain: string, ping: number) => void;
  setAdConfig: (config: AdConfig) => void;
  addRotatingAd: (ad: RotatingAd) => void;
  removeRotatingAd: (id: string) => void;
  updateRotatingAd: (id: string, ad: Partial<RotatingAd>) => void;
  setPlaceholderCount: (count: number) => void;
  addFriendLink: (link: FriendLink) => void;
  removeFriendLink: (id: string) => void;
  updateFriendLink: (id: string, link: Partial<FriendLink>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: Language) => void;
  setSeoConfig: (config: SeoConfig) => void;
  setContactInfo: (info: ContactInfo) => void;
  setRouteConfig: (config: RouteConfig) => void;
  updateDomesticRoutes: (routes: string[]) => void;
  updateInternationalRoutes: (routes: string[]) => void;
  loadFromServer: () => Promise<void>;
  saveToServer: () => Promise<void>;
  reset: () => void;
}

export const useMonitorStore = create<MonitorStore>()(
  persist(
    (set, get) => ({
  selectedType: null,
  customDomains: [],
  monitoringDomains: [],
  isMonitoring: false,
  interval: 5,
  results: {},
  history: {},
  topAds: [],
  rotatingAds: [],
  friendLinks: [],
  theme: 'dark',
  language: 'zh' as Language,
  seoConfig: {
    zh: {
      title: 'ping234.com - 在线网络检测工具',
      description: '专业的网络延迟检测工具，支持批量检测国内外网站的网络连通性、延迟、抖动和丢包率',
      keywords: 'ping,网络检测,延迟检测,网络监控,ping工具,在线ping,网络质量'
    },
    tw: {
      title: 'ping234.com - 線上網路檢測工具',
      description: '專業的網路延遲檢測工具，支援批次檢測國內外網站的網路連通性、延遲、抖動和掉包率',
      keywords: 'ping,網路檢測,延遲檢測,網路監控,ping工具,線上ping,網路品質'
    },
    en: {
      title: 'ping234.com - Online Network Detection Tool',
      description: 'Professional network latency detection tool, supports batch testing of domestic and international website connectivity, latency, jitter and packet loss',
      keywords: 'ping,network detection,latency test,network monitoring,ping tool,online ping,network quality'
    },
    author: 'ping234.com'
  },
  contactInfo: {
    email: 'admin@ping234.com',
    phone: '+86 123 456 7890',
    address: '北京市朝阳区',
    wechat: 'ping234',
    qq: '123456789'
  },
  routeConfig: {
    domestic: domains.domesticDomains,
    international: domains.internationalDomains
  },
  isLoaded: false,

  setSelectedType: (type) => set({ selectedType: type }),
  setCustomDomains: (domains) => set({ customDomains: domains }),
  setMonitoringDomains: (domains) => set({ monitoringDomains: domains }),
  setIsMonitoring: (monitoring) => set({ isMonitoring: monitoring }),
  setInterval: (interval) => set({ interval }),

  updateResult: (domain, ping) =>
    set((state) => ({
      results: { ...state.results, [domain]: ping }
    })),

  updateHistory: (domain, ping) =>
    set((state) => {
      const history = { ...state.history };
      if (!history[domain]) {
        history[domain] = [];
      }
      history[domain].push(ping);
      if (history[domain].length > 100) {
        history[domain].shift();
      }
      return { history };
    }),

  addTopAd: (ad) =>
    set((state) => ({
      topAds: [...state.topAds, ad]
    })),

  removeTopAd: (id) =>
    set((state) => ({
      topAds: state.topAds.filter(ad => ad.id !== id)
    })),

  updateTopAd: (id, updatedAd) =>
    set((state) => ({
      topAds: state.topAds.map(ad =>
        ad.id === id ? { ...ad, ...updatedAd } : ad
      )
    })),

  addRotatingAd: (ad) =>
    set((state) => ({
      rotatingAds: [...state.rotatingAds, ad]
    })),

  removeRotatingAd: (id) =>
    set((state) => ({
      rotatingAds: state.rotatingAds.filter(ad => ad.id !== id)
    })),

  updateRotatingAd: (id, updatedAd) =>
    set((state) => ({
      rotatingAds: state.rotatingAds.map(ad =>
        ad.id === id ? { ...ad, ...updatedAd } : ad
      )
    })),


  addFriendLink: (link) =>
    set((state) => ({
      friendLinks: [...state.friendLinks, link]
    })),

  removeFriendLink: (id) =>
    set((state) => ({
      friendLinks: state.friendLinks.filter(link => link.id !== id)
    })),

  updateFriendLink: (id, updatedLink) =>
    set((state) => ({
      friendLinks: state.friendLinks.map(link =>
        link.id === id ? { ...link, ...updatedLink } : link
      )
    })),

  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),

  setSeoConfig: (config) => set({ seoConfig: config }),
  setContactInfo: (info) => set({ contactInfo: info }),
  setRouteConfig: (config) => set({ routeConfig: config }),

  updateDomesticRoutes: (routes) =>
    set((state) => ({
      routeConfig: {
        ...state.routeConfig,
        domestic: routes
      }
    })),

  updateInternationalRoutes: (routes) =>
    set((state) => ({
      routeConfig: {
        ...state.routeConfig,
        international: routes
      }
    })),

  loadFromServer: async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      set({
        topAds: data.topAds || [],
        rotatingAds: data.rotatingAds || [],
        friendLinks: data.friendLinks || [],
        seoConfig: data.seoConfig || {
          zh: { title: '', description: '', keywords: '' },
          tw: { title: '', description: '', keywords: '' },
          en: { title: '', description: '', keywords: '' },
          author: ''
        },
        isLoaded: true
      });
    } catch (error) {
      console.error('Failed to load data from server:', error);
      set({ isLoaded: true });
    }
  },

  saveToServer: async () => {
    try {
      const state = get();
      const dataToSave = {
        topAds: state.topAds,
        rotatingAds: state.rotatingAds,
        friendLinks: state.friendLinks,
        seoConfig: state.seoConfig
      };
      await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
    } catch (error) {
      console.error('Failed to save data to server:', error);
    }
  },

  reset: () => set({
    selectedType: null,
    monitoringDomains: [],
    isMonitoring: false,
    results: {},
    history: {},
  }),
    }),
    {
      name: 'monitor-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        friendLinks: state.friendLinks,
        rotatingAds: state.rotatingAds,
        seoConfig: state.seoConfig,
        contactInfo: state.contactInfo,
        routeConfig: state.routeConfig,
        topAds: state.topAds,
      }),
    }
  )
);