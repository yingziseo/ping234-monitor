'use client';

import { useState } from 'react';
import { useMonitorStore } from '@/lib/store';
import { domesticDomains, internationalDomains } from '@/lib/domains';
import { getTranslation } from '@/lib/i18n';

export default function MainMenu() {
  const [customInput, setCustomInput] = useState('');
  const {
    selectedType,
    setSelectedType,
    setMonitoringDomains,
    setCustomDomains,
    interval,
    setInterval,
    language,
  } = useMonitorStore();

  const t = getTranslation(language);

  const handleSelectType = (type: 'domestic' | 'international' | 'custom') => {
    setSelectedType(type);

    if (type === 'domestic') {
      setMonitoringDomains(domesticDomains);
    } else if (type === 'international') {
      setMonitoringDomains(internationalDomains);
    }
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      const domains = customInput
        .split(/[\s,]+/)
        .filter(d => d.length > 0)
        .map(d => d.replace(/^https?:\/\//, '').replace(/\/$/, ''));

      setCustomDomains(domains);
      setMonitoringDomains(domains);
      setSelectedType('custom');
    }
  };

  return (
    <div className="space-y-6">
      {/* ASCII Banner */}
      <div className="text-center space-y-4 mb-2">
        <pre className="text-terminal-cyan text-sm md:text-base overflow-x-auto" style={{ lineHeight: '1.2' }}>
{`██████╗ ██╗███╗   ██╗ ██████╗ ██████╗ ██████╗ ██╗  ██╗
██╔══██╗██║████╗  ██║██╔════╝ ╚════██╗╚════██╗██║  ██║
██████╔╝██║██╔██╗ ██║██║  ███╗ █████╔╝ █████╔╝███████║
██╔═══╝ ██║██║╚██╗██║██║   ██║██╔═══╝  ╚═══██╗╚════██║
██║     ██║██║ ╚████║╚██████╔╝███████╗██████╔╝     ██║
╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═════╝      ╚═╝`}
        </pre>
        <div className="text-terminal-green text-base md:text-lg font-semibold" style={{ letterSpacing: '0.03em' }}>
          ping234.com - {t.onlineNetworkTool}
        </div>
      </div>

      <div className="space-y-5">
        <div className="text-terminal-green text-base md:text-lg font-medium">
          <span className="terminal-prompt">$ </span>
          <span>{t.selectType}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleSelectType('domestic')}
            className={`terminal-button text-base ${
              selectedType === 'domestic' ? 'border-terminal-green text-terminal-green bg-terminal-green/5' : ''
            }`}
          >
            <span className="font-bold">[1]</span> {t.chinaNetwork} <span className="text-sm opacity-80">(100+ {t.sites})</span>
          </button>

          <button
            onClick={() => handleSelectType('international')}
            className={`terminal-button text-base ${
              selectedType === 'international' ? 'border-terminal-green text-terminal-green bg-terminal-green/5' : ''
            }`}
          >
            <span className="font-bold">[2]</span> {t.internationalNetwork} <span className="text-sm opacity-80">(100+ {t.sites})</span>
          </button>

          <button
            onClick={() => handleSelectType('custom')}
            className={`terminal-button text-base ${
              selectedType === 'custom' ? 'border-terminal-green text-terminal-green bg-terminal-green/5' : ''
            }`}
          >
            <span className="font-bold">[3]</span> {t.customDetection}
          </button>
        </div>

        {selectedType === 'custom' && (
          <div className="space-y-4 mt-4">
            <div className="terminal-line">
              <span className="terminal-prompt text-base">$ </span>
              <span className="text-terminal-cyan text-base">{t.inputAddress}</span>
            </div>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="example.com google.com baidu.com"
              className="w-full h-28 p-4 bg-black/50 border border-terminal-gray/30
                       text-terminal-fg placeholder-terminal-gray/50
                       focus:border-terminal-green focus:outline-none
                       font-mono text-base rounded-md"
              style={{ lineHeight: '1.6' }}
            />
            <button
              onClick={handleCustomSubmit}
              className="terminal-button text-terminal-green text-base font-medium"
            >
              ✓ {t.confirmAddress}
            </button>
          </div>
        )}

        <div className="space-y-4">
          <div className="terminal-line">
            <span className="terminal-prompt text-base">$ </span>
            <span className="text-terminal-cyan text-base">{t.detectionInterval}</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[3, 5, 10, 15, 30, 60].map(sec => (
              <button
                key={sec}
                onClick={() => setInterval(sec)}
                className={`terminal-button px-4 py-2 text-base font-medium ${
                  interval === sec ? 'border-terminal-green text-terminal-green bg-terminal-green/5' : ''
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {selectedType && (
          <div className="text-center pt-4">
            <span className="text-terminal-yellow text-sm md:text-base font-medium">
              ✓ {t.selected}: {
                selectedType === 'domestic' ? t.chinaNetwork :
                selectedType === 'international' ? t.internationalNetwork :
                t.customDetection
              } | {t.detectionInterval}: {interval}s
            </span>
          </div>
        )}
      </div>
    </div>
  );
}