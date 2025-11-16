

import React from 'react';
import { LogoIcon } from './icons/LogoIcon';


interface HeaderProps {
  onVersionClick: () => void;
  themeStyles: Record<string, string>;
}

const Header: React.FC<HeaderProps> = ({ onVersionClick, themeStyles }) => {
  return (
    <header className={`flex items-center justify-between space-x-4 shrink-0 ${themeStyles.p} ${themeStyles.borderBottom} ${themeStyles.headerBg}`}>
        <div className="flex items-center space-x-4">
            <LogoIcon />
            <div>
                <h1 className={`text-xl font-bold tracking-wider ${themeStyles.textHeading}`}>OpenProtectAI</h1>
                <p className={`text-sm ${themeStyles.textSecondary}`}>AI-Powered Security Architecture for AWS, Azure, GCP & Hybrid Cloud</p>
            </div>
        </div>
        <button onClick={onVersionClick} className={`text-xs font-mono px-2 py-1 rounded-md transition-colors ${themeStyles.buttonSecondary}`}>
            v1.9.6
        </button>
    </header>
  );
};

export default Header;