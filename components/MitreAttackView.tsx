
import React, { useMemo } from 'react';
import { Alert, Playbook } from '../types';
import { mitreMatrix } from './mitreData';
import { MitreAttackIcon } from './icons/NavIcons';

interface MitreAttackViewProps {
    alerts: Alert[];
    playbooks: Playbook[];
}

interface Technique {
    id: string;
    name: string;
}

// Helper function to get the base technique ID (e.g., T1003 from T1003.001)
const getBaseTechniqueId = (id: string) => id.includes('.') ? id.split('.')[0] : id;

const TechniqueCell: React.FC<{
    tech: Technique;
    coverage: { detected: boolean; covered: boolean };
    isSubTechnique?: boolean;
}> = ({ tech, coverage, isSubTechnique = false }) => {
    
    const cellClasses = `p-2 rounded text-xs text-left w-full transition-colors ${
        coverage.covered ? 'bg-purple-600/50 hover:bg-purple-600/70 text-purple-200' :
        coverage.detected ? 'bg-sky-600/50 hover:bg-sky-600/70 text-sky-200' :
        'bg-slate-700/50 hover:bg-slate-700/80 text-gray-300'
    } ${isSubTechnique ? 'ml-4' : ''}`;

    let status = 'No activity detected.';
    if (coverage.detected) status = 'Detected in alerts.';
    if (coverage.covered) status = 'Covered by active playbook.';

    return (
        <div className={cellClasses} title={`${tech.id}: ${tech.name}\nStatus: ${status}`}>
            <p className="font-semibold truncate">{tech.name}</p>
            <p className="font-mono text-gray-400">{tech.id}</p>
        </div>
    );
};

const MitreAttackView: React.FC<MitreAttackViewProps> = ({ alerts, playbooks }) => {
    
    const coverageData = useMemo(() => {
        const detectedTechniques = new Set<string>();
        alerts.forEach(alert => {
            if (alert.mitre_mapping?.id) {
                detectedTechniques.add(alert.mitre_mapping.id);
                detectedTechniques.add(getBaseTechniqueId(alert.mitre_mapping.id));
            }
        });

        const playbookTechniques = new Set<string>();
        playbooks.forEach(playbook => {
            const activeVersion = playbook.versions.find(v => v.versionId === playbook.activeVersionId);
            if (playbook.is_active && activeVersion?.trigger.field === 'mitre_mapping.id') {
                playbookTechniques.add(activeVersion.trigger.value);
                playbookTechniques.add(getBaseTechniqueId(activeVersion.trigger.value));
            }
        });
        
        return { detectedTechniques, playbookTechniques };
    }, [alerts, playbooks]);
    
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
            <header className="p-4 border-b border-slate-700/50 shrink-0">
                 <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                    <MitreAttackIcon />
                    MITRE ATT&CK Coverage
                 </h2>
                 <p className="text-sm text-gray-400">Visualizing detected threats and automation coverage against adversary tactics.</p>
            </header>
            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {mitreMatrix.map(tactic => (
                        <div key={tactic.id} className="bg-slate-900/50 rounded-lg p-2 flex flex-col">
                            <h3 className="text-sm font-bold text-center text-cyan-400 border-b border-slate-700 pb-2 mb-2 shrink-0">{tactic.name}</h3>
                            <div className="space-y-1 flex-1">
                                {tactic.techniques.map(tech => {
                                    const isDetected = coverageData.detectedTechniques.has(tech.id);
                                    const isCovered = coverageData.playbookTechniques.has(tech.id);

                                    return (
                                        <React.Fragment key={tech.id}>
                                            <TechniqueCell tech={tech} coverage={{ detected: isDetected, covered: isCovered }} />
                                            {tech.subTechniques?.map(subTech => {
                                                const isSubDetected = coverageData.detectedTechniques.has(subTech.id);
                                                const isSubCovered = coverageData.playbookTechniques.has(subTech.id);
                                                return <TechniqueCell key={subTech.id} tech={subTech} coverage={{ detected: isSubDetected, covered: isSubCovered }} isSubTechnique={true} />
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-slate-700/50"></div>
                        <span>No Activity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-sky-600/50"></div>
                        <span>Threat Detected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-purple-600/50"></div>
                        <span>Playbook Coverage</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MitreAttackView;
