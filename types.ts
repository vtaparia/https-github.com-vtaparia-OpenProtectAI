// Copyright © 2024 OpenProtectAI. All Rights Reserved.

export const COPYRIGHT_NOTICE = '© 2024 OpenProtectAI. All Rights Reserved.';


export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  ERROR = 'error',
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export enum AlertSeverity {
  INFO = 'Info',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum CaseStatus {
    NEW = 'New',
    IN_PROGRESS = 'In Progress',
    RESOLVED = 'Resolved',
}

export interface Case {
    status: CaseStatus;
    alerts: Alert[];
    assignee?: string;
    resolution_notes?: string;
    resolved_at?: string;
}

export interface LWServer {
    id: string;
    hostname: string;
    location: string;
    status: 'Online' | 'Degraded' | 'Offline';
    connectedAgentCount: number;
    ingestionRate: number; // events/sec
    egressRate: number; // directives/min
    latencyMs: number;
}

export interface Device {
    type: 'Desktop' | 'Server' | 'Mobile' | 'Laptop' | 'IoT Device' | 'Firewall' | 'Cloud VM' | 'Container';
    os: 'Windows' | 'Linux' | 'Android' | 'macOS' | 'Embedded Linux' | 'PAN-OS' | 'Ubuntu';
    hostname: string;
    ip_address: string;
    last_seen: string;
    agent_version: string;
    firewall_status: 'Enabled' | 'Disabled';
    disk_encryption: 'Enabled' | 'Disabled';
    status: 'Online' | 'Offline' | 'Alerting';
    lwServerId: string;
}

export interface AlertContext {
    industry: 'Financial' | 'Healthcare' | 'Government' | 'Retail' | 'Manufacturing';
    country: string;
    continent: string;
    region: string;
}

export interface MitreMapping {
    tactic: string;
    technique: string;
    id: string; // e.g., "T1059.001"
}

export interface Alert {
  id: string;
  // FIX: Add missing timestamp property to the Alert interface to resolve type errors across the application.
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  raw_data?: Record<string, any> & { device: Device; context: AlertContext }; 
  caseId?: string;
  mitre_mapping?: MitreMapping;
}

export type LearningSource = 'MITRE ATT&CK' | 'VirusTotal' | 'AlienVault OTX' | 'CVE Database' | 'Splunk SIEM' | 'Microsoft Defender' | 'NVD/EPSS' | 'OSV' | 'Exploit-DB' | 'Antivirus Detections' | 'Grok AI Analysis' | 'CrowdStrike Falcon' | 'SentinelOne' | 'Zeek/Suricata' | 'OSQuery';

// --- SOAR PLAYBOOK TYPES ---
export interface PlaybookCondition {
    field: 'title' | 'severity' | 'device.os' | 'mitre_mapping.id';
    operator: 'is' | 'is_not';
    value: string;
}

export interface PlaybookTrigger {
    logicalOperator: 'AND' | 'OR';
    conditions: PlaybookCondition[];
}

export type PlaybookActionType = 'CREATE_CASE' | 'ASSIGN_CASE' | 'ISOLATE_HOST' | 'SEND_SLACK_MESSAGE' | 'SEND_TEAMS_MESSAGE' | 'SEND_EMAIL';

export interface PlaybookAction {
    type: PlaybookActionType;
    params?: {
        assignee?: string;      // For ASSIGN_CASE
        webhookUrl?: string;    // For SLACK, TEAMS
        channel?: string;       // For SLACK
        recipient?: string;     // For EMAIL
        subject?: string;       // For EMAIL
    };
}


export interface PlaybookVersion {
    versionId: string;
    createdAt: string;
    author: string;
    notes: string;
    trigger: PlaybookTrigger;
    actions: PlaybookAction[];
}

export interface Playbook {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    versions: PlaybookVersion[];
    activeVersionId: string;
}

export interface PlaybookTriggered {
    playbook_name: string;
    triggered_by_alert_title: string;
    target_host: string;
    actions_taken: string[];
}

export interface OutboundNotification {
    channel: 'Slack' | 'MS Teams' | 'Email';
    destination: string; // webhook url, channel name, or email address
    alert_title: string;
    playbook_name: string;
}


// --- SERVER EVENT TYPES ---
export interface ServerEvent {
  id:string;
  type: 'AGGREGATED_EVENT' | 'LEARNING_UPDATE' | 'DIRECTIVE_PUSH' | 'KNOWLEDGE_SYNC' | 'PROACTIVE_ALERT_PUSH' | 'AUTOMATED_REMEDIATION' | 'PLAYBOOK_TRIGGERED' | 'OUTBOUND_NOTIFICATION';
  timestamp: string;
  payload: AggregatedEvent | LearningUpdate | DirectivePush | KnowledgeSync | ProactiveAlertPush | AutomatedRemediation | PlaybookTriggered | OutboundNotification;
}

// Represents one or more agent alerts, aggregated and sanitized
export interface AggregatedEvent {
  title: string;
  severity: AlertSeverity;
  count: number;
  sanitized_data: Record<string, any>;
  first_seen: string;
  last_seen: string;
  context?: AlertContext;
  mitre_mapping?: MitreMapping;
}

// Represents the central server learning from external sources
export interface LearningUpdate {
  source: LearningSource;
  summary: string;
  details?: VulnerabilityDetails;
  mitre_mapping?: MitreMapping;
}

export interface VulnerabilityDetails {
    cve_id: string;
    cvss_score: number;
    affected_software: string;
    advisory_link: string;
}

// --- DIRECTIVE TYPES ---
export interface AgentUpgradeDirective {
    type: 'AGENT_UPGRADE';
    version: string;
    target_os: Device['os'] | 'All';
};

export interface YaraRuleUpdateDirective {
    type: 'YARA_RULE_UPDATE';
    rule_name: string;
    rule_content: string; // For simulation, this can be a summary
}

// Represents the server pushing new intelligence to agents
export type DirectivePayload = AgentUpgradeDirective | YaraRuleUpdateDirective;

export interface DirectivePush {
    directive: DirectivePayload;
}


// Represents the server syncing its knowledge to the LWServer/Agents
export interface KnowledgeSync {
    description: string;
    version: string;
}

// Represents a targeted, proactive warning to a specific group of agents
export interface ProactiveAlertPush {
    title: string;
    threat_summary: string;
    target_context: string; // e.g., "Financial Sector in Europe"
}

// Represents a single event that contributes to the server's knowledge
export interface KnowledgeContribution {
    id: string;
    timestamp: string;
    source: string; // e.g., "Critical Alert: Ransomware" or "Intel: VirusTotal"
    points: number;
    newTotal: number;
}

// Represents an automated response to a critical threat
export interface AutomatedRemediation {
    threat_name: string;
    actions_taken: ('Isolate Host' | 'Terminate Process Tree' | 'Delete File')[];
    target_host: string;
}


export type AllEventTypes = Alert | ServerEvent;

// FIX: Centralize AIProvider type definition
export type AIProvider = 'Google Gemini' | 'Groq' | 'Ollama';