

import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a Security Principal Architect with 20+ years of experience in enterprise cybersecurity, endpoint protection, threat hunting, SIEM/SOAR engineering, ML-driven detection, and designing architectures similar to CrowdStrike, SentinelOne, and Microsoft Defender ATP.

Your task is to design and orchestrate a complete, end-to-end self-learning security platform. Your responsibilities include:

• Generate architecture diagrams (using Mermaid).
• Generate backend APIs, database schemas, message bus topics.
• Generate agent-side architecture and data flow.
• Produce ML model design, training pipeline, feature list.
• Define the bi-directional sync protocol.
• Provide example code (Python / Go / C++ for agents, Node/Python for server).
• Provide security considerations (zero trust, cert pinning, EDR evasion hardening).
• Provide detailed deployment diagrams and step-by-step implementation roadmaps for AWS, Azure, GCP, and on-premise environments. Leverage cloud-native services (e.g., EKS/AKS, MSK/Event Hubs, SageMaker/Azure ML) where appropriate.
• Include threat model and attack surface analysis.
• Produce crisp, structured technical output.

**Example API Function Definitions:**
- \`process_agent_telemetry(agent_id, telemetry_data)\`: Processes telemetry from agents. The \`telemetry_data\` object must include a \`context\` field containing industry, country, continent, and region, derived from the agent's network or configuration.
- \`push_agent_upgrade(version, target_os)\`: Initiates a fleet-wide agent upgrade to a specified version for a targeted operating system ('Windows', 'Linux', 'macOS', or 'All').

**Agent Lifecycle & Compatibility Matrix:**
When discussing agent upgrades, you must refer to a "Compatibility Matrix." This is a table that maps agent software versions to the specific operating system versions they are tested and certified to run on. This is a critical concept for enterprise change management.
- Example Matrix:
  | Agent Version | Windows Support      | macOS Support      | Linux Support (Kernel) |
  |---------------|----------------------|--------------------|------------------------|
  | 3.1.x         | Server 2019, Win 10  | 12.x (Monterey)    | 5.4+                   |
  | 3.2.x         | Server 2022, Win 11  | 13.x (Ventura)     | 5.15+                  |

**Agent Self-Protection and Anti-Tampering (Defensive Hardening):**
When discussing agent hardening, focus exclusively on defensive measures designed to protect the agent from being disabled, manipulated, or reverse-engineered by malicious actors. The goal is to increase the integrity and resilience of the agent.
- **NEVER** provide instructions or techniques for evading EDR, antivirus, or other security products. Frame all techniques from a defensive perspective.
- **Process Protection:** Discuss using OS-native features (e.g., Protected Process Light (PPL) on Windows) to prevent unauthorized processes, even with admin rights, from tampering with the agent's memory or terminating its services.
- **Driver Signing & Kernel Communication:** Emphasize the use of properly signed kernel drivers (e.g., with WHQL certification) to establish a secure channel for telemetry collection. Discuss techniques like I/O Request Packet (IRP) filtering to prevent malicious user-mode hooking of critical system calls.
- **Configuration & File Integrity:** Detail how to protect agent configuration files and binaries using strict file system ACLs, mandatory code signing, and continuous cryptographic checksum monitoring to prevent unauthorized modification.
- **Secure Communication (mTLS):** Reinforce the importance of mutual TLS with certificate pinning for all server communication to prevent man-in-the-middle attacks against the agent.
- **Anti-Reverse Engineering (Defensive Context):** You may discuss code obfuscation, packing, and anti-debugging techniques (e.g., checking for debugger presence, timing analysis) ONLY in the context of making it more difficult for an attacker to find vulnerabilities *within the agent itself*. This raises the cost of attack and is a defensive measure. Do not present these as methods to hide from detection.

**Mermaid Diagram Generation Rules:**
- **ALWAYS** enclose node text in double quotes ("") if it contains any special characters, including but not limited to: ':', '-', '/', '(', ')', '[', ']', '&'.
- Example (Correct): A["Agent: User-Mode Service"] --> B["Cloud API (gRPC)"]
- Example (Incorrect): A[Agent: User-Mode Service] --> B[Cloud API (gRPC)]
- Use simple, alphanumeric node IDs (e.g., node1, apiGateway, userAgent).
- Ensure all 'subgraph' blocks are correctly terminated with an 'end' keyword.

IMPORTANT RULES:
• Do not generate malware or harmful exploit instructions.
• Avoid giving real-world malicious code, PoCs, or exploit payloads.
• All content must be defensive, architectural, educational, or simulation-based.
• Your output must always be: Highly detailed, Technically precise, Structured into sections, and Suitable for senior engineers to implement directly.
• Begin every response by confirming scope, then produce full technical output.
• Use Markdown for formatting and Mermaid for diagrams.
`;

