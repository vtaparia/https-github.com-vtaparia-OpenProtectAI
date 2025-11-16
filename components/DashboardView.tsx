


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
import KnowledgeGraph from './KnowledgeGraph';
import { KnowledgeGraphIcon } from './icons/KnowledgeGraphIcon';

interface DashboardViewProps {
  serverKnowledgeLevel: number;
  agentKnowledgeLevel: number;
  serverEvents: ServerEvent[];
  correlationActivity: number[];
  cases: Map<string, Case>;
  onDeployClick: () => void;
  onSettingsClick: () => void;
  onKnowledgeMeterClick: () => void;
  themeStyles: Record<string, string>;
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
  themeStyles,
}) => {
  const caseCounts = {
    [CaseStatus.NEW]: 0,
    [CaseStatus.IN_PROGRESS]: 0,
    [CaseStatus.RESOLVED]: 0,
  };
  cases.forEach(c => caseCounts[c.status]++);

  return (
    <div className={`flex-1 overflow-y-auto rounded-lg ${themeStyles.p} ${themeStyles.bgSecondaryBackdrop} ${themeStyles.border}`}>
        <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${themeStyles.textHeading}`}>Intelligence Dashboard</h2>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={onSettingsClick}
                    className={`flex items-center gap-2 text-sm font-semibold rounded-md transition-colors ${themeStyles.buttonSecondary} ${themeStyles.pxy_sm}`}
                    title="Configure Agent Settings"
                >
                    <SettingsIcon />
                    Agent Settings
                </button>
                <button 
                    onClick={onDeployClick}
                    className={`flex items-center gap-2 text-sm font-semibold rounded-md transition-colors shadow-lg ${themeStyles.buttonPrimary} ${themeStyles.pxy_sm}`}
                    title="Deploy New Agent"
                >
                    <DeployIcon />
                    Deploy Agent
                </button>
            </div>
        </div>
        <div className={themeStyles.gap}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${themeStyles.bgPanel} ${themeStyles.border}`}>
                    <ServerKnowledgeMeter level={serverKnowledgeLevel} onClick={onKnowledgeMeterClick} themeStyles={themeStyles} />
                </div>
                <div className={`p-4 rounded-lg ${themeStyles.bgPanel} ${themeStyles.border}`}>
                    <AgentKnowledgeMeter level={agentKnowledgeLevel} themeStyles={themeStyles} />
                </div>
                <div className={`p-4 rounded-lg ${themeStyles.bgPanel} ${themeStyles.border}`}>
                    <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${themeStyles.textSecondary}`}>
                        <CaseIcon />
                        Open Cases Summary
                    </h3>
                    <div className="flex justify-around items-center h-full">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-red-400">{caseCounts[CaseStatus.NEW]}</p>
                            <p className={`text-xs ${themeStyles.textSecondary}`}>New / Unassigned</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-yellow-400">{caseCounts[CaseStatus.IN_PROGRESS]}</p>
                            <p className={`text-xs ${themeStyles.textSecondary}`}>In Progress</p>
                        </div>
                         <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">{caseCounts[CaseStatus.RESOLVED]}</p>
                            <p className={`text-xs ${themeStyles.textSecondary}`}>Resolved</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                 <div className={`p-4 rounded-lg ${themeStyles.bgPanel} ${themeStyles.border}`}>
                    <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${themeStyles.textSecondary}`}>
                        <GlobeIcon />
                        Threat Landscape Overview
                    </h3>
                    <ThreatHeatmap events={serverEvents} />
                </div>
                 <div className={`p-4 rounded-lg ${themeStyles.bgPanel} ${themeStyles.border}`}>
                    <CorrelationActivityGraph activityData={correlationActivity} themeStyles={themeStyles} />
                </div>
                <div className={`p-4 rounded-lg ${themeStyles.bgPanel} ${themeStyles.border}`}>
                    <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${themeStyles.textSecondary}`}>
                        <KnowledgeGraphIcon />
                        Global Knowledge Graph
                    </h3>
                    <KnowledgeGraph themeStyles={themeStyles} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default DashboardView;
