

import React, { useState } from 'react';
import { Playbook, PlaybookAction, PlaybookTrigger, AlertSeverity, PlaybookVersion, PlaybookCondition } from '../types';
import { AutomationIcon } from './icons/NavIcons';
import { PlaybookIcon } from './icons/PlaybookIcon';
import PlaybookHistoryModal from './PlaybookHistoryModal';
import { HistoryIcon } from './icons/HistoryIcon';

interface AutomationViewProps {
    playbooks: Playbook[];
    setPlaybooks: React.Dispatch<React.SetStateAction<Playbook[]>>;
    uniqueAlertTitles: string[];
    uniqueMitreIds: string[];
    // FIX: Added themeStyles to props to match what is passed from App.tsx.
    themeStyles: Record<string, string>;
}

const PlaybookEditorModal: React.FC<{
    onClose: () => void;
    onSave: (data: { name: string; description: string; notes: string; trigger: PlaybookTrigger; actions: PlaybookAction[] }) => void;
    existingPlaybook?: Playbook;
    uniqueAlertTitles: string[];
    uniqueMitreIds: string[];
}> = ({ onClose, onSave, existingPlaybook, uniqueAlertTitles, uniqueMitreIds }) => {
    
    const activeVersion = existingPlaybook?.versions.find(v => v.versionId === existingPlaybook.activeVersionId);

    const [name, setName] = useState(existingPlaybook?.name || '');
    const [description, setDescription] = useState(existingPlaybook?.description || '');
    const [notes, setNotes] = useState('');

    const [conditions, setConditions] = useState<PlaybookCondition[]>(activeVersion?.trigger.conditions || [{ field: 'title', operator: 'is', value: uniqueAlertTitles[0] }]);
    const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>(activeVersion?.trigger.logicalOperator || 'AND');

    const [createCase, setCreateCase] = useState(activeVersion?.actions.some(a => a.type === 'CREATE_CASE') || false);
    const [assignTo, setAssignTo] = useState(activeVersion?.actions.find(a => a.type === 'ASSIGN_CASE')?.params?.assignee || 'None');

    const analysts = ['None', 'Tier 1 SOC', 'Tier 2 SOC', 'Alice', 'Bob'];

    const handleConditionChange = (index: number, field: keyof PlaybookCondition, value: string) => {
        const newConditions = [...conditions];
        const newCondition = { ...newConditions[index], [field]: value };

        if (field === 'field') {
            if (value === 'title') newCondition.value = uniqueAlertTitles[0] || '';
            else if (value === 'mitre_mapping.id') newCondition.value = uniqueMitreIds[0] || '';
            else if (value === 'severity') newCondition.value = AlertSeverity.HIGH;
            else newCondition.value = '';
        }

        newConditions[index] = newCondition;
        setConditions(newConditions);
    };

    const addCondition = () => {
        setConditions([...conditions, { field: 'title', operator: 'is', value: uniqueAlertTitles[0] }]);
    };

    const removeCondition = (index: number) => {
        setConditions(conditions.filter((_, i) => i !== index));
    };


    const handleSave = () => {
        if (!name.trim() || !description.trim()) {
            alert('Playbook Name and Description are required.');
            return;
        }
        if (!notes.trim()) {
            alert('Version notes are required to save changes.');
            return;
        }
        if (conditions.length === 0) {
            alert('At least one trigger condition is required.');
            return;
        }

        const actions: PlaybookAction[] = [];
        if (createCase) {
            actions.push({ type: 'CREATE_CASE' });
        }
        if (assignTo !== 'None') {
            actions.push({ type: 'ASSIGN_CASE', params: { assignee: assignTo }});
        }

        onSave({
            name,
            description,
            notes,
            trigger: {
                logicalOperator,
                conditions,
            },
            actions,
        });
        onClose();
    };

    const renderValueInput = (condition: PlaybookCondition, index: number) => {
        switch (condition.field) {
            case 'title':
                return (
                    <select value={condition.value} onChange={e => handleConditionChange(index, 'value', e.target.value)} className="bg-slate-700 rounded p-1 w-full">
                        {uniqueAlertTitles.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                );
            case 'mitre_mapping.id':
                 return (
                    <select value={condition.value} onChange={e => handleConditionChange(index, 'value', e.target.value)} className="bg-slate-700 rounded p-1 w-full">
                        {uniqueMitreIds.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                );
            case 'severity':
                return (
                    <select value={condition.value} onChange={e => handleConditionChange(index, 'value', e.target.value)} className="bg-slate-700 rounded p-1 w-full">
                        {Object.values(AlertSeverity).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                );
            default:
                return <input type="text" value={condition.value} onChange={e => handleConditionChange(index, 'value', e.target.value)} className="bg-slate-700 rounded p-1 w-full" />
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-3xl text-gray-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">{existingPlaybook ? `Create New Version: ${existingPlaybook.name}` : 'Create New Playbook'}</h2>
                </header>
                <main className="p-6 space-y-4 overflow-y-auto">
                    {!existingPlaybook && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Playbook Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-700/80 border border-slate-600/80 rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-700/80 border border-slate-600/80 rounded-lg p-2 h-20 resize-none" />
                            </div>
                        </>
                    )}
                    <div className="border-t border-slate-700 pt-4">
                        <h3 className="text-lg font-semibold mb-2">Trigger Conditions ("IF")</h3>
                        <div className="space-y-2 bg-slate-900/50 p-3 rounded-lg">
                            {conditions.map((condition, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="font-mono text-gray-400">{index > 0 ? logicalOperator : 'IF'}</span>
                                    <select value={condition.field} onChange={e => handleConditionChange(index, 'field', e.target.value)} className="bg-slate-700 rounded p-1">
                                        <option value="title">Alert Title</option>
                                        <option value="severity">Severity</option>
                                        <option value="mitre_mapping.id">MITRE ID</option>
                                        <option value="device.os">Device OS</option>
                                    </select>
                                    <select value={condition.operator} onChange={e => handleConditionChange(index, 'operator', e.target.value)} className="bg-slate-700 rounded p-1">
                                        <option value="is">IS</option>
                                        <option value="is_not">IS NOT</option>
                                    </select>
                                    <div className="flex-1">
                                        {renderValueInput(condition, index)}
                                    </div>
                                    <button onClick={() => removeCondition(index)} className="p-1 text-red-400 hover:bg-red-500/20 rounded-full" disabled={conditions.length === 1}>
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <div className="flex items-center gap-4 pt-2">
                                <button onClick={addCondition} className="text-xs px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded">Add Condition</button>
                                {conditions.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs">Logic:</label>
                                        <label className="flex items-center gap-1"><input type="radio" value="AND" checked={logicalOperator === 'AND'} onChange={() => setLogicalOperator('AND')} /> AND</label>
                                        <label className="flex items-center gap-1"><input type="radio" value="OR" checked={logicalOperator === 'OR'} onChange={() => setLogicalOperator('OR')} /> OR</label>
                                    </div>
                                )}
                            </div>
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
                     <div className="border-t border-slate-700 pt-4">
                         <label htmlFor="version-notes" className="block text-sm font-medium text-gray-300 mb-1">Version Notes (Required)</label>
                         <textarea id="version-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g., Added case creation for high severity alerts." className="w-full bg-slate-700/80 border border-slate-600/80 rounded-lg p-2 h-16 resize-none" />
                    </div>
                </main>
                <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm bg-transparent hover:bg-gray-700 rounded-md">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-500 rounded-md">Save</button>
                </footer>
            </div>
        </div>
    );
};

const AutomationView: React.FC<AutomationViewProps> = ({ playbooks, setPlaybooks, uniqueAlertTitles, uniqueMitreIds, themeStyles }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingPlaybook, setEditingPlaybook] = useState<Playbook | undefined>(undefined);
    const [historyPlaybook, setHistoryPlaybook] = useState<Playbook | undefined>(undefined);

    const handleSavePlaybook = (data: { name: string; description: string; notes: string; trigger: PlaybookTrigger; actions: PlaybookAction[]; }) => {
        const { name, description, trigger, actions, notes } = data;

        setPlaybooks(prev => {
            if (editingPlaybook) { // Creating a new version of an existing playbook
                return prev.map(p => {
                    if (p.id === editingPlaybook.id) {
                        const newVersionId = `pv-${p.id.split('-')[1]}-${Date.now()}`;
                        const newVersion: PlaybookVersion = {
                            versionId: newVersionId,
                            createdAt: new Date().toISOString(),
                            author: 'SOC Analyst',
                            notes,
                            trigger,
                            actions
                        };
                        return { ...p, versions: [...p.versions, newVersion], activeVersionId: newVersionId };
                    }
                    return p;
                });
            } else { // Creating a brand new playbook
                const newPlaybookId = `playbook-${Date.now()}`;
                const newVersionId = `pv-${newPlaybookId.split('-')[1]}-initial`;
                const initialVersion: PlaybookVersion = {
                    versionId: newVersionId,
                    createdAt: new Date().toISOString(),
                    author: 'SOC Analyst',
                    notes: notes,
                    trigger,
                    actions
                };
                const newPlaybook: Playbook = {
                    id: newPlaybookId, name, description, is_active: true,
                    versions: [initialVersion], activeVersionId: newVersionId,
                };
                return [...prev, newPlaybook];
            }
        });
    };
    
    const handleToggleActive = (playbookId: string) => {
        setPlaybooks(prev => prev.map(p => p.id === playbookId ? { ...p, is_active: !p.is_active } : p));
    };

    const handleSetActiveVersion = (playbookId: string, versionId: string) => {
        setPlaybooks(prev => prev.map(p => p.id === playbookId ? { ...p, activeVersionId: versionId } : p));
        setHistoryPlaybook(undefined); // Close modal on action
    };

    const renderTrigger = (trigger: PlaybookTrigger) => {
        return trigger.conditions.map(c => `alert.${c.field} ${c.operator} "${c.value}"`).join(` ${trigger.logicalOperator} `);
    }

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
                {playbooks.map(playbook => {
                    const activeVersion = playbook.versions.find(v => v.versionId === playbook.activeVersionId);
                    return (
                        <div key={playbook.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <PlaybookIcon />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-100">{playbook.name}</h3>
                                    <p className="text-sm text-gray-400">{playbook.description}</p>
                                    {activeVersion && (
                                        <>
                                            <div className="mt-2 font-mono text-xs text-cyan-300 bg-cyan-900/50 rounded px-2 py-1 inline-block">
                                               IF {renderTrigger(activeVersion.trigger)}
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                <p>
                                                    <span className="font-semibold text-gray-400">Active Version:</span> {playbook.versions.length} ({new Date(activeVersion.createdAt).toLocaleString()})
                                                </p>
                                                <p className="italic">"{activeVersion.notes}" - {activeVersion.author}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pl-4">
                                 <button onClick={() => setHistoryPlaybook(playbook)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
                                    <HistoryIcon />
                                    History
                                 </button>
                                 <button onClick={() => { setEditingPlaybook(playbook); setIsEditorOpen(true); }} className="text-sm text-gray-400 hover:text-white">New Version</button>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={playbook.is_active} onChange={() => handleToggleActive(playbook.id)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-300">{playbook.is_active ? 'Active' : 'Inactive'}</span>
                                 </label>
                            </div>
                        </div>
                    );
                })}
            </div>
            {isEditorOpen && <PlaybookEditorModal onClose={() => setIsEditorOpen(false)} onSave={handleSavePlaybook} existingPlaybook={editingPlaybook} uniqueAlertTitles={uniqueAlertTitles} uniqueMitreIds={uniqueMitreIds} />}
            {historyPlaybook && <PlaybookHistoryModal playbook={historyPlaybook} onClose={() => setHistoryPlaybook(undefined)} onSetActiveVersion={handleSetActiveVersion} />}
        </div>
    );
};

export default AutomationView;