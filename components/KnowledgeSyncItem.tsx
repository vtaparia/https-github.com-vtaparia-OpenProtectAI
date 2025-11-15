import React from 'react';
import { ServerEvent, KnowledgeSync, AllEventTypes } from '../types';
import { KnowledgeSyncIcon } from './icons/KnowledgeSyncIcon';

interface KnowledgeSyncItemProps {
  event: ServerEvent;
  onSelectItem: (item: AllEventTypes) => void;
}

const KnowledgeSyncItem: React.FC<KnowledgeSyncItemProps> = ({ event, onSelectItem }) => {
  const payload = event.payload as KnowledgeSync;

  return (
    <div 
        className="p-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border-l-4 border-emerald-500 overflow-hidden cursor-pointer transition-colors duration-300"
        onClick={() => onSelectItem(event)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-emerald-400">
          <KnowledgeSyncIcon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-emerald-300">Agent Knowledge Sync</p>
          <p className="text-xs text-gray-300 mt-1">{payload.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              Version: {payload.version}
            </span>
            {/* FIX: Format the ISO timestamp string into a readable time for display. */}
            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSyncItem;