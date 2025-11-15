
import React, { useMemo, useState } from 'react';
import { Case, CaseStatus } from '../types';

interface IncidentReviewViewProps {
    cases: Map<string, Case>;
}

const IncidentReviewView: React.FC<IncidentReviewViewProps> = ({ cases }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const resolvedCases = useMemo(() => {
        return Array.from(cases.entries())
            .filter(([, caseData]) => caseData.status === CaseStatus.RESOLVED)
            .map(([caseId, caseData]) => ({ caseId, ...caseData }))
            .sort((a, b) => new Date(b.resolved_at!).getTime() - new Date(a.resolved_at!).getTime());
    }, [cases]);

    const filteredCases = useMemo(() => {
        if (!searchTerm.trim()) {
            return resolvedCases;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return resolvedCases.filter(c => 
            c.caseId.toLowerCase().includes(lowercasedFilter) ||
            c.assignee?.toLowerCase().includes(lowercasedFilter) ||
            c.alerts[0].title.toLowerCase().includes(lowercasedFilter) ||
            c.resolution_notes?.toLowerCase().includes(lowercasedFilter)
        );
    }, [resolvedCases, searchTerm]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
            <header className="p-4 border-b border-slate-700/50 shrink-0 space-y-3">
                <h2 className="text-lg font-bold text-gray-100">Incident Review & Audit Trail</h2>
                <input
                    type="text"
                    placeholder="Search resolved cases by ID, assignee, or keyword..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700/80 border border-slate-600/80 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                />
            </header>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredCases.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center p-4">
                        <p className="text-gray-500">
                            {resolvedCases.length === 0 ? 'No resolved cases to review.' : 'No cases match the current search.'}
                        </p>
                    </div>
                ) : (
                    filteredCases.map(c => (
                        <div key={c.caseId} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400">Case ID</p>
                                    <p className="font-mono font-bold text-cyan-400">{c.caseId}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Threat</p>
                                    <p className="font-semibold text-gray-200">{c.alerts[0].title}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Resolved By</p>
                                    <p className="text-gray-300">{c.assignee || 'Unassigned'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Resolved At</p>
                                    <p className="text-gray-300">{new Date(c.resolved_at!).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-700/50">
                                <p className="text-xs text-gray-400 mb-1">Resolution Notes</p>
                                <p className="text-sm text-gray-200 whitespace-pre-wrap">{c.resolution_notes}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default IncidentReviewView;