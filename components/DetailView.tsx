

import React from 'react';
import { AllEventTypes, Alert, ServerEvent, AggregatedEvent, LearningUpdate, DirectivePush, KnowledgeSync, ProactiveAlertPush, VulnerabilityDetails, AutomatedRemediation, PlaybookTriggered } from '../types';
import PayloadDetailsView from './PayloadDetailsView';

interface DetailViewProps {
  item: AllEventTypes;
  onReturn: () => void;
}

const DetailRow: React.FC<{ label: string; value?: React.ReactNode; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="grid grid-cols-3 gap-2 py-1">
        <span className="text-gray-400 font-semibold col-span-1">{label}:</span>
        <span className="text-gray-200 col-span-2 break-words">{value ?? children}</span>
    </div>
);

const VulnerabilityDetailsDisplay: React.FC<{ details: VulnerabilityDetails }> = ({ details }) => (
    <div className="text-sm space-y-1 mt-2 font-mono">
        <DetailRow label="CVE ID" value={details.cve_id} />
        <DetailRow label="CVSS Score" value={details.cvss_score} />
        <DetailRow label="Software" value={details.affected_software} />
        <DetailRow label="Advisory">
            <a href={details.advisory_link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                View Details
            </a>
        </DetailRow>
    </div>
);

const DetailView: React.FC<DetailViewProps> = ({ item, onReturn }) => {

    const renderItemDetails = () => {
        if ('severity' in item && 'raw_data' in item) { // It's an Alert
            const alert = item as Alert;
            return (
                <div>
                    <h3 className="text-lg font-bold text-gray-200 mb-2">{alert.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{alert.description}</p>
                    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                         <h4 className="text-sm font-semibold text-gray-400 mb-2">Raw Log Details</h4>
                         <PayloadDetailsView payload={alert.raw_data || {}} />
                    </div>
                </div>
            );
        } else { // It's a ServerEvent
            const event = item as ServerEvent;
            switch(event.type) {
                case 'AGGREGATED_EVENT': {
                    const payload = event.payload as AggregatedEvent;
                    return (
                        <div>
                             <h3 className="text-lg font-bold text-gray-200 mb-2">{payload.title}</h3>
                             {payload.context && (
                                <div className='mb-4 text-sm font-mono'>
                                    <DetailRow label="Industry" value={payload.context.industry} />
                                    <DetailRow label="Region" value={`${payload.context.region}, ${payload.context.country}`} />
                                </div>
                             )}
                             <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Sanitized & Aggregated Data</h4>
                                <PayloadDetailsView payload={payload.sanitized_data} />
                             </div>
                        </div>
                    );
                }
                case 'LEARNING_UPDATE': {
                    const payload = event.payload as LearningUpdate;
                     return (
                        <div>
                             <h3 className="text-lg font-bold text-gray-200 mb-2">Intel Update: {payload.source}</h3>
                             <p className="text-sm text-gray-400 mb-4">{payload.summary}</p>
                             <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Intelligence Payload</h4>
                                {payload.details ? <VulnerabilityDetailsDisplay details={payload.details} /> : <PayloadDetailsView payload={payload} /> }
                             </div>
                        </div>
                    );
                }
                 case 'AUTOMATED_REMEDIATION': {
                    const payload = event.payload as AutomatedRemediation;
                     return (
                        <div>
                             <h3 className="text-lg font-bold text-orange-400 mb-2">Automated Remediation Triggered</h3>
                             <p className="text-sm text-gray-400 mb-4">Immediate response to critical threat: {payload.threat_name}</p>
                             <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Remediation Details</h4>
                                <PayloadDetailsView payload={payload} />
                             </div>
                        </div>
                    );
                }
                case 'PLAYBOOK_TRIGGERED': {
                    const payload = event.payload as PlaybookTriggered;
                     return (
                        <div>
                             <h3 className="text-lg font-bold text-violet-400 mb-2">SOAR Playbook Triggered</h3>
                             <p className="text-sm text-gray-400 mb-4">Playbook "{payload.playbook_name}" was executed in response to an alert.</p>
                             <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Execution Details</h4>
                                <PayloadDetailsView payload={payload} />
                             </div>
                        </div>
                    );
                }
                case 'DIRECTIVE_PUSH': {
                    const payload = event.payload as DirectivePush;
                    const { directive } = payload;
                    let title = "Directive Pushed";
                    let description = "A generic server directive was pushed to the agent fleet.";

                    if (directive.type === 'AGENT_UPGRADE') {
                        title = "Agent Upgrade Initiated";
                        description = `Server commanded agents to upgrade to version ${directive.version}.`;
                    }
                    return (
                       <div>
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">{title}</h3>
                            <p className="text-sm text-gray-400 mb-4">{description}</p>
                            <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                               <h4 className="text-sm font-semibold text-gray-400 mb-2">Directive Payload</h4>
                               <PayloadDetailsView payload={directive} />
                            </div>
                       </div>
                   );
                }
                default: {
                     const payload = event.payload as (KnowledgeSync | ProactiveAlertPush);
                     const genericPayload = payload as Record<string, any>;
                     return (
                        <div>
                             <h3 className="text-lg font-bold text-gray-200 mb-2">{'title' in genericPayload ? genericPayload.title : 'Server Action'}</h3>
                              <p className="text-sm text-gray-400 mb-4">{'description' in genericPayload ? genericPayload.description : ('threat_summary' in genericPayload ? genericPayload.threat_summary : '')}</p>
                             <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Event Payload</h4>
                                <PayloadDetailsView payload={payload} />
                             </div>
                        </div>
                    );
                }
            }
        }
    }

    return (
        <div className="p-4 flex flex-col h-full bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-lg">
            <div className="flex-shrink-0 mb-4">
                <button
                    onClick={onReturn}
                    className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Return to Previous View
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
                {renderItemDetails()}
            </div>
        </div>
    );
};

export default DetailView;