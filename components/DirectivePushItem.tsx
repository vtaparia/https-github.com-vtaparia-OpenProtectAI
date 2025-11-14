import React from 'react';
import { ServerEvent, DirectivePush, AllEventTypes } from '../types';
import { DirectiveIcon } from './icons/DirectiveIcon';

interface DirectivePushItemProps {
  event: ServerEvent;
  onSelectItem: (item: AllEventTypes) => void;
}

const DirectivePushItem: React.FC<DirectivePushItemProps> = ({ event, onSelectItem }) => {
  const payload = event.payload as DirectivePush;

  return (
    <div className="p-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border-l-4 border-cyan-500 overflow-hidden transition-colors duration-300 cursor-pointer"
         onClick={() => onSelectItem(event)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-cyan-400">
          <DirectiveIcon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-cyan-300">{payload.title}</p>
          <p className="text-xs text-gray-300 mt-1">{payload.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
              Target: {payload.target}
            </span>
            <span className="text-xs text-gray-500">{event.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectivePushItem;
