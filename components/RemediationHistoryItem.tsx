

import React from 'react';
import { ServerEvent, AutomatedRemediation } from '../types';
import { RemediationIcon } from './icons/RemediationIcon';

interface RemediationHistoryItemProps {
  event: ServerEvent;
}

const RemediationHistoryItem: React.FC<RemediationHistoryItemProps> = ({ event }) => {
  const payload = event.payload as AutomatedRemediation;

  return (
    <div className="p-2 rounded-lg bg-orange-600/10 border border-orange-500/20">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-orange-400">
          <RemediationIcon />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-orange-300">Response to: {payload.threat_name}</p>
          <p className="text-xs text-gray-300 mt-1">Actions: <span className="font-semibold">{payload.actions_taken.join(', ')}</span></p>
          <div className="flex items-center justify-end mt-1">
            {/* Provided a locale to toLocaleTimeString for consistent time formatting. */}
            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemediationHistoryItem;
