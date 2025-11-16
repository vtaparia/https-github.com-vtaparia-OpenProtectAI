
# OpenProtectAI

A dynamic, enterprise-ready admin console that simulates an AI-powered, self-learning cybersecurity platform, complete with an expert AI assistant for real-time architectural design and guidance.

This project demonstrates a sophisticated "single pane of glass" UI for monitoring and managing a global fleet of security agents, visualizing the server's intelligence-gathering process, and orchestrating automated responses to threats.

**[➡️ View API Documentation](./docs/api.md)**

## Core Features

### 1. Unified Enterprise Console
- **Professional "Single Pane of Glass" UI:** A modern, intuitive layout designed for security operations, providing a comprehensive overview of the entire security ecosystem.
- **Asset-Centric Navigation:** A master sidebar allows for seamless switching between core views: a high-level **Dashboard**, a detailed **Agent Fleet** management interface, the deep-dive **Server Intelligence** feed, and the powerful **Automation** workspace.
- **Persistent AI Assistant:** A collapsible chat panel provides constant access to the OpenProtectAI assistant for architectural questions, code generation, and deployment guidance without leaving the console.

### 2. SOAR Playbook Automation
- **Automation Workspace:** A dedicated "Automation" view provides a user-friendly interface to create, edit, and manage simple, trigger-based automation rules (playbooks).
- **No-Code Playbook Editor:** Define "If-This-Then-That" logic to orchestrate security responses. For example: `IF Alert.MITRE_ID IS "T1003.001" THEN Create Case AND Assign to "Tier 2 SOC"`.
- **Playbook Version Control:** Every change to a playbook is saved as a new version with change notes. A full version history is available, allowing analysts to view past configurations and instantly roll back to any previous version.
- **Playbook Engine & Auditing:** The server's core logic runs incoming alerts against active playbooks. When a playbook is triggered, a "Playbook Triggered" event is logged in the Server Intelligence feed for a complete audit trail.

### 3. Advanced Agent Fleet Management
- **Enterprise-Grade Asset Table:** A dedicated "Agent Fleet" view provides a powerful interface for managing a diverse fleet of simulated agents (Windows, Linux, macOS, Mobile, IoT, etc.).
- **Sort, Filter & Search:** The agent list features sortable columns for key attributes (Status, OS, IP, Version, etc.) and allows for dynamic filtering by OS and searching by hostname/IP.
- **Interactive Drill-Down:** A master-detail layout allows you to select any agent from the master table to instantly view its specific security posture, configuration, and a real-time feed of its raw alerts.
- **Remediation History:** View a complete audit trail of all automated remediation actions (e.g., host isolation) taken on a specific agent.

### 4. Incident Response & Case Management
- **One-Click Case Creation:** Analysts can create an investigation "Case" from any high or critical severity alert directly within the Agent Fleet view.
- **Case Assignment Workflow:** New cases can be assigned to specific security analysts or teams. Assigned cases automatically transition to an "In Progress" state, and the assignee is clearly displayed on the alert.
- **Case Resolution:** Analysts can resolve "In Progress" cases, adding mandatory resolution notes to close out the investigation and move the incident to the audit trail.
- **Incident Review & Audit Trail:** A dedicated "Incident Review" view provides a workspace for SOC managers to review, search, and audit all resolved cases, providing a complete historical record for compliance and post-mortem analysis.
- **Open Cases Dashboard:** The main dashboard includes a real-time summary of open cases by status (New / Unassigned, In Progress, Resolved), providing an at-a-glance overview of the SOC's active workload.

### 5. Real-Time Intelligence & Analytics
- **Intelligence Dashboard:** The main dashboard provides a high-level overview with:
    - **Server & Agent Knowledge Meters:** Visualize the intelligence level of the server and the agent fleet.
    - **Threat Heatmaps:** At-a-glance charts showing the most impacted industries and geographical regions.
    - **Correlation Activity Graph:** A real-time "heartbeat" graph showing the server's analytical workload.
