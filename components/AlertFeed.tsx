import React, { useState, useMemo } from 'react';
import { Alert, AlertSeverity, AllEventTypes } from '../types';
import AlertItem from './AlertItem';

interface AlertFeedProps {
  alerts: Alert[];
  onSelectItem: (item: AllEventTypes) => void;
}

type FilterType = AlertSeverity | 'All';

const FilterButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    color: string;
}> = ({ label, isActive, onClick, color }) => (
    <button
        onClick={onClick}
        className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
            isActive
                ? `${color} text-white shadow-md`
                : 'bg-slate-700/50 hover:bg-slate-600/50 text-gray-300'
        }`}
    >
        {label}
    </button>
);

const AlertFeed: React.FC<AlertFeedProps> = ({ alerts, onSelectItem }) => {
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<FilterType>('All');
  const [activeTitleFilter, setActiveTitleFilter] = useState<string>('All');

  const uniqueTitles = useMemo(() => {
    const titles = new Set(alerts.map(a => a.title));
    return ['All', ...Array.from(titles).sort()];
  }, [alerts]);

  const filteredAlerts = alerts.filter(alert => {
      const severityMatch = activeSeverityFilter === 'All' || alert.severity === activeSeverityFilter;
      const titleMatch = activeTitleFilter === 'All' || alert.title === activeTitleFilter;
      return severityMatch && titleMatch;
  });

  return (
    <div className="w-1/4 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
      <header className="p-4 border-b border-slate-700/50 space-y-3 shrink-0">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-lg font-bold text-gray-100">Real-Time Agent Feed</h2>
                <p className="text-sm text-gray-400">Raw endpoint detections</p>
            </div>
        </div>
        <div className="flex items-center space-x-2 pt-2">
            <FilterButton label="All" isActive={activeSeverityFilter === 'All'} onClick={() => setActiveSeverityFilter('All')} color="bg-slate-600" />
            <FilterButton label="Critical" isActive={activeSeverityFilter === AlertSeverity.CRITICAL} onClick={() => setActiveSeverityFilter(AlertSeverity.CRITICAL)} color="bg-red-500" />
            <FilterButton label="High" isActive={activeSeverityFilter === AlertSeverity.HIGH} onClick={() => setActiveSeverityFilter(AlertSeverity.HIGH)} color="bg-orange-500" />
            <FilterButton label="Medium" isActive={activeSeverityFilter === AlertSeverity.MEDIUM} onClick={() => setActiveSeverityFilter(AlertSeverity.MEDIUM)} color="bg-yellow-500" />
        </div>
        <div className="pt-2">
          <label htmlFor="title-filter" className="block text-xs font-medium text-gray-400 mb-1">Filter by Event Type:</label>
          <select
              id="title-filter"
              value={activeTitleFilter}
              onChange={(e) => setActiveTitleFilter(e.target.value)}
              className="w-full bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-1.5"
          >
              {uniqueTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
              ))}
          </select>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p className="text-gray-500">
                {alerts.length === 0 ? 'Awaiting agent events...' : 'No alerts match the current filters.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => <AlertItem key={alert.id} alert={alert} onSelectItem={onSelectItem} />)
        )}
      </div>
    </div>
  );
};

export default AlertFeed;
