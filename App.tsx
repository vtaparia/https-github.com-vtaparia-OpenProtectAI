
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, MessageRole, Alert, AlertSeverity, ServerEvent, AggregatedEvent, LearningUpdate, ProactiveAlertPush, AllEventTypes, DirectivePush, KnowledgeSync, LearningSource, AlertContext, KnowledgeContribution } from './types';
import { getChatResponse } from './services/geminiService';
import Header from './components/Header';
import ResponseDisplay from './components/ResponseDisplay';
import AlertFeed from './components/AlertFeed';
import ServerBrainFeed from './components/ServerBrainFeed';
import { sha256 } from './utils/hashing';
import DeploymentModal from './components/DeploymentModal';
import DashboardView from './components/DashboardView';
import DetailView from './components/DetailView';
import SettingsModal from './components/SettingsModal';
import PromptInput from './components/PromptInput';
import LearningAnalyticsModal from './components/LearningAnalyticsModal';

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
            signature: 'CobaltStrike.Beacon.Generic',
            device: { type: 'Server', os: 'Linux', hostname: 'WEB-SRV-03' },
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
            device: { type: 'Laptop', os: 'macOS', hostname: 'MKTG-MAC-05' },
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
            device: { type: 'Server', os: 'Linux', hostname: 'APP-SRV-01' },
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
            device: { type: 'Mobile', os: 'Android', hostname: 'samsung-sm-g998u1' },
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
      summary: 'Critical vulnerability in open-source library `left-pad` affecting numerous projects.',
      details: { cve_id: 'OSV-2022-1234', cvss_score: 8.5, affected_software: 'left-pad@1.3.0', advisory_link: 'https://osv.dev/' }
    },
];


