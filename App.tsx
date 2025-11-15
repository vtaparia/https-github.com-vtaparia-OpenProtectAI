
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, MessageRole, Alert, ServerEvent, AggregatedEvent, LearningUpdate, ProactiveAlertPush, AllEventTypes, DirectivePush, KnowledgeSync, LearningSource, KnowledgeContribution, AutomatedRemediation, Device, AlertSeverity } from './types';
import { getChatResponse } from './services/geminiService';
import Header from './components/Header';
import { sha256 } from './utils/hashing';
import DashboardView from './components/DashboardView';
import DetailView from './components/DetailView';
import SettingsModal from './components/SettingsModal';
import LearningAnalyticsModal from './components/LearningAnalyticsModal';
import ChatPanel from './components/ChatPanel';
import NavigationSidebar, { View as NavigationView } from './components/NavigationSidebar';
import AgentFleetView from './components/AgentFleetView';
import ServerIntelligenceView from './components/ServerIntelligenceView';
import DeploymentModal from './components/DeploymentModal';
import ReleaseNotesModal from './components/ReleaseNotesModal';


const sampleAlerts: Omit<Alert, 'id' | 'timestamp'>[] = [
    {
        severity: AlertSeverity.CRITICAL,
        title: 'Ransomware Behavior Detected',
        description: 'Multiple files encrypted in rapid succession on host.',
        raw_data: { 
            process: 'svchost.exe', 
            file_count: 1024, 
            pattern: 'mass_encryption.fast',
            device: { type: 'Desktop', os: 'Windows', hostname: 'FINANCE-PC-01', ip_address: '10.1.5.112', last_seen: '2m ago', agent_version: '3.1.2', firewall_status: 'Enabled', disk_encryption: 'Enabled', status: 'Alerting' },
            context: { industry: 'Financial', country: 'USA', continent: 'North America', region: 'NA-East' }
        }
    },
    {
        severity: AlertSeverity.HIGH,
        title: 'Potential Credential Dumping',
        description: 'LSASS process memory accessed by a non-system process.',
        raw_data: { 
            process: 'mimikatz.exe', 
            target_process: 'lsass.exe',
            device: { type: 'Server', os: 'Windows', hostname: 'DC-01', ip_address: '192.168.1.10', last_seen: '10m ago', agent_version: '3.1.1', firewall_status: 'Enabled', disk_encryption: 'Enabled', status: 'Online' },
            context: { industry: 'Government', country: 'Germany', continent: 'Europe', region: 'EU-Central' }
        }
    },
    {
        severity: AlertSeverity.MEDIUM,
        title: 'Anomalous Network Connection',
        description: 'Outbound connection to a known malicious IP from a device.',
        raw_data: { 
            process: 'powershell.exe', 
            destination_ip: '104.21.5.19',
            port: 4444,
            device: { type: 'Desktop', os: 'Windows', hostname: 'HR-PC-22', ip_address: '10.1.6.45', last_seen: '1h ago', agent_version: '3.1.2', firewall_status: 'Disabled', disk_encryption: 'Enabled', status: 'Alerting' },
            context: { industry: 'Healthcare', country: 'UK', continent: 'Europe', region: 'EU-West' }
        }
    },
    {
        severity: AlertSeverity.CRITICAL,
        title: 'In-Memory Threat Detected',
        description: 'YARA rule matched for Cobalt Strike beacon in memory.',
        raw_data: {
            process: 'rundll32.exe',
            memory_address: '0x00007FFD7A4E0000-0x00007FFD7A4F0000',
            signature: 'CobaltStrike.Beacon.Generic',
            device: { type: 'Server', os: 'Linux', hostname: 'WEB-SRV-03', ip_address: '172.16.30.8', last_seen: '5m ago', agent_version: '3.2.0', firewall_status: 'Enabled', disk_encryption: 'Enabled', status: 'Alerting' },
            context: { industry: 'Manufacturing', country: 'Japan', continent: 'Asia', region: 'APAC' }
        }
    },
     {
        severity: AlertSeverity.HIGH,
        title: 'Weak Password Usage',
        description: 'User logged in with a known weak password.',
        raw_data: {
            application: 'Salesforce',
            username: 'amanda.b',
            password_strength: 'weak',
            device: { type: 'Laptop', os: 'macOS', hostname: 'MKTG-MAC-05', ip_address: '192.168.10.51', last_seen: 'Just now', agent_version: '3.1.5', firewall_status: 'Enabled', disk_encryption: 'Enabled', status: 'Online' },
            context: { industry: 'Retail', country: 'USA', continent: 'North America', region: 'NA-West' }
        }
    },
     {
        severity: AlertSeverity.HIGH,
        title: 'Anomalous DB Query',
        description: 'Anomalous database query from a non-standard host.',
        raw_data: {
            process: 'sqlplus.exe',
            user: 'prod_db_user',
            query: 'SELECT * FROM customers;',
            device: { type: 'Server', os: 'Linux', hostname: 'APP-SRV-01', ip_address: '172.16.30.15', last_seen: '30s ago', agent_version: '3.2.0', firewall_status: 'Enabled', disk_encryption: 'Enabled', status: 'Online' },
            context: { industry: 'Financial', country: 'Brazil', continent: 'South America', region: 'SA-East' }
        }
    },
    {
        severity: AlertSeverity.MEDIUM,
        title: 'Mobile Phishing Link Access',
        description: 'User clicked on a known phishing link from a mobile device.',
        raw_data: {
            url: 'http://totally-safe-bank.com/login',
            application: 'Chrome',
            device: { type: 'Mobile', os: 'Android', hostname: 'samsung-sm-g998u1', ip_address: '100.80.15.2', last_seen: '1m ago', agent_version: '2.5.1', firewall_status: 'Enabled', disk_encryption: 'Enabled', status: 'Online' },
            context: { industry: 'Retail', country: 'Australia', continent: 'Australia', region: 'APAC' }
        }
    },
];

