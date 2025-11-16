

import React from 'react';

interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Feature: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-semibold text-cyan-400">{title}</h4>
        <p className="text-gray-400 text-sm mt-1">{children}</p>
    </div>
);

const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl text-gray-200 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold">What's New in v1.9.8</h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-gray-100">Advanced Agent Baselining & Heuristics</h3>
            
            <Feature title="Dynamic Process Monitoring">
                Agents now track process start times and parent-child relationships, enhancing the contextual data available for resource consumption anomalies and improving investigation accuracy.
            </Feature>
            <Feature title="Contextual Anomaly Detection">
                The agent's intelligence is improved. Anomaly detection for CPU, memory, and network usage now more heavily weighs a process's historical behavior and fleet-wide intelligence from the server to reduce false positives.
            </Feature>
             <Feature title="Enhanced Ransomware Heuristics">
                The file-write monitoring logic has been refined to better distinguish between legitimate high-volume I/O (like backups) and malicious encryption patterns, improving the fidelity of ransomware alerts.
            </Feature>

            <div className="border-t border-slate-700 my-6"></div>

            <h3 className="text-lg font-bold text-gray-100">Previous Versions</h3>

            <h4 className="text-md font-semibold text-gray-300 mt-2">v1.9.7 - Smarter Agent Intelligence & Proactive Detection</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Behavioral Anomaly Detection">
                    Agents are now smarter, establishing dynamic baselines for CPU, memory, and network usage on each host. They can now detect and alert on abnormal resource consumption by comparing real-time activity against historical data and fleet-wide intelligence.
                </Feature>
                <Feature title="Proactive Ransomware & Worm Detection">
                    The agent's local analysis engine can now identify patterns of rapid, mass file modification. This allows for the early detection of ransomware and worm-like activity before widespread damage occurs.
                </Feature>
            </div>
            
            <h4 className="text-md font-semibold text-gray-300 mt-2">v1.9.6 - Advanced SOAR Playbook Triggers</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Complex Trigger Logic ('AND'/'OR')">
                    The playbook trigger engine now supports multiple conditions with 'AND'/'OR' logic. This allows for the creation of highly specific automation rules, such as `IF severity IS 'High' AND MITRE ID IS 'T1003.001'`.
                </Feature>
                <Feature title="Enhanced Playbook Editor">
                    The playbook editor has been redesigned to support the new complex trigger logic. You can now dynamically add and remove conditions and select the logical operator ('AND'/'OR') that joins them.
                </Feature>
            </div>
            
            <h4 className="text-md font-semibold text-gray-300 mt-2">v1.9.5 - Enhanced Agent Simulation</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="New Detection Scenarios">
                    The agent simulation is now more robust, generating alerts for new real-world threat scenarios like Resource Hijacking (cryptomining), high memory usage by unsigned processes, and potential data exfiltration patterns. This provides a richer dataset for analysis and playbook development.
                </Feature>
                <Feature title="Documentation Update">
                    The README has been updated to reflect the agent's enhanced capabilities, providing a clearer picture of the end-to-end data flow from endpoint to cloud.
                </Feature>
            </div>
            
            <h4 className="text-md font-semibold text-gray-300 mt-2">v1.9.4 - Documentation & Clarity Update</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Enhanced Agent Description">
                    The README has been updated with a detailed description of the simulated agent's real-time monitoring capabilities, including process collection, anomaly detection, and local analysis.
                </Feature>
            </div>

            <h4 className="text-md font-semibold text-gray-300 mt-2">v1.9.3 - MITRE ATT&CK® Framework Integration</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="New! MITRE ATT&CK Coverage View">
                    A new "MITRE ATT&CK" view has been added, providing a strategic matrix of adversary tactics and techniques. This view visualizes your security posture, highlighting detected threats and where you have automated playbook coverage.
                </Feature>
                <Feature title="Interactive Threat Matrix">
                    The matrix cells are color-coded to indicate status: blue for detected techniques and purple for techniques covered by an active SOAR playbook. This allows for quick identification of defensive gaps and areas with strong automation.
                </Feature>
            </div>
            
            <h4 className="text-md font-semibold text-gray-300 mt-2">v1.9.2 - SOAR Playbook Version Control</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                 <Feature title="New! Playbook Versioning">
                    Playbooks now have a full version history. Editing a playbook creates a new, timestamped version with change notes instead of overwriting, preserving all previous configurations for audit and rollback.
                </Feature>
                <Feature title="History & Rollback UI">
                    A new "History" button on each playbook opens a modal to view all previous versions. From this view, you can see change notes and instantly revert to any older version by setting it as active.
                </Feature>
            </div>
            
        </main>
         <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-md">
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ReleaseNotesModal;