const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Simulation State
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [serverEvents, setServerEvents] = useState<ServerEvent[]>([]);
  const [serverKnowledgeLevel, setServerKnowledgeLevel] = useState(45);
  const [agentKnowledgeLevel, setAgentKnowledgeLevel] = useState(60);
  const [correlationActivity, setCorrelationActivity] = useState<number[]>(Array(30).fill(0));
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<AllEventTypes | null>(null);
  const [learningLog, setLearningLog] = useState<KnowledgeContribution[]>([]);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  
  const [contextualThreatTracker, setContextualThreatTracker] = useState<Record<string, { count: number, threats: Set<string> }>>({});

  const intervalRef = useRef<number>();

  const updateServerKnowledge = useCallback((gain: number, source: string) => {
    setServerKnowledgeLevel(prev => {
        const newTotal = Math.min(100, prev + gain);
        const newContribution: KnowledgeContribution = {
            id: `kc-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            source,
            points: newTotal - prev,
            newTotal
        };
        setLearningLog(prevLog => [newContribution, ...prevLog.slice(0, 99)]);
        return newTotal;
    });
  }, []);

  const processAlert = useCallback(async (alert: Alert) => {
    // 1. Sanitize & Aggregate (Simulate LWServer)
    const sanitized_data: Record<string, any> = {};
    for (const [key, value] of Object.entries(alert.raw_data || {})) {
        if (key === 'username') {
            sanitized_data['user_hash'] = await sha256(String(value));
        } else if (key === 'password_strength') {
            sanitized_data[key] = value;
        } else if (key === 'signature') {
             sanitized_data['signature_hash'] = await sha256(String(value));
        } else if (key !== 'device' && key !== 'context') {
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
    
    // 2. Server Brain Learns & Acts
    setServerEvents(prev => [{ id: `se-${Date.now()}`, type: 'AGGREGATED_EVENT', timestamp: alert.timestamp, payload: aggregatedEvent }, ...prev]);
    
    let knowledgeGain = 0;
    let activitySpike = 0;
    switch(alert.severity) {
        case AlertSeverity.CRITICAL: knowledgeGain = 0.8; activitySpike = 10; break;
        case AlertSeverity.HIGH: knowledgeGain = 0.5; activitySpike = 7; break;
        case AlertSeverity.MEDIUM: knowledgeGain = 0.2; activitySpike = 4; break;
    }
    // High-impact detections give more knowledge
    if(alert.title === 'In-Memory Threat Detected') knowledgeGain *= 1.5;

    updateServerKnowledge(knowledgeGain, `${alert.severity} Alert: ${alert.title}`);
    setCorrelationActivity(prev => [...prev.slice(1), activitySpike]);

    // Contextual Threat Tracking
    if (alert.raw_data?.context) {
        const { industry, region } = alert.raw_data.context;
        const key = `${industry}|${region}`;
        setContextualThreatTracker(prev => {
            const newTracker = { ...prev };
            if (!newTracker[key]) {
                newTracker[key] = { count: 0, threats: new Set() };
            }
            newTracker[key].count += 1;
            newTracker[key].threats.add(alert.title);
            return newTracker;
        });
    }

  }, [updateServerKnowledge]);

  useEffect(() => {
    // Main simulation loop
    intervalRef.current = window.setInterval(() => {
      // 1. Maybe a new alert comes in
      if (Math.random() < 0.6) {
        const sample = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
        const newAlert: Alert = {
          ...sample,
          id: `alert-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
        processAlert(newAlert);
      }

      // 2. Server learns from external sources
      if (Math.random() < 0.2) {
        const intelPool = [...externalIntelSources, ...vulnerabilityIntelSources];
        const intel = intelPool[Math.floor(Math.random() * intelPool.length)];
        const newEvent: ServerEvent = {
          id: `se-${Date.now()}`,
          type: 'LEARNING_UPDATE',
          timestamp: new Date().toLocaleTimeString(),
          payload: intel,
        };
        setServerEvents(prev => [newEvent, ...prev]);
        updateServerKnowledge(0.3, `Intel: ${intel.source}`);
        setCorrelationActivity(prev => [...prev.slice(1), 5]); // Intel ingestion causes activity
      }
      
      // 3. Server maybe pushes a directive
      if (Math.random() < 0.1) {
          const newDirective: DirectivePush = { title: 'New Behavioral Rule Deployed', description: 'Blocking anomalous PowerShell child processes.', target: 'All Agents' };
          setServerEvents(prev => [{ id: `se-${Date.now()}`, type: 'DIRECTIVE_PUSH', timestamp: new Date().toLocaleTimeString(), payload: newDirective }, ...prev]);
      }
      
      // 4. Server syncs knowledge if it has learned enough
      if (serverKnowledgeLevel > agentKnowledgeLevel + 5) {
          const newSync: KnowledgeSync = { description: 'Synchronizing latest threat models and IOCs.', version: `v1.${Math.floor(serverKnowledgeLevel)}` };
          setServerEvents(prev => [{ id: `se-${Date.now()}`, type: 'KNOWLEDGE_SYNC', timestamp: new Date().toLocaleTimeString(), payload: newSync }, ...prev]);
          setAgentKnowledgeLevel(prev => Math.min(100, prev + 5));
      }

      // 5. Check for contextual threat patterns
      Object.entries(contextualThreatTracker).forEach(([key, value]) => {
          if (value.count > 1) { // Threshold for proactive alert
              const [industry, region] = key.split('|');
              const newAlert: ProactiveAlertPush = {
                  title: 'Proactive Threat Alert',
                  threat_summary: `Detected correlated threat activity (${Array.from(value.threats).join(', ')}) targeting the ${industry} sector in ${region}.`,
                  target_context: `${industry} Sector - ${region}`
              };
              setServerEvents(prev => [{ id: `se-${Date.now()}`, type: 'PROACTIVE_ALERT_PUSH', timestamp: new Date().toLocaleTimeString(), payload: newAlert }, ...prev]);
              setContextualThreatTracker(prev => ({...prev, [key]: { count: 0, threats: new Set() }})); // Reset tracker
          }
      });
      
      // Natural decay of activity
      setCorrelationActivity(prev => [...prev.slice(1), Math.max(0, prev[prev.length - 1] * 0.8 - 0.1)]);

    }, 2500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [processAlert, agentKnowledgeLevel, serverKnowledgeLevel, contextualThreatTracker, updateServerKnowledge]);

  const handleSend = async (prompt: string) => {
    setIsLoading(true);
    setChatHistory((prev) => [...prev, { role: MessageRole.USER, content: prompt }]);

    try {
      const stream = await getChatResponse(prompt);
      let fullResponse = "";
      setChatHistory((prev) => [...prev, { role: MessageRole.MODEL, content: "" }]);

      for await (const chunk of stream) {
        // FIX: Per @google/genai guidelines, the response text is accessed via the .text property, not the .text() method.
        fullResponse += chunk.text;
        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content = fullResponse;
          return newHistory;
        });
      }
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: MessageRole.ERROR, content: (error as Error).message }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectItem = (item: AllEventTypes) => {
    setSelectedDetailItem(item);
  };
  
  const handleReturnToDashboard = () => {
    setSelectedDetailItem(null);
  };

  return (
    <div className="flex flex-col h-screen text-gray-200 font-sans bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Header />
      <main className="flex flex-1 p-4 gap-4 overflow-hidden">
        <AlertFeed alerts={alerts} onSelectItem={handleSelectItem} />
        
        <div className="flex-1 flex flex-col bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg overflow-hidden">
            {selectedDetailItem ? (
                <DetailView item={selectedDetailItem} onReturn={handleReturnToDashboard} />
            ) : (
                <DashboardView 
                    serverKnowledgeLevel={serverKnowledgeLevel}
                    agentKnowledgeLevel={agentKnowledgeLevel}
                    serverEvents={serverEvents}
                    correlationActivity={correlationActivity}
                    onDeployClick={() => setIsDeploymentModalOpen(true)}
                    onSettingsClick={() => setIsSettingsModalOpen(true)}
                    onKnowledgeMeterClick={() => setIsAnalyticsModalOpen(true)}
                />
            )}
        </div>
        
        <ServerBrainFeed events={serverEvents} onSelectItem={handleSelectItem} />
      </main>
      
       <footer className="shrink-0 p-4 border-t border-slate-700/50 bg-slate-900/75 backdrop-blur-lg">
         <div className="flex-1 flex flex-col gap-4">
            <ResponseDisplay chatHistory={chatHistory} isLoading={isLoading} />
            <PromptInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </footer>
      
      <DeploymentModal isOpen={isDeploymentModalOpen} onClose={() => setIsDeploymentModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <LearningAnalyticsModal 
        isOpen={isAnalyticsModalOpen} 
        onClose={() => setIsAnalyticsModalOpen(false)} 
        log={learningLog} 
      />

    </div>
  );
};

export default App;
