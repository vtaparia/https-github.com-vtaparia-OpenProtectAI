
import React from 'react';
import { MitreMapping } from '../types';
import { MitreIcon } from './icons/MitreIcon';

interface MitreTagProps {
    mapping: MitreMapping;
    isLink?: boolean;
}

export const MitreTag: React.FC<MitreTagProps> = ({ mapping, isLink = false }) => {
    const mitreUrl = `https://attack.mitre.org/techniques/${mapping.id.replace('.', '/')}/`;

    const TagContent = () => (
        <div className="flex items-center gap-1.5">
            <MitreIcon />
            <span>{mapping.id}</span>
        </div>
    );

    const commonClasses = "inline-block text-xs font-mono px-2 py-0.5 rounded-full bg-red-900/70 text-red-300 border border-red-500/30";

    if (isLink) {
        return (
            <a 
                href={mitreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${commonClasses} hover:bg-red-800/70 transition-colors`}
                onClick={e => e.stopPropagation()} // Prevent parent click handlers
                title={`View details for ${mapping.technique}`}
            >
                <TagContent />
            </a>
        );
    }

    return (
        <div className={commonClasses} title={`${mapping.tactic}: ${mapping.technique}`}>
            <TagContent />
        </div>
    );
};
