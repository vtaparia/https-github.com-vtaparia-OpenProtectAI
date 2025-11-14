import React, { useMemo } from 'react';
// FIX: Import `AggregatedEvent` to allow for a type assertion on the event payload.
import { ServerEvent, AggregatedEvent } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';
import { IndustryIcon } from './icons/IndustryIcon';

interface ThreatHeatmapProps {
  events: ServerEvent[];
}

const getTopN = (counts: Record<string, number>, n: number) => {
    const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const top = sorted.slice(0, n);
    const max = top[0]?.[1] || 1;
    return top.map(([name, count]) => ({
        name,
        count,
        percentage: (count / max) * 100,
    }));
};

const BarChart: React.FC<{ title: string; data: { name: string; count: number; percentage: number }[]; icon: React.ReactNode; barColor: string }> = ({ title, data, icon, barColor }) => (
    <div>
        <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
            {icon}
            {title}
        </h4>
        <div className="space-y-1.5 text-xs">
            {data.length > 0 ? data.map(({ name, count, percentage }) => (
                <div key={name} className="flex items-center gap-2">
                    <span className="w-1/3 truncate text-gray-300" title={name}>{name}</span>
                    <div className="w-2/3 bg-gray-700 rounded-full h-3">
                        <div 
                            className={`${barColor} h-3 rounded-full flex items-center justify-end pr-2 text-white font-bold`} 
                            style={{ width: `${percentage}%` }}
                        >
                           <span style={{ fontSize: '10px' }}>{count}</span>
                        </div>
                    </div>
                </div>
            )) : <p className="text-gray-500 text-center text-xs">No data available.</p>}
        </div>
    </div>
);

const ThreatHeatmap: React.FC<ThreatHeatmapProps> = ({ events }) => {
  const stats = useMemo(() => {
    const industryCounts: Record<string, number> = {};
    const regionCounts: Record<string, number> = {};

    events.forEach(event => {
      // FIX: Check event type before accessing payload properties to satisfy TypeScript's type narrowing.
      // A type assertion is used because ServerEvent is not defined as a discriminated union.
      if (event.type === 'AGGREGATED_EVENT') {
        const payload = event.payload as AggregatedEvent;
        if (payload.context) {
          const { industry, region } = payload.context;
          industryCounts[industry] = (industryCounts[industry] || 0) + 1;
          regionCounts[region] = (regionCounts[region] || 0) + 1;
        }
      }
    });

    return {
      topIndustries: getTopN(industryCounts, 3),
      topRegions: getTopN(regionCounts, 3),
    };
  }, [events]);

  return (
    <div className="space-y-4">
        <BarChart 
            title="Top Impacted Industries"
            data={stats.topIndustries}
            icon={<IndustryIcon />}
            barColor="bg-gradient-to-r from-sky-600 to-sky-400"
        />
        <BarChart 
            title="Top Impacted Regions"
            data={stats.topRegions}
            icon={<GlobeIcon />}
            barColor="bg-gradient-to-r from-amber-600 to-amber-400"
        />
    </div>
  );
};

export default ThreatHeatmap;