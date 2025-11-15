
import React from 'react';
import AgentKnowledgeMeter from './AgentKnowledgeMeter';
import ServerKnowledgeMeter from './ServerKnowledgeMeter';
import ThreatHeatmap from './ThreatHeatmap';
import { ServerEvent, CaseStatus, Case } from '../types';
import { DeployIcon } from './icons/DeployIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import CorrelationActivityGraph from './CorrelationActivityGraph';
import { GlobeIcon } from './icons/GlobeIcon';
import { CaseIcon } from './icons/CaseIcon';

interface DashboardViewProps {
  serverKnowledgeLevel: number;
  agentKnowledgeLevel: number;
  serverEvents: ServerEvent[];
  correlationActivity: number[];
  cases: Map<string, Case>;
  onDeployClick: () => void;
  onSettingsClick: () => void;
  onKnowledgeMeterClick: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  serverKnowledgeLevel,
  agentKnowledgeLevel,
  serverEvents,
  correlationActivity,
  cases,
  onDeployClick,
  onSettingsClick,
  onKnowledgeMeterClick,
}) => {
  const caseCounts = {
    [CaseStatus.NEW]: 0,
    [CaseStatus.IN_PROGRESS]: 0,
    [CaseStatus.RESOLVED]: 0,
  };
  cases.forEach(c => caseCounts[c.status]++);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-100">Intelligence Dashboard</h2>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={onSettingsClick}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"
                    title="Configure Agent Settings"
                >
                    <SettingsIcon />
                    Agent Settings
                </button>
                <button 
                    onClick={onDeployClick}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors shadow-lg shadow-cyan-600/20"
                    title="Deploy New Agent"
                >
                    <DeployIcon />
                    Deploy Agent
                </button>
            </div>
        </div>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <ServerKnowledgeMeter level={serverKnowledgeLevel} onClick={onKnowledgeMeterClick} />
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <AgentKnowledgeMeter level={agentKnowledgeLevel} />
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-base font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <CaseIcon />
                        Open Cases Summary
                    </h3>
                    <div className="flex justify-around items-center h-full">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-red-400">{caseCounts[CaseStatus.NEW]}</p>
                            <p className="text-xs text-gray-400">New / Unassigned</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-yellow-400">{caseCounts[CaseStatus.IN_PROGRESS]}</p>
                            <p className="text-xs text-gray-400">In Progress</p>
                        </div>
                         <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">{caseCounts[CaseStatus.RESOLVED]}</p>
                            <p className="text-xs text-gray-400">Resolved</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-base font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <GlobeIcon />
                        Threat Landscape Overview
                    </h3>
                    <ThreatHeatmap events={serverEvents} />
                </div>
                 <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <CorrelationActivityGraph activityData={correlationActivity} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default DashboardView;