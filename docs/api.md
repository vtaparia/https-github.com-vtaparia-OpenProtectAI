

# API Documentation (OpenAPI 3.0)

This document outlines the core APIs for the self-learning security platform. The endpoints are designed to be asynchronous, accepting data for processing into the main analysis pipeline.

## Authentication
In a production environment, these endpoints must be protected. A recommended approach is to use mutual TLS (mTLS), where both the client (LWServer) and the server present client certificates to authenticate each other, aligning perfectly with a Zero Trust model. For user-facing actions like case assignment, standard OAuth 2.0 bearer tokens would be used.

---

```yaml
openapi: 3.0.3
info:
  title: "OpenProtectAI - Self-Learning Security Platform API"
  description: "API for the central cloud platform, handling agent telemetry ingestion, threat intelligence fusion, and C2 communications."
  version: "1.0.0"
servers:
  - url: https://api.your-security-platform.com
    description: Production Server

tags:
  - name: Telemetry
    description: Endpoints for agent telemetry data ingestion.
  - name: Threat Intelligence
    description: Endpoints for external threat intelligence feed ingestion.
  - name: Case Management
    description: Endpoints for managing incident response cases.
  - name: Automation
    description: Endpoints for managing SOAR automation playbooks.

paths:
  /v1/telemetry/process:
    post:
      tags:
        - Telemetry
      summary: "Process aggregated agent telemetry"
      description: |
        Endpoint for LWServers to push sanitized and aggregated agent telemetry batches 
        to the central server for analysis and learning. This is an asynchronous endpoint;
        it acknowledges receipt of data for processing.
      requestBody:
        description: A batch of one or more aggregated events.
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AggregatedEventBatch'
      responses:
        '202':
          description: "Accepted. The telemetry batch has been successfully received and queued for processing."
        '400':
          description: "Bad Request. The request body is malformed or fails validation."
        '500':
          description: "Internal Server Error."

  /v1/intel/ingest:
    post:
      tags:
        - Threat Intelligence
      summary: "Ingest external threat intelligence"
      description: |
        Endpoint for the server's internal services to push newly fetched and normalized 
        threat intelligence from external sources (e.g., NVD, VirusTotal) into the learning pipeline.
      requestBody:
        description: A batch of one or more intelligence updates.
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ThreatIntelBatch'
      responses:
        '202':
          description: "Accepted. The intelligence batch has been successfully received and queued for processing."
        '400':
          description: "Bad Request. The request body is malformed."
  
  /v1/playbooks:
    get:
      tags:
        - Automation
      summary: "List all SOAR playbooks"
      description: "Retrieves a list of all configured automation playbooks."
      responses:
        '200':
          description: "A list of playbooks."
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Playbook'
    post:
      tags:
        - Automation
      summary: "Create a new SOAR playbook"
      description: "Creates a new automation playbook."
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Playbook'
      responses:
        '201':
          description: "Playbook created successfully."

  /v1/cases/{caseId}/assign:
    patch:
      tags:
        - Case Management
      summary: "Assign a case to an analyst"
      # ... (rest of the definition is the same)
      
  # ... (other case management endpoints)

components:
  schemas:
    PlaybookTrigger:
      type: object
      properties:
        field:
          type: string
          enum: [title, severity, device.os]
        operator:
          type: string
          enum: [is, is_not]
        value:
          type: string
      required: [field, operator, value]

    PlaybookAction:
      type: object
      properties:
        type:
          type: string
          enum: [CREATE_CASE, ASSIGN_CASE, ISOLATE_HOST]
        params:
          type: object
          properties:
            assignee:
              type: string
      required: [type]

    Playbook:
      type: object
      properties:
        id:
          type: string
          readOnly: true
        name:
          type: string
        description:
          type: string
        is_active:
          type: boolean
        trigger:
          $ref: '#/components/schemas/PlaybookTrigger'
        actions:
          type: array
          items:
            $ref: '#/components/schemas/PlaybookAction'
      required: [name, is_active, trigger, actions]

    # ... (other schemas like Alert, Case, etc.)
    
    AlertSeverity:
      type: string
      enum: [Info, Medium, High, Critical]
    
    CaseStatus:
      type: string
      enum: [New, In Progress, Resolved]
      
    Case:
      type: object
      properties:
        caseId:
          type: string
          example: "CASE-123456"
        status:
          $ref: '#/components/schemas/CaseStatus'
        assignee_id:
          type: string
          example: "analyst-alice"
        related_alerts:
          type: array
          items:
            type: string
            description: "Alert IDs related to this case."
        resolution_notes:
          type: string
        resolved_at:
          type: string
          format: date-time

    # ... (rest of the schemas)
```