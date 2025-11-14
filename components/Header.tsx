import React from 'react';

const ShieldIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.955a11.955 11.955 0 018.618-3.04 11.955 11.955 0 018.618 3.04 12.02 12.02 0 00-3-15.955z" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="flex items-center space-x-4 p-4 border-b border-slate-700/50 bg-slate-900/75 backdrop-blur-lg">
        <ShieldIcon />
        <div>
            <h1 className="text-xl font-bold text-gray-100 tracking-wider">Cyber Architect AI</h1>
            <p className="text-sm text-gray-400">Your AI Partner in Designing Next-Generation Security Platforms</p>
        </div>
    </header>
  );
};

export default Header;