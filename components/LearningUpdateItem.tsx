


import React from 'react';
import { ServerEvent, LearningUpdate, LearningSource, AllEventTypes } from '../types';
import { IntelIcon } from './icons/IntelIcon';
import { MitreTag } from './MitreTag';

interface LearningUpdateItemProps {
  event: ServerEvent;
  onSelectItem: (item: AllEventTypes) => void;
}

const sourceStyles: Record<LearningSource, { bg: string; border: string; text: string; hoverBg: string; }> = {
    'MITRE ATT&CK': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', hoverBg: 'hover:bg-red-500/20' },
    'VirusTotal': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', hoverBg: 'hover:bg-blue-500/20' },
    'AlienVault OTX': { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300', hoverBg: 'hover:bg-green-500/20' },
    'CVE Database': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', hoverBg: 'hover:bg-yellow-500/20' },
    'Splunk SIEM': { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-300', hoverBg: 'hover:bg-indigo-500/20' },
    'Microsoft Defender': { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-300', hoverBg: 'hover:bg-sky-500/20' },
    'NVD/EPSS': { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-300', hoverBg: 'hover:bg-rose-500/20' },
    'OSV': { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-300', hoverBg: 'hover:bg-teal-500/20' },
    'Exploit-DB': { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', text: 'text-fuchsia-300', hoverBg: 'hover:bg-fuchsia-500/20' },
    'Antivirus Detections': { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-300', hoverBg: 'hover:bg-pink-500/20' },
    'Grok AI Analysis': { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-300', hoverBg: 'hover:bg-indigo-500/20' },
    'CrowdStrike Falcon': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', hoverBg: 'hover:bg-red-500/20' },
    'SentinelOne': { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-300', hoverBg: 'hover:bg-gray-500/20' },
    'Zeek/Suricata': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300', hoverBg: 'hover:bg-amber-500/20' },
    'OSQuery': { bg: 'bg-lime-500/10', border: 'border-lime-500/30', text: 'text-lime-300', hoverBg: 'hover:bg-lime-500/20' },
};

const LearningUpdateItem: React.FC<LearningUpdateItemProps> = ({ event, onSelectItem }) => {
  const payload = event.payload as LearningUpdate;
  const style = sourceStyles[payload.source] || sourceStyles['AlienVault OTX'];

  return (
    <div 
        className={`p-3 rounded-lg ${style.bg} border ${style.border} ${style.hoverBg} overflow-hidden transition-all duration-300 cursor-pointer`}
        onClick={() => onSelectItem(event)}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-1 ${style.text}`}>
          <IntelIcon />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${style.text}`}>Intel Update: {payload.source}</p>
          <p className="text-xs text-gray-300 mt-1">{payload.summary}</p>
          <div className="flex items-center justify-between mt-2">
             {payload.mitre_mapping && <MitreTag mapping={payload.mitre_mapping} />}
            {/* Provided a locale to toLocaleTimeString for consistent time formatting. */}
            <span className="text-xs text-gray-500 ml-auto">{new Date(event.timestamp).toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningUpdateItem;
