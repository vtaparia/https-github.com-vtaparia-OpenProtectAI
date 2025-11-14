import React from 'react';
import AgentKnowledgeMeter from './AgentKnowledgeMeter';
import ServerKnowledgeMeter from './ServerKnowledgeMeter';
import ThreatHeatmap from './ThreatHeatmap';
import { ServerEvent } from '../types';
import { DeployIcon } from './icons/DeployIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import CorrelationActivityGraph from './CorrelationActivityGraph';
import { GlobeIcon } from './icons/GlobeIcon';

interface DashboardViewProps {
  serverKnowledgeLevel: number;
  agentKnowledgeLevel: number;
  serverEvents: ServerEvent[];
  correlationActivity: number[];
  onDeployClick: () => void;
  onSettingsClick: () => void;
  onKnowledgeMeterClick: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  serverKnowledgeLevel,
  agentKnowledgeLevel,
  serverEvents,
  correlationActivity,
  onDeployClick,
  onSettingsClick,
  onKnowledgeMeterClick,
}) => {
  return (
    <div className="p-4 flex-1 overflow-y-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <ServerKnowledgeMeter level={serverKnowledgeLevel} onClick={onKnowledgeMeterClick} />
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <AgentKnowledgeMeter level={agentKnowledgeLevel} />
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
             <div className="text-center text-gray-500 pt-8">
                <p>Welcome to the Cyber Architect AI Console.</p>
                <p className="text-sm">Select an event from the side feeds to view its details.</p>
            </div>
        </div>
    </div>
  );
};

export default DashboardView;