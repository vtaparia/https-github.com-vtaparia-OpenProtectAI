

import React from 'react';
import { ServerEvent, PlaybookTriggered, AllEventTypes } from '../types';
import { PlaybookIcon } from './icons/PlaybookIcon';

interface PlaybookTriggeredItemProps {
  event: ServerEvent;
  onSelectItem: (item: AllEventTypes) => void;
}

const PlaybookTriggeredItem: React.FC<PlaybookTriggeredItemProps> = ({ event, onSelectItem }) => {
  const payload = event.payload as PlaybookTriggered;

  return (
    <div 
        className="p-3 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border-l-4 border-violet-500 overflow-hidden cursor-pointer transition-colors duration-300"
        onClick={() => onSelectItem(event)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-violet-400">
          <PlaybookIcon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-violet-300">Playbook Triggered: {payload.playbook_name}</p>
          <p className="text-xs text-gray-300 mt-1">Automated response to: <span className="font-semibold">{payload.triggered_by_alert_title}</span></p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
              Host: {payload.target_host}
            </span>
            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookTriggeredItem;