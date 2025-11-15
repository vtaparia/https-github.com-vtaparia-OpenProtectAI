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
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: "Internal Server Error."
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

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
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /v1/cases/{caseId}/assign:
    patch:
      tags:
        - Case Management
      summary: "Assign a case to an analyst"
      description: |
        Assigns an analyst to an existing case and updates its status to 'In Progress'. 
        This is an idempotent operation.
      parameters:
        - name: caseId
          in: path
          required: true
          description: The unique identifier of the case.
          schema:
            type: string
            example: "CASE-123456"
      requestBody:
        description: The analyst to assign to the case.
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                assignee_id:
                  type: string
                  description: "The unique ID of the security analyst."
                  example: "analyst-alice"
              required:
                - assignee_id
      responses:
        '200':
          description: "OK. The case has been successfully assigned."
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Case'
        '404':
          description: "Not Found. The specified caseId does not exist."
        '401':
          description: "Unauthorized. The user does not have permission to assign cases."

components:
  schemas:
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

    AlertContext:
      type: object
      properties:
        industry:
          type: string
          enum: [Financial, Healthcare, Government, Retail, Manufacturing]
        country:
          type: string
          example: "USA"
        continent:
          type: string
          example: "North America"
        region:
          type: string
          example: "NA-West"
      required:
        - industry
        - country
        - continent
        - region

    AggregatedEvent:
      type: object
      properties:
        title:
          type: string
          description: "The title of the detected event (e.g., 'Ransomware Behavior Detected')."
        severity:
          $ref: '#/components/schemas/AlertSeverity'
        count:
          type: integer
          description: "The number of times this event was observed in the aggregation window."
          example: 10
        sanitized_data:
          type: object
          description: "Key-value pairs of sanitized, non-sensitive data related to the event."
          additionalProperties: true
        first_seen:
          type: string
          format: date-time
          description: "Timestamp of the first occurrence."
        last_seen:
          type: string
          format: date-time
          description: "Timestamp of the last occurrence."
        context:
          $ref: '#/components/schemas/AlertContext'
      required:
        - title
        - severity
        - count
        - sanitized_data
        - first_seen
        - last_seen

    AggregatedEventBatch:
      type: array
      items:
        $ref: '#/components/schemas/AggregatedEvent'

    VulnerabilityDetails:
      type: object
      properties:
        cve_id:
          type: string
          example: "CVE-2021-44228"
        cvss_score:
          type: number
          format: float
          example: 10.0
        affected_software:
          type: string
          example: "Apache Log4j2"
        advisory_link:
          type: string
          format: uri
          example: "https://nvd.nist.gov/vuln/detail/CVE-2021-44228"
      required:
        - cve_id
        - cvss_score
        - affected_software
        - advisory_link

    LearningUpdate:
      type: object
      properties:
        source:
          type: string
          description: "The external source of the intelligence."
          enum: [MITRE ATT&CK, VirusTotal, AlienVault OTX, CVE Database, Splunk SIEM, Microsoft Defender, NVD/EPSS, OSV, Exploit-DB, Antivirus Detections]
        summary:
          type: string
          description: "A human-readable summary of the intelligence update."
        details:
          $ref: '#/components/schemas/VulnerabilityDetails'
      required:
        - source
        - summary

    ThreatIntelBatch:
      type: array
      items:
        $ref: '#/components/schemas/LearningUpdate'

    Error:
      type: object
      properties:
        code:
          type: string
          description: "An internal error code."
        message:
          type: string
          description: "A human-readable error message."
      required:
        - code
        - message
```