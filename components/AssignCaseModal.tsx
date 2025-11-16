

import React, { useState } from 'react';

interface AssignCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string | null;
  onAssign: (caseId: string, assignee: string) => void;
}

const availableAnalysts = ['Alice', 'Bob', 'Charlie', 'Diana'];

const AssignCaseModal: React.FC<AssignCaseModalProps> = ({ isOpen, onClose, caseId, onAssign }) => {
  const [selectedAnalyst, setSelectedAnalyst] = useState(availableAnalysts[0]);

  if (!isOpen || !caseId) {
    return null;
  }
  
  const handleAssign = () => {
    onAssign(caseId, selectedAnalyst);
  };

  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-md text-gray-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Assign Case: <span className="text-cyan-400 font-mono">{caseId}</span></h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 space-y-4">
            <div>
                <label htmlFor="analyst-select" className="block text-sm font-medium text-gray-300 mb-1">Select Analyst</label>
                <select 
                    id="analyst-select" 
                    value={selectedAnalyst}
                    onChange={(e) => setSelectedAnalyst(e.target.value)}
                    className="w-full bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                >
                    {availableAnalysts.map(analyst => (
                        <option key={analyst} value={analyst}>{analyst}</option>
                    ))}
                </select>
            </div>
            <p className="text-xs text-gray-400">Assigning this case will change its status to 'In Progress' and notify the selected analyst.</p>
        </main>
        <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-transparent hover:bg-gray-700 rounded-md">
                Cancel
            </button>
            <button
                onClick={handleAssign}
                className="px-4 py-2 text-sm font-semibold text-white bg-yellow-600 hover:bg-yellow-500 rounded-md transition-colors"
            >
                Assign Case
            </button>
        </footer>
      </div>
    </div>
  );
};

export default AssignCaseModal;
