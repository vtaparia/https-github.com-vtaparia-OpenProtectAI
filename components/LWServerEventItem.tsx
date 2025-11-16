// Copyright © 2024 OpenProtectAI. All Rights Reserved.

import React from 'react';
import { ServerEvent, AggregatedEvent, AllEventTypes } from '../types';
import { ServerIcon } from './icons/ServerIcon';
import { MitreTag } from './MitreTag';

interface LWServerEventItemProps {
  event: ServerEvent;
  onSelectItem: (item: AllEventTypes) => void;
}

const LWServerEventItem: React.FC<LWServerEventItemProps> = ({ event, onSelectItem }) => {
  const payload = event.payload as AggregatedEvent;

  return (
    <div 
        className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/50 overflow-hidden transition-all duration-300 cursor-pointer"
        onClick={() => onSelectItem(event)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-purple-400">
          <ServerIcon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-200">{payload.title}</p>
          {payload.context && (
            <p className="text-xs text-gray-400 mt-1">
              {payload.context.industry} @ {payload.context.region}
            </p>
          )}
           <div className="flex items-center justify-between mt-2">
             <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  {payload.severity}
                </span>
                {payload.mitre_mapping && <MitreTag mapping={payload.mitre_mapping} />}
             </div>
            {/* Provided a locale to toLocaleTimeString for consistent time formatting. */}
            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LWServerEventItem;