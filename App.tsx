
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, MessageRole, Alert, AlertSeverity, ServerEvent, AggregatedEvent, LearningUpdate, ProactiveAlertPush, AllEventTypes } from './types';
import { getChatResponse } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ResponseDisplay from './components/ResponseDisplay';
import AlertFeed from './components/AlertFeed';
import ServerBrainFeed from './components/ServerBrainFeed';
import { sha256 } from './utils/hashing';
import DeploymentModal from './components/DeploymentModal';
import DashboardView from './components/DashboardView';
import DetailView from './components/DetailView';

const sampleAlerts: Omit<Alert, 'id' | 'timestamp'>[] = [
    {
        severity: AlertSeverity.CRITICAL,
        title: 'Ransomware Behavior Detected',
        description: 'Multiple files encrypted in rapid succession on host.',
        raw_data: { 
            process: 'svchost.exe', 
            file_count: 1024, 
            pattern: 'mass_encryption.fast',
            device: { type: 'Desktop', os: 'Windows', hostname: 'FINANCE-PC-01' },
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
            device: { type: 'Server', os: 'Windows', hostname: 'DC-01' },
            context: { industry: 'Government', country: 'Germany', continent: 'Europe', region: 'EU-Central' }
        }
    },
    {
        severity: AlertSeverity.MEDIUM,
        title: 'Anomalous Network Connection',
        description: 'Outbound connection to a known malicious IP address.',
        raw_data: { 
            process: 'powershell.exe', 
            destination_ip: '104.21.5.19',
            port: 4444,
            device: { type: 'Desktop', os: 'Windows', hostname: 'HR-PC-22' },
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
            signature: 'CobaltStrike_Beacon_Generic',
            device: { type: 'Server', os: 'Windows', hostname: 'WEBSRV-03' },
            context: { industry: 'Retail', country: 'USA', continent: 'North America', region: 'NA-West' }
        }
    },
    {
        severity: AlertSeverity.HIGH,
        title: 'Weak Password Usage',
        description: 'User logged in to a critical application with a weak password.',
        raw_data: {
            application: 'Salesforce',
            username: 'amanda.b',
            password_strength: 'weak',
            source_ip: '203.0.113.55',
            device: { type: 'Laptop', os: 'macOS', hostname: 'amanda-macbook' },
            context: { industry: 'Retail', country: 'USA', continent: 'North America', region: 'NA-West' }
        }
    },
    {
        severity: AlertSeverity.MEDIUM,
        title: 'Anomalous Database Query',
        description: 'A non-standard process is querying the customer PII table.',
        raw_data: {
            process: 'python3',
            user: 'db_admin_backup',
            query_hash: 'a1b2c3d4...',
            database: 'customer_prod',
            device: { type: 'Server', os: 'Linux', hostname: 'db-primary-pg' },
            context: { industry: 'Retail', country: 'USA', continent: 'North America', region: 'NA-West' }
        }
    },
    {
        severity: AlertSeverity.HIGH,
        title: 'Mobile Phishing Link Access',
        description: 'User clicked on a known phishing URL from a corporate mobile device.',
        raw_data: {
            url: 'http://login.microsoft.com.security-update.xyz',
            browser: 'Chrome Mobile',
            device: { type: 'Mobile', os: 'Android', hostname: 'samsung-sm-g998u' },
            context: { industry: 'Financial', country: 'Canada', continent: 'North America', region: 'NA-East' }
        }
    },
    {
        severity: AlertSeverity.MEDIUM,
        title: 'Anomalous IoT Traffic',
        description: 'IoT camera initiated an outbound SSH connection.',
        raw_data: {
            protocol: 'SSH',
            destination_ip: '198.51.100.8',
            port: 22,
            device: { type: 'IoT Device', os: 'Embedded Linux', hostname: 'CAM-LOBBY-04' },
            context: { industry: 'Manufacturing', country: 'Japan', continent: 'Asia', region: 'APAC' }
        }
    },
    {
        severity: AlertSeverity.HIGH,
        title: 'Cloud Metadata API Abuse',
        description: 'Suspicious access to instance metadata service from a container.',
        raw_data: {
            source_ip: '169.254.169.254',
            user_agent: 'curl/7.64.0',
            path: '/latest/meta-data/iam/security-credentials/',
            device: { type: 'Cloud VM', os: 'Ubuntu', hostname: 'prod-runner-x86-abcd' },
            context: { industry: 'Retail', country: 'USA', continent: 'North America', region: 'NA-West' }
        }
    },
    {
        severity: AlertSeverity.CRITICAL,
        title: 'Container Escape Attempt',
        description: 'Process in container created a file in a sensitive host path.',
        raw_data: {
            container_id: 'c3a4b1d...',
            process: 'exploit.sh',
            host_path: '/proc/sys/kernel/core_pattern',
            device: { type: 'Container', os: 'Linux', hostname: 'k8s-node-42' },
            context: { industry: 'Government', country: 'Germany', continent: 'Europe', region: 'EU-Central' }
        }
    }
];

