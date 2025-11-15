import React from 'react';
import { Alert, AlertSeverity, AllEventTypes } from '../types';
import { InfoIcon, WarningIcon, HighIcon, CriticalIcon } from './icons/AlertIcons';
import PayloadDetailsView from './PayloadDetailsView';
import { ChevronIcon } from './icons/ChevronIcon';

interface AlertItemProps {
  alert: Alert;
  onSelectItem: (item: AllEventTypes) => void;
  isExpanded?: boolean;
}

const severityConfig = {
  [AlertSeverity.INFO]: {
    Icon: InfoIcon,
    borderColor: 'border-sky-500',
    bgColor: 'bg-sky-500/10',
    hoverBgColor: 'hover:bg-sky-500/20',
  },
  [AlertSeverity.MEDIUM]: {
    Icon: WarningIcon,
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/10',
    hoverBgColor: 'hover:bg-yellow-500/20',
  },
  [AlertSeverity.HIGH]: {
    Icon: HighIcon,
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
    hoverBgColor: 'hover:bg-orange-500/20',
  },
  [AlertSeverity.CRITICAL]: {
    Icon: CriticalIcon,
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    hoverBgColor: 'hover:bg-red-500/20',
  },
};

const AlertItem: React.FC<AlertItemProps> = ({ alert, onSelectItem, isExpanded = false }) => {
  const config = severityConfig[alert.severity];

  return (
    <div 
        className={`p-3 rounded-lg border-l-4 ${config.borderColor} ${config.bgColor} ${isExpanded ? config.hoverBgColor.replace('hover:','') : config.hoverBgColor} overflow-hidden transition-all duration-300 cursor-pointer`}
        onClick={() => onSelectItem(alert)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <config.Icon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-200">{alert.title}</p>
          <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bgColor} text-gray-300`}>{alert.severity}</span>
            <span className="text-xs text-gray-500">{alert.timestamp}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
            <ChevronIcon isExpanded={isExpanded} />
        </div>
      </div>
      {isExpanded && alert.raw_data && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Raw Log Details</h4>
          <PayloadDetailsView payload={alert.raw_data} />
        </div>
      )}
    </div>
  );
};

export default AlertItem;