import React, { useMemo } from 'react';
import { KnowledgeContribution } from '../types';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { AlertSeverity } from '../types';

interface LearningAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: KnowledgeContribution[];
}

const LearningAnalyticsModal: React.FC<LearningAnalyticsModalProps> = ({ isOpen, onClose, log }) => {
  const summary = useMemo(() => {
    const totals: Record<string, { points: number; count: number }> = {
        'Critical Alerts': { points: 0, count: 0 },
        'High Alerts': { points: 0, count: 0 },
        'Medium Alerts': { points: 0, count: 0 },
        'Intel Ingestion': { points: 0, count: 0 },
    };

    log.forEach(entry => {
        if (entry.source.startsWith(AlertSeverity.CRITICAL)) {
            totals['Critical Alerts'].points += entry.points;
            totals['Critical Alerts'].count += 1;
        } else if (entry.source.startsWith(AlertSeverity.HIGH)) {
            totals['High Alerts'].points += entry.points;
            totals['High Alerts'].count += 1;
        } else if (entry.source.startsWith(AlertSeverity.MEDIUM)) {
            totals['Medium Alerts'].points += entry.points;
            totals['Medium Alerts'].count += 1;
        } else if (entry.source.startsWith('Intel:')) {
            totals['Intel Ingestion'].points += entry.points;
            totals['Intel Ingestion'].count += 1;
        }
    });
    return totals;
  }, [log]);

  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-4xl text-gray-200 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <AnalyticsIcon />
            <h2 className="text-xl font-bold">Server Learning Analytics</h2>
          </div>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
            <div className="md:w-1/3 flex flex-col space-y-4">
                <h3 className="text-lg font-semibold text-gray-100 border-b border-slate-700 pb-2">Contribution Summary</h3>
                <div className="space-y-3 text-sm">
                    {Object.entries(summary).map(([source, data]) => (
                        <div key={source} className="flex justify-between items-baseline">
                            <span className="text-gray-400">{source} ({data.count} events):</span>
                            <span className="font-bold text-cyan-400">+{data.points.toFixed(2)} pts</span>
                        </div>
                    ))}
                </div>
                 <div className="border-t border-slate-700 pt-3 text-sm flex justify-between items-baseline">
                    <span className="font-semibold text-gray-300">Current Knowledge Level:</span>
                    <span className="font-bold text-xl text-green-400">{log[0]?.newTotal.toFixed(1) ?? 'N/A'}%</span>
                </div>
            </div>

            <div className="md:w-2/3 flex flex-col border-l border-slate-700 pl-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-100 border-b border-slate-700 pb-2 mb-2 shrink-0">Live Learning Log</h3>
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="text-xs font-mono space-y-2">
                         {log.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No learning events recorded yet.</p>
                         ) : (
                            log.map(entry => (
                                <div key={entry.id} className="grid grid-cols-12 gap-2 p-1.5 rounded bg-slate-900/50">
                                    {/* FIX: Format the ISO timestamp string into a readable time for display. */}
                                    <span className="col-span-2 text-gray-500">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                    <span className="col-span-7 text-gray-300 truncate" title={entry.source}>{entry.source}</span>
                                    <span className="col-span-1 text-green-400 text-right">+{entry.points.toFixed(2)}</span>
                                    <span className="col-span-2 text-cyan-400 text-right font-semibold">{entry.newTotal.toFixed(1)}%</span>
                                </div>
                            ))
                         )}
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default LearningAnalyticsModal;