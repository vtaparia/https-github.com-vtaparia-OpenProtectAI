

import React, { useState } from 'react';
import { RefreshIcon } from './icons/RefreshIcon';
import { Theme, Density } from '../theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProvider: string;
  onReinitialize: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  density: Density;
  setDensity: (density: Density) => void;
}

const themeOptions: { id: Theme; name: string; bg: string; text: string; border: string; }[] = [
    { id: 'dark', name: 'Default Dark', bg: 'bg-slate-800', text: 'text-slate-200', border: 'border-slate-600' },
    { id: 'light', name: 'Light Mode', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
    { id: 'twilight', name: 'Twilight Blue', bg: 'bg-blue-950', text: 'text-blue-200', border: 'border-blue-800' },
];

const densityOptions: { id: Density; name: string }[] = [
    { id: 'compact', name: 'Compact' },
    { id: 'comfortable', name: 'Comfortable' },
];


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, activeProvider, onReinitialize, theme, setTheme, density, setDensity }) => {
  const [scanFrequency, setScanFrequency] = useState('4h');
  const [logVerbosity, setLogVerbosity] = useState('Normal');
  const [sensitivity, setSensitivity] = useState(2);
  const [syncing, setSyncing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reinitClicked, setReinitClicked] = useState(false);

  if (!isOpen) {
    return null;
  }
  
  const handleSave = () => {
    // In a real app, this would send settings to a server
    console.log({ scanFrequency, logVerbosity, sensitivity, theme, density });
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

  const handleReinitialize = () => {
    onReinitialize();
    setReinitClicked(true);
    setTimeout(() => setReinitClicked(false), 2000);
  }
  
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
          <h2 className="text-xl font-bold">Configuration</h2>
          <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
        </header>

        <main className="p-6 space-y-6">
            <div className="border-b border-gray-700 pb-6">
                 <h3 className="text-base font-semibold text-gray-300 mb-3">Appearance</h3>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
                         <div className="grid grid-cols-3 gap-3">
                            {themeOptions.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`p-3 text-sm rounded-lg border-2 text-center transition-all ${theme === t.id ? 'border-cyan-400 ring-2 ring-cyan-400/50' : `${t.border} hover:border-cyan-500/50`} ${t.bg} ${t.text}`}
                                >
                                    {t.name}
                                </button>
                            ))}
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-400 mb-2">UI Density</label>
                         <div className="flex bg-slate-700/50 p-1 rounded-lg">
                            {densityOptions.map(d => (
                                 <button
                                    key={d.id}
                                    onClick={() => setDensity(d.id)}
                                    className={`w-full py-1 text-sm rounded-md transition-colors ${density === d.id ? 'bg-cyan-600 text-white font-semibold' : 'text-gray-300 hover:bg-slate-600/50'}`}
                                 >
                                    {d.name}
                                 </button>
                            ))}
                         </div>
                     </div>
                 </div>
            </div>
             <div className="border-b border-gray-700 pb-6">
                <h3 className="text-base font-semibold text-gray-300 mb-3">Agent Fleet Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="scan-frequency" className="block text-sm font-medium text-gray-400 mb-1">Active Scan Frequency</label>
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
                        <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-400 mb-1">
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
                </div>
             </div>
            <div>
                <h3 className="text-base font-semibold text-gray-300 mb-3">AI Service Configuration</h3>
                <div className="bg-slate-900/50 p-3 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Current AI Provider:</span>
                        <span className="font-bold text-cyan-400">{activeProvider}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                        To switch providers (e.g., to Groq or Ollama) or update an API key, modify the server's environment variables and re-initialize the connection.
                    </p>
                    <button
                        onClick={handleReinitialize}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-200 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"
                    >
                        <RefreshIcon />
                        {reinitClicked ? 'Connection Reset!' : 'Re-initialize AI Connection'}
                    </button>
                </div>
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