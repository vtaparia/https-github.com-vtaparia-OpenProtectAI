

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
          <h2 className="text-xl font-bold">What's New in v1.9.0</h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-gray-100">Automation & Orchestration</h3>
            
            <Feature title="New! SOAR Playbook Automation">
                A new "Automation" view has been added to the console. This provides a user-friendly interface to create and manage simple, trigger-based automation rules (playbooks) to orchestrate security responses (e.g., auto-create and assign cases).
            </Feature>

            <Feature title="Playbook Engine & Auditing">
                The server's core logic now includes a playbook engine that runs incoming alerts against active playbooks. When a playbook is triggered, a new "Playbook Triggered" event is logged in the Server Intelligence feed for a complete audit trail.
            </Feature>
            
            <div className="border-t border-slate-700 my-6"></div>

            <h3 className="text-lg font-bold text-gray-100">Previous Versions</h3>

            <h4 className="text-md font-semibold text-gray-300 mt-2">v1.8.1 - Extensibility & Configuration</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                 <Feature title="Multi-LLM Integration Framework">
                    The AI service is now a modular framework, making it easy for developers to switch between different LLM backends (e.g., Google Gemini, Groq, or a local Ollama instance) by securely changing server-side configuration.
                </Feature>
            </div>
            
            <h4 className="text-md font-semibold text-gray-300 mt-4">v1.8.0 - Incident Lifecycle Management</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Case Resolution Workflow">
                    The incident response lifecycle is now complete. Analysts can resolve "In Progress" cases by adding mandatory resolution notes, which closes out the investigation and moves the case to the Incident Review audit trail.
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