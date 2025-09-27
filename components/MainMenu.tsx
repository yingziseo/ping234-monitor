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
      <div className="text-center space-y-3">
        <pre className="text-terminal-cyan text-xs md:text-sm overflow-x-auto">
{`██████╗ ██╗███╗   ██╗ ██████╗ ██████╗ ██████╗ ██╗  ██╗
██╔══██╗██║████╗  ██║██╔════╝ ╚════██╗╚════██╗██║  ██║
██████╔╝██║██╔██╗ ██║██║  ███╗ █████╔╝ █████╔╝███████║
██╔═══╝ ██║██║╚██╗██║██║   ██║██╔═══╝  ╚═══██╗╚════██║
██║     ██║██║ ╚████║╚██████╔╝███████╗██████╔╝     ██║
╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═════╝      ╚═╝`}
        </pre>
        <div className="text-terminal-green text-sm md:text-base">
          ping234.com - {t.onlineNetworkTool}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-terminal-green">
          <span className="terminal-prompt">$ </span>
          <span>{t.selectType}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => handleSelectType('domestic')}
            className={`terminal-button ${
              selectedType === 'domestic' ? 'border-terminal-green text-terminal-green' : ''
            }`}
          >
            [1] {t.chinaNetwork} (100+ {t.sites})
          </button>

          <button
            onClick={() => handleSelectType('international')}
            className={`terminal-button ${
              selectedType === 'international' ? 'border-terminal-green text-terminal-green' : ''
            }`}
          >
            [2] {t.internationalNetwork} (100+ {t.sites})
          </button>

          <button
            onClick={() => handleSelectType('custom')}
            className={`terminal-button ${
              selectedType === 'custom' ? 'border-terminal-green text-terminal-green' : ''
            }`}
          >
            [3] {t.customDetection}
          </button>
        </div>

        {selectedType === 'custom' && (
          <div className="space-y-3">
            <div className="terminal-line">
              <span className="terminal-prompt">$ </span>
              <span className="text-terminal-cyan">{t.inputAddress}</span>
            </div>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="example.com google.com baidu.com"
              className="w-full h-24 p-2 bg-black/50 border border-terminal-gray/30
                       text-terminal-fg placeholder-terminal-gray/50
                       focus:border-terminal-green focus:outline-none
                       font-mono text-sm"
            />
            <button
              onClick={handleCustomSubmit}
              className="terminal-button text-terminal-green"
            >
              [{t.confirmAddress}]
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div className="terminal-line">
            <span className="terminal-prompt">$ </span>
            <span className="text-terminal-cyan">{t.detectionInterval}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[3, 5, 10, 15, 30, 60].map(sec => (
              <button
                key={sec}
                onClick={() => setInterval(sec)}
                className={`terminal-button px-3 py-1 ${
                  interval === sec ? 'border-terminal-green text-terminal-green' : ''
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {selectedType && (
          <div className="text-center pt-4">
            <span className="text-terminal-yellow text-xs md:text-sm">
              {t.selected}: {
                selectedType === 'domestic' ? t.chinaNetwork :
                selectedType === 'international' ? t.internationalNetwork :
                t.customDetection
              } | {t.detectionInterval.replace('（秒）：', '')}: {interval}s
            </span>
          </div>
        )}
      </div>
    </div>
  );
}