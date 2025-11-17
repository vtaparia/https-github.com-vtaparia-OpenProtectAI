<!-- Copyright © 2024 OpenProtectAI. All Rights Reserved. -->

# OpenProtectAI

A dynamic, enterprise-ready admin console that simulates an AI-powered, self-learning cybersecurity platform, complete with an expert AI assistant for real-time architectural design and guidance.

This project demonstrates a sophisticated "single pane of glass" UI for monitoring and managing a global fleet of security agents, visualizing the server's intelligence-gathering process, and orchestrating automated responses to threats.

**[➡️ View API Documentation](./docs/api.md)**

## Core Features

### 1. Unified Enterprise Console
- **Professional "Single Pane of Glass" UI:** A modern, intuitive layout designed for security operations, providing a comprehensive overview of the entire security ecosystem.
- **Asset-Centric Navigation:** A master sidebar allows for seamless switching between core views: a high-level **Dashboard**, a detailed **Agent Fleet** management interface, the **LWServer Fleet** view, the deep-dive **Server Intelligence** feed, and the powerful **Automation** workspace.
- **Persistent AI Assistant:** A collapsible chat panel provides constant access to the OpenProtectAI assistant for architectural questions, code generation, and deployment guidance without leaving the console.

### 2. Intelligent Real-Time Endpoint Agent
The platform's agents provide deep, real-time visibility by performing intelligent, localized analysis. Each agent establishes a dynamic baseline of normal behavior for its host by monitoring **process start times, parent-child relationships**, CPU/memory utilization, and network activity over time. It then detects anomalies by comparing current activity against this **rich historical context** and against aggregated intelligence from the LWServer, which provides context from peer devices across the network. This allows the agent to proactively identify and alert on threats such as:
- **Behavioral Resource Abuse:** A process consuming an abnormal amount of CPU or memory compared to its own history or similar processes across the fleet, with added context from its parent process.
- **Anomalous Network Patterns:** Suspicious outbound traffic that deviates from established norms, potentially indicating C2 communication or data exfiltration.
- **Ransomware & Worm-like Behavior:** The agent's local analysis engine uses **refined heuristics** to detect patterns of rapid, mass file modification across the filesystem. It's designed to distinguish between legitimate high-volume I/O and malicious encryption patterns, triggering immediate, high-priority alerts for ransomware or wiper malware.

Security-relevant events are reported as structured JSON alerts, providing rich context for the central server's learning engine. Agents also receive updated security rules, AI models, and behavioral profiles from the server to continuously enhance their local detection capabilities.

### 3. AI-Powered Central Brain & Global Intelligence Fusion
The platform's core is a self-learning "Central Brain" designed to continuously enhance its intelligence and detection capabilities by fusing data from a vast security ecosystem. This creates a powerful, proactive defense system.

-   **Broad Ecosystem Integration:** The server is engineered to integrate with and absorb real-world attack signals from a diverse range of security tools and threat feeds, including **CrowdStrike, SentinelOne, OSQuery, Zeek, ELK,** and open-source intelligence sources (OTX, AbuseIPDB, etc.). This creates a massive, unified dataset for analysis.

-   **AI-Powered Analysis Core:** An AI-powered "brain" using models like **Gemini, GPT, and Grok** sits at the heart of the server. It automatically analyzes telemetry patterns, learns from multi-source intelligence, and updates detection rules and behavioral models without requiring manual intervention.

-   **Global Knowledge Graph:** The server builds a global knowledge graph that links disparate security entities—processes, IP addresses, file hashes, user behaviors, CVEs, and ATT&CK techniques. This allows the server to understand complex relationships and attack chains the way a human analyst would, enabling more sophisticated threat detection.

-   **Continuous Learning Loop:** The entire system operates on a continuous, self-improving feedback loop. Agents send rich telemetry to the server, the server's AI brain trains itself on this data, and it then pushes improved intelligence, new detection rules, and updated models back to the entire agent fleet. This ensures the system grows smarter and more resilient over time.

### 4. Hardened Zero Trust Communication Fabric (mTLS)
All communication between agents, LWServers, and the central cloud platform is secured using a hardened Zero Trust model. Every service-to-service connection is authenticated and encrypted using **mutual TLS (mTLS)**. This means that every component must present a valid, signed client certificate to establish a connection, ensuring all data in transit is protected against interception. This prevents unauthorized access and man-in-the-middle attacks across the entire architecture.

### 5. LWServer Fleet Management
- **Architectural Visibility:** A dedicated "LWServer Fleet" view visualizes the platform's critical middle tier. It provides a real-time dashboard of all deployed LWServers, which act as the secure aggregation and sanitization points between endpoint agents and the central cloud.
- **Health & Performance Monitoring:** At a glance, view the operational status, connected agent count, data ingestion rates, and C2 latency for each LWServer in your global deployment.
- **Agent-to-Server Mapping:** The interactive master-detail interface allows you to select any LWServer to instantly see a list of all endpoint agents that are currently connected to and routing data through it, providing a clear map of your data flow.
- **LWServer Knowledge Meter:** A new meter on the main dashboard provides visibility into the collective intelligence level of the LWServer tier, showing how effectively it is processing and sanitizing data before it reaches the central server.

### 6. SOAR Playbook Automation
- **Automation Workspace:** A dedicated "Automation" view provides a user-friendly interface to create, edit, and manage simple, trigger-based automation rules (playbooks).
- **No-Code Playbook Editor:** Define "If-This-Then-That" logic to orchestrate security responses. For example: `IF Alert.MITRE_ID IS "T1003.001" THEN Create Case AND Assign to "Tier 2 SOC"`.
- **Advanced Notification Actions:** Playbooks can be configured to send real-time notifications to external systems like **MS Teams, Slack, or Email**, integrating the platform directly into your existing SOC and IT workflows.
- **Playbook Version Control:** Every change to a playbook is saved as a new version with change notes. A full version history is available, allowing analysts to view past configurations and instantly roll back to any previous version.
- **Playbook Engine & Auditing:** The server's core logic runs incoming alerts against active playbooks. When a playbook is triggered, a "Playbook Triggered" event is logged in the Server Intelligence feed for a complete audit trail.

### 7. Advanced Agent Fleet Management
- **Enterprise-Grade Asset Table:** A dedicated "Agent Fleet" view provides a powerful interface for managing a diverse fleet of simulated agents (Windows, Linux, macOS, etc.).
- **Rich Contextual Details:** Selecting an agent provides a detailed drill-down, including its full posture, recent alerts, and automated remediation history.
- **Centralized Upgrades:** Initiate fleet-wide agent upgrades directly from the console, with a built-in compatibility matrix to prevent deployment issues.
- **Integrated Case Management:** Create, assign, and resolve incident cases directly from an agent's alert feed, streamlining the response workflow.

### 8. MITRE ATT&CK® Coverage View
- **Strategic Threat Matrix:** A new "MITRE ATT&CK" view provides an interactive matrix that maps detected threats and automated responses to the industry-standard framework.
- **Gap Analysis:** Instantly visualize your security posture: blue cells indicate detected techniques, and purple cells show techniques covered by an active SOAR playbook. This allows security teams to identify defensive gaps and prioritize where to build new automation.

### 9. Copyright & License
This project and its source code are the intellectual property of OpenProtectAI.
**© 2024 OpenProtectAI. All Rights Reserved.**