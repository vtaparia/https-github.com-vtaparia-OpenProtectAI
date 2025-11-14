import React, { useMemo } from 'react';
import { ServerEvent, AggregatedEvent, AllEventTypes } from '../types';
import LWServerEventItem from './LWServerEventItem';
import LearningUpdateItem from './LearningUpdateItem';
import DirectivePushItem from './DirectivePushItem';
import KnowledgeSyncItem from './KnowledgeSyncItem';
import ProactiveAlertItem from './ProactiveAlertItem';

interface ServerBrainFeedProps {
  events: ServerEvent[];
  onSelectItem: (item: AllEventTypes) => void;
}

const ServerBrainFeed: React.FC<ServerBrainFeedProps> = ({ events, onSelectItem }) => {

  const { weakPasswordEvents, otherEvents } = useMemo(() => {
    const weakPasswordEvents: ServerEvent[] = [];
    const otherEvents: ServerEvent[] = [];

    events.forEach(event => {
      if (event.type === 'AGGREGATED_EVENT' && (event.payload as AggregatedEvent).title === 'Weak Password Usage') {
        weakPasswordEvents.push(event);
      } else {
        otherEvents.push(event);
      }
    });

    return { weakPasswordEvents, otherEvents };
  }, [events]);

  const allSortedEvents = useMemo(() => {
    return [...weakPasswordEvents, ...otherEvents].sort((a, b) => {
        // A bit of a hack to parse time string like "10:30:15 PM" for sorting
        return new Date(`1970-01-01 ${b.timestamp}`).getTime() - new Date(`1970-01-01 ${a.timestamp}`).getTime();
    });
  },[weakPasswordEvents, otherEvents]);

  return (
    <div className="w-1/4 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
      <header className="p-4 border-b border-slate-700/50 shrink-0">
        <h2 className="text-lg font-bold text-gray-100">Server Brain & Intelligence</h2>
        <p className="text-sm text-gray-400">Learning, correlation &amp; action</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p className="text-gray-500">Awaiting processed events...</p>
          </div>
        ) : (
          <>
            {allSortedEvents.map(event => {
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
                  default:
                      return null;
              }
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ServerBrainFeed;
