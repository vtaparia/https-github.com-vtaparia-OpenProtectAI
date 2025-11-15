

import React, { useState, useMemo } from 'react';
import { Alert, Device, ServerEvent, AutomatedRemediation, AlertSeverity, Case, CaseStatus } from '../types';
import { WindowsIcon, LinuxIcon, AppleIcon, AndroidIcon } from './icons/OSIcons';
import AlertItem from './AlertItem';
import PayloadDetailsView from './PayloadDetailsView';
import { SortIcon } from './icons/SortIcon';
import RemediationHistoryItem from './RemediationHistoryItem';
import { UpgradeIcon } from './icons/UpgradeIcon';
import { CaseIcon } from './icons/CaseIcon';
import { AssignIcon } from './icons/AssignIcon';
import { ResolveIcon } from './icons/ResolveIcon';

interface AgentFleetViewProps {
  alerts: Alert[];
  serverEvents: ServerEvent[];
  cases: Map<string, Case>;
  onUpgradeClick: () => void;
  onCreateCase: (alert: Alert) => void;
  onAssignCaseClick: (caseId: string) => void;
  onResolveCaseClick: (caseId: string) => void;
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

type SortKey = keyof Device | 'hostname';
type SortDirection = 'asc' | 'desc';

const AgentFleetView: React.FC<AgentFleetViewProps> = ({ alerts, serverEvents, cases, onUpgradeClick, onCreateCase, onAssignCaseClick, onResolveCaseClick }) => {
  const [selectedAgent, setSelectedAgent] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [osFilter, setOsFilter] = useState<Device['os'] | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('hostname');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const uniqueAgents = useMemo(() => {
    const agentMap = new Map<string, Device>();
    alerts.forEach(alert => {
      if (alert.raw_data?.device) {
        const existing = agentMap.get(alert.raw_data.device.hostname);
        const hasCritical = alert.severity === 'Critical';
        const newStatus = hasCritical ? 'Alerting' : (existing?.status === 'Alerting' ? 'Alerting' : 'Online');
        if (!existing || newStatus === 'Alerting') {
            agentMap.set(alert.raw_data.device.hostname, { ...alert.raw_data.device, status: newStatus });
        }
      }
    });
    return Array.from(agentMap.values());
  }, [alerts]);

  const sortedAndFilteredAgents = useMemo(() => {
    return uniqueAgents
      .filter(agent => {
        const searchMatch = agent.hostname.toLowerCase().includes(searchTerm.toLowerCase()) || agent.ip_address.includes(searchTerm);
        const osMatch = osFilter === 'All' || agent.os === osFilter;
        return searchMatch && osMatch;
      })
      .sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [uniqueAgents, searchTerm, osFilter, sortKey, sortDirection]);

  const selectedAgentAlerts = useMemo(() => {
    if (!selectedAgent) return [];
    return alerts.filter(alert => alert.raw_data?.device.hostname === selectedAgent.hostname);
  }, [selectedAgent, alerts]);
  
  const remediationHistory = useMemo(() => {
    if (!selectedAgent) return [];
    return serverEvents
        .filter(event => 
            event.type === 'AUTOMATED_REMEDIATION' && 
            (event.payload as AutomatedRemediation).target_host === selectedAgent.hostname
        )
        // Sort by parsing the ISO timestamp string to ensure correct chronological order.
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedAgent, serverEvents]);

  const handleSelectAgent = (agent: Device) => {
    setSelectedAgent(agent);
    setSelectedAlert(null); // Reset selected alert when changing agent
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  const getStatusPill = (status: Device['status']) => {
    switch(status) {
        case 'Online': return <span className="px-2 py-0.5 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full">Online</span>
        case 'Offline': return <span className="px-2 py-0.5 text-xs font-semibold text-gray-400 bg-gray-600/50 rounded-full">Offline</span>
        case 'Alerting': return <span className="px-2 py-0.5 text-xs font-semibold text-red-300 bg-red-500/20 rounded-full animate-pulse">Alerting</span>
    }
  }

  const uniqueOsTypes = useMemo(() => ['All', ...Array.from(new Set(uniqueAgents.map(a => a.os)))], [uniqueAgents]);
  
  const TableHeader: React.FC<{ sortableKey: SortKey, children: React.ReactNode}> = ({ sortableKey, children }) => (
    <th className="p-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-slate-700/50" onClick={() => handleSort(sortableKey)}>
        <div className="flex items-center gap-1">
            {children}
            {sortKey === sortableKey && <SortIcon direction={sortDirection} />}
        </div>
    </th>
  )

  const renderCaseButton = (alert: Alert) => {
    if (alert.caseId) {
        const caseDetails = cases.get(alert.caseId);
        if (caseDetails?.status === CaseStatus.RESOLVED) {
            return (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                    <ResolveIcon />
                    Resolved
                </span>
            );
        }
        if (caseDetails?.assignee) {
            return (
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-600 text-gray-300">
                        Assigned to: {caseDetails.assignee}
                    </span>
                    <button 
                        onClick={() => onResolveCaseClick(alert.caseId!)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full bg-green-600/40 hover:bg-green-600/60 text-green-200 transition-colors"
                    >
                        <ResolveIcon />
                        Resolve
                    </button>
                </div>
            );
        }
        return (
            <button 
                onClick={() => onAssignCaseClick(alert.caseId!)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 transition-colors"
            >
                <AssignIcon />
                Assign Case {alert.caseId}
            </button>
        );
    }
    
    if (alert.severity === AlertSeverity.HIGH || alert.severity === AlertSeverity.CRITICAL) {
        return (
            <button 
                onClick={() => onCreateCase(alert)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors"
            >
                <CaseIcon />
                Create Case
            </button>
        );
    }
    return null;
  };

  return (
    <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="w-2/3 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
            <header className="p-4 border-b border-slate-700/50 shrink-0 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-gray-100">Agent Fleet Management</h2>
                    </div>
                    <button
                        onClick={onUpgradeClick}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-500 rounded-md transition-colors shadow-lg shadow-purple-600/20"
                        title="Manage Agent Upgrades"
                    >
                        <UpgradeIcon />
                        Upgrade Agents
                    </button>
                </div>
                <div className="flex gap-4">
                    <input 
                        type="text"
                        placeholder="Search by hostname or IP..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-1.5"
                    />
                     <select
                        value={osFilter}
                        onChange={(e) => setOsFilter(e.target.value as Device['os'] | 'All')}
                        className="bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-1.5"
                    >
                        {uniqueOsTypes.map(os => <option key={os} value={os}>{os}</option>)}
                    </select>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-slate-800/80 backdrop-blur-sm">
                        <tr>
                            <TableHeader sortableKey="status">Status</TableHeader>
                            <TableHeader sortableKey="hostname">Hostname</TableHeader>
                            <th className="p-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">OS</th>
                            <TableHeader sortableKey="ip_address">IP Address</TableHeader>
                            <TableHeader sortableKey="last_seen">Last Seen</TableHeader>
                            <TableHeader sortableKey="agent_version">Version</TableHeader>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {sortedAndFilteredAgents.map(agent => (
                            <tr key={agent.hostname} onClick={() => handleSelectAgent(agent)} className={`cursor-pointer transition-colors ${selectedAgent?.hostname === agent.hostname ? 'bg-cyan-600/20' : 'hover:bg-slate-700/50'}`}>
                                <td className="p-2 whitespace-nowrap">{getStatusPill(agent.status)}</td>
                                <td className="p-2 font-semibold text-gray-200 whitespace-nowrap">{agent.hostname}</td>
                                <td className="p-2 whitespace-nowrap"><div className="flex items-center gap-2"><div className="w-5 h-5">{osIcons[agent.os] ? React.createElement(osIcons[agent.os]) : null}</div> {agent.os}</div></td>
                                <td className="p-2 font-mono text-gray-400 whitespace-nowrap">{agent.ip_address}</td>
                                <td className="p-2 text-gray-400 whitespace-nowrap">{agent.last_seen}</td>
                                <td className="p-2 text-gray-400 whitespace-nowrap">{agent.agent_version}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="w-1/3 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
            {selectedAgent ? (
                <>
                <header className="p-4 border-b border-slate-700/50 shrink-0">
                    <h2 className="text-lg font-bold text-gray-100">{selectedAgent.hostname}</h2>
                    <p className="text-sm text-gray-400">Agent Details & Recent Activity</p>
                </header>
                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                        <h3 className="text-base font-semibold text-gray-300 mb-2">Device Posture</h3>
                        <PayloadDetailsView payload={selectedAgent} />
                    </div>
                     <div>
                        <h3 className="text-base font-semibold text-gray-300 mb-2 px-1">Remediation History</h3>
                         {remediationHistory.length > 0 ? (
                            <div className="space-y-2">
                                {remediationHistory.map(event => <RemediationHistoryItem key={event.id} event={event} />)}
                            </div>
                         ) : (
                             <p className="text-gray-500 text-center text-xs p-4">No remediation actions recorded for this agent.</p>
                         )}
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-300 mb-2 px-1">Recent Alerts</h3>
                         {selectedAgentAlerts.length > 0 ? (
                            <div className="space-y-2">
                                {selectedAgentAlerts.map(alert => (
                                    <div key={alert.id} className="bg-slate-900/50 p-1 rounded-lg border border-transparent hover:border-slate-700">
                                        <AlertItem alert={alert} onSelectItem={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)} isExpanded={selectedAlert?.id === alert.id}/>
                                        <div className="px-3 pb-2 flex justify-end">
                                            {renderCaseButton(alert)}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
