
import React from 'react';
// FIX: Import `AllEventTypes` to use in the `onSelectItem` prop type.
import { ServerEvent, AllEventTypes } from '../types';
import LWServerEventItem from './LWServerEventItem';

interface WeakPasswordAlertsProps {
  events: ServerEvent[];
  // FIX: Add the `onSelectItem` prop to allow parent components to handle item selection.
  onSelectItem: (item: AllEventTypes) => void;
}

const WeakPasswordAlerts: React.FC<WeakPasswordAlertsProps> = ({ events, onSelectItem }) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700 mb-2">
        <h3 className="text-sm font-semibold text-yellow-300 px-1 pb-2">Weak Password Usage Alerts</h3>
        <div className="space-y-2">
            {events.map(event => (
                // FIX: Pass the `onSelectItem` prop to the child component.
                <LWServerEventItem key={event.id} event={event} onSelectItem={onSelectItem} />
            ))}
        </div>
    </div>
  );
};

export default WeakPasswordAlerts;
