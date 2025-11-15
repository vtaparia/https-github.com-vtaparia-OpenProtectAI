
import React, { useState } from 'react';
import { Device } from '../types';
import { UpgradeIcon } from './icons/UpgradeIcon';

interface AgentUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiateUpgrade: (version: string, targetOs: Device['os'] | 'All') => void;
}

const compatibilityMatrix = [
    { version: '3.2.1', windows: '✅', macos: '✅', linux: '✅', android: '⚠️' },
    { version: '3.2.0', windows: '✅', macos: '✅', linux: '✅', android: '❌' },
    { version: '3.1.5', windows: '✅', macos: '✅', linux: '⚠️', android: '❌' },
    { version: '2.5.1', windows: '❌', macos: '❌', linux: '❌', android: '✅' },
];

const availableVersions = ['3.2.1', '3.2.0', '3.1.5'];
const availableOs: (Device['os'] | 'All')[] = ['All', 'Windows', 'Linux', 'macOS'];

const AgentUpgradeModal: React.FC<AgentUpgradeModalProps> = ({ isOpen, onClose, onInitiateUpgrade }) => {
    const [selectedVersion, setSelectedVersion] = useState<string>(availableVersions[0]);
    const [targetOs, setTargetOs] = useState<Device['os'] | 'All'>('All');

    if (!isOpen) {
        return null;
    }
    
    const handleUpgrade = () => {
        onInitiateUpgrade(selectedVersion, targetOs);
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
          <div 
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-3xl text-gray-200 flex flex-col max-h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <header className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <UpgradeIcon />
                    <h2 className="text-xl font-bold">Agent Upgrade & Compatibility</h2>
                </div>
                <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
            </header>

            <main className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">Compatibility Matrix</h3>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-700/50 text-xs uppercase text-gray-400">
                            <tr>
                                <th className="p-2">Version</th>
                                <th className="p-2">Windows</th>
                                <th className="p-2">macOS</th>
                                <th className="p-2">Linux</th>
                                <th className="p-2">Android</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {compatibilityMatrix.map(row => (
                                <tr key={row.version} className="hover:bg-slate-700/50">
                                    <td className="p-2 font-mono font-semibold">{row.version}</td>
                                    <td className="p-2 text-center">{row.windows}</td>
                                    <td className="p-2 text-center">{row.macos}</td>
                                    <td className="p-2 text-center">{row.linux}</td>
                                    <td className="p-2 text-center">{row.android}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     <p className="text-xs text-gray-500 mt-2">✅: Fully Supported, ⚠️: Partial Support, ❌: Not Supported</p>
                </div>
                <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-3">Initiate Fleet Upgrade</h3>
                    <div className="flex items-end gap-4 bg-slate-900/50 p-4 rounded-lg">
                        <div className="flex-1">
                            <label htmlFor="version-select" className="block text-sm font-medium text-gray-300 mb-1">Target Version</label>
                            <select
                                id="version-select"
                                value={selectedVersion}
                                onChange={e => setSelectedVersion(e.target.value)}
                                className="w-full bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                            >
                                {availableVersions.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                         <div className="flex-1">
                            <label htmlFor="os-select" className="block text-sm font-medium text-gray-300 mb-1">Target OS</label>
                            <select
                                id="os-select"
                                value={targetOs}
                                onChange={e => setTargetOs(e.target.value as Device['os'] | 'All')}
                                className="w-full bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                            >
                                {availableOs.map(os => <option key={os} value={os}>{os}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={handleUpgrade}
                            className="px-4 h-9 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-md transition-colors"
                        >
                            Push Upgrade
                        </button>
                    </div>
                </div>
            </main>
          </div>
        </div>
    );
};

export default AgentUpgradeModal;
