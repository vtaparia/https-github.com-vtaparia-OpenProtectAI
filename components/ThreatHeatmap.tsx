// Copyright © 2024 OpenProtectAI. All Rights Reserved.

import React, { useMemo } from 'react';
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
        percentage: Math.max(5, (count / max) * 100), // Ensure a minimum width for visibility
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
                <div key={name} className="flex items-center gap-2" title={`${name} (${count} events)`}>
                    <span className="w-1/3 truncate text-gray-300">{name}</span>
                    <div className="w-2/3 bg-gray-700/50 rounded-full h-4">
                        <div 
                            className={`${barColor} h-4 rounded-full flex items-center justify-end px-2 text-white font-bold text-[10px]`} 
                            style={{ width: `${percentage}%` }}
                        >
                           {count}
                        </div>
                    </div>
                </div>
            )) : <p className="text-gray-500 text-center text-xs py-2">No data available.</p>}
        </div>
    </div>
);

const ThreatHeatmap: React.FC<ThreatHeatmapProps> = ({ events }) => {
  const stats = useMemo(() => {
    const industryCounts: Record<string, number> = {};
    const regionCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const continentCounts: Record<string, number> = {};

    events.forEach(event => {
      if (event.type === 'AGGREGATED_EVENT') {
        const payload = event.payload as AggregatedEvent;
        if (payload.context) {
          const { industry, region, country, continent } = payload.context;
          industryCounts[industry] = (industryCounts[industry] || 0) + 1;
          regionCounts[region] = (regionCounts[region] || 0) + 1;
          countryCounts[country] = (countryCounts[country] || 0) + 1;
          continentCounts[continent] = (continentCounts[continent] || 0) + 1;
        }
      }
    });

    return {
      topIndustries: getTopN(industryCounts, 3),
      topRegions: getTopN(regionCounts, 3),
      topCountries: getTopN(countryCounts, 3),
      topContinents: getTopN(continentCounts, 3),
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
            title="Top Impacted Continents"
            data={stats.topContinents}
            icon={<GlobeIcon />}
            barColor="bg-gradient-to-r from-purple-600 to-purple-400"
        />
        <BarChart 
            title="Top Impacted Regions"
            data={stats.topRegions}
            icon={<GlobeIcon />}
            barColor="bg-gradient-to-r from-amber-600 to-amber-400"
        />
        <BarChart 
            title="Top Impacted Countries"
            data={stats.topCountries}
            icon={<GlobeIcon />}
            barColor="bg-gradient-to-r from-rose-600 to-rose-400"
        />
    </div>
  );
};

export default ThreatHeatmap;