

import React, { useState } from 'react';
import { Playbook, PlaybookAction, PlaybookTrigger, AlertSeverity } from '../types';
import { AutomationIcon } from './icons/NavIcons';
import { PlaybookIcon } from './icons/PlaybookIcon';

interface AutomationViewProps {
    playbooks: Playbook[];
    setPlaybooks: React.Dispatch<React.SetStateAction<Playbook[]>>;
    uniqueAlertTitles: string[];
    uniqueMitreIds: string[];
}

const PlaybookEditorModal: React.FC<{
    onClose: () => void;
    onSave: (playbook: Playbook) => void;
    existingPlaybook?: Playbook;
    uniqueAlertTitles: string[];
    uniqueMitreIds: string[];
}> = ({ onClose, onSave, existingPlaybook, uniqueAlertTitles, uniqueMitreIds }) => {
    const [name, setName] = useState(existingPlaybook?.name || '');
    const [description, setDescription] = useState(existingPlaybook?.description || '');
    const [triggerField, setTriggerField] = useState<PlaybookTrigger['field']>(existingPlaybook?.trigger.field || 'title');
    const [triggerValue, setTriggerValue] = useState(existingPlaybook?.trigger.value || uniqueAlertTitles[0]);
    const [createCase, setCreateCase] = useState(existingPlaybook?.actions.some(a => a.type === 'CREATE_CASE') || false);
    const [assignTo, setAssignTo] = useState(existingPlaybook?.actions.find(a => a.type === 'ASSIGN_CASE')?.params?.assignee || 'None');
    
    const analysts = ['None', 'Tier 1 SOC', 'Tier 2 SOC', 'Alice', 'Bob'];

    const handleSave = () => {
        const actions: PlaybookAction[] = [];
        if (createCase) {
            actions.push({ type: 'CREATE_CASE' });
        }
        if (assignTo !== 'None') {
            actions.push({ type: 'ASSIGN_CASE', params: { assignee: assignTo }});
        }

        const newPlaybook: Playbook = {
            id: existingPlaybook?.id || `playbook-${Date.now()}`,
            name,
            description,
            is_active: existingPlaybook?.is_active ?? true,
            trigger: {
                field: triggerField,
                operator: 'is',
                value: triggerValue,
            },
            actions,
        };
        onSave(newPlaybook);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl text-gray-200 flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">{existingPlaybook ? 'Edit' : 'Create'} Playbook</h2>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Playbook Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-700/80 border border-slate-600/80 rounded-lg p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-700/80 border border-slate-600/80 rounded-lg p-2 h-20 resize-none" />
                    </div>
                    <div className="border-t border-slate-700 pt-4">
                        <h3 className="text-lg font-semibold mb-2">Trigger ("IF")</h3>
                        <div className="flex items-center gap-2">
                             <span className="font-mono">IF Alert</span>
                             <select value={triggerField} onChange={e => {
                                const newField = e.target.value as PlaybookTrigger['field'];
                                 setTriggerField(newField);
                                 if (newField === 'title') {
                                     setTriggerValue(uniqueAlertTitles[0] || '');
                                 } else if (newField === 'mitre_mapping.id') {
                                     setTriggerValue(uniqueMitreIds[0] || '');
                                 } else if (newField === 'severity') {
                                     setTriggerValue(AlertSeverity.HIGH);
                                 }
                             }} className="bg-slate-700 rounded p-1">
                                <option value="title">Title</option>
                                <option value="severity">Severity</option>
                                <option value="mitre_mapping.id">MITRE ID</option>
                             </select>
                             <span className="font-mono">IS</span>
                             {triggerField === 'title' && (
                                <select value={triggerValue} onChange={e => setTriggerValue(e.target.value)} className="bg-slate-700 rounded p-1">
                                    {uniqueAlertTitles.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                             )}
                             {triggerField === 'mitre_mapping.id' && (
                                <select value={triggerValue} onChange={e => setTriggerValue(e.target.value)} className="bg-slate-700 rounded p-1">
                                    {uniqueMitreIds.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                             )}
                              {triggerField === 'severity' && (
                                <select value={triggerValue} onChange={e => setTriggerValue(e.target.value)} className="bg-slate-700 rounded p-1">
                                    {Object.values(AlertSeverity).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             )}
                        </div>
                    </div>
                    <div className="border-t border-slate-700 pt-4">
                        <h3 className="text-lg font-semibold mb-2">Actions ("THEN")</h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={createCase} onChange={e => setCreateCase(e.target.checked)} className="h-4 w-4 rounded bg-slate-700 text-cyan-500" />
                                <span>Create Case</span>
                            </label>
                             <div className="flex items-center gap-2">
                                <input type="checkbox" checked={assignTo !== 'None'} onChange={e => setAssignTo(e.target.checked ? analysts[1] : 'None')} className="h-4 w-4 rounded bg-slate-700 text-cyan-500" />
                                <span>Assign Case to:</span>
                                <select value={assignTo} onChange={e => setAssignTo(e.target.value)} disabled={assignTo === 'None'} className="bg-slate-700 rounded p-1 disabled:opacity-50">
                                    {analysts.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm bg-transparent hover:bg-gray-700 rounded-md">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 rounded-md">Save Playbook</button>
                </footer>
            </div>
        </div>
    );
};

const AutomationView: React.FC<AutomationViewProps> = ({ playbooks, setPlaybooks, uniqueAlertTitles, uniqueMitreIds }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingPlaybook, setEditingPlaybook] = useState<Playbook | undefined>(undefined);

    const handleSavePlaybook = (playbook: Playbook) => {
        setPlaybooks(prev => {
            const index = prev.findIndex(p => p.id === playbook.id);
            if (index > -1) {
                const newPlaybooks = [...prev];
                newPlaybooks[index] = playbook;
                return newPlaybooks;
            }
            return [...prev, playbook];
        });
    };
    
    const handleToggleActive = (playbookId: string) => {
        setPlaybooks(prev => prev.map(p => p.id === playbookId ? { ...p, is_active: !p.is_active } : p));
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
            <header className="p-4 border-b border-slate-700/50 shrink-0 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2"><AutomationIcon /> Automation & SOAR Playbooks</h2>
                    <p className="text-sm text-gray-400">Define automated responses to specific threats.</p>
                </div>
                 <button onClick={() => { setEditingPlaybook(undefined); setIsEditorOpen(true); }} className="px-4 py-2 text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 rounded-md">
                    Create New Playbook
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {playbooks.map(playbook => (
                    <div key={playbook.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <PlaybookIcon />
                            <div>
                                <h3 className="font-bold text-gray-100">{playbook.name}</h3>
                                <p className="text-sm text-gray-400">{playbook.description}</p>
                                <div className="mt-2 font-mono text-xs text-cyan-300 bg-cyan-900/50 rounded px-2 py-1 inline-block">
                                   IF alert.{playbook.trigger.field} IS "{playbook.trigger.value}"
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <button onClick={() => { setEditingPlaybook(playbook); setIsEditorOpen(true); }} className="text-sm text-gray-400 hover:text-white">Edit</button>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={playbook.is_active} onChange={() => handleToggleActive(playbook.id)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-300">{playbook.is_active ? 'Active' : 'Inactive'}</span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
            {isEditorOpen && <PlaybookEditorModal onClose={() => setIsEditorOpen(false)} onSave={handleSavePlaybook} existingPlaybook={editingPlaybook} uniqueAlertTitles={uniqueAlertTitles} uniqueMitreIds={uniqueMitreIds} />}
        </div>
    );
};

export default AutomationView;