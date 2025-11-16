

import React from 'react';

interface KnowledgeGraphProps {
    themeStyles: Record<string, string>;
}

const Node: React.FC<{ x: number; y: number; label: string; subLabel: string; color: string; }> = ({ x, y, label, subLabel, color }) => (
    <div
        className="absolute p-2 rounded-lg shadow-lg text-center"
        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', backgroundColor: color }}
    >
        <p className="text-xs font-bold text-white">{label}</p>
        <p className="text-[10px] text-gray-300">{subLabel}</p>
    </div>
);

const Edge: React.FC<{ x1: number; y1: number; x2: number; y2: number; label: string; themeStyles: Record<string, string>; }> = ({ x1, y1, x2, y2, label, themeStyles }) => {
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return (
        <>
            <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} className="stroke-current text-slate-600" strokeWidth="1.5" />
            <foreignObject x={`${midX - 25}%`} y={`${midY - 10}%`} width="50%" height="20%" style={{ overflow: 'visible' }}>
                 <div 
                    className={`text-[8px] italic font-semibold px-1 py-0.5 rounded-full inline-block ${themeStyles.bgPanel} ${themeStyles.textSecondary}`}
                    style={{ transform: `translate(-50%, -50%)` }}
                >
                    {label}
                </div>
            </foreignObject>
        </>
    );
};


const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ themeStyles }) => {
    const nodes = [
        { id: 'cve', x: 20, y: 20, label: 'CVE-2021-44228', subLabel: 'Vulnerability', color: '#be123c' },
        { id: 'proc', x: 50, y: 50, label: 'powershell.exe', subLabel: 'Process', color: '#0369a1' },
        { id: 'ip', x: 80, y: 20, label: '104.21.5.19', subLabel: 'Malicious IP', color: '#b45309' },
        { id: 'mitre', x: 80, y: 80, label: 'T1059.001', subLabel: 'MITRE TTP', color: '#7e22ce' },
        { id: 'host', x: 20, y: 80, label: 'FINANCE-PC-01', subLabel: 'Host', color: '#15803d' },
    ];

    const edges = [
        { from: 'cve', to: 'proc', label: 'exploits' },
        { from: 'proc', to: 'ip', label: 'communicates with' },
        { from: 'proc', to: 'host', label: 'observed on' },
        { from: 'proc', to: 'mitre', label: 'associated with' },
        { from: 'ip', to: 'mitre', label: 'indicator for' },
    ];
    
    const getNode = (id: string) => nodes.find(n => n.id === id)!;

    return (
        <div className="w-full h-full relative">
            <svg width="100%" height="100%" className="absolute inset-0">
                {edges.map(edge => {
                    const fromNode = getNode(edge.from);
                    const toNode = getNode(edge.to);
                    return <Edge key={`${edge.from}-${edge.to}`} x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} label={edge.label} themeStyles={themeStyles} />;
                })}
            </svg>
            {nodes.map(node => (
                <Node key={node.id} {...node} />
            ))}
             <p className="absolute bottom-0 left-0 right-0 text-center text-[10px] text-gray-600">
                Shows relationships between security entities.
            </p>
        </div>
    );
};

export default KnowledgeGraph;