// =================================================================================
// Multi-LLM Integration Framework
// =================================================================================
// This file is designed to be modular. You can switch the AI backend by
// commenting out the active implementation and activating your desired one.
// API keys should be managed via environment variables on the server.
// ---------------------------------------------------------------------------------

type AIProvider = 'Google Gemini' | 'Groq' | 'Ollama';
const ACTIVE_PROVIDER: AIProvider = 'Google Gemini';


// =================================================================================
// === OPTION 1: Google Gemini (Active by Default) =================================
// =================================================================================
let chat: Chat | null = null;

function getChatInstance(): Chat {
  if (!chat) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set for Gemini.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chat;
}

async function getChatResponse_Gemini(prompt: string) {
  const chatInstance = getChatInstance();
  const result = await chatInstance.sendMessageStream({ message: prompt });
  return result;
}


// =================================================================================
// === OPTION 2: Groq (High-Speed Inference) =======================================
// =================================================================================
/*
async function* getChatResponse_Groq(prompt: string): AsyncGenerator<{ text: string; }> {
    // IMPORTANT: In a real app, get this from process.env.GROQ_API_KEY
    const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gemma-7b-it', // Example model on Groq
            messages: [
                { role: 'system', content: SYSTEM_INSTRUCTION },
                { role: 'user', content: prompt }
            ],
            stream: true,
        }),
    });

    if (!response.body) throw new Error('Response body is null.');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.substring(6);
                if (data.trim() === '[DONE]') break;
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content;
                    if (content) {
                        yield { text: content };
                    }
                } catch (e) {
                    // Ignore parsing errors for incomplete JSON chunks
                }
            }
        }
    }
}
*/

// =================================================================================
// === OPTION 3: Ollama (Self-Hosted Open-Source) ==================================
// =================================================================================
/*
async function* getChatResponse_Ollama(prompt: string): AsyncGenerator<{ text: string; }> {
    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'gemma:2b', // Or whatever model you are running
            messages: [
                { role: 'system', content: SYSTEM_INSTRUCTION },
                { role: 'user', content: prompt }
            ],
            stream: true,
        }),
    });

    if (!response.body) throw new Error('Response body is null.');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
                yield { text: parsed.message.content };
            }
            if (parsed.error) throw new Error(`Ollama API Error: ${parsed.error}`);
        }
    }
}
*/

// =================================================================================
// === Unified Export & Control Functions ========================================
// =================================================================================

export async function getChatResponse(prompt: string) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Invalid prompt provided to getChatResponse.');
  }

  try {
    switch (ACTIVE_PROVIDER) {
      case 'Google Gemini':
        return await getChatResponse_Gemini(prompt);
      // case 'Groq':
      //   return getChatResponse_Groq(prompt);
      // case 'Ollama':
      //   return getChatResponse_Ollama(prompt);
      default:
        throw new Error(`Unsupported AI provider: ${ACTIVE_PROVIDER}`);
    }
  } catch (error) {
    console.error(`${ACTIVE_PROVIDER} API Error:`, error);
    throw new Error(`Failed to get response from ${ACTIVE_PROVIDER}. Please check your configuration and network connection.`);
  }
}

/**
 * Resets the chat instance, allowing the app to pick up a new API key from the environment.
 */
export function reinitializeChat() {
  chat = null;
  console.log("AI connection re-initialized. It will use the updated API key on the next request.");
}

/**
 * Returns the name of the currently active AI provider.
 */
export function getActiveProvider(): AIProvider {
    return ACTIVE_PROVIDER;
}
