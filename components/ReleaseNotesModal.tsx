

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
          <h2 className="text-xl font-bold">What's New in v1.5.0</h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-gray-100">SOC Workflow &amp; Case Assignment</h3>
            
            <Feature title="New: Case Assignment Workflow">
                To enhance the incident response lifecycle, cases can now be assigned to specific security analysts. Assigned cases automatically transition to an "In Progress" state, and the assignee is clearly displayed on the alert, creating a complete audit and accountability trail.
            </Feature>
             <Feature title="New: Assign Case Modal">
                An intuitive modal allows for the quick assignment of any new case to a predefined list of analysts, streamlining the SOC manager's workflow.
            </Feature>
            
            <div className="border-t border-slate-700 my-6"></div>

            <h3 className="text-lg font-bold text-gray-100">Previous Versions</h3>
            
            <h4 className="text-md font-semibold text-gray-300 mt-2">v1.4.0 - Incident Response &amp; Case Management</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Case Management System">
                    Analysts can create an investigation "Case" from any high or critical severity alert, assigning a unique Case ID for tracking.
                </Feature>
                <Feature title="Open Cases Dashboard">
                   The main dashboard includes a summary of open cases by status for an at-a-glance overview of the SOC's workload.
                </Feature>
            </div>


            <h4 className="text-md font-semibold text-gray-300 mt-4">v1.3.0 - Agent Action &amp; Remediation Visibility</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Agent Remediation History">
                    The Agent Fleet detail view now includes a 'Remediation History' section, showing all automated remediation actions taken on the selected agent.
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