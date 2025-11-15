
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
          <h2 className="text-xl font-bold">What's New in v1.7.0</h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-gray-100">SOC Workflow Enhancements</h3>
            
            <Feature title="New! Case Assignment Workflow">
                To enhance the incident response lifecycle, newly created cases can now be assigned to specific security analysts from a dropdown. Assigning a case automatically transitions its status to "In Progress" and updates the main dashboard, providing a complete workflow for incident management.
            </Feature>
            
            <div className="border-t border-slate-700 my-6"></div>

            <h3 className="text-lg font-bold text-gray-100">Previous Versions</h3>
            
             <h4 className="text-md font-semibold text-gray-300 mt-2">v1.6.1 - Intelligence Enhancements</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="New Intel Source: Grok AI Analysis">
                    The server can now simulate leveraging a powerful Large Language Model (like Grok) to analyze complex, uncategorized threat data and generate actionable summaries.
                </Feature>
            </div>

            <h4 className="text-md font-semibold text-gray-300 mt-4">v1.6.0 - Incident Review & Auditing</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Incident Review View">
                    A new "Incident Review" section allows SOC managers to view, search, and audit all resolved cases, providing a complete historical record of past incidents.
                </Feature>
            </div>

            <h4 className="text-md font-semibold text-gray-300 mt-4">v1.5.0 - SOC Workflow &amp; Case Assignment</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Case Assignment Workflow">
                    To enhance the incident response lifecycle, cases can now be assigned to specific security analysts, automatically transitioning them to an "In Progress" state.
                </Feature>
            </div>


            <h4 className="text-md font-semibold text-gray-300 mt-4">v1.4.0 - Incident Response &amp; Case Management</h4>
            <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-700">
                <Feature title="Case Management System">
                    Analysts can create an investigation "Case" from any high or critical severity alert, assigning a unique Case ID for tracking.
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
