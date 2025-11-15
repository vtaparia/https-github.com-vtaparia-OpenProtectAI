import React from 'react';
import { ServerEvent, AutomatedRemediation, AllEventTypes } from '../types';
import { RemediationIcon } from './icons/RemediationIcon';

interface AutomatedRemediationItemProps {
  event: ServerEvent;
  onSelectItem: (item: AllEventTypes) => void;
}

const AutomatedRemediationItem: React.FC<AutomatedRemediationItemProps> = ({ event, onSelectItem }) => {
  const payload = event.payload as AutomatedRemediation;

  return (
    <div 
        className="p-3 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 border-l-4 border-orange-500 overflow-hidden cursor-pointer transition-colors duration-300 animate-pulse"
        style={{ animationIterationCount: '3' }}
        onClick={() => onSelectItem(event)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-orange-400">
          <RemediationIcon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-orange-300">Automated Remediation Triggered</p>
          <p className="text-xs text-gray-300 mt-1">Response to: <span className="font-semibold">{payload.threat_name}</span></p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
              Host: {payload.target_host}
            </span>
            {/* FIX: Format the ISO timestamp string into a readable time for display. */}
            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedRemediationItem;