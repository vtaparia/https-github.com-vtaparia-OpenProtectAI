import React from 'react';
import { ServerEvent, ProactiveAlertPush, AllEventTypes } from '../types';
import { ProactiveAlertIcon } from './icons/ProactiveAlertIcon';

interface ProactiveAlertItemProps {
  event: ServerEvent;
  onSelectItem: (item: AllEventTypes) => void;
}

const ProactiveAlertItem: React.FC<ProactiveAlertItemProps> = ({ event, onSelectItem }) => {
  const payload = event.payload as ProactiveAlertPush;

  return (
    <div 
        className="p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border-l-4 border-amber-500 overflow-hidden cursor-pointer transition-colors duration-300"
        onClick={() => onSelectItem(event)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-amber-400">
          <ProactiveAlertIcon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-300">{payload.title}</p>
          <p className="text-xs text-gray-300 mt-1">{payload.threat_summary}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              Target: {payload.target_context}
            </span>
            {/* Provided a locale to toLocaleTimeString for consistent time formatting. */}
            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProactiveAlertItem;
