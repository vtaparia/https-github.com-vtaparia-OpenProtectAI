
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';


interface HeaderProps {
  onVersionClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onVersionClick }) => {
  return (
    <header className="flex items-center justify-between space-x-4 p-4 border-b border-slate-700/50 bg-slate-900/75 backdrop-blur-lg shrink-0">
        <div className="flex items-center space-x-4">
            <LogoIcon />
            <div>
                <h1 className="text-xl font-bold text-gray-100 tracking-wider">OpenProtectAI</h1>
                <p className="text-sm text-gray-400">AI-Powered Security Architecture for AWS, Azure, GCP & Hybrid Cloud</p>
            </div>
        </div>
        <button onClick={onVersionClick} className="text-xs font-mono bg-slate-700/50 text-cyan-400 px-2 py-1 rounded-md hover:bg-slate-700 transition-colors">
            v1.9.2
        </button>
    </header>
  );
};

export default Header;