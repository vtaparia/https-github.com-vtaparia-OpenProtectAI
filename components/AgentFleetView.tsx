import React, { useState, useMemo } from 'react';
import { Alert, Device } from '../types';
import { WindowsIcon, LinuxIcon, AppleIcon, AndroidIcon } from './icons/OSIcons';
import AlertItem from './AlertItem';
import PayloadDetailsView from './PayloadDetailsView';

interface AgentFleetViewProps {
  alerts: Alert[];
}

const osIcons: Record<Device['os'], React.FC> = {
    Windows: WindowsIcon,
    Linux: LinuxIcon,
    macOS: AppleIcon,
    Android: AndroidIcon,
    Ubuntu: LinuxIcon,
    'Embedded Linux': LinuxIcon,
    'PAN-OS': LinuxIcon,
};

const AgentFleetView: React.FC<AgentFleetViewProps> = ({ alerts }) => {
  const [selectedAgent, setSelectedAgent] = useState<Device | null>(null);

  const uniqueAgents = useMemo(() => {
    const agentMap = new Map<string, Device>();
    alerts.forEach(alert => {
      if (alert.raw_data?.device) {
        agentMap.set(alert.raw_data.device.hostname, { ...alert.raw_data.device, status: 'Online' });
      }
    });
    return Array.from(agentMap.values());
  }, [alerts]);

  const selectedAgentAlerts = useMemo(() => {
    if (!selectedAgent) return [];
    return alerts.filter(alert => alert.raw_data?.device.hostname === selectedAgent.hostname);
  }, [selectedAgent, alerts]);
  
  const handleSelectAgent = (agent: Device) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Master List */}
        <div className="w-1/3 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
            <header className="p-4 border-b border-slate-700/50 shrink-0">
                <h2 className="text-lg font-bold text-gray-100">Agent Fleet</h2>
                <p className="text-sm text-gray-400">{uniqueAgents.length} Agents Online</p>
            </header>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {uniqueAgents.map(agent => {
                    const Icon = osIcons[agent.os] || LinuxIcon;
                    return (
                        <button 
                            key={agent.hostname}
                            onClick={() => handleSelectAgent(agent)}
                            className={`w-full text-left p-3 rounded-lg border-l-4 transition-colors ${selectedAgent?.hostname === agent.hostname ? 'bg-cyan-600/20 border-cyan-500' : 'bg-slate-900/50 border-slate-700 hover:bg-slate-700/50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon />
                                <div>
                                    <p className="font-bold text-gray-200">{agent.hostname}</p>
                                    <p className="text-xs text-gray-400">{agent.os} {agent.type}</p>
                                </div>
                                <span className="ml-auto text-xs font-semibold text-green-400">Online</span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Detail View */}
        <div className="w-2/3 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
            {selectedAgent ? (
                <>
                <header className="p-4 border-b border-slate-700/50 shrink-0">
                    <h2 className="text-lg font-bold text-gray-100">{selectedAgent.hostname}</h2>
                    <p className="text-sm text-gray-400">Agent Details & Recent Activity</p>
                </header>
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-1/2 overflow-y-auto p-4 border-r border-slate-700/50">
                         <h3 className="text-base font-semibold text-gray-300 mb-2">Device Posture</h3>
                         <PayloadDetailsView payload={selectedAgent} />
                    </div>
                    <div className="w-1/2 overflow-y-auto p-2 space-y-2">
                        <h3 className="text-base font-semibold text-gray-300 p-2">Recent Alerts</h3>
                         {selectedAgentAlerts.length > 0 ? (
                            selectedAgentAlerts.map(alert => <AlertItem key={alert.id} alert={alert} onSelectItem={() => {}} />)
                         ) : (
                             <p className="text-gray-500 text-center p-4">No alerts for this agent.</p>
                         )}
                    </div>
                </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Select an agent to view details</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AgentFleetView;