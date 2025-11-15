
import React, { useState } from 'react';

interface ResolveCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string | null;
  onResolve: (caseId: string, notes: string) => void;
}

const ResolveCaseModal: React.FC<ResolveCaseModalProps> = ({ isOpen, onClose, caseId, onResolve }) => {
  const [notes, setNotes] = useState('');

  if (!isOpen || !caseId) {
    return null;
  }
  
  const handleResolve = () => {
    if (notes.trim()) {
        onResolve(caseId, notes.trim());
        setNotes('');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-lg text-gray-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Resolve Case: <span className="text-cyan-400 font-mono">{caseId}</span></h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 space-y-4">
            <div>
                <label htmlFor="resolution-notes" className="block text-sm font-medium text-gray-300 mb-1">Resolution Notes</label>
                <textarea
                  id="resolution-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter a summary of actions taken and the final resolution..."
                  className="w-full h-32 p-2 text-gray-200 bg-slate-700/50 border border-slate-600/80 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-shadow"
                />
            </div>
            <p className="text-xs text-gray-400">Resolving this case will close it for auditing. This action cannot be undone.</p>
        </main>
        <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-transparent hover:bg-gray-700 rounded-md">
                Cancel
            </button>
            <button
                onClick={handleResolve}
                disabled={!notes.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Mark as Resolved
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ResolveCaseModal;