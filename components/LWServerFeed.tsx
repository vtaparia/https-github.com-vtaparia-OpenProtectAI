

import React from 'react';
// FIX: Import `AllEventTypes` to use in the `onSelectItem` prop type.
import { ServerEvent, AllEventTypes } from '../types';
import LWServerEventItem from './LWServerEventItem';
import LearningUpdateItem from './LearningUpdateItem';
import ServerKnowledgeMeter from './ServerKnowledgeMeter';
import DirectivePushItem from './DirectivePushItem';

interface ServerBrainFeedProps {
  events: ServerEvent[];
  knowledgeLevel: number;
  // FIX: Add the `onSelectItem` prop to allow parent components to handle item selection.
  onSelectItem: (item: AllEventTypes) => void;
}

const ServerBrainFeed: React.FC<ServerBrainFeedProps> = ({ events, knowledgeLevel, onSelectItem }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold text-gray-100">Server Brain & Intelligence</h2>
        <p className="text-sm text-gray-400">Learning, correlation &amp; action</p>
      </header>
      
      <div className="p-4 border-b border-gray-700">
        {/* FIX: The ServerKnowledgeMeter component requires an 'onClick' prop. 
            Providing a no-op function to satisfy the requirement as the parent component does not provide a handler. */}
        <ServerKnowledgeMeter level={knowledgeLevel} onClick={() => {}} />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p className="text-gray-500">Awaiting processed events...</p>
          </div>
        ) : (
          events.map(event => {
            switch (event.type) {
                case 'AGGREGATED_EVENT':
                    // FIX: Pass the `onSelectItem` prop to the child component.
                    return <LWServerEventItem key={event.id} event={event} onSelectItem={onSelectItem} />;
                case 'LEARNING_UPDATE':
                    // FIX: Pass the `onSelectItem` prop to the child component.
                    return <LearningUpdateItem key={event.id} event={event} onSelectItem={onSelectItem} />;
                case 'DIRECTIVE_PUSH':
                    // FIX: Pass the `onSelectItem` prop to the child component.
                    return <DirectivePushItem key={event.id} event={event} onSelectItem={onSelectItem} />;
                default:
                    return null;
            }
          })
        )}
      </div>
    </div>
  );
};

export default ServerBrainFeed;