const externalIntelSources: Omit<LearningUpdate, 'details'>[] = [
    { source: 'MITRE ATT&CK', summary: 'Updated adversary tactics for T1059 (Command-Line Interface).' },
    { source: 'VirusTotal', summary: 'New IOC hashes detected for Emotet malware family.' },
    { source: 'AlienVault OTX', summary: 'Ingested pulse for recent phishing campaigns targeting financial sector.' },
    { source: 'Microsoft Defender', summary: 'New behavioral analytics model for detecting lateral movement.'},
    { source: 'Splunk SIEM', summary: 'Correlated low-and-slow C2 traffic across multiple tenants.'},
    { source: 'Antivirus Detections', summary: 'Increased global detections of SmokeLoader backdoor.'},
];

const vulnerabilityIntelSources: LearningUpdate[] = [
    { 
      source: 'NVD/EPSS', 
      summary: 'High EPSS score for Log4j vulnerability indicates active exploitation.',
      details: { cve_id: 'CVE-2021-44228', cvss_score: 10.0, affected_software: 'Apache Log4j2', advisory_link: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228' }
    },
    { 
      source: 'Exploit-DB', 
      summary: 'New public exploit script available for recent Microsoft Exchange vulnerability.',
      details: { cve_id: 'CVE-2024-21410', cvss_score: 9.8, affected_software: 'Microsoft Exchange Server', advisory_link: 'https://www.exploit-db.com/exploits/51943' }
    },
     { 
      source: 'OSV', 
      summary: 'Critical vulnerability in popular open-source library `left-pad` discovered.',
      details: { cve_id: 'OSV-2024-1234', cvss_score: 9.1, affected_software: 'left-pad@1.3.0', advisory_link: 'https://osv.dev/vulnerability/OSV-2024-1234' }
    },
];

const App: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [serverEvents, setServerEvents] = useState<ServerEvent[]>([]);
    const [knowledgeLevel, setKnowledgeLevel] = useState(10);
    const [agentKnowledgeLevel, setAgentKnowledgeLevel] = useState(5);
    const [isDeploymentModalOpen, setDeploymentModalOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [isAnalyticsModalOpen, setAnalyticsModalOpen] = useState(false);
    const [isReleaseNotesModalOpen, setReleaseNotesModalOpen] = useState(false);
    const [selectedDetailItem, setSelectedDetailItem] = useState<AllEventTypes | null>(null);
    const [contextualThreatTracker, setContextualThreatTracker] = useState<Record<string, { count: number; titles: Set<string> }>>({});
    const [correlationActivity, setCorrelationActivity] = useState<number[]>(new Array(20).fill(0));
    const [learningLog, setLearningLog] = useState<KnowledgeContribution[]>([]);
    
    const intervalRef = useRef<number | undefined>();
    let alertCounter = 0;
    
    const logKnowledgeContribution = useCallback((source: string, points: number) => {
        setKnowledgeLevel(currentLevel => {
            const newTotal = Math.min(100, currentLevel + points);
            const newEntry: KnowledgeContribution = {
                id: `log-${Date.now()}-${Math.random()}`,
                // FIX: Using undefined for locales in toLocaleTimeString for broader compatibility.
                timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                source,
                points,
                newTotal,
            };
            setLearningLog(prevLog => [newEntry, ...prevLog].slice(0, 100)); // Keep last 100 entries
            return newTotal;
        });
    }, []);

    const processAlert = useCallback(async (alert: Alert) => {
        const sanitized_data: Record<string, any> = {};
        for (const [key, value] of Object.entries(alert.raw_data || {})) {
            if (key === 'username') {
                sanitized_data['user_hash'] = await sha256(String(value));
            } else if (key === 'password_strength' && value === 'weak') {
                sanitized_data[key] = value;
            } else if (key === 'signature') {
                 sanitized_data['signature_hash'] = await sha256(String(value));
            } else if (!['device', 'context'].includes(key)) {
                sanitized_data[key] = value;
            }
        }

        const aggregatedEvent: AggregatedEvent = {
            title: alert.title,
            severity: alert.severity,
            count: 1,
            sanitized_data,
            first_seen: alert.timestamp,
            last_seen: alert.timestamp,
            context: alert.raw_data?.context,
        };

        const serverEvent: ServerEvent = {
            id: `se-${Date.now()}`,
            type: 'AGGREGATED_EVENT',
            timestamp: alert.timestamp,
            payload: aggregatedEvent,
        };
        setServerEvents(prev => [...prev, serverEvent]);

        let knowledgeGain = 0;
        let activitySpike = 0;
        if (alert.severity === AlertSeverity.CRITICAL) { 
            knowledgeGain += 0.8;
            activitySpike += 15;
        }
        if (alert.severity === AlertSeverity.HIGH) { 
            knowledgeGain += 0.4;
            activitySpike += 8;
        }
        if (alert.severity === AlertSeverity.MEDIUM) { 
            knowledgeGain += 0.2;
            activitySpike += 4;
        }
        
        if (knowledgeGain > 0) {
            logKnowledgeContribution(`${alert.severity} Alert: ${alert.title}`, knowledgeGain);
        }

        if (alert.raw_data?.context) {
            const contextKey = `${alert.raw_data.context.industry}|${alert.raw_data.context.region}`;
            setContextualThreatTracker(prev => {
                const newTracker = {...prev};
                const current = newTracker[contextKey] || { count: 0, titles: new Set() };
                current.count++;
                current.titles.add(alert.title);
                newTracker[contextKey] = current;
                return newTracker;
            });
        }
        
        if (alert.severity === AlertSeverity.CRITICAL) {
             const remediationEvent: ServerEvent = {
                id: `se-${Date.now()}-remediate`,
                type: 'AUTOMATED_REMEDIATION',
                timestamp: alert.timestamp,
                payload: {
                    threat_name: alert.title,
                    actions_taken: ['Isolate Host', 'Terminate Process Tree'],
                    target_host: alert.raw_data?.device.hostname || 'Unknown',
                } as AutomatedRemediation
            };
            setServerEvents(prev => [...prev, remediationEvent]);
            logKnowledgeContribution(`Remediation for: ${alert.title}`, 0.5);
            activitySpike += 10;
        }

        setCorrelationActivity(prev => [...prev.slice(1), activitySpike]);

    }, [logKnowledgeContribution]);

    const pushKnowledgeSync = useCallback(() => {
        const syncEvent: ServerEvent = {
            id: `se-${Date.now()}-sync`,
            type: 'KNOWLEDGE_SYNC',
            // FIX: Using undefined for locales in toLocaleTimeString for broader compatibility.
            timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            payload: {
                description: 'Pushed latest threat intelligence models and IOCs to fleet.',
                version: `v${(agentKnowledgeLevel + 0.1).toFixed(2)}`
            } as KnowledgeSync
        };
        setServerEvents(prev => [...prev, syncEvent]);
        setAgentKnowledgeLevel(prev => Math.min(100, prev + (Math.random() * 0.5 + 0.1)));
    }, [agentKnowledgeLevel]);


    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            alertCounter++;
            const now = new Date();

            if (alertCounter % 2 === 0 && sampleAlerts.length > 0) {
                const sample = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
                const newAlert: Alert = {
                    ...sample,
                    id: `alert-${now.getTime()}`,
                    // FIX: Using undefined for locales in toLocaleTimeString for broader compatibility.
                    timestamp: now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                };
                setAlerts(prev => [newAlert, ...prev].slice(0, 50));
                processAlert(newAlert);
            }
            
            if (alertCounter % 7 === 0) {
                const source: LearningUpdate = Math.random() > 0.3 ? externalIntelSources[Math.floor(Math.random() * externalIntelSources.length)] : vulnerabilityIntelSources[Math.floor(Math.random() * vulnerabilityIntelSources.length)];
                const learningEvent: ServerEvent = {
                    id: `se-${now.getTime()}`,
                    type: 'LEARNING_UPDATE',
                    // FIX: Using undefined for locales in toLocaleTimeString for broader compatibility.
                    timestamp: now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    payload: source as LearningUpdate,
                };
                setServerEvents(prev => [...prev, learningEvent]);
                const intelGain = source.details ? 1.0 : 0.5;
                logKnowledgeContribution(`Intel: ${source.source}`, intelGain);
                setCorrelationActivity(prev => [...prev.slice(1), 12]);
            }

            Object.entries(contextualThreatTracker).forEach(([key, data]) => {
                if (data.count > 1) { 
                    const [industry, region] = key.split('|');
                     const proactiveAlert: ServerEvent = {
                        id: `se-${now.getTime()}-proactive`,
                        type: 'PROACTIVE_ALERT_PUSH',
                        // FIX: Using undefined for locales in toLocaleTimeString for broader compatibility.
                        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        payload: {
                            title: `Heightened Threat Activity Detected`,
                            threat_summary: `Correlated multiple threats targeting the ${industry} industry in ${region}. Threats include: ${Array.from(data.titles).join(', ')}.`,
                            target_context: `${industry} Sector in ${region}`
                        } as ProactiveAlertPush
                    };
                    setServerEvents(prev => [...prev, proactiveAlert]);
                    logKnowledgeContribution(`Proactive Alert for ${industry}`, 1.2);
                    setContextualThreatTracker(prev => {
                        const newTracker = {...prev};
                        delete newTracker[key];
                        return newTracker;
                    });
                }
            });
            
            if (knowledgeLevel > agentKnowledgeLevel * 1.5 && Math.random() > 0.6) {
                pushKnowledgeSync();
            }

        }, 3000);

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    // FIX: Add logKnowledgeContribution to dependency array to prevent stale closures.
    }, [processAlert, knowledgeLevel, agentKnowledgeLevel, contextualThreatTracker, pushKnowledgeSync, logKnowledgeContribution]);


    const handleSend = async (prompt: string) => {
        setIsLoading(true);
        setChatHistory(prev => [...prev, { role: MessageRole.USER, content: prompt }]);
        
        try {
            const stream = await getChatResponse(prompt);
            let modelResponse = '';
            setChatHistory(prev => [...prev, { role: MessageRole.MODEL, content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].content = modelResponse;
                    return newHistory;
                });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            setChatHistory(prev => [...prev, { role: MessageRole.ERROR, content: message }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const [activeView, setActiveView] = useState<NavigationView>('Dashboard');

    const handleViewChange = (view: NavigationView) => {
        setActiveView(view);
        setSelectedDetailItem(null); // Clear detail view when changing main view
    }

    const handleSelectItem = (item: AllEventTypes) => {
        // For server events, we want a full-screen detail view
        if ('type' in item) {
             setActiveView('Server Intelligence'); // Switch view for context
             setSelectedDetailItem(item);
        }
    }

    const renderMainView = () => {
        switch(activeView) {
            case 'Dashboard':
                 return (
                    <DashboardView 
                        serverKnowledgeLevel={knowledgeLevel}
                        agentKnowledgeLevel={agentKnowledgeLevel}
                        serverEvents={serverEvents}
                        correlationActivity={correlationActivity}
                        onDeployClick={() => setDeploymentModalOpen(true)}
                        onSettingsClick={() => setSettingsModalOpen(true)}
                        onKnowledgeMeterClick={() => setAnalyticsModalOpen(true)}
                    />
                );
            case 'Agent Fleet':
                return <AgentFleetView alerts={alerts} />;
            case 'Server Intelligence':
                 return <ServerIntelligenceView events={serverEvents} onSelectItem={handleSelectItem} />;
            default:
                return null;
        }
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-900 text-gray-200 font-sans">
            <Header onVersionClick={() => setReleaseNotesModalOpen(true)} />
            <main className="flex-1 flex overflow-hidden">
                <NavigationSidebar 
                    activeView={activeView} 
                    onViewChange={handleViewChange} 
                />
                <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
                     {selectedDetailItem && activeView === 'Server Intelligence' ? (
                        <DetailView item={selectedDetailItem} onReturn={() => setSelectedDetailItem(null)} />
                     ) : (
                        renderMainView()
                     )}
                </div>
            </main>
             <ChatPanel 
                chatHistory={chatHistory}
                isLoading={isLoading}
                onSend={handleSend}
             />
            <DeploymentModal isOpen={isDeploymentModalOpen} onClose={() => setDeploymentModalOpen(false)} />
            <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
            <LearningAnalyticsModal isOpen={isAnalyticsModalOpen} onClose={() => setAnalyticsModalOpen(false)} log={learningLog} />
            <ReleaseNotesModal isOpen={isReleaseNotesModalOpen} onClose={() => setReleaseNotesModalOpen(false)} />
        </div>
    );
};

export default App;