const externalIntelSources: Omit<LearningUpdate, 'id' | 'timestamp'>[] = [
    {
        source: 'NVD/EPSS',
        summary: 'New high-severity vulnerability in Apache Struts (CVE-2023-50164). EPSS score: 92.5%.',
        details: {
            cve_id: 'CVE-2023-50164',
            cvss_score: 9.8,
            affected_software: 'Apache Struts 2.x',
            advisory_link: 'https://nvd.nist.gov/vuln/detail/CVE-2023-50164'
        }
    },
    {
        source: 'VirusTotal',
        summary: 'File hash 275a021b... analyzed: 68/71 vendors flagged as LockBit 3.0 ransomware.',
    },
    {
        source: 'Exploit-DB',
        summary: 'Public exploit code published for VMware vCenter Server bug (CVE-2023-34048).',
        details: {
            cve_id: 'CVE-2023-34048',
            cvss_score: 9.8,
            affected_software: 'VMware vCenter Server',
            advisory_link: 'https://www.exploit-db.com/exploits/51869'
        }
    },
    {
        source: 'OSV',
        summary: 'Vulnerability in popular NPM package `jsonwebtoken` allows remote code execution.',
        details: {
            cve_id: 'CVE-2022-23529',
            cvss_score: 7.2,
            affected_software: 'jsonwebtoken < 9.0.0',
            advisory_link: 'https://osv.dev/vulnerability/GHSA-27h2-hgpw-p957'
        }
    },
    {
        source: 'AlienVault OTX',
        summary: 'New pulse created for FIN7 threat actor C2 infrastructure. Ingested 150+ new IP IOCs.',
    },
    {
        source: 'Antivirus Detections',
        summary: 'Correlated global telemetry: 30% spike in detections for Trojan:Win32/Wacatac.B!ml.',
    },
    {
        source: 'NVD/EPSS',
        summary: 'Critical vulnerability in Progress MOVEit Transfer (CVE-2023-34362) actively exploited.',
        details: {
            cve_id: 'CVE-2023-34362',
            cvss_score: 9.8,
            affected_software: 'MOVEit Transfer',
            advisory_link: 'https://nvd.nist.gov/vuln/detail/CVE-2023-34362'
        }
    },
];

