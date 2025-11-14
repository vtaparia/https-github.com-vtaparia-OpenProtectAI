
import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [scanFrequency, setScanFrequency] = useState('4h');
  const [logVerbosity, setLogVerbosity] = useState('Normal');
  const [sensitivity, setSensitivity] = useState(2);
  const [syncing, setSyncing] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) {
    return null;
  }
  
  const handleSave = () => {
    // In a real app, this would send settings to a server
    console.log({ scanFrequency, logVerbosity, sensitivity });
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        onClose();
    }, 1500);
  };

  const handleSync = () => {
    setSyncing(true);
    // Simulate API call
    setTimeout(() => {
        setSyncing(false);
    }, 2000);
  };
  
  const sensitivityLabels = ['Low', 'Medium', 'High', 'Very High'];

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
          <h2 className="text-xl font-bold">Agent Fleet Configuration</h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 space-y-6">
            <div>
                <label htmlFor="scan-frequency" className="block text-sm font-medium text-gray-300 mb-1">Active Scan Frequency</label>
                <select 
                    id="scan-frequency" 
                    value={scanFrequency}
                    onChange={(e) => setScanFrequency(e.target.value)}
                    className="w-full bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                >
                    <option value="1h">Every 1 Hour</option>
                    <option value="4h">Every 4 Hours</option>
                    <option value="12h">Every 12 Hours</option>
                    <option value="24h">Every 24 Hours</option>
                </select>
            </div>
            <div>
                <label htmlFor="log-verbosity" className="block text-sm font-medium text-gray-300 mb-1">Log Verbosity</label>
                <select 
                    id="log-verbosity"
                    value={logVerbosity}
                    onChange={(e) => setLogVerbosity(e.target.value)}
                    className="w-full bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                >
                    <option>Quiet</option>
                    <option>Normal</option>
                    <option>Verbose</option>
                </select>
            </div>
             <div>
                <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-300 mb-1">
                    Local Detection Sensitivity: <span className="font-bold text-cyan-400">{sensitivityLabels[sensitivity-1]}</span>
                </label>
                <input 
                    id="sensitivity"
                    type="range" 
                    min="1" 
                    max="4" 
                    value={sensitivity}
                    onChange={(e) => setSensitivity(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" 
                />
            </div>
             <div className="border-t border-gray-700 pt-4">
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-200 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {syncing ? 'Syncing Intelligence...' : 'Force Sync with LWServer'}
                </button>
             </div>
        </main>
        <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-transparent hover:bg-gray-700 rounded-md">
                Cancel
            </button>
            <button
                onClick={handleSave}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors ${saved ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-500'}`}
            >
                {saved ? 'Settings Saved!' : 'Save Changes'}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
