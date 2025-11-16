
export interface Technique {
    id: string;
    name: string;
    subTechniques?: Technique[];
}

export interface Tactic {
    id: string;
    name: string;
    techniques: Technique[];
}

export const mitreMatrix: Tactic[] = [
    {
        id: 'TA0005',
        name: 'Defense Evasion',
        techniques: [
            { id: 'T1027', name: 'Obfuscated Files or Information' },
            { id: 'T1070', name: 'Indicator Removal' },
            { id: 'T1036', name: 'Masquerading' },
        ]
    },
    {
        id: 'TA0006',
        name: 'Credential Access',
        techniques: [
            { 
                id: 'T1003', 
                name: 'OS Credential Dumping',
                subTechniques: [
                    { id: 'T1003.001', name: 'LSASS Memory' },
                ]
            },
            { id: 'T1110', name: 'Brute Force' },
        ]
    },
    {
        id: 'TA0002',
        name: 'Execution',
        techniques: [
            { 
                id: 'T1059', 
                name: 'Command and Scripting Interpreter',
                subTechniques: [
                    { id: 'T1059.001', name: 'PowerShell' },
                    { id: 'T1059.003', name: 'Windows Command Shell' },
                ]
            },
            { id: 'T1053', name: 'Scheduled Task/Job' },
        ]
    },
    {
        id: 'TA0011',
        name: 'Command and Control',
        techniques: [
            { id: 'T1105', name: 'Ingress Tool Transfer' },
            { id: 'T1071', name: 'Application Layer Protocol' },
        ]
    },
    {
        id: 'TA0010',
        name: 'Exfiltration',
        techniques: [
            { id: 'T1041', name: 'Exfiltration Over C2 Channel' },
            { id: 'T1048', name: 'Exfiltration Over Alternative Protocol' },
        ]
    },
    {
        id: 'TA0040',
        name: 'Impact',
        techniques: [
            { id: 'T1486', name: 'Data Encrypted for Impact' },
            { id: 'T1490', name: 'Inhibit System Recovery' },
            { id: 'T1496', name: 'Resource Hijacking' },
        ]
    },
];

// Helper to flatten techniques for easy lookup
export const allTechniques: Technique[] = mitreMatrix.flatMap(tactic => 
    tactic.techniques.flatMap(tech => tech.subTechniques ? [tech, ...tech.subTechniques] : [tech])
);