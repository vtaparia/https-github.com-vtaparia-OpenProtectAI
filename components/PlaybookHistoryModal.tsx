
import React, { useState } from 'react';
import { Playbook, PlaybookVersion } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';

interface PlaybookHistoryModalProps {
    playbook: Playbook;
    onClose: () => void;
    onSetActiveVersion: (playbookId: string, versionId: string) => void;
}

const VersionDetails: React.FC<{ version: PlaybookVersion }> = ({ version }) => (
    <div className="mt-2 p-3 bg-slate-900/50 rounded-md text-xs space-y-2">
        <div>
            <h5 className="font-semibold text-gray-300">Trigger</h5>
            <p className="font-mono text-gray-400">IF alert.{version.trigger.field} IS "{version.trigger.value}"</p>
        </div>
        <div>
            <h5 className="font-semibold text-gray-300">Actions</h5>
            <ul className="list-disc list-inside font-mono text-gray-400">
                {version.actions.map((action, index) => (
                    <li key={index}>
                        {action.type}
                        {action.params?.assignee && ` (to: ${action.params.assignee})`}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


const PlaybookHistoryModal: React.FC<PlaybookHistoryModalProps> = ({ playbook, onClose, onSetActiveVersion }) => {
    const [viewingVersionId, setViewingVersionId] = useState<string | null>(null);

    const toggleView = (versionId: string) => {
        setViewingVersionId(prevId => prevId === versionId ? null : versionId);
    };
    
    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-3xl text-gray-200 flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <HistoryIcon />
                        Version History: {playbook.name}
                    </h2>
                    <button onClick={onClose} className="text-2xl font-light p-1 rounded-full leading-none hover:bg-gray-700">&times;</button>
                </header>
                <main className="p-6 flex-1 overflow-y-auto space-y-3">
                    {playbook.versions.slice().reverse().map((version, index) => {
                        const isActive = playbook.activeVersionId === version.versionId;
                        return (
                             <div key={version.versionId} className={`p-3 rounded-lg border-l-4 ${isActive ? 'bg-cyan-600/20 border-cyan-500' : 'bg-slate-900/50 border-slate-700'}`}>
                                 <div className="flex justify-between items-start">
                                     <div>
                                        <p className="font-semibold text-gray-200">
                                            Version {playbook.versions.length - index}
                                            {isActive && <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200">ACTIVE</span>}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(version.createdAt).toLocaleString()} by {version.author}</p>
                                        <p className="text-sm text-gray-300 italic mt-2">"{version.notes}"</p>
                                     </div>
                                     <div className="flex items-center gap-2 text-sm">
                                         <button onClick={() => toggleView(version.versionId)} className="font-semibold text-gray-400 hover:text-white">
                                            {viewingVersionId === version.versionId ? 'Hide' : 'View'}
                                         </button>
                                         {!isActive && (
                                            <button onClick={() => onSetActiveVersion(playbook.id, version.versionId)} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded-md">
                                                Set as Active
                                            </button>
                                         )}
                                     </div>
                                 </div>
                                 {viewingVersionId === version.versionId && <VersionDetails version={version} />}
                             </div>
                        )
                    })}
                </main>
                 <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 rounded-md">Close</button>
                </footer>
            </div>
        </div>
    );
};

export default PlaybookHistoryModal;