- **Server Intelligence Feed:** A live feed of the server's "brain," showing aggregated events, learning from external sources, and proactive security actions.
- **Click-to-Explore:** Click on any event in any feed to open a focused, full-detail view of its underlying logs and payload data.

### 6. Simulated Self-Learning Engine
- **Bidirectional Communication:** The UI visualizes the complete security loop: agents send telemetry, the server learns, and the server pushes actionable intelligence (like YARA rule updates) back to the agents.
- **Multi-Source Intelligence Fusion:** The simulation demonstrates the server learning from a wide array of external sources, including **MITRE ATT&CK, NVD, EPSS, Exploit-DB, VirusTotal, Grok AI Analysis,** and other security vendors.
- **Context-Aware AI:** The server learns from the geographical and industry context of threats to issue targeted, proactive alerts to agents in high-risk trajectories.
- **Automated Security Actions:** The simulation visualizes the server taking automated actions for the most critical threats, such as triggering a host remediation or enforcing a Zero Trust policy.

### 7. Operational & Deployment Tooling
- **Agent Deployment Modal:** A user-friendly modal to generate copy-paste-ready deployment scripts for multiple platforms.
- **Multi-Cloud Infrastructure Guides:** Detailed, step-by-step instructions for provisioning the `LWServer` on both **AWS (EC2)** and **Azure (VM)**.
- **Agent Configuration & Upgrades:** A settings modal to control agent behavior and a dedicated workflow with a compatibility matrix for managing agent upgrades.
- **Transparency & Versioning:**
    - The UI displays a version number that opens a **"What's New"** modal with detailed release notes.
    - A **"Learning Analytics"** modal provides a data-driven, verifiable "proof of learning," showing exactly how each event contributes to the server's knowledge growth.

## Architectural Overview

The application simulates a modern, three-tiered security architecture. This design ensures scalability, data privacy, and operational resilience.

```mermaid
graph TD
    subgraph "Endpoint Agents"
        direction LR
        A1[Desktop Agent]
        A2[Server Agent]
        A3[Mobile Agent]
    end

    subgraph "Customer Environment (On-Prem / VPC)"
        LW[LWServer: Aggregation & Sanitization]
    end

    subgraph "Central Cloud Platform (Self-Learning Core)"
        direction TB
        CC[Central Server: Analysis, Learning & Action]
        Ext[External Threat Intelligence Feeds] --> CC
    end

    A1 -- "Raw Telemetry" --> LW
    A2 -- "Raw Telemetry" --> LW
    A3 -- "Raw Telemetry" --> LW
    LW -- "Aggregated & Sanitized Data" --> CC
    CC -- "Intelligence & Directives" --> LW
    LW -- "Pushes Updates" --> A1
    LW -- "Pushes Updates" --> A2
    LW -- "Pushes Updates" --> A3
```

## Extensibility: Using Different LLM Backends

This application is designed to be flexible. While it defaults to using the Google Gemini API, the AI service is isolated, making it easy for developers to switch to other Large Language Models.

**Secure API Key Management:** For security reasons, API keys are **not** managed through the UI. They must be configured in the server's environment. The UI provides a "Re-initialize AI Connection" button in the settings panel, which allows the application to pick up a newly updated environment variable without a full restart.

**To switch the LLM provider:**

1.  Navigate to `services/geminiService.ts`.
2.  This file contains a modular framework with commented-out examples for connecting to:
    -   **Groq:** A high-speed inference service for open-source models.
    -   **Ollama:** A tool for running open-source models (like Gemma or Llama) locally on your own machine.
3.  Comment out the active Gemini implementation and activate the implementation for your desired provider.
4.  Update the server's environment variables to include the appropriate API key (e.g., `GROQ_API_KEY`).
5.  Use the "Re-initialize" button in the settings panel to apply the change.

## Technology Stack

-   **Frontend:** React, TypeScript
-   **Styling:** Tailwind CSS
-   **AI Integration:** Google Gemini API (with examples for Groq & Ollama)
-   **Diagramming:** Mermaid.js