const App: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [serverEvents, setServerEvents] = useState<ServerEvent[]>([]);
    const [knowledgeLevel, setKnowledgeLevel] = useState(10);
    const [agentKnowledgeLevel, setAgentKnowledgeLevel] = useState(15);
    const [contextualThreatTracker, setContextualThreatTracker] = useState<Record<string, { count: number; threats: Set<string> }>>({});
    const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);
    const [selectedDetailItem, setSelectedDetailItem] = useState<AllEventTypes | null>(null);
    const intervalRef = useRef<number | undefined>();

    const pushServerEvent = useCallback((type: ServerEvent['type'], payload: ServerEvent['payload']) => {
        setServerEvents(prev => [{
            id: crypto.randomUUID(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            type,
            payload
        }, ...prev.slice(0,99)]);
    }, []);
    
    const processAlert = useCallback(async (alert: Alert) => {
        const sanitized_data: Record<string, any> = {};
        for (const [key, value] of Object.entries(alert.raw_data ?? {})) {
            if (key === 'username') {
                // FIX: Ensure value is a string before hashing to prevent potential errors.
                sanitized_data['user_hash'] = await sha256(String(value));
            } else if (key === 'password_strength') {
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
            context: alert.raw_data?.context
        };
        pushServerEvent('AGGREGATED_EVENT', aggregatedEvent);

        let knowledgeGain = 0;
        switch(alert.severity) {
            case AlertSeverity.CRITICAL: knowledgeGain = 0.8; break;
            case AlertSeverity.HIGH: knowledgeGain = 0.5; break;
            case AlertSeverity.MEDIUM: knowledgeGain = 0.2; break;
        }
        if (alert.title === 'In-Memory Threat Detected') knowledgeGain *= 2;
        
        setKnowledgeLevel(prev => Math.min(100, prev + knowledgeGain));

        if (alert.raw_data?.context) {
            const { industry, region } = alert.raw_data.context;
            const key = `${industry}|${region}`;
            
            setContextualThreatTracker(prev => {
                const newTracker = {...prev};
                const current = newTracker[key] || { count: 0, threats: new Set() };
                current.count += 1;
                current.threats.add(alert.title);

                if (current.count > 2 && Object.keys(newTracker).every(k => newTracker[k].count <= current.count)) {
                     pushServerEvent('PROACTIVE_ALERT_PUSH', {
                        title: `Proactive Alert: Increased Threat Activity`,
                        threat_summary: `Correlated multiple threats (${Array.from(current.threats).join(', ')}) targeting the ${industry} industry in ${region}.`,
                        target_context: `${industry} Sector in ${region}`
                    });
                    current.count = 0;
                    current.threats.clear();
                }
                newTracker[key] = current;
                return newTracker;
            });
        }

    }, [pushServerEvent]);

    const pushKnowledgeSync = useCallback(() => {
        const version = `${new Date().getFullYear()}.${Date.now()}`;
        pushServerEvent('KNOWLEDGE_SYNC', {
            description: 'Synchronizing latest threat models and behavioral rules.',
            version: version,
        });
        setAgentKnowledgeLevel(prev => Math.min(100, prev + 2.5));
    }, [pushServerEvent]);

    const pushDirective = useCallback(() => {
        pushServerEvent('DIRECTIVE_PUSH', {
            title: 'Deploy New Behavioral Rule',
            description: 'Blocking PowerShell execution from Office products with network connections.',
            target: 'All Agents'
        });
    }, [pushServerEvent]);
    

    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            const alertTemplate = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
            const newAlert: Alert = {
                ...alertTemplate,
                id: crypto.randomUUID(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            };
            setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
            processAlert(newAlert);

            if (Math.random() > 0.6) {
                const intel = externalIntelSources[Math.floor(Math.random() * externalIntelSources.length)];
                pushServerEvent('LEARNING_UPDATE', intel);
                setKnowledgeLevel(prev => Math.min(100, prev + 0.5));
            }

            if (knowledgeLevel > 30 && Math.random() > 0.85) {
                pushDirective();
            }
            if (knowledgeLevel > agentKnowledgeLevel + 10 && Math.random() > 0.7) {
                pushKnowledgeSync();
            }

        }, 3000);

        return () => window.clearInterval(intervalRef.current);
    }, [processAlert, pushDirective, pushKnowledgeSync, knowledgeLevel, agentKnowledgeLevel]);


    const handleSend = async (prompt: string) => {
        setIsLoading(true);
        setChatHistory(prev => [...prev, { role: MessageRole.USER, content: prompt }]);

        try {
            const stream = await getChatResponse(prompt);
            let fullResponse = '';
            setChatHistory(prev => [...prev, { role: MessageRole.MODEL, content: '' }]);

            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].content = fullResponse;
                    return newHistory;
                });
            }
        } catch (error) {
            setChatHistory(prev => [...prev, { role: MessageRole.ERROR, content: (error as Error).message }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col h-screen font-sans text-gray-200">
                <Header />
                <main className="flex-1 flex gap-4 p-4 overflow-hidden">
                    <AlertFeed 
                        alerts={alerts} 
                        onSelectItem={setSelectedDetailItem}
                    />
                    
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
                        {selectedDetailItem ? (
                            <DetailView 
                                item={selectedDetailItem}
                                onReturn={() => setSelectedDetailItem(null)}
                            />
                        ) : (
                             <DashboardView
                                serverKnowledgeLevel={knowledgeLevel}
                                agentKnowledgeLevel={agentKnowledgeLevel}
                                serverEvents={serverEvents}
                                onDeployClick={() => setIsDeploymentModalOpen(true)}
                            />
                        )}
                    </div>

                    <ServerBrainFeed 
                        events={serverEvents} 
                        onSelectItem={setSelectedDetailItem}
                    />
                </main>
                <div className="p-4 pt-0">
                    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg p-4 max-w-4xl mx-auto">
                        <ResponseDisplay chatHistory={chatHistory} isLoading={isLoading} />
                        <PromptInput onSend={handleSend} isLoading={isLoading} />
                    </div>
                </div>
            </div>
            <DeploymentModal 
                isOpen={isDeploymentModalOpen} 
                onClose={() => setIsDeploymentModalOpen(false)} 
            />
        </>
    );
};

export default App;
