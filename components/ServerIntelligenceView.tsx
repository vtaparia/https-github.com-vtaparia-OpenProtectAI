
import React from 'react';
import { ServerEvent, AllEventTypes } from '../types';
import LWServerEventItem from './LWServerEventItem';
import LearningUpdateItem from './LearningUpdateItem';
import DirectivePushItem from './DirectivePushItem';
import KnowledgeSyncItem from './KnowledgeSyncItem';
import ProactiveAlertItem from './ProactiveAlertItem';
import AutomatedRemediationItem from './AutomatedRemediationItem';

interface ServerIntelligenceViewProps {
  events: ServerEvent[];
  onSelectItem: (item: AllEventTypes) => void;
}

const ServerIntelligenceView: React.FC<ServerIntelligenceViewProps> = ({ events, onSelectItem }) => {

  const reversedEvents = [...events].reverse();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
      <header className="p-4 border-b border-slate-700/50 shrink-0">
        <h2 className="text-lg font-bold text-gray-100">Server Intelligence Feed</h2>
        <p className="text-sm text-gray-400">Learning, correlation &amp; action</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {reversedEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p className="text-gray-500">Awaiting processed events...</p>
          </div>
        ) : (
          reversedEvents.map(event => {
            switch (event.type) {
                case 'AGGREGATED_EVENT':
                    return <LWServerEventItem key={event.id} event={event} onSelectItem={onSelectItem} />;
                case 'LEARNING_UPDATE':
                    return <LearningUpdateItem key={event.id} event={event} onSelectItem={onSelectItem}/>;
                case 'DIRECTIVE_PUSH':
                    return <DirectivePushItem key={event.id} event={event} onSelectItem={onSelectItem}/>;
                case 'KNOWLEDGE_SYNC':
                    return <KnowledgeSyncItem key={event.id} event={event} onSelectItem={onSelectItem}/>;
                case 'PROACTIVE_ALERT_PUSH':
                    return <ProactiveAlertItem key={event.id} event={event} onSelectItem={onSelectItem}/>;
                case 'AUTOMATED_REMEDIATION':
                    return <AutomatedRemediationItem key={event.id} event={event} onSelectItem={onSelectItem}/>;
                default:
                    return null;
            }
          })
        )}
      </div>
    </div>
  );
};

export default ServerIntelligenceView;
